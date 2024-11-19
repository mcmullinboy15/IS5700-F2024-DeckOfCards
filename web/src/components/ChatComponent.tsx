import { useState, useRef, useEffect } from "react";
import "./ChatComponent.css";
import useMQTT, { MQTTMode } from "../hooks/mqtt";

type Reaction = {
	type: 'like' | 'heart' | 'laugh' | 'wow' | 'sad' | 'angry';
	users: string[];
};

type Channel = {
	id: string;
	name: string;
	type: 'public' | 'game';
	gameId?: string;
};

type Message = {
	text: string;
	sender: string;
	timestamp: string;
	id: string;
	channelId: string;
	reactions?: Record<string, Reaction>;
	isReactionUpdate?: boolean;
	replyTo?: string;
};

const AVAILABLE_REACTIONS: Reaction['type'][] = ['like', 'heart', 'laugh', 'wow', 'sad', 'angry'];

// Add default channels
const DEFAULT_CHANNELS: Channel[] = [
	{ id: 'public', name: 'Public', type: 'public' },
	{ id: 'poker', name: 'Poker', type: 'game', gameId: 'poker' },
	{ id: 'blackjack', name: 'Blackjack', type: 'game', gameId: 'blackjack' }
];

const ChatComponent = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [unreadCount, setUnreadCount] = useState(0);
	const [isMinimized, setIsMinimized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
	const [channels] = useState<Channel[]>(DEFAULT_CHANNELS);
	const [currentChannel, setCurrentChannel] = useState<Channel>(channels[0]);

	// Subscribe to messages
	const { messages: mqttMessages, sendMessage } = useMQTT<Message>(`chat/${currentChannel.id}`, {
			mode: MQTTMode.BUFFERED,
			bufferSize: 50,
	});

	// Update messages when MQTT messages come in
	useEffect(() => {
		if (!Array.isArray(mqttMessages)) return;
		
		setMessages(prevMessages => {
			if (!Array.isArray(prevMessages)) prevMessages = [];
			
			const updatedMessages = [...prevMessages];
			
			mqttMessages.forEach(mqttMsg => {
				const existingMessageIndex = updatedMessages.findIndex(msg => msg.id === mqttMsg.id);
				
				if (mqttMsg.isReactionUpdate && existingMessageIndex !== -1) {
					// Update existing message's reactions
					updatedMessages[existingMessageIndex] = {
						...updatedMessages[existingMessageIndex],
						reactions: mqttMsg.reactions
					};
				} else if (!mqttMsg.isReactionUpdate && existingMessageIndex === -1) {
					// Add new message with its reactions
					updatedMessages.push({
						...mqttMsg,
						reactions: mqttMsg.reactions || {}
					});
				}
			});
			
			return updatedMessages;
		});
	}, [mqttMessages]);

	// Update notification logic to only count when minimized
	useEffect(() => {
		if (!Array.isArray(mqttMessages)) return;
		
		mqttMessages.forEach(mqttMsg => {
			if (!mqttMsg.isReactionUpdate && !messages.some(msg => msg.id === mqttMsg.id)) {
				if (isMinimized) {
					setUnreadCount(prev => prev + 1);
				}
			}
		});
	}, [mqttMessages, isMinimized, messages]);

	// Reset unread count when maximizing
	const handleMinimizeToggle = () => {
		if (isMinimized) {
			setUnreadCount(0); // Reset count when opening
		}
		setIsMinimized(!isMinimized);
	};

	const handleReaction = (messageId: string, reactionType: Reaction['type']) => {
		const userId = `User_${Math.random().toString(16).substring(2, 6)}`;
		
		const messageToUpdate = messages.find(msg => msg.id === messageId);
		if (!messageToUpdate) return;

		// Create a deep copy of the existing reactions
		const updatedReactions = { ...messageToUpdate.reactions } || {};
		
		// If this reaction type doesn't exist yet, initialize it
		if (!updatedReactions[reactionType]) {
			updatedReactions[reactionType] = {
				type: reactionType,
				users: []
			};
		}

		// Toggle user's reaction
		const existingUserIndex = updatedReactions[reactionType].users.indexOf(userId);
		if (existingUserIndex === -1) {
			// Add user's reaction
			updatedReactions[reactionType].users = [...updatedReactions[reactionType].users, userId];
		} else {
			// Remove user's reaction
			updatedReactions[reactionType].users = updatedReactions[reactionType].users.filter(id => id !== userId);
		}

		// Clean up empty reactions
		Object.keys(updatedReactions).forEach(key => {
			if (updatedReactions[key].users.length === 0) {
				delete updatedReactions[key];
			}
		});

		const reactionUpdate: Message = {
			...messageToUpdate,
			isReactionUpdate: true,
			reactions: updatedReactions
		};

		// Send update to MQTT only
		sendMessage(reactionUpdate);
	};

	const handleReply = (messageId: string) => {
		const messageData: Message = {
			id: crypto.randomUUID(),
			text: newMessage,
			sender: `User_${Math.random().toString(16).substring(2, 6)}`,
			timestamp: new Date().toISOString(),
			channelId: currentChannel.id,
			reactions: {},
			isReactionUpdate: false,
			replyTo: messageId
		};

		sendMessage(messageData);
		setNewMessage("");
	};

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const getReactionEmoji = (type: string): string => {
		const emojiMap: Record<string, string> = {
				like: '👍',
				heart: '❤️',
				laugh: '😄',
				wow: '😮',
				sad: '😢',
				angry: '😠'
		};
		return emojiMap[type] || '';
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		const messageData: Message = {
			id: crypto.randomUUID(),
			text: newMessage,
			sender: `User_${Math.random().toString(16).substring(2, 6)}`,
			timestamp: new Date().toISOString(),
			channelId: currentChannel.id,
			reactions: {},
			isReactionUpdate: false
		};

		sendMessage(messageData);
		setNewMessage("");
	};

	const handleAddReactionClick = (messageId: string, event: React.MouseEvent) => {
		event.preventDefault();
		setShowReactionPicker(messageId);
	};

	return (
		<div className={`chat-widget ${isMinimized ? 'minimized' : ''}`}>
			<div className="chat-container">
				<div className="chat-header" onClick={handleMinimizeToggle}>
					<h3>Chat - {currentChannel.name}</h3>
					{isMinimized && unreadCount > 0 && (
						<span className="notification-badge">{unreadCount}</span>
					)}
					<span className="minimize-icon">{isMinimized ? '▲' : '▼'}</span>
				</div>
				
				<div className="channel-list">
					{channels.map(channel => (
						<button
							key={channel.id}
							className={`channel-button ${currentChannel.id === channel.id ? 'active' : ''}`}
							onClick={() => setCurrentChannel(channel)}
						>
							{channel.name}
						</button>
					))}
				</div>
				
				<div className="chat-messages" tabIndex={0}>
					{messages.map((msg) => (
						<div 
							key={msg.id} 
							className={`message ${msg.replyTo ? 'reply' : ''}`}
							style={{ marginLeft: msg.replyTo ? '20px' : '0' }}
						>
							{msg.replyTo && (
								<div className="reply-indicator">
									↳ Reply to: {messages.find(m => m.id === msg.replyTo)?.text.substring(0, 30)}...
								</div>
							)}
							<div className="message-content">
								<span className="sender">{msg.sender}</span>
								<span className="text">{msg.text}</span>
								<span className="timestamp">
									{new Date(msg.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<div className="reactions">
								<div className="active-reactions">
									{Object.entries(msg.reactions || {}).map(([type, reaction]) => (
										reaction.users.length > 0 && (
											<button
												key={type}
												onClick={() => handleReaction(msg.id, type as Reaction['type'])}
												className="reaction-button"
											>
												{getReactionEmoji(type)}
												{reaction.users.length}
											</button>
										)
									))}
								</div>
								<button 
									className="add-reaction"
									onClick={(e) => handleAddReactionClick(msg.id, e)}
								>
									+
								</button>
							</div>
							{showReactionPicker === msg.id && (
								<div className="reaction-picker">
									{AVAILABLE_REACTIONS.map(type => (
										<button
											key={type}
											className="reaction-option"
											onClick={() => {
												handleReaction(msg.id, type);
												setShowReactionPicker(null);
											}}
										>
											{getReactionEmoji(type)}
										</button>
									))}
								</div>
							)}
							<div className="message-actions">
								<button onClick={() => handleReply(msg.id)}>Reply</button>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
				<form onSubmit={handleSendMessage} className="chat-input-form">
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type a message..."
					/>
					<button type="submit">Send</button>
				</form>
			</div>
		</div>
	);
};

export default ChatComponent;
