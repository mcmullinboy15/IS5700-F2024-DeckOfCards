import { useState, useRef, useEffect, useContext } from "react";
import "./ChatComponent.css";
import useMQTT, { MQTTMode } from "../hooks/useMqtt";
<<<<<<< HEAD
import useMQTT, { MQTTMode } from "../hooks/mqtt";
import { AuthContext } from "../context/AuthContext";
=======

type Reaction = {
  type: "like" | "heart" | "laugh" | "wow" | "sad" | "angry";
  users: string[];
  count: number;
};

type Channel = {
  id: string;
  name: string;
  type: "public" | "game" | "private";
  gameId?: string;
  description?: string;
  participants?: string[];
  isSubscribed?: boolean;
};
>>>>>>> main

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

<<<<<<< HEAD
interface ChatComponentProps {
  chatName: string;
}
=======
const AVAILABLE_REACTIONS: Reaction["type"][] = [
  "like",
  "heart",
  "laugh",
  "wow",
  "sad",
  "angry",
];
>>>>>>> main

// Add default channels
const DEFAULT_CHANNELS: Channel[] = [
  {
    id: "public",
    name: "Public",
    type: "public",
    description: "General chat for all users",
  },
  {
    id: "poker",
    name: "Poker",
    type: "game",
    gameId: "poker",
    description: "Chat for poker players",
  },
  {
    id: "blackjack",
    name: "Blackjack",
    type: "game",
    gameId: "blackjack",
    description: "Chat for blackjack players",
  },
];

interface ChatSettings {
  appearance: {
    theme: "light" | "dark" | "system";
    fontSize: number;
    messageSpacing: number;
    showAvatars: boolean;
    compactMode: boolean;
    emojiStyle: "native" | "twitter" | "apple";
    timestampFormat: "12h" | "24h";
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    soundVolume: number;
    desktop: boolean;
    mentions: boolean;
    showPreview: boolean;
    mutedChannels: string[];
    mutedUsers: string[];
  };
  privacy: {
    showStatus: boolean;
    showTyping: boolean;
    readReceipts: boolean;
    sharePresence: boolean;
    allowDMs: boolean;
    blockList: string[];
  };
  messages: {
    sendWithEnter: boolean;
    showDeletedMessages: boolean;
    showEditHistory: boolean;
    enableMarkdown: boolean;
    enableEmojis: boolean;
    enableGifs: boolean;
    maxImageSize: number;
    autoplayMedia: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    messageSpeed: number;
  };
  language: {
    interface: string;
    spellcheck: boolean;
    autocorrect: boolean;
  };
}

