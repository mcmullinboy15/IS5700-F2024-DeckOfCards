import { act, renderHook } from "@testing-library/react";
import useGameState from "./useGameState";
import useMqtt from "./useMqtt";

jest.mock("./useMqtt");

const mockUseMqtt = useMqtt as jest.Mock;

interface TestGameStateObject {
	id: string;
	timestamp: number;
	value: string;
}

describe("useGameState", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("initial object", () => {
		const initialObject = { id: "game1", timestamp: 1, value: "initial" };

		mockUseMqtt.mockReturnValue({
			messages: [],
			connected: true,
			error: null,
			sendMessage: jest.fn(),
		});

		const { result } = renderHook(() => useGameState<TestGameStateObject>(initialObject));

		expect(result.current.object).toEqual(initialObject);
		expect(result.current.connected).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("updates the object when a newer timestamp is received", () => {
		const initialObject = { id: "game1", timestamp: 1, value: "initial" };
		const newMessage = { id: "game1", timestamp: 2, value: "updated" };

		mockUseMqtt.mockReturnValueOnce({
			messages: [],
			connected: true,
			error: null,
			sendMessage: jest.fn(),
		});

		mockUseMqtt.mockReturnValueOnce({
			messages: [newMessage],
			connected: true,
			error: null,
			sendMessage: jest.fn(),
		});

		const { result, rerender } = renderHook(() => useGameState<TestGameStateObject>(initialObject));

		act(() => {
			rerender();
		});

		expect(result.current.object).toEqual(newMessage);
	});

	it("doesn't update the object when an older timestamp is received", () => {
		const initialObject = { id: "game1", timestamp: 2, value: "initial" };
		const oldMessage = { id: "game1", timestamp: 1, value: "outdated" };

		mockUseMqtt.mockReturnValue({
			messages: [oldMessage],
			connected: true,
			error: null,
			sendMessage: jest.fn(),
		});

		const { result } = renderHook(() => useGameState<TestGameStateObject>(initialObject));

		expect(result.current.object).toEqual(initialObject);
	});

	it("handles multiple messages and updates to the latest timestamp", () => {
		const initialObject = { id: "game1", timestamp: 1, value: "initial" };
		const messages = [
			{ id: "game1", timestamp: 2, value: "second" },
			{ id: "game1", timestamp: 3, value: "latest" },
		];

		mockUseMqtt.mockReturnValue({
			messages,
			connected: true,
			error: null,
			sendMessage: jest.fn(),
		});

		const { result } = renderHook(() => useGameState<TestGameStateObject>(initialObject));

		expect(result.current.object).toEqual(messages[1]); // Latest message
	});
});
