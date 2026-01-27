import { useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { orderParticipants } from "../utils/chatUtils";
import { MAX_MESSAGE_LENGTH, MAX_MESSAGES_PER_CHAT } from "../utils/chatConstants";
import { useProgram } from "./useProgram";
import { useEncryption } from "../contexts/EncryptionContext";
import type { Chat } from "../types/chat";

interface SendMessageParams {
  activeChat: Chat;
  message: string;
}

interface StartChatParams {
  receiverAddress: string;
  initialMessage: string;
}

/**
 * Custom hook for sending messages and starting chats
 */
export const useMessageOperations = () => {
  const wallet = useWallet();
  const { getProgram, connection } = useProgram();
  const encryption = useEncryption();

  /**
   * Send a message to an existing chat
   */
  const sendMessage = useCallback(async ({ activeChat, message }: SendMessageParams) => {
    if (!activeChat || !message.trim()) {
      throw new Error("Invalid message or chat");
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message too long! Maximum ${MAX_MESSAGE_LENGTH} characters.`);
    }

    if (activeChat.messages.length >= MAX_MESSAGES_PER_CHAT) {
      throw new Error(`This chat has reached the maximum of ${MAX_MESSAGES_PER_CHAT} messages.`);
    }

    // Check if encryption is initialized
    if (!encryption.isInitialized) {
      await encryption.initializeEncryption();
    }

    if (!wallet.publicKey) throw new Error("Wallet not connected");

    const program = getProgram();
    const receiverPk = new PublicKey(activeChat.receiver);

    // Encrypt the message
    const encryptedMessage = await encryption.encryptMessage(message.trim(), activeChat.receiver);
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

    // Retry loop for transaction failures
    let attempts = 0;
    const maxAttempts = 3;
    let signature: string | undefined;

    while (attempts < maxAttempts && !signature) {
      try {
        attempts++;

        // Create transaction - let sendTransaction handle the blockhash
        const tx = new anchor.web3.Transaction().add(ix);

        // Use wallet.sendTransaction - this handles:
        // 1. Fetching blockhash using the connection's RPC
        // 2. Setting feePayer
        // 3. Signing with the wallet
        // 4. Sending to the network
        // This avoids the RPC mismatch issue where wallet validates against different RPC
        signature = await wallet.sendTransaction(tx, connection, {
          skipPreflight: true,
          maxRetries: 3,
        });

        // Wait for confirmation
        const latestBlockhash = await connection.getLatestBlockhash('confirmed');
        await connection.confirmTransaction({
          signature,
          ...latestBlockhash,
        }, 'confirmed');

      } catch (txErr: any) {
        const errMsg = txErr.message?.toLowerCase() || '';
        const isRetryable = errMsg.includes('blockhash') || errMsg.includes('block height') || errMsg.includes('timeout');

        if (isRetryable && attempts < maxAttempts) {
          console.log(`Transaction failed, retrying (${attempts}/${maxAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
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

    return signature;
  }, [wallet, getProgram, connection, encryption]);

  /**
   * Start a new chat with initial message
   */
  const startNewChat = useCallback(async ({ receiverAddress, initialMessage }: StartChatParams) => {
    const trimmedMessage = initialMessage.trim() || "👋 Hey there!";

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message too long! Maximum ${MAX_MESSAGE_LENGTH} characters.`);
    }

    if (!wallet.publicKey) throw new Error("Wallet not connected");

    // Validate address
    let receiver: PublicKey;
    try {
      receiver = new PublicKey(receiverAddress);
    } catch {
      throw new Error("Invalid Solana wallet address");
    }

    // Check if chatting with self
    if (receiver.equals(wallet.publicKey)) {
      throw new Error("You cannot chat with yourself!");
    }

    // Check if encryption is initialized
    if (!encryption.isInitialized) {
      await encryption.initializeEncryption();
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

    // Retry loop for transaction failures
    let attempts = 0;
    const maxAttempts = 3;
    let signature: string | undefined;

    while (attempts < maxAttempts && !signature) {
      try {
        attempts++;

        // Create transaction - let sendTransaction handle the blockhash
        const tx = new anchor.web3.Transaction().add(ix);

        // Use wallet.sendTransaction - this handles:
        // 1. Fetching blockhash using the connection's RPC
        // 2. Setting feePayer
        // 3. Signing with the wallet
        // 4. Sending to the network
        signature = await wallet.sendTransaction(tx, connection, {
          skipPreflight: true,
          maxRetries: 3,
        });

        // Wait for confirmation
        const latestBlockhash = await connection.getLatestBlockhash('confirmed');
        await connection.confirmTransaction({
          signature,
          ...latestBlockhash,
        }, 'confirmed');

      } catch (txErr: any) {
        const errMsg = txErr.message?.toLowerCase() || '';
        const isRetryable = errMsg.includes('blockhash') || errMsg.includes('block height') || errMsg.includes('timeout');

        if (isRetryable && attempts < maxAttempts) {
          console.log(`Transaction failed, retrying (${attempts}/${maxAttempts})...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
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

    return { signature, receiverAddress: receiver.toBase58() };
  }, [wallet, getProgram, connection, encryption]);

  return {
    sendMessage,
    startNewChat,
  };
};
