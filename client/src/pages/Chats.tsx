import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import NewChatModal from "../components/NewChatModal";
import { useEncryption } from "../contexts/EncryptionContext";
import { useChatOperations } from "../hooks/useChatOperations";
import { useMessageOperations } from "../hooks/useMessageOperations";
import { useWebSocketChat } from "../hooks/useWebSocketChat";
import type { Chat } from "../types/chat";

export default function Chats() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();
  const encryption = useEncryption();
  
  const { fetchChat, findExistingChat, discoverUserChats } = useChatOperations();
  const { sendMessage: sendMessageOp, startNewChat: startNewChatOp } = useMessageOperations();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(280);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  // Setup WebSocket subscription for real-time updates
  useWebSocketChat({
    activeChat,
    connection,
    setActiveChat,
    setChats,
  });

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
  }, [wallet.publicKey, connection]);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initialize encryption when wallet connects
  useEffect(() => {
    const initEncryption = async () => {
      if (wallet.connected && encryption.isEncryptionReady && !encryption.isInitialized) {
        try {
          await encryption.initializeEncryption();
          console.log("✅ Encryption initialized");
        } catch (err) {
          console.warn("Encryption initialization skipped or failed:", err);
          // Don't show error - user may have rejected signature
        }
      }
    };
    
    void initEncryption();
  }, [wallet.connected, encryption]);

  // On wallet connect, discover existing chats so they persist across refreshes
  useEffect(() => {
    if (wallet.connected) {
      void discoverUserChats().then(setChats);
    } else {
      setChats([]);
      setActiveChat(null);
    }
  }, [wallet.connected, discoverUserChats]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidth = Math.min(520, Math.max(160, startWidth + delta));
      setSidebarWidth(newWidth);
    };

    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const openChat = async (receiverAddr: string) => {
    setLoading(true);
    try {
      const msgs = await fetchChat(receiverAddr);
      const meFirst = wallet.publicKey
        ? Buffer.compare(wallet.publicKey.toBuffer(), new PublicKey(receiverAddr).toBuffer()) <= 0
        : false;
      const chat: Chat = { receiver: receiverAddr, messages: msgs, isSentByMe: meFirst };
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

    setLoading(true);
    try {
      await sendMessageOp({
        activeChat,
        message: input.trim(),
      });
        
      setInput("");
      // Small delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh the chat to show new message
      await openChat(activeChat.receiver);
    } catch (e: any) {
      console.error("Send message error:", e);
      if (e.message?.includes("MessageTooLong") || e.message?.includes("too long")) {
        setError(e.message);
      } else if (e.message?.includes("blockhash")) {
        setError("Network congestion. Please try again.");
      } else if (e.message?.includes("insufficient")) {
        setError("Insufficient SOL balance for transaction.");
      } else if (e.message?.includes("Encryption")) {
        setError(e.message);
      } else {
        setError(e?.message || "Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async (address: string, message: string) => {
    if (!address) {
      setError("Please enter a wallet address");
      return;
    }

    setLoading(true);
    try {
      // Check if chat already exists
      const existingChat = await findExistingChat(address);
      if (existingChat) {
        setError("Chat already exists! Opening it...");
        setShowModal(false);
        await openChat(address);
        return;
      }

      const { receiverAddress } = await startNewChatOp({
        receiverAddress: address,
        initialMessage: message,
      });
        
      setShowModal(false);
      // Small delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      await openChat(receiverAddress);
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
      <div
        style={{ width: sidebarWidth }}
        className={`flex-shrink-0 ${isResizing ? '' : 'transition-[width] duration-150 ease-out'}`}
      >
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onOpenChat={openChat}
          onNewChat={() => setShowModal(true)}
        />
      </div>

      {/* draggable divider */}
      <div
        onMouseDown={startResizing}
        className="w-3 cursor-col-resize flex items-center justify-center z-10"
        title="Drag to resize sidebar"
      >
        <div className="w-[2px] h-10 bg-white/10 rounded" />
      </div>

      <ChatWindow
        activeChat={activeChat}
        wallet={wallet}
        input={input}
        onInputChange={setInput}
        onSendMessage={sendMessage}
        loading={loading}
        balance={balance}
        connection={connection}
      />

      <NewChatModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onStartChat={startNewChat}
        loading={loading}
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow">
          {error}
        </div>
      )}
    </div>
  );
}
