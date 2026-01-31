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
    <main className="flex-1 flex flex-col bg-[var(--color-term-bg)] font-body">
      {/* Chat Header */}
      <header className="relative z-40 flex items-center justify-between gap-2 px-6 py-4 border-b border-[var(--color-term-dim)] bg-[var(--color-term-bg)] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-[var(--color-term-green)] p-1">
            <img
              src={pigeon}
              alt="Pigeon"
              className="w-full h-full object-contain holographic-pigeon"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-display font-semibold text-[var(--color-term-green)] tracking-widest uppercase">
                {activeChat ? truncateAddress(activeChat.receiver) : "NO_SIGNAL"}
              </h2>
              {activeChat && (
                <>
                  <span className="px-2 py-0.5 bg-[var(--color-term-dim)]/20 text-[var(--color-term-green)] text-xs border border-[var(--color-term-dim)]">
                    [ SECURE ]
                  </span>
                  <button
                    onClick={() => setTipModalOpen(true)}
                    className="px-2 py-0.5 bg-[var(--color-term-dim)]/20 text-[var(--color-term-green)] text-xs border border-[var(--color-term-dim)] hover:bg-[var(--color-term-green)] hover:text-black transition-none"
                  >
                    [ TIP_USER ]
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-[var(--color-term-dim)] flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-[var(--color-term-green)] animate-pulse" />
              CONNECTION_ESTABLISHED
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Balance Display */}
          {wallet.publicKey && (
            <div className="text-right">
              <div className="text-xs text-[var(--color-term-dim)] uppercase tracking-wider">
                {getNetworkLabel(
                  (connection as { rpcEndpoint?: string }).rpcEndpoint ?? ""
                )}
              </div>
              <div className="font-display font-medium text-lg text-[var(--color-term-green)]">
                {balance !== null ? (
                  <span>{balance.toFixed(4)} SOL</span>
                ) : (
                  <span className="animate-pulse">LOADING...</span>
                )}
              </div>
            </div>
          )}
          <div className="relative z-50">
             {/* Note: WalletMultiButton styles are overridden globally in index.css */}
            <WalletMultiButton className="!h-10 !px-4 !rounded-none !bg-[var(--color-term-green)] !text-black !font-display !tracking-widest !uppercase hover:!bg-white" />
          </div>
        </div>
      </header>

      {/* Messages Pane */}
      <div className="flex-1 relative overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[var(--color-term-dim)]">
        {/* Matrix background effect (handled by body scanlines, but we can add a watermark) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 opacity-10">
          <div className="text-[10rem] font-display text-[var(--color-term-green)] opacity-10 rotate-12">PIGEON</div>
        </div>

        <div className="space-y-4 relative z-10">
          {activeChat ? (
            activeChat.messages.map((m, i) => {
              const isMyMessage =
                m.sender?.toBase58 &&
                wallet.publicKey?.toBase58 &&
                m.sender.toBase58() === wallet.publicKey.toBase58();

              const timeStr = formatTimestamp(m.timestamp);

              return (
                <div
                  className={`flex flex-col gap-1 max-w-2xl ${isMyMessage ? "ml-auto items-end" : "mr-auto items-start"}`}
                  key={i}
                >
                  <p className="text-[var(--color-term-dim)] text-[10px] font-display uppercase tracking-wider">
                     {isMyMessage ? `[ YOU ] @ ${timeStr}` : `[ PEER ] @ ${timeStr}`}
                  </p>
                  
                  <div
                    className={`px-4 py-2 border ${
                      isMyMessage 
                        ? "border-[var(--color-term-green)] bg-[var(--color-term-green)]/10 text-[var(--color-term-green)]" 
                        : "border-[var(--color-term-dim)] bg-black text-[var(--color-term-green)] opacity-90"
                    }`}
                  >
                     <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-[var(--color-term-dim)] text-xl font-display uppercase blink">
                  _WAITING_FOR_TARGET_SELECTION
                </p>
             </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      {activeChat && (
        <div className="p-4 border-t border-[var(--color-term-dim)] bg-[var(--color-term-bg)]">
          <div className="relative flex items-end gap-0 border border-[var(--color-term-green)] bg-black">
             <div className="pl-3 py-3 text-[var(--color-term-green)] font-display text-lg select-none">
                &gt;
             </div>
            <textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 text-[var(--color-term-green)] placeholder:text-[var(--color-term-dim)] p-3 font-body resize-none h-14 min-h-[56px]"
              placeholder="ENTER_PAYLOAD..."
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={loading}
            />
            
            <div className="flex items-center pr-2 pb-2 gap-2">
                <div className="text-[10px] text-[var(--color-term-dim)] font-display">
                    {input.length}/{MAX_MESSAGE_LENGTH}
                </div>
                <button
                onClick={onSendMessage}
                disabled={!input.trim() || loading}
                className="h-8 px-4 bg-[var(--color-term-green)] text-black font-display text-sm tracking-widest uppercase hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-none"
                >
                {loading ? "SENDING..." : "[ SEND ]"}
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Tip Modal */}
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

export default ChatWindow;
