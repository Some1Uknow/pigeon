import { useState, type CSSProperties } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import { ChatSidebar, NewChatModal } from "../components";
import {
  useAutoError,
  useBalance,
  useChatState,
  useSidebarResize,
  useWebSocketChat,
} from "../hooks";
import type { AppShellContextValue } from "./appShellContext";

export default function AppShell() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();

  const [error, setError] = useAutoError();
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const sidebar = useSidebarResize(340, 280, 480);
  const balance = useBalance(wallet, connection);
  const chat = useChatState(setError);

  useWebSocketChat({
    activeChat: chat.activeChat,
    connection,
    setActiveChat: () => {},
    setChats: () => {},
  });

  const handleOpenChat = async (receiver: string) => {
    await chat.openChat(receiver);
    navigate(`/app/chats/${receiver}`);
  };

  const handleSendMessage = async () => {
    await chat.sendMessage(input);
    setInput("");
  };

  const handleStartChat = async (address: string, message: string) => {
    await chat.startNewChat(address, message);
    setShowModal(false);
  };

  const sidebarStyle = {
    "--sidebar-width": `${sidebar.width}px`,
  } as CSSProperties;

  const outletContext: AppShellContextValue = {
    chat,
    wallet,
    connection,
    balance,
    input,
    onInputChange: setInput,
    onSendMessage: handleSendMessage,
  };

  return (
    <div className="app-bg relative flex h-screen min-h-screen flex-col overflow-hidden font-body text-[var(--color-text)] md:flex-row">
      <div className="fixed inset-0 z-0 bg-noise" />
      <div className="fixed inset-0 z-0 bg-grid" />

      <div
        style={sidebarStyle}
        className={`relative z-10 h-[44vh] w-full shrink-0 md:h-screen md:w-[var(--sidebar-width)] ${
          sidebar.isResizing ? "" : "md:transition-[width] md:duration-150 md:ease-out"
        }`}
      >
        <ChatSidebar
          chats={chat.chats}
          activeChat={chat.activeChat}
          onOpenChat={handleOpenChat}
          onNewChat={() => setShowModal(true)}
        />
      </div>

      <div
        onMouseDown={sidebar.startResizing}
        className="relative z-20 hidden w-1.5 cursor-col-resize flex-col items-center justify-center gap-1 bg-[rgba(119,117,117,0.16)] opacity-80 transition-colors hover:bg-[var(--color-secondary)] hover:opacity-100 md:flex"
        title="Resize panel"
      />

      <Outlet context={outletContext} />

      <NewChatModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onStartChat={handleStartChat}
        loading={chat.loading}
      />

      {error && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-[rgba(255,110,132,0.42)] bg-[rgba(32,31,31,0.94)] px-4 py-3 font-label text-sm text-[var(--color-error)] shadow-2xl backdrop-blur-xl">
          <div className="mb-1 text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            Error
          </div>
          {error}
        </div>
      )}
    </div>
  );
}
