import { useState, useRef, useEffect, useContext } from "react";
import "./ChatComponent.css";
import useMQTT, { MQTTMode } from "../hooks/mqtt";
import { AuthContext } from "../context/AuthContext";

type Message = {
  text: string;
  sender: string;
  timestamp: string;
};

interface ChatComponentProps {
  chatName: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatName }) => {
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;

  const { messages, sendMessage, error, connected } = useMQTT<Message>(
    chatName,
    {
      mode: MQTTMode.BUFFERED,
      bufferSize: 5,
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const senderName = user?.displayName || user?.email || "Guest";

    const messageData: Message = {
      text: newMessage,
      sender: senderName,
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
          <h3>
            {chatName} {!connected && " (Disconnected)"}
            {error && ` - ${error.message}`}
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
