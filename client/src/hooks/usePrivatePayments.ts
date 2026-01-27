import { useCallback, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    Transaction,
    SystemProgram,
} from "@solana/web3.js";
import { isPrivateTransfersAvailable, lamportsToSol } from "../utils/magicblock";

export interface TipResult {
    signature: string;
    isPrivate: boolean;
    amount: number;
    recipient: string;
}

/**
 * Hook for sending SOL tips to chat participants
 * 
 * Currently uses standard Solana transfers.
 * Will upgrade to MagicBlock PER private transfers when available.
 */
export const usePrivatePayments = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Send a SOL tip to a recipient
     * @param recipientAddress - Recipient wallet address
     * @param amountLamports - Amount in lamports
     */
    const sendTip = useCallback(async (
        recipientAddress: string,
        amountLamports: number
    ): Promise<TipResult> => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }

        if (amountLamports <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        const minAmount = 5000; // Minimum 5000 lamports (~0.000005 SOL)
        if (amountLamports < minAmount) {
            throw new Error(`Minimum tip amount is ${lamportsToSol(minAmount)} SOL`);
        }

        setIsLoading(true);
        setError(null);

        try {
            const recipient = new PublicKey(recipientAddress);

            // Check if recipient is the sender
            if (recipient.equals(wallet.publicKey)) {
                throw new Error("Cannot tip yourself");
            }

            // Check balance
            const balance = await connection.getBalance(wallet.publicKey);
            const requiredBalance = amountLamports + 5000; // Include fee estimate
            if (balance < requiredBalance) {
                throw new Error(
                    `Insufficient balance. You have ${lamportsToSol(balance)} SOL, ` +
                    `need ${lamportsToSol(requiredBalance)} SOL`
                );
            }

            // Check if private transfers are available
            const isPrivate = isPrivateTransfersAvailable();

            if (isPrivate) {
                // TODO: Implement MagicBlock PER transfer when API is available
                throw new Error("Private transfers not yet available");
            }

            // Standard SOL transfer - use wallet.sendTransaction to avoid blockhash mismatch
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: recipient,
                    lamports: amountLamports,
                })
            );

            // wallet.sendTransaction handles blockhash fetching internally
            // using the same RPC as our connection, avoiding validation mismatch
            const signature = await wallet.sendTransaction(tx, connection, {
                skipPreflight: true,
                maxRetries: 3,
            });

            // Confirm with fresh blockhash
            const latestBlockhash = await connection.getLatestBlockhash("confirmed");
            await connection.confirmTransaction({
                signature,
                ...latestBlockhash,
            }, "confirmed");

            console.log(`💰 Tip sent: ${lamportsToSol(amountLamports)} SOL to ${recipientAddress.slice(0, 8)}...`);
            console.log(`   Signature: ${signature}`);

            return {
                signature,
                isPrivate,
                amount: amountLamports,
                recipient: recipientAddress,
            };
        } catch (err: any) {
            const errorMessage = err.message || "Failed to send tip";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [wallet, connection]);

    /**
     * Get wallet SOL balance
     */
    const getBalance = useCallback(async (): Promise<number> => {
        if (!wallet.publicKey) {
            throw new Error("Wallet not connected");
        }
        return connection.getBalance(wallet.publicKey);
    }, [wallet.publicKey, connection]);

    /**
     * Check if private transfers are available
     */
    const checkPrivateAvailability = useCallback((): boolean => {
        return isPrivateTransfersAvailable();
    }, []);

    return {
        sendTip,
        getBalance,
        checkPrivateAvailability,
        isLoading,
        error,
        clearError: () => setError(null),
    };
};
