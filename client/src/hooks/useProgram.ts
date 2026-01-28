import { useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import idl from "../solana_program.json";

// Custom hook to get the Anchor program instance
export const useProgram = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

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

  return { getProgram, connection };
};
