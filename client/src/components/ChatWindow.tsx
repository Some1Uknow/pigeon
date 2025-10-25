import React from 'react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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

interface ChatWindowProps {
  activeChat: Chat | null;
  wallet: any;
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  loading: boolean;
  balance: number | null;
  connection: any;
}

const MAX_MESSAGE_LENGTH = 280;
const MAX_MESSAGES_PER_CHAT = 10;

const getNetworkLabel = (endpoint: string) => {
  try {
    const url = new URL(endpoint);
    if (url.hostname === "127.0.0.1" || url.hostname === "localhost") return "Localnet";
    if (url.hostname.includes("devnet")) return "Devnet";
    if (url.hostname.includes("mainnet")) return "Mainnet";
    return url.hostname;
  } catch {
    return endpoint;
  }
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  activeChat,
  wallet,
  input,
  onInputChange,
  onSendMessage,
  loading,
  balance,
  connection
}) => {
  return (
    <main className="flex-1 flex flex-col bg-[#0c0c0c]/60 backdrop-blur-md">
      <div className="border-b border-white/10 p-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="font-semibold text-lg truncate">
            {activeChat ? activeChat.receiver : "Select or start a chat"}
          </h1>
          {activeChat && (
            <p className="text-xs text-gray-500">
              {activeChat.messages.length}/{MAX_MESSAGES_PER_CHAT} messages used
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Balance Display */}
          {wallet.publicKey && (
            <div className="text-right">
              <div className="text-xs text-gray-400">{getNetworkLabel((connection as any).rpcEndpoint || "")}</div>
              <div className="font-semibold text-sm">
                {balance !== null ? (
                  <span className="text-blue-400">
                    ◎ {balance.toFixed(4)}
                  </span>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
            </div>
          )}
          <WalletMultiButton />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {activeChat &&
          activeChat.messages.map((m, i) => {
            const isMyMessage = m.sender.toBase58() === wallet.publicKey?.toBase58();
            return (
              <div
                key={i}
                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-lg px-4 py-2 rounded-2xl ${
                    isMyMessage
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap wrap-break-word">{m.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(m.timestamp.toNumber() * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        {!activeChat && (
          <p className="text-gray-500 text-center mt-10 text-sm">
            Choose a chat or start a new one
          </p>
        )}
      </div>

      {activeChat && (
        <div className="border-t border-white/10 p-4 bg-[#0f0f0f]/70">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder="Type your message... (Press Enter to send)"
              className="flex-1 bg-[#1a1a1a]/70 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500/40"
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={loading}
            />
            <button
              onClick={onSendMessage}
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-20"
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="animate-pulse">⏳</span> Sending
                </span>
              ) : (
                "Send"
              )}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {input.length}/{MAX_MESSAGE_LENGTH} characters
          </div>
        </div>
      )}
    </main>
  );
};

export default ChatWindow;
