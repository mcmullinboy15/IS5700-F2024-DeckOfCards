import { useState, useEffect, useRef } from "react";
import mqtt from "mqtt";
import "./ChatComponent.css";

//in order to make this work, we need to but <ChatComponent /> in App.tsx

type Message = {
  text: string;
  sender: string;
  timestamp: string;
};

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Connect to MQTT broker
  useEffect(() => {
    // This should eventually be tied to the user's profile/id
    const clientId = "webchat_" + Math.random().toString(16).substring(2, 8);

    // I used mosquitto broker for this
    const mqttClient = mqtt.connect("wss://test.mosquitto.org:8081", {
      clientId: clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      setConnected(true);
      setConnectionError("");

      // Technically there is only one "channel" to chat on and the user is automatically subscribed to that
      mqttClient.subscribe("webchat/public", (err) => {
        if (err) {
          console.error("Subscription error:", err);
          setConnectionError("Failed to subscribe to chat");
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());
        setMessages((prev) => [...prev, message]);
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    });

    mqttClient.on("error", (err) => {
      console.error("MQTT error:", err);
      setConnectionError("Connection error occurred");
      setConnected(false);
    });

    mqttClient.on("offline", () => {
      setConnected(false);
      setConnectionError("Connection lost. Reconnecting...");
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !client || !connected) return;

    const messageData = {
      text: newMessage,
      sender: `User_${Math.random().toString(16).substring(2, 6)}`, // once available use actual user profile/ID
      timestamp: new Date().toISOString(),
    };

    try {
      client.publish("webchat/public", JSON.stringify(messageData));
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setConnectionError("Failed to send message");
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chat-widget ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-container">
        <div className="chat-header" onClick={toggleMinimize}>
          <h3>
            Chat {!connected && " (Disconnected)"}
            {connectionError && ` - ${connectionError}`}
          </h3>
          <button className="minimize-button">{isMinimized ? "+" : "-"}</button>
        </div>

        {!isMinimized && (
          <>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <span className="sender">{msg.sender}</span>
                  <span className="text">{msg.text}</span>
                  <span className="timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  connected ? "Type your message..." : "Connecting..."
                }
                disabled={!connected}
              />
              <button type="submit" disabled={!connected || !newMessage.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
