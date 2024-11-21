import { renderHook, act } from "@testing-library/react";
import mqtt, { MqttClient } from "mqtt";
import useMQTT, { MQTTMode } from "./useMqtt";

jest.mock("mqtt", () => ({
	connect: jest.fn(),
}));

const mockOn = jest.fn();
const mockPublish = jest.fn();
const mockSubscribe = jest.fn();
const mockEnd = jest.fn();

const createMockClient = (): Partial<MqttClient> => ({
	on: mockOn,
	publish: mockPublish,
	subscribe: mockSubscribe,
	end: mockEnd,
});

describe("useMQTT hook", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(mqtt.connect as jest.Mock).mockImplementation(() => createMockClient());
	});

	it("connects to MQTT and subscribes to the topic", () => {
		const { result } = renderHook(() => useMQTT("test-topic"));

		const connectCallback = mockOn.mock.calls.find(([event]) => event === "connect")?.[1];
		act(() => {
			connectCallback && connectCallback();
		});

		expect(result.current.connected).toBe(true);
		expect(mockSubscribe).toHaveBeenCalledWith("IS5700/USU/McMullin/test-topic");
	});

	it("handles incoming messages in SINGLE mode", () => {
		const { result } = renderHook(() => useMQTT("test-topic", { mode: MQTTMode.SINGLE }));

		const messageCallback = mockOn.mock.calls.find(([event]) => event === "message")?.[1];

		const message = JSON.stringify({ content: "Hello, world!" });

		act(() => {
			messageCallback && messageCallback("test-topic", message);
		});

		expect(result.current.messages).toEqual([{ content: "Hello, world!" }]);
	});

	it("handles errors", () => {
		const { result } = renderHook(() => useMQTT("test-topic"));

		const errorCallback = mockOn.mock.calls.find(([event]) => event === "error")?.[1];

		const error = new Error("Test error");

		act(() => {
			errorCallback && errorCallback(error);
		});

		expect(result.current.error?.message).toBe("MQTT error: Test error");
		expect(result.current.connected).toBe(false);
	});

	it("handles buffered messages in BUFFERED mode", () => {
		const { result } = renderHook(() =>
			useMQTT("test-topic", {
				mode: MQTTMode.BUFFERED,
				bufferSize: 3,
				existingMessages: [{ content: "Initial message" }],
			})
		);

		const messageCallback = mockOn.mock.calls.find(([event]) => event === "message")?.[1];

		const newMessages = JSON.stringify([{ content: "Message 1" }, { content: "Message 2" }]);

		act(() => {
			messageCallback && messageCallback("test-topic", newMessages);
		});

		expect(result.current.messages).toEqual([
			{ content: "Initial message" },
			{ content: "Message 1" },
			{ content: "Message 2" },
		]);
	});

	it("sends messages", () => {
		const { result } = renderHook(() => useMQTT("test-topic", { mode: MQTTMode.SINGLE }));

		act(() => {
			result.current.sendMessage({ content: "Test message" });
		});

		expect(mockPublish).toHaveBeenCalledWith(
			"IS5700/USU/McMullin/test-topic",
			JSON.stringify({ content: "Test message" })
		);
	});
});
