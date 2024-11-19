import { useEffect, useState } from "react";
import useMQTT, { MQTTMode } from "./useMqtt";

/**
 * GameState object must have an ID and a Timestamp
 */
interface GameStateObject {
	id: string;
	timestamp: number;
}

/**
 * Hook for managing game state updates with ID and timestamp.
 * @param topic - The MQTT topic to subscribe to.
 * @param bufferSize - The size of the message buffer. 10 by default
 * @returns Functions and state to manage game state objects.
 */
const useGameState = <T extends GameStateObject>(initialObject: T, bufferSize: number = 5) => {
	const { messages, connected, error } = useMQTT<T>(`GameState-${initialObject.id}`, {
		mode: MQTTMode.BUFFERED,
		bufferSize: bufferSize,
	});
	const [object, setObject] = useState<T>(initialObject);

	useEffect(() => {
		if (messages && messages.length > 0) {
			// Update the object if the message is newer
			let updatedObject = object;

			messages.forEach((message) => {
				if (updatedObject.timestamp < message.timestamp) {
					updatedObject = message;
				}
			});

			if (updatedObject !== object) {
				setObject(updatedObject);
			}
		}
	}, [messages]);

	return {
		object,
		connected,
		error,
	};
};

export default useGameState;
