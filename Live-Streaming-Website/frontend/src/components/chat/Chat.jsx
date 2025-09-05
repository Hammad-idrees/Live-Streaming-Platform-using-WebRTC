import React, { useState, useEffect, useRef } from "react";

export default function Chat({
  socketRef,
  sendChatMessage,
  userRole = "viewer",
  onChatMessage,
  username,
  usernameSet,
  setUserName,
  clearUsername,
}) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Show username input only if not set and no saved username
  useEffect(() => {
    if (
      !usernameSet &&
      !showUsernameInput &&
      !localStorage.getItem("chat-username")
    ) {
      setShowUsernameInput(true);
    }
  }, [usernameSet, showUsernameInput]);

  // Auto-focus input when username is set
  useEffect(() => {
    if (usernameSet && inputRef.current) {
      inputRef.current.focus();
    }
  }, [usernameSet]);

  // Handle incoming chat messages
  useEffect(() => {
    if (!onChatMessage) return;

    const handleMessage = (data) => {
      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            message: data.message,
            senderId: data.senderId,
            senderName: data.senderName || "Anonymous",
            timestamp: data.timestamp || Date.now(),
            self: data.self || false,
          },
        ]);
      }
    };

    onChatMessage.current = handleMessage;

    return () => {
      if (onChatMessage.current) {
        onChatMessage.current = null;
      }
    };
  }, [onChatMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSetUsername = () => {
    if (tempUsername.trim()) {
      setUserName(tempUsername.trim());
      setShowUsernameInput(false);
      setIsEditingUsername(false);
      setTempUsername("");
    }
  };

  const handleUsernameKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSetUsername();
    } else if (e.key === "Escape") {
      handleCancelUsername();
    }
  };

  const handleChangeUsername = () => {
    setTempUsername(username);
    setIsEditingUsername(true);
    setShowUsernameInput(true);
  };

  const handleCancelUsername = () => {
    setTempUsername("");
    setShowUsernameInput(false);
    setIsEditingUsername(false);
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !usernameSet) return;

    const newMessage = {
      id: Date.now(),
      message: currentMessage,
      senderId: socketRef.current?.id,
      senderName: username,
      timestamp: Date.now(),
      self: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    sendChatMessage(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDisplayName = (msg) => {
    return msg.self ? "You" : msg.senderName || "Anonymous";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white";
      case "moderator":
        return "bg-amber-500 text-white";
      case "viewer":
        return "bg-slate-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
      {/* Username Setup Modal */}
      {showUsernameInput && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                {isEditingUsername
                  ? "✏️ Change Display Name"
                  : "👤 Set Your Name"}
              </h3>
              <button
                onClick={handleCancelUsername}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                onKeyDown={handleUsernameKeyPress}
                placeholder="Enter your display name..."
                className="w-full bg-slate-700/80 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-700 border border-slate-600"
                maxLength={20}
                autoFocus
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-400">
                  {tempUsername.length}/20 characters
                </span>
                {isEditingUsername && (
                  <span className="text-xs text-slate-400">
                    Press Esc to cancel
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSetUsername}
                disabled={!tempUsername.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
              >
                {isEditingUsername ? "Update Name" : "Save & Continue"}
              </button>
              {isEditingUsername && (
                <button
                  onClick={handleCancelUsername}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-base font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Live Chat</h3>
              <div
                className={`text-xs px-2 py-1 rounded-full ${getRoleColor(
                  userRole
                )}`}
              >
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </div>
            </div>
          </div>

          {usernameSet && (
            <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300">Logged in as:</span>
                <span className="text-sm font-medium text-white">
                  {username}
                </span>
              </div>
              <button
                onClick={handleChangeUsername}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
        {!usernameSet ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="text-4xl mb-4">👋</div>
            <h4 className="text-lg font-medium text-white mb-2">
              Welcome to the chat!
            </h4>
            <p className="text-slate-400">
              Please set your display name to start chatting
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="text-4xl mb-4">💭</div>
            <h4 className="text-lg font-medium text-white mb-2">
              No messages yet
            </h4>
            <p className="text-slate-400">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-xs lg:max-w-md">
                {!msg.self && (
                  <div className="text-xs text-slate-400 mb-1">
                    {getDisplayName(msg)}
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-xl text-sm ${
                    msg.self
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-700 text-slate-100"
                  }`}
                >
                  <div className="break-words">{msg.message}</div>
                  <div
                    className={`text-xs mt-2 ${
                      msg.self ? "text-indigo-200" : "text-slate-400"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/80">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              usernameSet ? "Type your message..." : "Set your name first..."
            }
            disabled={!usernameSet}
            className="flex-1 bg-slate-700/80 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600"
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || !usernameSet}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-slate-400">
            Press Enter to send • Shift+Enter for new line
          </div>
          <div className="text-xs text-slate-400">
            {currentMessage.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}
