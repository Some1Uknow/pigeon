import { NavLink, Link, useLocation } from "react-router-dom";

import pigeon from "../assets/pigeon.png";
import { truncateAddress } from "../utils/format";
import type { Chat } from "../types/chat";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onOpenChat: (receiver: string) => void;
  onNewChat: () => void;
}

type SidebarTool = "chat" | "swap" | "transfer";

const tabs: Array<{ id: SidebarTool; label: string; icon: string; to: string }> = [
  { id: "chat", label: "Chat", icon: "chat_bubble", to: "/app/chats" },
  { id: "swap", label: "Swap", icon: "swap_horiz", to: "/app/swap" },
  { id: "transfer", label: "Transfer", icon: "send_money", to: "/app/transfer" },
];

const ChatSidebar = ({
  chats,
  activeChat,
  onOpenChat,
  onNewChat,
}: ChatSidebarProps) => {
  const { pathname } = useLocation();
  const activeTool: SidebarTool = pathname.startsWith("/app/swap")
    ? "swap"
    : pathname.startsWith("/app/transfer")
      ? "transfer"
      : "chat";

  const chatTarget = activeChat ? `/app/chats/${activeChat.receiver}` : "/app/chats";

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[rgba(119,117,117,0.16)] bg-[rgba(14,14,14,0.9)] p-4 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-[rgba(119,117,117,0.16)] pb-4">
        <Link to={chatTarget} className="flex min-w-0 items-center gap-3" aria-label="Open Pigeon chat workspace">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[rgba(189,157,255,0.38)] bg-[var(--color-surface-low)] p-1.5">
            <img src={pigeon} alt="" className="h-full w-full object-contain holographic-pigeon" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-black uppercase leading-none text-[var(--color-primary)]">
              PIGEON
            </h1>
            <p className="mt-1 flex items-center gap-2 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              <span className="status-dot" />
              {activeTool}_online
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onNewChat}
          className="btn-primary min-h-10 shrink-0 px-3 text-xs"
        >
          [ New ]
        </button>
      </div>

      <div className="min-h-0 grow overflow-hidden">
        {activeTool === "chat" && (
          <ChatContextPanel
            chats={chats}
            activeChat={activeChat}
            onOpenChat={onOpenChat}
            onNewChat={onNewChat}
          />
        )}
        {activeTool === "swap" && <SwapContextPanel />}
        {activeTool === "transfer" && <TransferContextPanel activeChat={activeChat} />}
      </div>

      <div className="mt-4 border-t border-[rgba(119,117,117,0.16)] pt-3">
        <nav className="grid grid-cols-3 gap-2" aria-label="Pigeon superapp tools">
          {tabs.map((tab) => {
            const to = tab.id === "chat" ? chatTarget : tab.to;
            return (
              <NavLink
                key={tab.id}
                to={to}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border px-2 font-label text-[11px] uppercase transition-colors ${
                    isActive
                      ? "border-[rgba(189,157,255,0.5)] bg-[rgba(189,157,255,0.14)] text-[var(--color-primary)]"
                      : "border-[rgba(119,117,117,0.16)] bg-[var(--color-surface-black)] text-[var(--color-text-muted)] hover:border-[rgba(0,238,252,0.36)] hover:text-[var(--color-secondary)]"
                  }`
                }
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

function ChatContextPanel({
  chats,
  activeChat,
  onOpenChat,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <label className="relative mb-4 block">
        <span className="sr-only">Search contacts</span>
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-[var(--color-text-muted)]" aria-hidden="true">
          search
        </span>
        <input
          className="h-11 w-full rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] pl-10 pr-4 font-label text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-secondary)]"
          placeholder="SEARCH_CONTACTS"
          type="search"
        />
      </label>

      <nav className="-mr-2 min-h-0 grow overflow-y-auto pr-2" aria-label="Chat sessions">
        <div className="flex flex-col gap-2">
          {chats.length === 0 ? (
            <div className="panel-surface rounded-lg p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-surface-bright)]">
                <span className="material-symbols-outlined text-[var(--color-secondary)]" aria-hidden="true">forum</span>
              </div>
              <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                No active sessions
              </p>
              <button
                type="button"
                onClick={onNewChat}
                className="btn-secondary mt-4 min-h-10 px-4 text-xs"
              >
                Start chat
              </button>
            </div>
          ) : (
            chats.map((chat) => {
              const isActive = activeChat?.receiver === chat.receiver;
              return (
                <button
                  key={chat.receiver}
                  type="button"
                  onClick={() => onOpenChat(chat.receiver)}
                  className={`flex min-h-16 w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
                    isActive
                      ? "border-[rgba(189,157,255,0.52)] bg-[rgba(189,157,255,0.13)] text-[var(--color-text)]"
                      : "border-transparent text-[var(--color-text-muted)] hover:border-[rgba(119,117,117,0.18)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${isActive ? "border-[rgba(0,238,252,0.4)] text-[var(--color-secondary)]" : "border-[rgba(119,117,117,0.24)] text-[var(--color-text-muted)]"}`}>
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">chat_bubble</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-label text-sm font-bold">{truncateAddress(chat.receiver)}</p>
                    <p className="truncate text-xs text-[var(--color-text-muted)]">
                      {chat.messages.at(-1)?.text?.slice(0, 48) || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </nav>
    </div>
  );
}

function SwapContextPanel() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
      <ToolHeader icon="swap_horiz" title="Swap Context" eyebrow="Route support" />
      <div className="panel-surface rounded-lg p-4">
        <div className="mb-3 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">
          Recent pairs
        </div>
        <div className="space-y-2">
          {["SOL / USDC", "SOL / BONK", "USDC / PYUSD"].map((pair) => (
            <div key={pair} className="flex min-h-11 items-center justify-between rounded-md border border-[rgba(119,117,117,0.16)] bg-[var(--color-surface-black)] px-3">
              <span className="font-label text-sm text-[var(--color-text)]">{pair}</span>
              <span className="font-label text-[11px] uppercase text-[var(--color-text-muted)]">Preview</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-panel rounded-lg p-4">
        <div className="mb-2 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">Workspace</div>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Quotes, routes, and confirmation stay in the right pane so the sidebar remains navigation.
        </p>
      </div>
    </div>
  );
}

function TransferContextPanel({ activeChat }: { activeChat: Chat | null }) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto pr-1">
      <ToolHeader icon="send_money" title="Transfer Context" eyebrow="Recipient support" />
      {activeChat && (
        <Link
          to={`/app/transfer?to=${activeChat.receiver}`}
          className="panel-surface block rounded-lg p-4 transition-colors hover:border-[rgba(0,238,252,0.38)]"
        >
          <div className="mb-2 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">
            Active chat recipient
          </div>
          <div className="font-label text-sm text-[var(--color-text)]">{truncateAddress(activeChat.receiver)}</div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Open transfer prefilled with this wallet.
          </p>
        </Link>
      )}
      <div className="panel-surface rounded-lg p-4">
        <div className="mb-3 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">
          Recipient rails
        </div>
        <div className="space-y-2">
          {["Wallet address", "Recent chats", "Encrypted memo"].map((item) => (
            <div key={item} className="flex min-h-11 items-center gap-3 rounded-md border border-[rgba(119,117,117,0.16)] bg-[var(--color-surface-black)] px-3">
              <span className="status-dot" />
              <span className="text-sm text-[var(--color-text-soft)]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolHeader({ icon, title, eyebrow }: { icon: string; title: string; eyebrow: string }) {
  return (
    <div className="panel-surface rounded-lg p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-surface-bright)] text-[var(--color-primary)]">
        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
      </div>
      <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">{eyebrow}</p>
      <h2 className="mt-1 font-display text-2xl font-bold uppercase text-[var(--color-text)]">{title}</h2>
    </div>
  );
}

export default ChatSidebar;
