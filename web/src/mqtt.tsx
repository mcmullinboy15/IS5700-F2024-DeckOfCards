import mqtt, { MqttClient } from "mqtt";
import { useEffect, useState } from "react";

interface UseMQTT<T> {
  messages: T[];
  sendMessage: (message: T) => void;
}

const useMQTT = <T,>(topic: string): UseMQTT<T> => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<T[]>([]);

  useEffect(() => {
    const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081");

    mqttClient.on("connect", () => {
      console.log(
        `Connected to MQTT Broker: host: test.mosquitto.org, port: 8081, topic: IS5700/USU/McMullin/${topic}`
      );
      mqttClient.subscribe(`IS5700/USU/McMullin/${topic}`);
    });

    mqttClient.on("message", (topic, message) => {
      let parsedMessage: T;
      const messageString = message.toString();
      if (typeof messageString === "string") {
        console.log("Received message:", messageString);
        parsedMessage = messageString as T;
      } else {
        try {
          parsedMessage = JSON.parse(messageString) as T;
        } catch (error) {
          console.error("Failed to parse message:", error);
          return;
        }
      }
      setMessages((prevMessages) => [...prevMessages, parsedMessage]);
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

  return { messages, sendMessage };
};

export default useMQTT;
