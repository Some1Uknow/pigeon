import React from 'react';

interface Message {
  sender: any; // PublicKey
  text: string;
  timestamp: any; // BN
}

interface Chat {
  receiver: string;
  messages: Message[];
  isSentByMe: boolean;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onOpenChat: (receiver: string, isSentByMe: boolean) => void;
  onNewChat: () => void;
}

const MAX_MESSAGES_PER_CHAT = 10;

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onOpenChat,
  onNewChat
}) => {
  return (
    <aside className="w-80 border-r border-white/10 bg-[#101010]/80 backdrop-blur-lg p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Pigeon 🕊</h2>
        <button
          onClick={onNewChat}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
        >
          New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm mt-8 text-center">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.receiver}
              onClick={() => onOpenChat(chat.receiver, chat.isSentByMe)}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                activeChat?.receiver === chat.receiver
                  ? "bg-blue-600/30 border border-blue-500/20"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="font-medium text-gray-200 truncate">{chat.receiver}</div>
              <div className="text-xs text-gray-500">
                {chat.messages.at(-1)?.text?.slice(0, 40) || "No messages"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {chat.messages.length}/{MAX_MESSAGES_PER_CHAT} messages
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
