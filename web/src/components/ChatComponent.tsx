import { useState, useRef, useEffect } from "react";
import "./ChatComponent.css";
import useMQTT, { MQTTMode } from "../hooks/mqtt";

//in order to make this work, we need to but <ChatComponent /> in App.tsx

type Message = {
	text: string;
	sender: string;
	timestamp: string;
};

const ChatComponent = () => {
	const [newMessage, setNewMessage] = useState("");
	const [isMinimized, setIsMinimized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	// Connect to MQTT broker
	const { messages, sendMessage, error, connected } = useMQTT<Message>("chat", {
		mode: MQTTMode.BUFFERED,
		bufferSize: 5, // How long do we want this to be?
	});

	// // Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessageEvent = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		const messageData = {
			text: newMessage,
			sender: `User_${Math.random().toString(16).substring(2, 6)}`, // once available use actual user profile/ID
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
						Chat {!connected && " (Disconnected)"}
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
									<span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>

						<form onSubmit={sendMessageEvent} className="chat-input-form">
							<input
								type="text"
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								placeholder={connected ? "Type your message..." : "Connecting..."}
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