const ChatComponent = () => {
  const [isMinimized, setIsMinimized] = useState(false);
<<<<<<< HEAD
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

=======
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isResizing, setIsResizing] = useState(false);
  const [messagesByChannel, setMessagesByChannel] = useState<
    Record<string, Message[]>
  >({});
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(
    null
  );
  const [channels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [currentChannel, setCurrentChannel] = useState<Channel>(
    DEFAULT_CHANNELS[0]
  );
  const [mentionUsers, setMentionUsers] = useState<string[]>([]);
  const [unreadByChannel, setUnreadByChannel] = useState<
    Record<string, number>
  >({});
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(
    new Set(["public"])
  );
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("appearance");
  const [settings, setSettings] = useState<ChatSettings>({
    appearance: {
      theme: "system",
      fontSize: 14,
      messageSpacing: 8,
      showAvatars: true,
      compactMode: false,
      emojiStyle: "native",
      timestampFormat: "12h",
    },
    notifications: {
      enabled: true,
      sound: true,
      soundVolume: 0.5,
      desktop: true,
      mentions: true,
      showPreview: true,
      mutedChannels: [],
      mutedUsers: [],
    },
    privacy: {
      showStatus: true,
      showTyping: true,
      readReceipts: true,
      sharePresence: true,
      allowDMs: true,
      blockList: [],
    },
    messages: {
      sendWithEnter: true,
      showDeletedMessages: false,
      showEditHistory: true,
      enableMarkdown: true,
      enableEmojis: true,
      enableGifs: true,
      maxImageSize: 5, // MB
      autoplayMedia: true,
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      screenReader: false,
      messageSpeed: 1,
    },
    language: {
      interface: "en",
      spellcheck: true,
      autocorrect: true,
    },
  });

  // Separate MQTT subscriptions for each channel
  const channelSubscriptions = DEFAULT_CHANNELS.map((channel) =>
    useMQTT<Message>(`chat/${channel.id}`, {
      mode: MQTTMode.BUFFERED,
      bufferSize: 50,
    })
  );

  // Update messages when receiving new ones for any channel
  useEffect(() => {
    DEFAULT_CHANNELS.forEach((channel, index) => {
      const channelMessages = channelSubscriptions[index].messages;
      if (Array.isArray(channelMessages)) {
        setMessagesByChannel((prev) => {
          const existingMessages = [...(prev[channel.id] || [])];

          channelMessages.forEach((newMsg) => {
            if (newMsg.isReactionUpdate) {
              // Update existing message's reactions
              const existingIndex = existingMessages.findIndex(
                (msg) => msg.id === newMsg.id
              );
              if (existingIndex !== -1) {
                existingMessages[existingIndex] = {
                  ...existingMessages[existingIndex],
                  reactions: newMsg.reactions,
                };
              }
            } else {
              // Add new message if it doesn't exist
              if (!existingMessages.some((msg) => msg.id === newMsg.id)) {
                existingMessages.push(newMsg);
              }
            }
          });

          return {
            ...prev,
            [channel.id]: existingMessages,
          };
        });
      }
    });
  }, [channelSubscriptions.map((sub) => sub.messages)]);

  // Update unread counts when new messages arrive
  useEffect(() => {
    DEFAULT_CHANNELS.forEach((channel, index) => {
      const channelMessages = channelSubscriptions[index].messages;
      if (Array.isArray(channelMessages)) {
        // Only increment unread if it's not the current channel
        if (channel.id !== currentChannel.id) {
          const newMessages = channelMessages.filter(
            (msg) =>
              !messagesByChannel[channel.id]?.some(
                (existing) => existing.id === msg.id
              )
          ).length;

          if (newMessages > 0) {
            setUnreadByChannel((prev) => ({
              ...prev,
              [channel.id]: (prev[channel.id] || 0) + newMessages,
            }));
          }
        }
      }
    });
  }, [channelSubscriptions.map((sub) => sub.messages)]);

  // Updated resize logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !dragStart) return;

      // Calculate the difference between current mouse position and start position
      const deltaWidth = dragStart.x - e.clientX;
      const deltaHeight = dragStart.y - e.clientY;

      // Update the size while maintaining constraints
      setSize({
        width: Math.max(300, Math.min(1200, dragStart.width + deltaWidth)),
        height: Math.max(300, Math.min(800, dragStart.height + deltaHeight)),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setDragStart(null);
      document.body.style.cursor = "default";
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "nw-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isResizing, dragStart]);

  // Get current channel's messages
  const currentMessages = messagesByChannel[currentChannel.id] || [];

  // Reset unread count when maximizing
  const handleMinimizeToggle = () => {
    if (isMinimized) {
      setUnreadCount(0); // Reset count when opening
    }
    setIsMinimized(!isMinimized);
  };

  const handleReaction = (
    messageId: string,
    reactionType: Reaction["type"]
  ) => {
    const userId = "testUser123"; // TODO: Replace with actual user ID from auth

    const messageToUpdate = currentMessages.find((msg) => msg.id === messageId);
    if (!messageToUpdate) {
      console.error("Message not found:", messageId);
      return;
    }

    // Create a deep copy of the existing reactions
    const updatedReactions = JSON.parse(
      JSON.stringify(messageToUpdate.reactions || {})
    );

    // Initialize or increment reaction
    if (!updatedReactions[reactionType]) {
      updatedReactions[reactionType] = {
        type: reactionType,
        count: 1,
        users: [userId],
      };
    } else {
      // Simply increment the count
      updatedReactions[reactionType].count += 1;
    }

    // Send only the necessary update information
    const reactionUpdate: Message = {
      id: messageId,
      text: messageToUpdate.text,
      sender: messageToUpdate.sender,
      timestamp: messageToUpdate.timestamp,
      channelId: currentChannel.id,
      reactions: updatedReactions,
      isReactionUpdate: true,
    };

    // Find the correct channel subscription
    const channelIndex = DEFAULT_CHANNELS.findIndex(
      (c) => c.id === currentChannel.id
    );
    if (channelIndex !== -1) {
      channelSubscriptions[channelIndex].sendMessage(reactionUpdate);
    }
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
      replyTo: messageId,
    };

    channelSubscriptions[DEFAULT_CHANNELS.indexOf(currentChannel)].sendMessage(
      messageData
    );
    setNewMessage("");
  };

  // Auto-scroll to bottom when new messages arrive
>>>>>>> main
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const getReactionEmoji = (type: string): string => {
    const emojiMap: Record<string, string> = {
      like: "👍",
      heart: "❤️",
      laugh: "😄",
      wow: "😮",
      sad: "😢",
      angry: "😠",
    };
    return emojiMap[type] || "";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

<<<<<<< HEAD
    const senderName = user?.displayName || user?.email || "Guest";

    const messageData: Message = {
=======
    const messageData: Message = {
      id: crypto.randomUUID(),
>>>>>>> main
      text: newMessage,
      sender: senderName,
      timestamp: new Date().toISOString(),
      channelId: currentChannel.id,
      reactions: {},
    };

    // Find the correct channel subscription
    const channelIndex = DEFAULT_CHANNELS.findIndex(
      (c) => c.id === currentChannel.id
    );
    if (channelIndex !== -1) {
      channelSubscriptions[channelIndex].sendMessage(messageData);
    }

    setNewMessage("");
  };

  const handleAddReactionClick = (
    messageId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setShowReactionPicker(messageId);
  };

<<<<<<< HEAD
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
=======
  const handleMention = (message: string) => {
    const mentions = message.match(/@(\w+)/g);
    if (mentions) {
      setMentionUsers(mentions.map((m) => m.substring(1)));
      // Trigger notification for mentioned users
    }
  };
>>>>>>> main

  // Clear unread count when switching channels
  const handleChannelSwitch = (channel: Channel) => {
    setCurrentChannel(channel);
    setUnreadByChannel((prev) => ({
      ...prev,
      [channel.id]: 0,
    }));
  };

  const handleSubscription = (channelId: string, subscribe: boolean) => {
    setSubscribedChannels((prev) => {
      const newSet = new Set(prev);
      if (subscribe) {
        newSet.add(channelId);
      } else {
        newSet.delete(channelId);
      }
      return newSet;
    });
  };

  const handleGameJoin = (gameId: string) => {
    const gameChannel = DEFAULT_CHANNELS.find((c) => c.gameId === gameId);
    if (gameChannel) {
      handleSubscription(gameChannel.id, true);
    }
  };

  const handleGameLeave = (gameId: string) => {
    const gameChannel = DEFAULT_CHANNELS.find((c) => c.gameId === gameId);
    if (gameChannel) {
      handleSubscription(gameChannel.id, false);
    }
  };

  const updateSettings = (
    category: keyof ChatSettings,
    setting: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  // Add notification state and handlers
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        updateSettings("notifications", "enabled", true);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  // Handle notification settings changes
  const handleNotificationChange = async (enabled: boolean) => {
    if (enabled && notificationPermission !== "granted") {
      await requestNotificationPermission();
    } else {
      updateSettings("notifications", "enabled", enabled);
    }
  };

  // Apply theme changes
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      settings.appearance.theme
    );
    if (settings.appearance.theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }
  }, [settings.appearance.theme]);

  // Apply font size changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base-font-size",
      `${settings.appearance.fontSize}px`
    );
  }, [settings.appearance.fontSize]);

  // Handle notifications
  useEffect(() => {
    if (!settings.notifications.enabled) return;

    // Create message handler for notifications
    const handleNewMessages = () => {
      DEFAULT_CHANNELS.forEach((channel, index) => {
        const channelMessages = channelSubscriptions[index].messages;

        // Get last message if there are any messages
        if (Array.isArray(channelMessages) && channelMessages.length > 0) {
          const lastMessage = channelMessages[channelMessages.length - 1];

          // Check if we should show notification
          if (
            document.hidden && // Only notify if window is not focused
            !settings.notifications.mutedChannels.includes(
              lastMessage.channelId
            ) &&
            !settings.notifications.mutedUsers.includes(lastMessage.sender)
          ) {
            // Show notification
            if (
              settings.notifications.desktop &&
              notificationPermission === "granted"
            ) {
              const notification = new Notification("New Message", {
                body: `${lastMessage.sender}: ${lastMessage.text}`,
                icon: "/path/to/notification-icon.png", // Add your notification icon
              });

              // Auto-close notification
              setTimeout(() => notification.close(), 5000);
            }

            // Play sound if enabled
            if (settings.notifications.sound) {
              const audio = new Audio("/path/to/notification-sound.mp3"); // Add your notification sound
              audio.volume = settings.notifications.soundVolume;
              audio.play().catch(console.error);
            }
          }
        }
      });
    };

    // Watch for changes in messages
    channelSubscriptions.forEach((sub, index) => {
      if (sub.messages) {
        handleNewMessages();
      }
    });
  }, [
    channelSubscriptions.map((sub) => sub.messages),
    settings.notifications,
    notificationPermission,
  ]);

  return (
    <div
      className={`chat-widget ${isMinimized ? "minimized" : ""} ${
        isResizing ? "resizing" : ""
      }`}
      style={{
        width: isMinimized ? "250px" : `${size.width}px`,
        height: isMinimized ? "auto" : `${size.height}px`,
      }}
    >
      <div className="chat-header">
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        >
          <span className="resize-icon">⋮</span>
        </div>
        <h3 onClick={handleMinimizeToggle}>{currentChannel.name} Chat</h3>
        <button
          className={`settings-toggle ${showSettings ? "active" : ""}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
        <span className="minimize-icon" onClick={handleMinimizeToggle}>
          {isMinimized ? "▲" : "▼"}
        </span>
      </div>

      {!isMinimized && (
        <div className="chat-container">
          <div className="sidebar">
            <div className="channel-list">
              {channels.map((channel) => (
                <div key={channel.id} className="channel-item">
                  <button
                    onClick={() => handleChannelSwitch(channel)}
                    className={`channel-button ${
                      currentChannel.id === channel.id ? "active" : ""
                    }`}
                  >
                    <span className="channel-name">{channel.name}</span>
                    {unreadByChannel[channel.id] > 0 && (
                      <span className="unread-badge">
                        {unreadByChannel[channel.id]}
                      </span>
                    )}
                  </button>

                  {channel.type !== "public" && (
                    <button
                      onClick={() =>
                        handleSubscription(
                          channel.id,
                          !subscribedChannels.has(channel.id)
                        )
                      }
                      className={`subscribe-button ${
                        subscribedChannels.has(channel.id) ? "subscribed" : ""
                      }`}
                      title={
                        subscribedChannels.has(channel.id)
                          ? "Unsubscribe from channel"
                          : "Subscribe to channel"
                      }
                    >
                      {subscribedChannels.has(channel.id) ? "🔔" : "🔕"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="main-chat">
            <div className={`chat-messages ${showSettings ? "hidden" : ""}`}>
              {currentMessages.map((msg) => (
                <div key={msg.id} className="message">
                  {msg.replyTo && (
                    <div className="reply-indicator">
                      ↳ Reply to:{" "}
                      {currentMessages
                        .find((m) => m.id === msg.replyTo)
                        ?.text.substring(0, 30)}
                      ...
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
                      {Object.entries(msg.reactions || {}).map(
                        ([type, reaction]) => (
                          <button
                            key={type}
                            onClick={() =>
                              handleReaction(msg.id, type as Reaction["type"])
                            }
                            className="reaction-button"
                          >
                            {getReactionEmoji(type)}
                            <span className="reaction-count">
                              {reaction.count}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                    <button
                      className="add-reaction"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddReactionClick(msg.id, e);
                      }}
                    >
                      +
                    </button>
                    {showReactionPicker === msg.id && (
                      <div className="reaction-picker">
                        {AVAILABLE_REACTIONS.map((type) => (
                          <button
                            key={type}
                            className="reaction-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReaction(msg.id, type);
                              setShowReactionPicker(null);
                            }}
                          >
                            {getReactionEmoji(type)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="message-actions">
                    <button onClick={() => handleReply(msg.id)}>Reply</button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`settings-container ${showSettings ? "visible" : ""}`}
            >
              <div className="settings-header">
                <button
                  className="back-button"
                  onClick={() => setShowSettings(false)}
                >
                  ← Back to Chat
                </button>
                <h3>Settings</h3>
              </div>

              <div className="settings-content">
                <div className="settings-tabs">
                  <button
                    className={
                      activeSettingsTab === "appearance" ? "active" : ""
                    }
                    onClick={() => setActiveSettingsTab("appearance")}
                  >
                    Appearance
                  </button>
                  <button
                    className={
                      activeSettingsTab === "notifications" ? "active" : ""
                    }
                    onClick={() => setActiveSettingsTab("notifications")}
                  >
                    Notifications
                  </button>
                  {/* Add more tabs as needed */}
                </div>

                <div className="settings-options">
                  {/* Settings content based on active tab */}
                  {activeSettingsTab === "appearance" && (
                    <div className="settings-section">
                      <h4>Theme</h4>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) =>
                          updateSettings("appearance", "theme", e.target.value)
                        }
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>

                      <h4>Font Size</h4>
                      <div className="setting-item">
                        <input
                          type="range"
                          min="12"
                          max="20"
                          value={settings.appearance.fontSize}
                          onChange={(e) =>
                            updateSettings(
                              "appearance",
                              "fontSize",
                              Number(e.target.value)
                            )
                          }
                        />
                        <span>{settings.appearance.fontSize}px</span>
                      </div>

                      <h4>Message Display</h4>
                      <div className="setting-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={settings.appearance.compactMode}
                            onChange={(e) =>
                              updateSettings(
                                "appearance",
                                "compactMode",
                                e.target.checked
                              )
                            }
                          />
                          Compact Mode
                        </label>
                      </div>

                      <div className="setting-item">
                        <label>
                          <input
                            type="checkbox"
                            checked={settings.appearance.showAvatars}
                            onChange={(e) =>
                              updateSettings(
                                "appearance",
                                "showAvatars",
                                e.target.checked
                              )
                            }
                          />
                          Show Avatars
                        </label>
                      </div>

                      <h4>Emoji Style</h4>
                      <select
                        value={settings.appearance.emojiStyle}
                        onChange={(e) =>
                          updateSettings(
                            "appearance",
                            "emojiStyle",
                            e.target.value
                          )
                        }
                      >
                        <option value="native">Native</option>
                        <option value="twitter">Twitter</option>
                        <option value="apple">Apple</option>
                      </select>

                      <h4>Timestamp Format</h4>
                      <select
                        value={settings.appearance.timestampFormat}
                        onChange={(e) =>
                          updateSettings(
                            "appearance",
                            "timestampFormat",
                            e.target.value
                          )
                        }
                      >
                        <option value="12h">12h</option>
                        <option value="24h">24h</option>
                      </select>
                    </div>
                  )}
                  {activeSettingsTab === "notifications" && (
                    <div className="settings-section">
                      <h4>Notifications</h4>
                      <div className="setting-item">
                        <label>
                          <div className="setting-item-text">
                            Enable Notifications
                            {notificationPermission === "denied" && (
                              <div className="setting-description">
                                Please enable notifications in your browser
                                settings
                              </div>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.enabled}
                            onChange={(e) =>
                              handleNotificationChange(e.target.checked)
                            }
                            className="setting-item-checkbox"
                          />
                        </label>
                      </div>

                      {settings.notifications.enabled && (
                        <>
                          <div className="setting-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={settings.notifications.sound}
                                onChange={(e) =>
                                  updateSettings(
                                    "notifications",
                                    "sound",
                                    e.target.checked
                                  )
                                }
                              />
                              Play Sound
                            </label>
                          </div>

                          {settings.notifications.sound && (
                            <div className="setting-item">
                              <label>Sound Volume</label>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.notifications.soundVolume}
                                onChange={(e) =>
                                  updateSettings(
                                    "notifications",
                                    "soundVolume",
                                    Number(e.target.value)
                                  )
                                }
                              />
                              <button
                                className="test-sound"
                                onClick={() => {
                                  const audio = new Audio(
                                    "/path/to/notification-sound.mp3"
                                  );
                                  audio.volume =
                                    settings.notifications.soundVolume;
                                  audio.play().catch(console.error);
                                }}
                              >
                                Test
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`chat-input-form ${showSettings ? "hidden" : ""}`}>
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${currentChannel.name}`}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
