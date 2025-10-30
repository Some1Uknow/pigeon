import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import idl from "../solana_program.json";
import * as anchor from "@coral-xyz/anchor";
import type { BN } from "@coral-xyz/anchor";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { useEncryption } from "../contexts/EncryptionContext";

// Always derive the program id from the IDL to avoid mismatches after redeploys
const PROGRAM_ID = new PublicKey((idl as any).address);
const MAX_MESSAGE_LENGTH = 280;
const MAX_MESSAGES_PER_CHAT = 10;
const MIN_ENCRYPTED_LENGTH = 12 + 16; // Nonce (12) + Poly1305 tag (16)

interface Message {
  sender: PublicKey;
  text: string;
  timestamp: BN;
}


interface Chat {
  receiver: string;
  messages: Message[];
  isSentByMe: boolean; // true if my pubkey is lexicographically first
}

export default function Chats() {
  const wallet = useWallet();
  const { connection } = useConnection(); // Use connection from wallet context
  const navigate = useNavigate();
  const encryption = useEncryption();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(280);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  
  // WebSocket subscription ID refs
  const accountSubscriptionRef = useRef<number | null>(null);

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

  const getProgram = useCallback(() => {
    if (!wallet.publicKey) throw new Error("Wallet not connected");
    const provider = new anchor.AnchorProvider(
      connection,
      wallet as any,
      {
        preflightCommitment: "processed",
        commitment: "processed",
        skipPreflight: false,
      }
    );
    return new anchor.Program(idl as any, provider);
  }, [wallet, connection]);

  const orderParticipants = (a: PublicKey, b: PublicKey): [PublicKey, PublicKey] => {
    return Buffer.compare(a.toBuffer(), b.toBuffer()) <= 0 ? [a, b] : [b, a];
  };

  const getChatPda = (a: PublicKey, b: PublicKey) => {
    const seed = Buffer.from("chat");
    const [first, second] = orderParticipants(a, b);
    return PublicKey.findProgramAddressSync(
      [seed, first.toBuffer(), second.toBuffer()],
      PROGRAM_ID
    );
  };

  const coder = useMemo(() => new anchor.BorshAccountsCoder(idl as any), []);
  const activeChatReceiver = activeChat?.receiver;
  const walletKeyBase58 = wallet.publicKey?.toBase58();

  // Subscribe to account changes for real-time updates using WebSockets
  useEffect(() => {
    if (!wallet.publicKey || !activeChatReceiver) {
      if (accountSubscriptionRef.current !== null) {
        connection.removeAccountChangeListener(accountSubscriptionRef.current);
        accountSubscriptionRef.current = null;
      }
      return;
    }

    let disposed = false;

    const setupWebSocket = async () => {
      try {
        const receiverPk = new PublicKey(activeChatReceiver);
        const [chatPda] = getChatPda(wallet.publicKey!, receiverPk);

        console.log("🔌 Setting up WebSocket subscription for chat:", chatPda.toBase58());

        const subscriptionId = connection.onAccountChange(
          chatPda,
          async (accountInfo) => {
            if (disposed) return;
            console.log("📨 Real-time update received!");

            try {
              if (!accountInfo || accountInfo.data?.length === 0) {
                console.warn("⚠️ Skipping empty account update payload");
                return;
              }

              const ownerMatchesProgram =
                accountInfo.owner && accountInfo.owner.equals(PROGRAM_ID);
              if (!ownerMatchesProgram) {
                console.warn(
                  "⚠️ Skipping update for account owned by",
                  accountInfo.owner?.toBase58?.()
                );
                return;
              }

              if (accountInfo.data.length < 8) {
                console.warn(
                  "⚠️ Account data too small to decode, length:",
                  accountInfo.data.length
                );
                return;
              }

              const decoded = coder.decode("ChatAccount", accountInfo.data);

              if (!decoded || !decoded.messages) return;

              const messages = await Promise.all(
                decoded.messages.map(async (msg: any) => {
                  try {
                    const senderAddr = msg.sender.toBase58();
                    const isMyMessage = senderAddr === walletKeyBase58;
                    const otherPartyAddr = isMyMessage
                      ? activeChatReceiver
                      : senderAddr;

                    if (encryption.isInitialized) {
                      const rawPayload = msg.encryptedPayload as
                        | Uint8Array
                        | number[]
                        | undefined;
                      const payloadLength = Number(msg.payloadLen ?? 0);

                      if (!rawPayload || payloadLength < 28) {
                        console.warn(
                          "⚠️ Invalid encrypted data in subscription payload",
                          {
                            exists: !!rawPayload,
                            length: payloadLength,
                            payloadType: rawPayload?.constructor?.name,
                            sample: Array.from(rawPayload || []).slice(0, 10),
                          }
                        );
                        return {
                          sender: msg.sender,
                          text: "⚠️ [Message from incompatible version]",
                          timestamp: msg.timestamp,
                        };
                      }

                      const payloadBuffer =
                        rawPayload instanceof Uint8Array
                          ? rawPayload
                          : new Uint8Array(rawPayload);
                      const usableLength = Math.min(
                        payloadBuffer.length,
                        payloadLength
                      );
                      const encryptedData = payloadBuffer.slice(0, usableLength);
                      const plaintext = await encryption.decryptMessage(
                        encryptedData,
                        otherPartyAddr
                      );

                      return {
                        sender: msg.sender,
                        text: plaintext,
                        timestamp: msg.timestamp,
                      };
                    }

                    return {
                      sender: msg.sender,
                      text: "🔒 [Encrypted - Sign message to decrypt]",
                      timestamp: msg.timestamp,
                    };
                  } catch (decryptErr) {
                    console.error("Failed to decrypt message:", decryptErr);
                    return {
                      sender: msg.sender,
                      text: "⚠️ [Decryption failed]",
                      timestamp: msg.timestamp,
                    };
                  }
                })
              );

              setActiveChat((prev) => {
                if (!prev || prev.receiver !== activeChatReceiver) {
                  return prev;
                }
                return {
                  ...prev,
                  messages,
                };
              });

              setChats((prev) => {
                let found = false;
                const next = prev.map((chat) => {
                  if (chat.receiver === activeChatReceiver) {
                    found = true;
                    return {
                      ...chat,
                      messages,
                    };
                  }
                  return chat;
                });

                if (!found) {
                  next.push({
                    receiver: activeChatReceiver,
                    messages,
                    isSentByMe:
                      walletKeyBase58 !== undefined &&
                      walletKeyBase58 === activeChatReceiver,
                  });
                }

                return next;
              });
            } catch (err) {
              console.error("Error processing WebSocket update:", err);
            }
          },
          "confirmed"
        );

        accountSubscriptionRef.current = subscriptionId;
        console.log("✅ WebSocket subscription active (ID:", subscriptionId, ")");
      } catch (err) {
        console.error("Error setting up WebSocket:", err);
      }
    };

    void setupWebSocket();

    return () => {
      disposed = true;
      if (accountSubscriptionRef.current !== null) {
        connection.removeAccountChangeListener(accountSubscriptionRef.current);
        accountSubscriptionRef.current = null;
        console.log("🔌 WebSocket subscription cleaned up");
      }
    };
  }, [
    wallet.publicKey,
    walletKeyBase58,
    activeChatReceiver,
    connection,
    encryption,
    coder,
  ]);

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
  const meIsFirst = participants[0].toBase58() === me;
  const other = meIsFirst ? participants[1].toBase58() : participants[0].toBase58();

        const existing = merged.get(other);
        if (!existing || (messages?.length || 0) > (existing.messages?.length || 0)) {
          merged.set(other, {
            receiver: other,
            messages,
            isSentByMe: meIsFirst,
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

  // Devnet: no localnet-specific helpers or fallbacks

  // Fetch chat messages and decrypt them
  const fetchChat = async (receiverAddr: string) => {
    try {
      if (!wallet.publicKey) return [];
      const program = getProgram();
      const receiver = new PublicKey(receiverAddr);
      
      const [chatPda] = getChatPda(wallet.publicKey, receiver);
      
      const acc = await (program.account as any).chatAccount.fetchNullable(chatPda);
      if (!acc || !acc.messages) {
        return [];
      }
      
      // Decrypt messages
      const messages = await Promise.all(
        acc.messages.map(async (msg: any) => {
          try {
            // Determine the sender address for decryption
            const senderAddr = msg.sender.toBase58();
            const isMyMessage = senderAddr === wallet.publicKey?.toBase58();
            
            // For decryption, we need the OTHER party's address
            const otherPartyAddr = isMyMessage ? receiverAddr : senderAddr;
            
            // Decrypt the message
            if (encryption.isInitialized) {
              const rawPayload = msg.encryptedPayload as
                | Uint8Array
                | number[]
                | undefined;
              const payloadLength = Number(msg.payloadLen ?? 0);

              if (!rawPayload || payloadLength < MIN_ENCRYPTED_LENGTH) {
                // Minimum: 12 (nonce) + 16 (auth tag) = 28 bytes
                console.warn("⚠️ Invalid encrypted data:", {
                  exists: !!rawPayload,
                  length: payloadLength,
                  payloadType: rawPayload?.constructor?.name,
                  sample: Array.from(rawPayload || []).slice(0, 10)
                });
                return {
                  sender: msg.sender,
                  text: "⚠️ [Message from incompatible version - please start a new chat]",
                  timestamp: msg.timestamp,
                };
              }
              
              const payloadBuffer = rawPayload instanceof Uint8Array
                ? rawPayload
                : new Uint8Array(rawPayload);
              const usableLength = Math.min(payloadBuffer.length, payloadLength);
              const encryptedData = payloadBuffer.slice(0, usableLength);
              const plaintext = await encryption.decryptMessage(encryptedData, otherPartyAddr);
              
              return {
                sender: msg.sender,
                text: plaintext,
                timestamp: msg.timestamp,
              };
            } else {
              // Encryption not initialized - show encrypted indicator
              return {
                sender: msg.sender,
                text: "🔒 [Encrypted - Sign message to decrypt]",
                timestamp: msg.timestamp,
              };
            }
          } catch (decryptErr) {
            console.error("Failed to decrypt message:", decryptErr);
            return {
              sender: msg.sender,
              text: "⚠️ [Decryption failed]",
              timestamp: msg.timestamp,
            };
          }
        })
      );
      
      return messages;
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
      const [chatPda] = getChatPda(wallet.publicKey, receiver);
      const account = await (program.account as any).chatAccount.fetchNullable(chatPda);

      if (account && account.messages.length > 0) {
        const meFirst = Buffer.compare(wallet.publicKey.toBuffer(), receiver.toBuffer()) <= 0;
        return {
          receiver: receiverAddr,
          messages: account.messages,
          isSentByMe: meFirst,
        };
      }

      return null;
    } catch (err) {
      console.error("Error finding chat:", err);
      return null;
    }
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
    
    if (input.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long! Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    if (activeChat.messages.length >= MAX_MESSAGES_PER_CHAT) {
      setError(`This chat has reached the maximum of ${MAX_MESSAGES_PER_CHAT} messages.`);
      return;
    }

    // Check if encryption is initialized
    if (!encryption.isInitialized) {
      try {
        await encryption.initializeEncryption();
      } catch (err) {
        setError("Encryption required. Please sign the message to enable secure messaging.");
        return;
      }
    }

    setLoading(true);
    try {
      if (!wallet.publicKey) throw new Error("Wallet not connected");
      
      const program = getProgram();
      const receiverPk = new PublicKey(activeChat.receiver);
      
      // Encrypt the message
      const encryptedMessage = await encryption.encryptMessage(input.trim(), activeChat.receiver);
      
      // Convert to Buffer for Anchor (Vec<u8> in Rust)
      const encryptedBuffer = Buffer.from(encryptedMessage);

      const [participantA, participantB] = orderParticipants(wallet.publicKey, receiverPk);
      
      // Build instruction first
      const ix = await program.methods
        .sendDm(encryptedBuffer)
        .accountsPartial({
          authority: wallet.publicKey,
          participantA,
          participantB,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      
      // Retry loop for blockhash expiration
      let attempts = 0;
      const maxAttempts = 3;
      let signature: string | undefined;
      
      while (attempts < maxAttempts && !signature) {
        try {
          attempts++;
          
          // Get fresh blockhash RIGHT before wallet signature
          const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
          
          // Create transaction with fresh blockhash
          const tx = new anchor.web3.Transaction({
            feePayer: wallet.publicKey,
            blockhash,
            lastValidBlockHeight,
          }).add(ix);
          
          // Sign (this is where user approves in wallet)
          const signedTx = await wallet.signTransaction!(tx);
          
          // Send immediately after signing
          signature = await connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: true,
            maxRetries: 2,
          });
          
          // Confirm transaction
          await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          }, 'processed');
          
        } catch (txErr: any) {
          if (txErr.message?.includes('blockhash') && attempts < maxAttempts) {
            console.log(`Blockhash expired, retrying (${attempts}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          throw txErr;
        }
      }
      
      if (!signature) {
        throw new Error("Failed to send transaction after retries");
      }

      console.log("Transaction signature:", signature);
      console.log("🔒 Message encrypted and sent");
        
      setInput("");
      // Small delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Refresh the chat to show new message
  await openChat(activeChat.receiver);
    } catch (e: any) {
      console.error("Send message error:", e);
      if (e.message?.includes("MessageTooLong")) {
        setError("Message too long! Maximum 280 characters.");
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
  await openChat(receiver.toBase58());
        return;
      }

      // Check if encryption is initialized
      if (!encryption.isInitialized) {
        try {
          await encryption.initializeEncryption();
        } catch (err) {
          setError("Encryption required. Please sign the message to enable secure messaging.");
          return;
        }
      }

      const program = getProgram();
      
      // Encrypt the first message
      const encryptedMessage = await encryption.encryptMessage(trimmedMessage, receiver.toBase58());
      const encryptedBuffer = Buffer.from(encryptedMessage);
      const [participantA, participantB] = orderParticipants(wallet.publicKey, receiver);
      
      // Build instruction first
      const ix = await program.methods
        .sendDm(encryptedBuffer)
        .accountsPartial({
          authority: wallet.publicKey,
          participantA,
          participantB,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
      
      // Retry loop for blockhash expiration
      let attempts = 0;
      const maxAttempts = 3;
      let signature: string | undefined;
      
      while (attempts < maxAttempts && !signature) {
        try {
          attempts++;
          
          // Get fresh blockhash RIGHT before wallet signature
          const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
          
          // Create transaction with fresh blockhash
          const tx = new anchor.web3.Transaction({
            feePayer: wallet.publicKey,
            blockhash,
            lastValidBlockHeight,
          }).add(ix);
          
          // Sign (this is where user approves in wallet)
          const signedTx = await wallet.signTransaction!(tx);
          
          // Send immediately after signing
          signature = await connection.sendRawTransaction(signedTx.serialize(), {
            skipPreflight: true,
            maxRetries: 2,
          });
          
          // Confirm transaction
          await connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight,
          }, 'processed');
          
        } catch (txErr: any) {
          if (txErr.message?.includes('blockhash') && attempts < maxAttempts) {
            console.log(`Blockhash expired, retrying (${attempts}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          throw txErr;
        }
      }
      
      if (!signature) {
        throw new Error("Failed to send transaction after retries");
      }
        
      console.log("Transaction signature:", signature);
      console.log("🔒 First message encrypted and sent");
        
      setShowModal(false);
      setNewAddress("");
      setNewMessage("");
      // Small delay to ensure transaction is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
  await openChat(receiver.toBase58());
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
