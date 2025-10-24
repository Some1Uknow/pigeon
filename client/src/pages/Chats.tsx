import { useEffect, useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import idl from "../solana_program.json";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from "@coral-xyz/anchor";
import type { BN } from "@coral-xyz/anchor";

// Always derive the program id from the IDL to avoid mismatches after redeploys
const PROGRAM_ID = new PublicKey((idl as any).address);
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

// TypeScript types for our program
// type PigeonProgram = Program<{
//   address: string;
//   metadata: { name: string; version: string; spec: string };
//   instructions: any[];
//   accounts: any[];
//   types: any[];
// }>;

interface Message {
  sender: PublicKey;
  text: string;
  timestamp: BN;
}

// interface ChatAccount {
//   participants: [PublicKey, PublicKey];
//   messages: Message[];
// }

interface Chat {
  receiver: string;
  messages: Message[];
  isSentByMe: boolean; // Track if I initiated this chat
}

export default function Chats() {
  const wallet = useWallet();
  const { connection } = useConnection(); // Use connection from wallet context
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!wallet.connected) navigate("/");
  }, [wallet.connected, navigate]);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.publicKey) {
        try {
          const bal = await connection.getBalance(wallet.publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error("Error fetching balance:", err);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [wallet.publicKey]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getProgram = useCallback(() => {
    if (!wallet.publicKey) throw new Error("Wallet not connected");
    const provider = new anchor.AnchorProvider(
      connection,
      wallet as any,
      {
        preflightCommitment: "confirmed",
        commitment: "confirmed",
      }
    );
    return new anchor.Program(idl as any, provider);
  }, [wallet, connection]);

  // Discover existing chats on devnet where the connected wallet is a participant
  const discoverUserChats = useCallback(async () => {
    if (!wallet.publicKey) return [] as Chat[];
    try {
      const program = getProgram();
      const me = wallet.publicKey.toBase58();
      const memcmp0 = {
        memcmp: {
          // 8-byte discriminator, then participants[0] at offset 8
          offset: 8,
          bytes: me,
        },
      } as any;
      const memcmp1 = {
        memcmp: {
          // participants[1] at offset 8 + 32
          offset: 8 + 32,
          bytes: me,
        },
      } as any;

      const [asSender, asReceiver] = await Promise.all([
        (program.account as any).chatAccount.all([memcmp0]),
        (program.account as any).chatAccount.all([memcmp1]),
      ]);

      const merged = new Map<string, Chat>();
      const addAccount = (acc: any) => {
        const participants: PublicKey[] = acc.account.participants;
        const messages: Message[] = acc.account.messages || [];
        const isSentByMe = participants[0].toBase58() === me;
        const other = isSentByMe ? participants[1].toBase58() : participants[0].toBase58();

        const existing = merged.get(other);
        if (!existing || (messages?.length || 0) > (existing.messages?.length || 0)) {
          merged.set(other, {
            receiver: other,
            messages,
            isSentByMe,
          });
        }
      };

      asSender.forEach(addAccount);
      asReceiver.forEach(addAccount);

      const result = Array.from(merged.values());
      setChats(result);
      return result;
    } catch (err) {
      console.error("Discover chats failed:", err);
      return [] as Chat[];
    }
  }, [wallet.publicKey, getProgram]);

  // On wallet connect, discover existing chats so they persist across refreshes
  useEffect(() => {
    if (wallet.connected) {
      void discoverUserChats();
    } else {
      setChats([]);
      setActiveChat(null);
    }
  }, [wallet.connected, discoverUserChats]);

  // Devnet: no localnet-specific helpers or fallbacks

  // Get PDA based on sender/receiver order (NOT SORTED - matches smart contract)
  const getChatPda = (sender: PublicKey, receiver: PublicKey) => {
    const seed = Buffer.from("chat");
    return PublicKey.findProgramAddressSync(
      [seed, sender.toBuffer(), receiver.toBuffer()],
      PROGRAM_ID
    );
  };

  // Fetch chat messages (try both directions)
  const fetchChat = async (receiverAddr: string, isSentByMe: boolean) => {
    try {
      if (!wallet.publicKey) return [];
      const program = getProgram();
      const receiver = new PublicKey(receiverAddr);
      
      // Use correct sender/receiver order based on who initiated
      const [chatPda] = isSentByMe 
        ? getChatPda(wallet.publicKey, receiver)  // I sent first
        : getChatPda(receiver, wallet.publicKey);  // They sent first
      
      const acc = await (program.account as any).chatAccount.fetchNullable(chatPda);
      return acc ? acc.messages : [];
    } catch (err) {
      console.error("Error fetching chat:", err);
      return [];
    }
  };

  // Try to find existing chat in both directions
  const findExistingChat = async (receiverAddr: string): Promise<Chat | null> => {
    try {
      if (!wallet.publicKey) return null;
      const receiver = new PublicKey(receiverAddr);
      const program = getProgram();

      // Try sender->receiver direction
      const [pdaSentByMe] = getChatPda(wallet.publicKey, receiver);
      const accSentByMe = await (program.account as any).chatAccount.fetchNullable(pdaSentByMe);
      
      if (accSentByMe && accSentByMe.messages.length > 0) {
        return {
          receiver: receiverAddr,
          messages: accSentByMe.messages,
          isSentByMe: true,
        };
      }

      // Try receiver->sender direction
      const [pdaSentToMe] = getChatPda(receiver, wallet.publicKey);
      const accSentToMe = await (program.account as any).chatAccount.fetchNullable(pdaSentToMe);
      
      if (accSentToMe && accSentToMe.messages.length > 0) {
        return {
          receiver: receiverAddr,
          messages: accSentToMe.messages,
          isSentByMe: false,
        };
      }

      return null;
    } catch (err) {
      console.error("Error finding chat:", err);
      return null;
    }
  };

  const openChat = async (receiverAddr: string, isSentByMe: boolean) => {
    setLoading(true);
    try {
      const msgs = await fetchChat(receiverAddr, isSentByMe);
      const chat: Chat = { receiver: receiverAddr, messages: msgs, isSentByMe };
      setActiveChat(chat);
      
      // Update chats list
      setChats((prev) => {
        const existing = prev.find((c) => c.receiver === receiverAddr);
        if (existing) {
          return prev.map((c) => c.receiver === receiverAddr ? chat : c);
        }
        return [...prev, chat];
      });
    } catch (err: any) {
      setError(`Failed to open chat: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!activeChat || !input.trim()) return;
    
    if (input.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long! Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    if (activeChat.messages.length >= MAX_MESSAGES_PER_CHAT) {
      setError(`This chat has reached the maximum of ${MAX_MESSAGES_PER_CHAT} messages.`);
      return;
    }

    setLoading(true);
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");
      
      const program = getProgram();
      const receiverPk = new PublicKey(activeChat.receiver);
      
      // Send transaction and let Anchor handle confirmation
      const tx = await program.methods
        .sendDm(input.trim())
        .accountsPartial({
          sender: wallet.publicKey,
          receiver: receiverPk,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      console.log("Transaction signature:", tx);
        
      setInput("");
      // Small delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh the chat to show new message
      await openChat(activeChat.receiver, activeChat.isSentByMe);
    } catch (e: any) {
      console.error("Send message error:", e);
      if (e.message?.includes("MessageTooLong")) {
        setError("Message too long! Maximum 280 characters.");
      } else if (e.message?.includes("blockhash")) {
        setError("Network congestion. Please try again.");
      } else if (e.message?.includes("insufficient")) {
        setError("Insufficient SOL balance for transaction.");
      } else {
        setError(e?.message || "Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async () => {
    const trimmedAddress = newAddress.trim();
    const trimmedMessage = newMessage.trim() || "👋 Hey there!";
    
    if (!trimmedAddress) {
      setError("Please enter a wallet address");
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long! Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    setLoading(true);
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");
      
      // Validate address
      let receiver: PublicKey;
      try {
        receiver = new PublicKey(trimmedAddress);
      } catch {
        setError("Invalid Solana wallet address");
        return;
      }

      // Check if chatting with self
      if (receiver.equals(wallet.publicKey)) {
        setError("You cannot chat with yourself!");
        return;
      }

      // Check if chat already exists
      const existingChat = await findExistingChat(receiver.toBase58());
      if (existingChat) {
        setError("Chat already exists! Opening it...");
        setShowModal(false);
        setNewAddress("");
        setNewMessage("");
        await openChat(receiver.toBase58(), existingChat.isSentByMe);
        return;
      }

      const program = getProgram();
      
      // Send transaction and let Anchor handle confirmation
      const tx = await program.methods
        .sendDm(trimmedMessage)
        .accountsPartial({
          sender: wallet.publicKey,
          receiver,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      console.log("Transaction signature:", tx);
        
      setShowModal(false);
      setNewAddress("");
      setNewMessage("");
      // Small delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      await openChat(receiver.toBase58(), true); // isSentByMe = true
    } catch (e: any) {
      console.error("Start chat error:", e);
      if (e.message?.includes("blockhash")) {
        setError("Network congestion. Please try again.");
      } else if (e.message?.includes("insufficient")) {
        setError("Insufficient SOL balance for transaction.");
      } else {
        setError(e?.message || "Failed to start chat. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-[#050505] via-[#0a0a0a] to-[#141414] text-gray-100">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/10 bg-[#101010]/80 backdrop-blur-lg p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Pigeon 🕊</h2>
          <button
            onClick={() => setShowModal(true)}
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
                onClick={() => openChat(chat.receiver, chat.isSentByMe)}
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

      {/* Chat window */}
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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message... (Press Enter to send)"
                className="flex-1 bg-[#1a1a1a]/70 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500/40"
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
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

      {/* New Chat Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Start a new chat</h2>
            <input
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value.trim())}
              placeholder="Receiver wallet address"
              className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500/40"
            />
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Initial message..."
              className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-xl px-4 py-2 mt-3 h-24 outline-none focus:border-blue-500/40"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={startNewChat}
                disabled={!newAddress || loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white disabled:opacity-50 min-w-20"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-pulse">⏳</span> Starting
                  </span>
                ) : (
                  "Start"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow">
          {error}
        </div>
      )}
    </div>
  );
}
