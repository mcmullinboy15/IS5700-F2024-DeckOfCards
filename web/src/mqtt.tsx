import mqtt, { MqttClient } from "mqtt";
import { useEffect, useState } from "react";

interface UseMQTT<T> {
  messages: T[];
  sendMessage: (message: T) => void;
  error: Error | null;
  connected: boolean;
}

const useMQTT = <T,>(topic: string): UseMQTT<T> => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // This should eventually be tied to the user's profile/id
    const clientId = "webchat_" + Math.random().toString(16).substring(2, 8);

    const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081", {
      clientId: clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      setConnected(true);
      setError(null);
      mqttClient.subscribe(`IS5700/USU/McMullin/${topic}`);
      console.log(
        `Connected to MQTT Broker: host: test.mosquitto.org, port: 8081, topic: IS5700/USU/McMullin/${topic}`
      );
    });

    mqttClient.on("message", (_, message) => {
      let parsedMessage: T;
      const messageString = message.toString();
      try {
        parsedMessage = JSON.parse(messageString) as T;
      } catch (error) {
        console.error("Failed to parse message:", error);
        return;
      }
      setMessages((prevMessages) => [...prevMessages, parsedMessage]);
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error:", err.message);
      setError(Error(err.message));
      setConnected(false);
    });

    mqttClient.on("offline", () => {
      setConnected(false);
      setError(Error("Connection lost. Reconnecting..."));
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, [topic]);

  const sendMessage = (message: T) => {
    if (client) {
      const messageString =
        typeof message === "string" ? message : JSON.stringify(message);
      client.publish(`IS5700/USU/McMullin/${topic}`, messageString);
    }
  };

  return { messages, sendMessage, error, connected };
};

export default useMQTT;
