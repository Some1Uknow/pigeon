import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getChatPda } from "../utils/chatUtils";
import { MIN_ENCRYPTED_LENGTH } from "../utils/chatConstants";
import { useProgram } from "./useProgram";
import { useEncryption } from "../contexts/EncryptionContext";
import type { Chat, Message } from "../types/chat";

/**
 * Custom hook for chat-related operations
 */
export const useChatOperations = () => {
  const wallet = useWallet();
  const { getProgram } = useProgram();
  const encryption = useEncryption();

  /**
   * Fetch and decrypt chat messages between wallet and receiver
   */
  const fetchChat = useCallback(async (receiverAddr: string): Promise<Message[]> => {
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
                // Only show warning for truly invalid payloads, not loading states
                console.warn("⚠️ Invalid encrypted data:", {
                  exists: !!rawPayload,
                  length: payloadLength,
                  payloadType: rawPayload?.constructor?.name,
                  sample: Array.from(rawPayload || []).slice(0, 10)
                });
                return {
                  sender: msg.sender,
                  text: "⏳ Loading...",
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
  }, [wallet.publicKey, getProgram, encryption]);

  /**
   * Try to find existing chat in both directions
   */
  const findExistingChat = useCallback(async (receiverAddr: string): Promise<Chat | null> => {
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
  }, [wallet.publicKey, getProgram]);

  /**
   * Discover existing chats on devnet where the connected wallet is a participant
   */
  const discoverUserChats = useCallback(async (): Promise<Chat[]> => {
    if (!wallet.publicKey) return [];
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

      return Array.from(merged.values());
    } catch (err) {
      console.error("Discover chats failed:", err);
      return [];
    }
  }, [wallet.publicKey, getProgram]);

  return {
    fetchChat,
    findExistingChat,
    discoverUserChats,
  };
};
