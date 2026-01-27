import { useEffect, useRef, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { getChatPda } from "../utils/chatUtils";
import { MIN_ENCRYPTED_LENGTH } from "../utils/chatConstants";
import type { Chat, Message } from "../types/chat";
import { useEncryption } from "../contexts/EncryptionContext";
import idl from "../solana_program.json";

// Polling interval in milliseconds
const POLLING_INTERVAL_MS = 3000;

interface UseWebSocketChatParams {
  activeChat: Chat | null;
  connection: Connection;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;
}

/**
 * Custom hook to manage WebSocket subscriptions + polling fallback for real-time chat updates
 */
export const useWebSocketChat = ({
  activeChat,
  connection,
  setActiveChat,
  setChats,
}: UseWebSocketChatParams) => {
  const wallet = useWallet();
  const encryption = useEncryption();
  const accountSubscriptionRef = useRef<number | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageCountRef = useRef<number>(0);
  const coder = useMemo(() => new anchor.BorshAccountsCoder(idl as any), []);

  const activeChatReceiver = activeChat?.receiver;
  const walletKeyBase58 = wallet.publicKey?.toBase58();

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
        const [chatPda] = getChatPda(wallet.publicKey!, new anchor.web3.PublicKey(activeChatReceiver));

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
                accountInfo.owner && accountInfo.owner.equals(new anchor.web3.PublicKey((idl as any).address));
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

                      if (!rawPayload || payloadLength < MIN_ENCRYPTED_LENGTH) {
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
    setActiveChat,
    setChats,
  ]);

  // Polling fallback - runs every 3 seconds to catch any missed WebSocket updates
  useEffect(() => {
    if (!wallet.publicKey || !activeChatReceiver || !encryption.isInitialized) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    const pollMessages = async () => {
      try {
        const program = new anchor.Program(idl as any, { connection });
        const chatPda = getChatPda(wallet.publicKey!, new PublicKey(activeChatReceiver))[0];

        const acc = await (program.account as any).chatAccount.fetchNullable(chatPda);
        if (!acc || !acc.messages) return;

        // Only update if message count changed
        if (acc.messages.length === lastMessageCountRef.current) return;
        lastMessageCountRef.current = acc.messages.length;

        console.log("📬 Polling detected new messages");

        const messages: Message[] = await Promise.all(
          acc.messages.map(async (msg: any) => {
            try {
              const senderAddr = msg.sender.toBase58();
              const isMyMessage = senderAddr === walletKeyBase58;
              const otherPartyAddr = isMyMessage ? activeChatReceiver : senderAddr;

              const rawPayload = msg.encryptedPayload as Uint8Array | number[] | undefined;
              const payloadLength = Number(msg.payloadLen ?? 0);

              if (!rawPayload || payloadLength < MIN_ENCRYPTED_LENGTH) {
                return {
                  sender: msg.sender,
                  text: "⚠️ [Message from incompatible version]",
                  timestamp: msg.timestamp,
                };
              }

              const payloadBuffer = rawPayload instanceof Uint8Array ? rawPayload : new Uint8Array(rawPayload);
              const usableLength = Math.min(payloadBuffer.length, payloadLength);
              const encryptedData = payloadBuffer.slice(0, usableLength);
              const plaintext = await encryption.decryptMessage(encryptedData, otherPartyAddr);

              return {
                sender: msg.sender,
                text: plaintext,
                timestamp: msg.timestamp,
              };
            } catch (decryptErr) {
              console.error("Polling decrypt error:", decryptErr);
              return {
                sender: msg.sender,
                text: "⚠️ [Decryption failed]",
                timestamp: msg.timestamp,
              };
            }
          })
        );

        setActiveChat((prev) => {
          if (!prev || prev.receiver !== activeChatReceiver) return prev;
          return { ...prev, messages };
        });

        setChats((prev) => {
          return prev.map((chat) =>
            chat.receiver === activeChatReceiver ? { ...chat, messages } : chat
          );
        });
      } catch (err) {
        // Silent fail - WebSocket is the primary, polling is backup
        console.debug("Polling fetch error (non-critical):", err);
      }
    };

    // Initial poll
    pollMessages();

    // Set up interval
    pollingIntervalRef.current = setInterval(pollMessages, POLLING_INTERVAL_MS);
    console.log("⏱️ Polling fallback active (every 3s)");

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log("⏱️ Polling fallback cleaned up");
      }
    };
  }, [
    wallet.publicKey,
    walletKeyBase58,
    activeChatReceiver,
    connection,
    encryption,
    setActiveChat,
    setChats,
  ]);
};
