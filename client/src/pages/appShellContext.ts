import { useOutletContext } from "react-router-dom";
import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Connection } from "@solana/web3.js";
import type { ChatState } from "../hooks/useChatState";

export interface AppShellContextValue {
  chat: ChatState;
  wallet: WalletContextState;
  connection: Connection;
  balance: number | null;
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => Promise<void>;
}

export function useAppShellContext() {
  return useOutletContext<AppShellContextValue>();
}
