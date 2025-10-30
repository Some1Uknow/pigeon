import { useEffect, useRef, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { getChatPda } from "../utils/chatUtils";
import { MIN_ENCRYPTED_LENGTH } from "../utils/chatConstants";
import type { Chat } from "../types/chat";
import { useEncryption } from "../contexts/EncryptionContext";
import idl from "../solana_program.json";

interface UseWebSocketChatParams {
  activeChat: Chat | null;
  connection: Connection;
  setActiveChat: Dispatch<SetStateAction<Chat | null>>;
  setChats: Dispatch<SetStateAction<Chat[]>>;
}

/**
 * Custom hook to manage WebSocket subscriptions for real-time chat updates
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
};
