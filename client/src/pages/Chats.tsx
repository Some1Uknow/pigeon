import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import idl from "../solana_program.json";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const PROGRAM_ID = new PublicKey("B1kqTcmKKi44qPBjpnCM1yJyvunrfkwRvQLuEKdKLAbj");
const connection = new Connection("https://api.devnet.solana.com");

interface Message {
  sender: string;
  text: string;
  timestamp: number;
}

interface Chat {
  receiver: string;
  messages: Message[];
}

export default function Chats() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet.connected) navigate("/");
  }, [wallet.connected]);

  const getProgram = async () => {
    const anchor = await import("@project-serum/anchor");
    const { AnchorProvider, Program } = anchor as any;
    return new Program(idl as any, PROGRAM_ID, new AnchorProvider(connection, wallet as any, {}));
  };

  const sortPubkeys = (a: PublicKey, b: PublicKey): [PublicKey, PublicKey] =>
    a.toBase58().localeCompare(b.toBase58()) <= 0 ? [a, b] : [b, a];

  const getChatPda = (sender: PublicKey, receiver: PublicKey) => {
    const [a, b] = sortPubkeys(sender, receiver);
    const seed = new TextEncoder().encode("chat");
    return PublicKey.findProgramAddressSync([seed, a.toBuffer(), b.toBuffer()], PROGRAM_ID);
  };

  const fetchChat = async (receiverAddr: string) => {
    try {
      const program = await getProgram();
      const receiver = new PublicKey(receiverAddr);
      const [chatPda] = getChatPda(wallet.publicKey!, receiver);
      const acc = await (program as any).account.chatAccount.fetchNullable(chatPda);
      return acc ? acc.messages : [];
    } catch {
      return [];
    }
  };

  const openChat = async (receiverAddr: string) => {
    const msgs = await fetchChat(receiverAddr);
    const chat: Chat = { receiver: receiverAddr, messages: msgs };
    setActiveChat(chat);
    if (!chats.find((c) => c.receiver === receiverAddr)) {
      setChats((prev) => [...prev, chat]);
    }
  };

  const sendMessage = async () => {
    if (!activeChat) return;
    try {
      const program = await getProgram();
      const receiverPk = new PublicKey(activeChat.receiver);
      const [chatPda] = getChatPda(wallet.publicKey!, receiverPk);
      await (program as any).methods
        .sendDm(input)
        .accounts({
          chatAccount: chatPda,
          sender: wallet.publicKey,
          receiver: receiverPk,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setInput("");
      openChat(activeChat.receiver);
    } catch (e: any) {
      setError(e?.message || String(e));
    }
  };

  const startNewChat = async () => {
    try {
      const receiver = new PublicKey(newAddress.trim());
      const program = await getProgram();
      const [chatPda] = getChatPda(wallet.publicKey!, receiver);
      await (program as any).methods
        .sendDm(newMessage || "👋 Hey there!")
        .accounts({
          chatAccount: chatPda,
          sender: wallet.publicKey,
          receiver,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setShowModal(false);
      setNewAddress("");
      setNewMessage("");
      openChat(receiver.toBase58());
    } catch (e: any) {
      setError("Invalid address or transaction failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#141414] text-gray-100">
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
                onClick={() => openChat(chat.receiver)}
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
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Chat window */}
      <main className="flex-1 flex flex-col bg-[#0c0c0c]/60 backdrop-blur-md">
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
          <h1 className="font-semibold text-lg truncate">
            {activeChat ? activeChat.receiver : "Select or start a chat"}
          </h1>
          <WalletMultiButton />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeChat &&
            activeChat.messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.sender === wallet.publicKey?.toBase58() ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg px-4 py-2 rounded-2xl ${
                    m.sender === wallet.publicKey?.toBase58()
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 text-gray-100"
                  }`}
                >
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          {!activeChat && (
            <p className="text-gray-500 text-center mt-10 text-sm">
              Choose a chat or start a new one
            </p>
          )}
        </div>

        {activeChat && (
          <div className="border-t border-white/10 p-4 flex items-center gap-2 bg-[#0f0f0f]/70">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#1a1a1a]/70 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-blue-500/40"
            />
            <button
              onClick={sendMessage}
              disabled={!input}
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl text-white disabled:opacity-50"
            >
              Send
            </button>
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
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={startNewChat}
                disabled={!newAddress}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white disabled:opacity-50"
              >
                Start
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
