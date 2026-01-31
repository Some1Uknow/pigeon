import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { ChatSidebar, ChatWindow, NewChatModal } from "../components";
import {
  useChatState,
  useBalance,
  useSidebarResize,
  useAutoError,
  useWebSocketChat,
} from "../hooks";

export default function Chats() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [error, setError] = useAutoError();
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const sidebar = useSidebarResize();
  const balance = useBalance(wallet, connection);

  // Chat State
  const chat = useChatState(setError);

  // Real-time updates
  useWebSocketChat({
    activeChat: chat.activeChat,
    connection,
    setActiveChat: () => { }, // Managed by useChatState
    setChats: () => { },
  });

  const handleSendMessage = async () => {
    await chat.sendMessage(input);
    setInput("");
  };

  const handleStartChat = async (address: string, message: string) => {
    await chat.startNewChat(address, message);
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-term-bg)] text-[var(--color-term-green)] font-body overflow-hidden">
      <div
        style={{ width: sidebar.width }}
        className={`shrink-0 ${sidebar.isResizing ? "" : "transition-[width] duration-150 ease-out"}`}
      >
        <ChatSidebar
          chats={chat.chats}
          activeChat={chat.activeChat}
          onOpenChat={chat.openChat}
          onNewChat={() => setShowModal(true)}
        />
      </div>

      {/* Resizer Handle */}
      <div
        onMouseDown={sidebar.startResizing}
        className="w-1.5 cursor-col-resize z-50 bg-[var(--color-term-dim)] hover:bg-[var(--color-term-green)] transition-colors flex flex-col justify-center items-center gap-1 opacity-80 hover:opacity-100"
        title="RESIZE_PANEL"
        style={{
           backgroundImage: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)",
           backgroundSize: "100% 4px"
        }}
      />

      <ChatWindow
        activeChat={chat.activeChat}
        wallet={wallet}
        input={input}
        onInputChange={setInput}
        onSendMessage={handleSendMessage}
        loading={chat.loading}
        balance={balance}
        connection={connection}
      />

      <NewChatModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onStartChat={handleStartChat}
        loading={chat.loading}
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-black text-[var(--color-term-alert)] px-4 py-2 border border-[var(--color-term-alert)] shadow-[4px_4px_0px_var(--color-term-alert)] font-display uppercase tracking-widest text-sm z-50">
          [ ERROR ] : {error}
        </div>
      )}
    </div>
  );
}
