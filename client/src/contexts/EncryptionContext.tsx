import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { x25519 } from "@noble/curves/ed25519.js";
import {
  deriveSharedSecret,
  encryptMessage as encryptMessageUtil,
  decryptMessage as decryptMessageUtil,
  generateNonce,
  SecurityUtils,
} from "../utils/encryption";
import { useUserRegistry } from "../hooks/useUserRegistry";

/**
 * Encryption Context for managing E2EE state across the app
 * 
 * Architecture: Signature-Based Key Derivation
 * - Uses wallet.signMessage() to derive deterministic encryption keypair
 * - Each wallet generates a consistent encryption key from signature (and wallet pubkey as salt)
 * - Keys cached in-memory per session
 * - User signs once per session to unlock encryption
 */

interface EncryptionContextType {
  // Encrypt a message for a specific recipient
  encryptMessage: (message: string, recipientAddress: string) => Promise<Uint8Array>;
  
  // Decrypt a message from a specific sender
  decryptMessage: (encryptedData: Uint8Array, senderAddress: string) => Promise<string>;
  
  // Initialize encryption (prompts for signature)
  initializeEncryption: () => Promise<void>;
  
  // Clear all encryption state (called on disconnect)
  clearEncryptionState: () => void;
  
  // Check if encryption is available
  isEncryptionReady: boolean;
  
  // Check if encryption is initialized (user has signed)
  isInitialized: boolean;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

const DERIVATION_MESSAGE = "Sign this message to enable encrypted messaging on Pigeon. This signature is used only to derive your encryption keys and never leaves your device.";

export function EncryptionProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const { registerUser, getUserEncryptionKey } = useUserRegistry();
  const [encryptionKeypair, setEncryptionKeypair] = useState<Uint8Array | null>(null);
  const [sharedSecrets, setSharedSecrets] = useState<Map<string, Uint8Array>>(new Map());
  const [recipientEncryptionKeys, setRecipientEncryptionKeys] = useState<Map<string, Uint8Array>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const isEncryptionReady = Boolean(wallet.publicKey && wallet.signMessage);

  const clearEncryptionState = useCallback(() => {
    if (
      !encryptionKeypair &&
      !isInitialized &&
      sharedSecrets.size === 0 &&
      recipientEncryptionKeys.size === 0
    ) {
      return;
    }

    sharedSecrets.forEach((secret) => {
      SecurityUtils.clearSensitiveData(secret);
    });

    if (encryptionKeypair) {
      SecurityUtils.clearSensitiveData(encryptionKeypair);
    }

    setEncryptionKeypair(null);
    setSharedSecrets(new Map());
    setRecipientEncryptionKeys(new Map());
    setIsInitialized(false);
  }, [sharedSecrets, recipientEncryptionKeys, encryptionKeypair, isInitialized]);

  useEffect(() => {
    if (!wallet.connected) {
      clearEncryptionState();
    }
  }, [wallet.connected, clearEncryptionState]);

 
  const initializeEncryption = useCallback(async () => {
    if (!wallet.signMessage || !wallet.publicKey) {
      throw new Error("Wallet not connected or doesn't support message signing");
    }

    try {
      
      const messageBytes = new TextEncoder().encode(DERIVATION_MESSAGE);
      const signature = await wallet.signMessage(messageBytes);
      
     
      const walletPubkeyBytes = wallet.publicKey.toBytes();
      const info = new TextEncoder().encode("pigeon-encryption-keypair-v1");
      const seed = hkdf(sha256, signature, walletPubkeyBytes, info, 32);
      
      const privateKey = seed.slice();
      privateKey[0] &= 248;
      privateKey[31] &= 127;
      privateKey[31] |= 64;
      
      const publicKey = x25519.getPublicKey(privateKey);
      
      const keypair = new Uint8Array(64);
      keypair.set(privateKey, 0);
      keypair.set(publicKey, 32);
      
      setEncryptionKeypair(keypair);
      setIsInitialized(true);
      
      SecurityUtils.checkSecureContext();

      const derivedPubkey = publicKey;
      const selfAddress = wallet.publicKey.toBase58();
      const existingKey = await getUserEncryptionKey(selfAddress);

      if (!existingKey) {
        await registerUser(derivedPubkey);
        console.log("✅ Encryption public key registered on-chain");
      } else {
        const matches = existingKey.length === derivedPubkey.length &&
          existingKey.every((value, idx) => value === derivedPubkey[idx]);
        if (!matches) {
          throw new Error(
            "Encryption key mismatch for this wallet. " +
              "Existing on-chain key does not match derived key."
          );
        }
      }
      
      console.log("✅ Encryption initialized successfully");
    //  console.log("📍 Encryption public key:", Buffer.from(publicKey).toString('hex').slice(0, 16) + '...');
    } catch (error) {
      console.error("Failed to initialize encryption:", error);
      clearEncryptionState();
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Encryption initialization failed");
    }
  }, [wallet, registerUser, getUserEncryptionKey, clearEncryptionState]);

