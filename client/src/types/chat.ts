import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@coral-xyz/anchor";

export interface Message {
  sender: PublicKey;
  text: string;
  timestamp: BN;
}

export interface Chat {
  receiver: string;
  messages: Message[];
  isSentByMe: boolean; // true if my pubkey is lexicographically first
}
