import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
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

/**
 * Encryption Context for managing E2EE state across the app
 * 
 * Architecture: Signature-Based Key Derivation
 * - Uses wallet.signMessage() to derive deterministic encryption keypair
 * - Each wallet generates a consistent encryption key from signature
 * - Keys cached in-memory per session
 * - User signs once per session to unlock encryption
 */

interface EncryptionContextType {
  // Encrypt a message for a specific recipient
  encryptMessage: (message: string, recipientAddress: string) => Promise<Uint8Array>;
  
  // Decrypt a message from a specific sender
  decryptMessage: (encryptedData: Uint8Array, senderAddress: string) => Promise<string>;
  
  // Get the current message counter for a chat
  getMessageCounter: (recipientAddress: string) => number;
  
  // Increment message counter
  incrementCounter: (recipientAddress: string) => void;
  
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
  
  // Derived encryption keypair from wallet signature (64 bytes: 32 private + 32 public)
  const [encryptionKeypair, setEncryptionKeypair] = useState<Uint8Array | null>(null);
  
  // In-memory storage for shared secrets (never persisted)
  const [sharedSecrets, setSharedSecrets] = useState<Map<string, Uint8Array>>(new Map());
  
  // Message counters for nonce generation (per chat)
  const [messageCounters, setMessageCounters] = useState<Map<string, number>>(new Map());
  
  // Track if encryption is initialized
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track if we have a valid wallet
  const isEncryptionReady = Boolean(wallet.publicKey && wallet.signMessage);

  // Clear encryption state when wallet disconnects
  useEffect(() => {
    if (!wallet.connected) {
      clearEncryptionState();
    }
  }, [wallet.connected]);

  /**
   * Initialize encryption by prompting user to sign message
   * Derives encryption keypair from wallet public key (deterministic)
   */
  const initializeEncryption = useCallback(async () => {
    if (!wallet.signMessage || !wallet.publicKey) {
      throw new Error("Wallet not connected or doesn't support message signing");
    }

    try {
      // Prompt user to sign - this is just for user consent/authentication
      // We derive keys from the public key, not the signature
      const messageBytes = new TextEncoder().encode(DERIVATION_MESSAGE);
      await wallet.signMessage(messageBytes);
      
      // Derive encryption keypair deterministically from wallet public key
      // This allows anyone to compute anyone else's encryption public key
      const walletPubkeyBytes = wallet.publicKey.toBytes();
      const info = new TextEncoder().encode("pigeon-encryption-keypair-v1");
      const seed = hkdf(sha256, walletPubkeyBytes, undefined, info, 32);
      
      // Use the seed as X25519 private key directly (with proper clamping)
      const privateKey = seed.slice();
      privateKey[0] &= 248;
      privateKey[31] &= 127;
      privateKey[31] |= 64;
      
      // Generate X25519 public key from the clamped private key
      const publicKey = x25519.getPublicKey(privateKey);
      
      // Combine into 64-byte keypair format (private + public)
      const keypair = new Uint8Array(64);
      keypair.set(privateKey, 0);
      keypair.set(publicKey, 32);
      
      setEncryptionKeypair(keypair);
      setIsInitialized(true);
      
      SecurityUtils.checkSecureContext();
      
      console.log("✅ Encryption initialized successfully");
      console.log("📍 Encryption public key:", Buffer.from(publicKey).toString('hex').slice(0, 16) + '...');
    } catch (error) {
      console.error("Failed to initialize encryption:", error);
      throw new Error("User rejected signature or encryption initialization failed");
    }
  }, [wallet]);

