import { useState, useRef, useEffect } from "react";
import "./ChatComponent.css";
import useMQTT, { MQTTMode } from "../hooks/useMqtt";

//in order to make this work, we need to but <ChatComponent /> in App.tsx

type Message = {
  text: string;
  sender: string;
  timestamp: string;
};

type ChatComponentProps = {
  chatName: string; // Name of the chat
};

const ChatComponent: React.FC<ChatComponentProps> = ({ chatName }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Connect to MQTT broker
  const { messages, sendMessage, error, connected } = useMQTT<Message>("chat", {
    mode: MQTTMode.BUFFERED,
    bufferSize: 5,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      sender: `User_${Math.random().toString(16).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    sendMessage(messageData);
    setNewMessage("");
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chat-widget ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-container">
        <div className="chat-header" onClick={toggleMinimize}>
          <h3>{chatName}</h3>
          <p className="chat-status">
            {connected ? "Connected" : "Disconnected"}
            {error && ` - Error: ${error.message}`}
          </p>
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

            <form onSubmit={sendMessageEvent} className="chat-input-form">
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
