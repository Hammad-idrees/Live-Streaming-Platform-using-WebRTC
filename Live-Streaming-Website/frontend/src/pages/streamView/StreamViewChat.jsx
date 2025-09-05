import React from "react";
import Chat from "../../components/chat/Chat";
import { ChevronRight, MessageCircle } from "lucide-react";

const StreamViewChat = ({ streamData, chatCollapsed, setChatCollapsed }) => (
  <div
    className={`fixed top-0 right-0 h-full w-80 bg-dark-900 border-l border-dark-800 shadow-lg z-40 transition-transform duration-300 ${
      chatCollapsed ? "translate-x-full" : "translate-x-0"
    }`}
  >
    <div className="flex items-center justify-between p-4 border-b border-dark-800 bg-dark-900">
      <div className="flex items-center gap-2">
        <MessageCircle size={20} className="text-primary-400" />
        <span className="text-white font-semibold">Live Chat</span>
      </div>
      <button
        onClick={() => setChatCollapsed(true)}
        className="text-dark-400 hover:text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
    <div className="h-[calc(100%-56px)] overflow-y-auto">
      <Chat streamId={streamData.id} />
    </div>
  </div>
);

export default StreamViewChat;