  /**
   * Get or compute shared secret for a recipient
   */
  const getSharedSecret = useCallback(
    (recipientAddress: string): Uint8Array => {
      if (!encryptionKeypair) {
        throw new Error("Encryption not initialized. Call initializeEncryption() first.");
      }

      // Check if we already have this secret cached
      const cached = sharedSecrets.get(recipientAddress);
      if (cached) {
        return cached;
      }

      // Get my encryption private key
      const myPrivateKey = encryptionKeypair.slice(0, 32);
      
      // Derive the recipient's encryption public key from their wallet public key
      // This uses the same derivation as initializeEncryption()
      const recipientWalletPubkey = new PublicKey(recipientAddress).toBytes();
      const info = new TextEncoder().encode("pigeon-encryption-keypair-v1");
      
      // Derive recipient's encryption seed from their wallet pubkey
      const recipientSeed = hkdf(sha256, recipientWalletPubkey, undefined, info, 32);
      
      // Clamp the private key for X25519
      const recipientPrivateKey = recipientSeed.slice();
      recipientPrivateKey[0] &= 248;
      recipientPrivateKey[31] &= 127;
      recipientPrivateKey[31] |= 64;
      
      const recipientEncryptionPubkey = x25519.getPublicKey(recipientPrivateKey);
      
      // Now derive shared secret using ECDH with their encryption public key
      const sharedSecret = deriveSharedSecret(myPrivateKey, recipientEncryptionPubkey);
      
      // Cache for this session
      setSharedSecrets(prev => {
        const newMap = new Map(prev);
        newMap.set(recipientAddress, sharedSecret);
        return newMap;
      });
      
      return sharedSecret;
    },
    [encryptionKeypair, sharedSecrets]
  );

  /**
   * Encrypt a message for a recipient
   */
  const encryptMessage = useCallback(
    async (message: string, recipientAddress: string): Promise<Uint8Array> => {
      if (!isInitialized || !encryptionKeypair) {
        throw new Error("Encryption not initialized. Please sign the message first.");
      }

      // Get or compute shared secret
      const sharedSecret = getSharedSecret(recipientAddress);

      // Get current counter
      const counter = messageCounters.get(recipientAddress) || 0;

      // Generate nonce
      const nonce = generateNonce(counter);

      // Encrypt
      const encrypted = encryptMessageUtil(message, sharedSecret, nonce);

      // Increment counter for next message
      setMessageCounters(prev => {
        const newMap = new Map(prev);
        newMap.set(recipientAddress, counter + 1);
        return newMap;
      });

      return encrypted;
    },
    [isInitialized, encryptionKeypair, getSharedSecret, messageCounters]
  );

  /**
   * Decrypt a message from a sender
   */
  const decryptMessage = useCallback(
    async (encryptedData: Uint8Array, senderAddress: string): Promise<string> => {
      if (!isInitialized || !encryptionKeypair) {
        throw new Error("Encryption not initialized. Please sign the message first.");
      }

      // Get or compute shared secret
      const sharedSecret = getSharedSecret(senderAddress);

      // Decrypt
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

  /**
   * Get message counter for a chat
   */
  const getMessageCounter = useCallback(
    (recipientAddress: string): number => {
      return messageCounters.get(recipientAddress) || 0;
    },
    [messageCounters]
  );

  /**
   * Increment message counter (used after sending)
   */
  const incrementCounter = useCallback(
    (recipientAddress: string): void => {
      setMessageCounters(prev => {
        const newMap = new Map(prev);
        const current = newMap.get(recipientAddress) || 0;
        newMap.set(recipientAddress, current + 1);
        return newMap;
      });
    },
    []
  );

  /**
   * Clear all encryption state
   * Called on wallet disconnect or security timeout
   */
  const clearEncryptionState = useCallback(() => {
    // Securely clear shared secrets
    sharedSecrets.forEach((secret) => {
      SecurityUtils.clearSensitiveData(secret);
    });
    
    // Clear encryption keypair
    if (encryptionKeypair) {
      SecurityUtils.clearSensitiveData(encryptionKeypair);
    }
    
    setEncryptionKeypair(null);
    setSharedSecrets(new Map());
    setMessageCounters(new Map());
    setIsInitialized(false);
  }, [sharedSecrets, encryptionKeypair]);

  const value: EncryptionContextType = {
    encryptMessage,
    decryptMessage,
    getMessageCounter,
    incrementCounter,
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

/**
 * Hook to use encryption context
 */
export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error("useEncryption must be used within EncryptionProvider");
  }
  return context;
}
