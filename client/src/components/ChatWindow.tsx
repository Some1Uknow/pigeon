import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";

import pigeon from "../assets/pigeon.png";
import { TipModal } from "./TipModal";
import { truncateAddress, getNetworkLabel } from "../utils/format";
import { MAX_MESSAGE_LENGTH } from "../utils/chatConstants";
import type { Chat } from "../types/chat";

interface ChatWindowProps {
  activeChat: Chat | null;
  wallet: WalletContextState;
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  balance: number | null;
  connection: Connection;
}

const ChatWindow = ({
  activeChat,
  wallet,
  input,
  onInputChange,
  onSendMessage,
  loading,
  balance,
  connection,
}: ChatWindowProps) => {
  const [tipModalOpen, setTipModalOpen] = useState(false);

  const formatTimestamp = (timestamp: { toNumber?: () => number } | number) => {
    const seconds =
      typeof timestamp === "number"
        ? timestamp
        : (timestamp?.toNumber?.() ?? Date.now() / 1000);
    return new Date(seconds * 1000).toLocaleTimeString();
  };

  return (
    <main className="relative z-10 flex min-h-0 flex-1 flex-col bg-[rgba(14,14,14,0.58)]">
      <header className="relative z-40 flex shrink-0 flex-col gap-4 border-b border-[rgba(119,117,117,0.16)] bg-[rgba(19,19,19,0.82)] px-4 py-4 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[rgba(189,157,255,0.38)] bg-[var(--color-surface-low)] p-1.5">
            <img
              src={pigeon}
              alt=""
              className="h-full w-full object-contain holographic-pigeon"
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate font-display text-2xl font-bold uppercase text-[var(--color-text)]">
                {activeChat ? truncateAddress(activeChat.receiver) : "NO_SIGNAL"}
              </h2>
              {activeChat && (
                <>
                  <span className="rounded-sm border border-[rgba(0,238,252,0.26)] bg-[rgba(0,238,252,0.08)] px-2 py-1 font-label text-xs uppercase text-[var(--color-secondary)]">
                    Secure
                  </span>
                  <button
                    type="button"
                    onClick={() => setTipModalOpen(true)}
                    className="btn-secondary min-h-10 px-3 text-xs"
                  >
                    Tip user
                  </button>
                </>
              )}
            </div>
            <p className="mt-1 flex items-center gap-2 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
              <span className="status-dot" />
              {activeChat ? "Connection established" : "Select target session"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          {wallet.publicKey && (
            <div className="rounded-md border border-[rgba(119,117,117,0.16)] bg-[var(--color-surface-low)] px-3 py-2 text-left lg:text-right">
              <div className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                {getNetworkLabel(
                  (connection as { rpcEndpoint?: string }).rpcEndpoint ?? ""
                )}
              </div>
              <div className="font-label text-sm font-bold text-[var(--color-secondary)]">
                {balance !== null ? (
                  <span>{balance.toFixed(4)} SOL</span>
                ) : (
                  <span className="blink">Loading...</span>
                )}
              </div>
            </div>
          )}
          <div className="relative z-[10000]">
            <WalletMultiButton className="btn-primary flex h-11 min-w-[9rem] items-center justify-center px-4 text-xs" />
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
          <div className="select-none font-display text-8xl font-black uppercase text-[var(--color-text)] md:text-[10rem]">
            PIGEON
          </div>
        </div>

        <div className="relative z-10 flex min-h-full flex-col gap-4">
          {activeChat ? (
            activeChat.messages.length > 0 ? (
              activeChat.messages.map((m, i) => {
                const isMyMessage =
                  m.sender?.toBase58 &&
                  wallet.publicKey?.toBase58 &&
                  m.sender.toBase58() === wallet.publicKey.toBase58();

                const timeStr = formatTimestamp(m.timestamp);

                return (
                  <div
                    className={`flex max-w-2xl flex-col gap-1 ${isMyMessage ? "ml-auto items-end" : "mr-auto items-start"}`}
                    key={i}
                  >
                    <p className="font-label text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      {isMyMessage ? `YOU @ ${timeStr}` : `PEER @ ${timeStr}`}
                    </p>
                    
                    <div
                      className={`rounded-lg border px-4 py-3 shadow-lg ${
                        isMyMessage
                          ? "border-[rgba(189,157,255,0.42)] bg-[rgba(189,157,255,0.14)] text-[var(--color-text)]"
                          : "border-[rgba(119,117,117,0.2)] bg-[rgba(19,19,19,0.92)] text-[var(--color-text-soft)]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyChatState label="No encrypted payloads yet" description="Send the first message to establish this conversation history." />
            )
          ) : (
            <div className="flex min-h-full items-center justify-center">
              <EmptyChatState label="Waiting for target selection" description="Choose a session or start a new encrypted chat from the sidebar." />
            </div>
          )}
        </div>
      </div>

      {activeChat && (
        <div className="shrink-0 border-t border-[rgba(119,117,117,0.16)] bg-[rgba(19,19,19,0.88)] p-4 backdrop-blur-xl">
          <div className="rounded-lg border border-[rgba(189,157,255,0.28)] bg-[var(--color-surface-black)] p-3">
            <label className="sr-only" htmlFor="message-payload">Message payload</label>
            <div className="flex items-end gap-3">
              <div className="hidden pb-3 font-label text-lg text-[var(--color-secondary)] sm:block" aria-hidden="true">
                &gt;
              </div>
              <textarea
                id="message-payload"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                className="min-h-14 flex-1 resize-none border-0 bg-transparent p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                placeholder="ENTER_PAYLOAD"
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={loading}
                aria-busy={loading}
              />
              
              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                <div className="font-label text-[11px] text-[var(--color-text-muted)]">
                  {input.length}/{MAX_MESSAGE_LENGTH}
                </div>
                <button
                  type="button"
                  onClick={onSendMessage}
                  disabled={!input.trim() || loading}
                  className="btn-primary min-h-10 px-4 text-xs disabled:opacity-50"
                >
                  {loading ? "Sending..." : "[ Send ]"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeChat && (
        <TipModal
          isOpen={tipModalOpen}
          onClose={() => setTipModalOpen(false)}
          recipientAddress={activeChat.receiver}
        />
      )}
    </main>
  );
};

function EmptyChatState({ label, description }: { label: string; description: string }) {
  return (
    <div className="glass-panel mx-auto max-w-md rounded-xl p-8 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--color-surface-bright)]">
        <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]" aria-hidden="true">mark_chat_unread</span>
      </div>
      <p className="font-display text-2xl font-bold uppercase text-[var(--color-text)]">{label}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}

export default ChatWindow;
