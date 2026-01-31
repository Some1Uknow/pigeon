import pigeon from "../assets/pigeon.png";
import { truncateAddress } from "../utils/format";
import type { Chat } from "../types/chat";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  onOpenChat: (receiver: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({
  chats,
  activeChat,
  onOpenChat,
  onNewChat,
}: ChatSidebarProps) => {
  return (
    <aside className="shrink-0 border-r border-[var(--color-term-dim)] bg-[var(--color-term-bg)] flex flex-col p-4 w-full h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-term-dim)] border-dashed">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 p-1 border border-[var(--color-term-green)]">
            <img src={pigeon} alt="Pigeon" className="w-full h-full object-contain holographic-pigeon" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[var(--color-term-green)] text-xl font-display font-semibold tracking-widest uppercase leading-none">PIGEON_CLI</h1>
            <p className="text-[var(--color-term-dim)] text-xs font-normal uppercase">SYS: ONLINE</p>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="px-2 py-1 bg-[var(--color-term-green)] text-black hover:bg-[var(--color-term-green)]/80 text-sm font-display tracking-widest uppercase border border-[var(--color-term-green)]"
        >
          [ NEW ]
        </button>
      </div>

      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-term-dim)]">search</span>
        <input
          className="w-full bg-black border border-[var(--color-term-dim)] rounded-none pl-10 pr-4 py-2 text-sm font-body text-[var(--color-term-green)] placeholder:text-[var(--color-term-dim)] focus:border-[var(--color-term-green)] focus:outline-none transition-none"
          placeholder="SEARCH_CONTACTS..."
          type="text"
        />
      </div>

      <nav className="grow overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-[var(--color-term-dim)]">
        <div className="flex flex-col gap-1">
          {chats.length === 0 ? (
            <p className="text-[var(--color-term-dim)] text-sm mt-8 text-center font-body">&gt; No active sessions found.</p>
          ) : (
            chats.map((chat) => {
              const isActive = activeChat?.receiver === chat.receiver;
              return (
                <button
                  key={chat.receiver}
                  onClick={() => onOpenChat(chat.receiver)}
                  className={`flex items-center gap-3 px-3 py-3 w-full text-left relative font-body transition-none ${isActive 
                    ? "bg-[var(--color-term-green)] text-black" 
                    : "text-[var(--color-term-green)] hover:bg-[var(--color-term-dim)]/20"
                    }`}
                >
                  <div className="relative">
                    <div className={`w-8 h-8 flex items-center justify-center text-sm border ${isActive ? "border-black text-black" : "border-[var(--color-term-green)] text-[var(--color-term-green)]"}`}>
                      <span className="material-symbols-outlined text-lg">chat_bubble</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate tracking-wider">{truncateAddress(chat.receiver)}</p>
                    <p className={`text-xs truncate ${isActive ? "text-black/70" : "text-[var(--color-term-dim)]"}`}>
                      {chat.messages.at(-1)?.text?.slice(0, 40) || "No messages"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-[var(--color-term-dim)] border-dashed">
        <a className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-term-dim)]/20 transition-none group" href="#">
          <span className="material-symbols-outlined text-[var(--color-term-dim)] group-hover:text-[var(--color-term-green)]">settings</span>
          <p className="text-[var(--color-term-dim)] group-hover:text-[var(--color-term-green)] text-sm font-medium uppercase tracking-wider">Config</p>
        </a>
      </div>
    </aside>
  );
};

export default ChatSidebar;

