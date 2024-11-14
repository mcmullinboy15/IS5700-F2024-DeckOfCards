import mqtt, { MqttClient } from "mqtt";
import { useEffect, useState } from "react";

interface UseMQTT<T> {
  messages: T[];
  sendMessage: (message: T) => void;
  error: Error | null;
  connected: boolean;
}

enum MQTTMode {
  SINGLE = "single",
  BUFFERED = "buffered",
}

interface SingleModeOptions<T> {
  mode: MQTTMode.SINGLE;
  orderBy?: (a: T, b: T) => number;
}

interface BufferedModeOptions<T> {
  mode: MQTTMode.BUFFERED;
  bufferSize: number;
  existingMessages?: T[];
  orderBy?: (a: T, b: T) => number;
}

type UseMQTTOptions<T> = SingleModeOptions<T> | BufferedModeOptions<T>;

/**
 * Custom hook to manage MQTT connections and messages.
 *
 * @template T - The type of the messages.
 * @param {string} topic - The MQTT topic to subscribe to.
 * @param {UseMQTTOptions<T>} options - Options for configuring the MQTT connection and message handling.See `UseMQTTOptions`. Defaults to SINGLE mode.
 * @returns {UseMQTT<T>} An object containing the messages, sendMessage function, error, and connection status.
 *
 * @typedef {Object} UseMQTTOptions<T>
 * @property {MQTTMode} mode - The mode of message handling (SINGLE or BUFFERED).
 * @property {number} [bufferSize] - The size of the message buffer (only applicable in BUFFERED mode).
 * @property {T[]} [existingMessages] - Existing messages to initialize the messages array with (only applicable in BUFFERED mode). This also immediately pusbishes these messages to the MQTT topic.
 *
 * @typedef {Object} UseMQTT<T>
 * @property {T[]} messages - The list of messages.
 * @property {(message: T) => void} sendMessage - Function to send a message on the topic.
 * @property {Error | null} error - The error object if an error occurs, otherwise null.
 * @property {boolean} connected - The connection status.
 *
 * @typedef {Object} MqttClient - The MQTT client instance.
 *
 * @typedef {Object} Mode
 * @property {string} SINGLE - Single message mode.
 * @property {string} BUFFERED - Buffered message mode.
 *
 * @param {MqttClient} mqttClient - The MQTT client instance.
 * @param {React.Dispatch<React.SetStateAction<T[]>>} setMessages - Function to update the messages state.
 * @param {keyof T | ((a: T, b: T) => number)} [orderBy] - Optional parameter to sort messages by a key or a custom function.
 * @param {number} bufferSize - The size of the message buffer.
 * @param {T[]} existingMessages - Existing messages to initialize the messages array with (only applicable in BUFFERED mode). This also immediately publishes these messages to the MQTT topic.
 *
 * @returns {void}
 */
const useMQTT = <T,>(
  topic: string,
  options: UseMQTTOptions<T> = { mode: MQTTMode.SINGLE }
): UseMQTT<T> => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<T[]>(
    options.mode === MQTTMode.BUFFERED && options.existingMessages
      ? options.existingMessages
      : []
  );
  const [error, setError] = useState<Error | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081", {
      clientId: `webchat_${Math.random().toString(16).substring(2, 8)}`, // This will be the user id
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      setConnected(true);
      setError(null);
      mqttClient.subscribe(`IS5700/USU/McMullin/${topic}`);
      console.log(`Connected to topic: ${topic}`);
    });

    mqttClient.on("error", (err) => {
      setError(Error(`MQTT error: ${err.message}`));
      setConnected(false);
    });

    mqttClient.on("offline", () => {
      setConnected(false);
      setError(Error("Connection lost. Reconnecting..."));
    });

    setClient(mqttClient);

    if (options.mode === MQTTMode.SINGLE) {
      useSingleMessageMode(mqttClient, setMessages);
    } else if (options.mode === MQTTMode.BUFFERED) {
      useBufferedMode(
        mqttClient,
        options.bufferSize,
        options.existingMessages ?? [],
        setMessages,
        options.orderBy
      );
    }

    return () => {
      mqttClient.end();
    };
  }, [topic]);

  const sendMessage = (message: T) => {
    sendMessageForMode(options.mode, message);
  };

  const sendMessageForMode = (mode: MQTTMode, message: T) => {
    switch (mode) {
      case MQTTMode.SINGLE:
        if (client) {
          const messageString = JSON.stringify(message);
          client.publish(`IS5700/USU/McMullin/${topic}`, messageString);
        }
        break;
      case MQTTMode.BUFFERED:
        const bufferedOptions = options as BufferedModeOptions<T>;
        if (client) {
          const updatedMessages = [...messages, message];
          const bufferMessages = updatedMessages.slice(
            -bufferedOptions.bufferSize
          );

          client.publish(
            `IS5700/USU/McMullin/${topic}`,
            JSON.stringify(bufferMessages),
            {
              retain: true,
            }
          );
        }
        break;
    }
  };

  const sortMessages = <T,>(
    messages: T[],
    orderBy?: (a: T, b: T) => number
  ) => {
    console.log("Sorting messages", orderBy);
    if (!orderBy) return messages;
    return messages.sort(orderBy);
  };

  const useSingleMessageMode = <T,>(
    mqttClient: MqttClient,
    setMessages: React.Dispatch<React.SetStateAction<T[]>>,
    orderBy?: (a: T, b: T) => number
  ) => {
    mqttClient.on("message", (_, message) => {
      let parsedMessage: T;
      try {
        parsedMessage = JSON.parse(message.toString()) as T;
      } catch (error) {
        console.error("Failed to parse single message:", error);
        return;
      }

      setMessages((prevMessages) =>
        sortMessages([...prevMessages, parsedMessage], orderBy)
      );
    });
  };

  const useBufferedMode = <T,>(
    mqttClient: MqttClient,
    bufferSize: number,
    existingMessages: T[],
    setMessages: React.Dispatch<React.SetStateAction<T[]>>,
    orderBy?: (a: T, b: T) => number
  ) => {
    // Helper to remove duplicates
    const filterDuplicates = (newMessages: T[], existingMessages: T[]): T[] => {
      const existingMessageSet = new Set(
        existingMessages.map((msg) => JSON.stringify(msg))
      );
      return newMessages.filter(
        (msg) => !existingMessageSet.has(JSON.stringify(msg))
      );
    };

    // Handle message event
    mqttClient.on("message", (_, message) => {
      console.log("Message received:", message.toString());

      try {
        // Parse the entire array of messages from the received JSON string
        const parsedMessages = JSON.parse(message.toString()) as T[];
        if (!Array.isArray(parsedMessages)) {
          console.error("Parsed message is not an array:", parsedMessages);
          return; // Exit early if parsedMessages is not an array
        }

        // Filter out duplicates using current messages in state
        setMessages((prevMessages) => {
          const filteredMessages = filterDuplicates(
            parsedMessages,
            prevMessages
          );
          return sortMessages([...prevMessages, ...filteredMessages], orderBy);
        });
      } catch (error) {
        console.error("Failed to parse buffered message array:", error);
      }
    });

    // Publish "catch-up" messages on connect
    mqttClient.on("connect", () => {
      if (existingMessages.length > 0) {
        const bufferMessages = existingMessages.slice(-bufferSize);
        mqttClient.publish(
          `IS5700/USU/McMullin/${topic}`,
          JSON.stringify(bufferMessages),
          {
            retain: true,
          }
        );
      }
    });
  };

  return { messages, sendMessage, error, connected };
};

export { MQTTMode };
export default useMQTT;