  const getRecipientEncryptionKey = useCallback(
    async (recipientAddress: string): Promise<Uint8Array> => {
      const cached = recipientEncryptionKeys.get(recipientAddress);
      if (cached) {
        return cached;
      }

      const onchainKey = await getUserEncryptionKey(recipientAddress);
      if (!onchainKey) {
        throw new Error("Recipient has not registered an encryption key yet");
      }

      setRecipientEncryptionKeys(prev => {
        const next = new Map(prev);
        next.set(recipientAddress, onchainKey);
        return next;
      });

      return onchainKey;
    },
    [recipientEncryptionKeys, getUserEncryptionKey]
  );

  
  const getSharedSecret = useCallback(
    async (recipientAddress: string): Promise<Uint8Array> => {
      if (!encryptionKeypair) {
        throw new Error("Encryption not initialized. Call initializeEncryption() first.");
      }

      const cached = sharedSecrets.get(recipientAddress);
      if (cached) {
        return cached;
      }

      const myPrivateKey = encryptionKeypair.slice(0, 32);
      
      const recipientEncryptionPubkey = await getRecipientEncryptionKey(recipientAddress);
      
      const sharedSecret = deriveSharedSecret(myPrivateKey, recipientEncryptionPubkey);
      
      setSharedSecrets(prev => {
        const newMap = new Map(prev);
        newMap.set(recipientAddress, sharedSecret);
        return newMap;
      });
      
      return sharedSecret;
    },
    [encryptionKeypair, sharedSecrets, getRecipientEncryptionKey]
  );

  /**
   * Encrypt a message for a recipient
   */
  const encryptMessage = useCallback(
    async (message: string, recipientAddress: string): Promise<Uint8Array> => {
      if (!isInitialized || !encryptionKeypair) {
        throw new Error("Encryption not initialized. Please sign the message first.");
      }

      const sharedSecret = await getSharedSecret(recipientAddress);
      const nonce = generateNonce();

      const encrypted = encryptMessageUtil(message, sharedSecret, nonce);

      return encrypted;
    },
    [isInitialized, encryptionKeypair, getSharedSecret]
  );

  /**
   * Decrypt a message from a sender
   */
  const decryptMessage = useCallback(
    async (encryptedData: Uint8Array, senderAddress: string): Promise<string> => {
      if (!isInitialized || !encryptionKeypair) {
        throw new Error("Encryption not initialized. Please sign the message first.");
      }

      const sharedSecret = await getSharedSecret(senderAddress);

      try {
        const plaintext = decryptMessageUtil(encryptedData, sharedSecret);
        return plaintext;
      } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Failed to decrypt message - it may be corrupted or from a different encryption session");
      }
    },
    [isInitialized, encryptionKeypair, getSharedSecret]
  );

  const value: EncryptionContextType = {
    encryptMessage,
    decryptMessage,
    initializeEncryption,
    clearEncryptionState,
    isEncryptionReady,
    isInitialized,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error("useEncryption must be used within EncryptionProvider");
  }
  return context;
}
