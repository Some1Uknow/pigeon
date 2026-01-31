import { useState, useCallback } from "react";
import { usePrivatePayments } from "../hooks/usePrivatePayments";
import { TIP_PRESETS, lamportsToSol, solToLamports } from "../utils/magicblock";

interface TipModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientAddress: string;
    recipientLabel?: string;
}

type TipStep = "amount" | "confirm" | "success" | "error";

export function TipModal({ isOpen, onClose, recipientAddress, recipientLabel }: TipModalProps) {
    const { sendTip, isLoading, error, clearError } = usePrivatePayments();

    const [step, setStep] = useState<TipStep>("amount");
    const [selectedAmount, setSelectedAmount] = useState<number>(TIP_PRESETS[0].lamports);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [txSignature, setTxSignature] = useState<string>("");

    const displayRecipient = recipientLabel || `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`;

    const handleClose = useCallback(() => {
        setStep("amount");
        setSelectedAmount(TIP_PRESETS[0].lamports);
        setCustomAmount("");
        setTxSignature("");
        clearError();
        onClose();
    }, [onClose, clearError]);

    const handlePresetClick = (lamports: number) => {
        setSelectedAmount(lamports);
        setCustomAmount("");
    };

    const handleCustomAmountChange = (value: string) => {
        setCustomAmount(value);
        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed > 0) {
            setSelectedAmount(solToLamports(parsed));
        }
    };

    const handleConfirm = () => {
        setStep("confirm");
    };

    const handleSendTip = async () => {
        try {
            const result = await sendTip(recipientAddress, selectedAmount);
            setTxSignature(result.signature);
            setStep("success");
        } catch {
            setStep("error");
        }
    };

    const handleBack = () => {
        setStep("amount");
        clearError();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-body">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-none"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-black border border-[var(--color-term-green)] shadow-[8px_8px_0px_var(--color-term-dim)]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[var(--color-term-dim)]/20 border-b border-[var(--color-term-green)]">
                    <h2 className="text-lg font-display font-bold text-[var(--color-term-green)] tracking-widest uppercase">
                        {step === "success" ? "TX_CONFIRMED" : step === "error" ? "TX_FAILED" : "INIT_TRANSFER"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-[var(--color-term-green)] hover:text-white font-display font-bold"
                    >
                        [ X ]
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === "amount" && (
                        <div className="space-y-6">
                            <p className="text-[var(--color-term-dim)] text-center text-sm uppercase tracking-widest">
                                Target: <span className="text-[var(--color-term-green)]">{displayRecipient}</span>
                            </p>

                            {/* Preset amounts */}
                            <div className="grid grid-cols-3 gap-3">
                                {TIP_PRESETS.map((preset) => (
                                    <button
                                        key={preset.label}
                                        onClick={() => handlePresetClick(preset.lamports)}
                                        className={`py-3 px-4 font-display font-bold uppercase tracking-widest text-sm transition-none border ${selectedAmount === preset.lamports && !customAmount
                                                ? "bg-[var(--color-term-green)] text-black border-[var(--color-term-green)]"
                                                : "bg-black text-[var(--color-term-green)] border-[var(--color-term-dim)] hover:border-[var(--color-term-green)]"
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>

                            {/* Custom amount */}
                            <div>
                                <label className="block text-xs text-[var(--color-term-dim)] mb-2 uppercase tracking-widest font-display">Custom Amount:</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        placeholder="0.00"
                                        value={customAmount}
                                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                                        className="w-full px-4 py-3 bg-black border border-[var(--color-term-green)] text-[var(--color-term-green)] placeholder-[var(--color-term-dim)] focus:outline-none rounded-none font-display text-lg"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-term-green)] font-display">SOL</span>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={selectedAmount <= 0}
                                className="w-full py-3 px-4 bg-[var(--color-term-green)] hover:bg-white disabled:bg-[var(--color-term-dim)] disabled:cursor-not-allowed text-black font-display font-bold uppercase tracking-widest transition-none"
                            >
                                [ PROCEED ]
                            </button>
                        </div>
                    )}

                    {step === "confirm" && (
                        <div className="space-y-6">
                            <div className="text-center border-b border-[var(--color-term-dim)] border-dashed pb-4">
                                <p className="text-3xl font-display font-bold text-[var(--color-term-green)] mb-2">
                                    {lamportsToSol(selectedAmount)} SOL
                                </p>
                                <p className="text-[var(--color-term-dim)] text-xs uppercase tracking-widest">
                                    &gt;&gt; {displayRecipient}
                                </p>
                            </div>

                            <div className="bg-[var(--color-term-dim)]/10 p-4 border border-[var(--color-term-dim)]">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--color-term-dim)] uppercase tracking-wider font-display">Amount</span>
                                    <span className="text-[var(--color-term-green)] font-display">{lamportsToSol(selectedAmount)} SOL</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--color-term-dim)] uppercase tracking-wider font-display">Network Fee</span>
                                    <span className="text-[var(--color-term-green)] font-display">~0.000005 SOL</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 bg-black border border-[var(--color-term-dim)] hover:border-[var(--color-term-green)] text-[var(--color-term-green)] font-display font-bold uppercase tracking-widest transition-none"
                                >
                                    [ BACK ]
                                </button>
                                <button
                                    onClick={handleSendTip}
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 bg-[var(--color-term-green)] hover:bg-white disabled:bg-[var(--color-term-dim)] text-black font-display font-bold uppercase tracking-widest transition-none"
                                >
                                    {isLoading ? (
                                        "PROCESSING..."
                                    ) : (
                                        "[ CONFIRM ]"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="space-y-6 text-center">
                            <div className="py-4">
                                <span className="text-[var(--color-term-green)] text-4xl font-display">[ SUCCESS ]</span>
                            </div>

                            <div>
                                <p className="text-lg font-display text-[var(--color-term-green)] mb-1">TRANSFER COMPLETE</p>
                                <p className="text-[var(--color-term-dim)] text-sm font-body">
                                    {lamportsToSol(selectedAmount)} SOL &gt;&gt; {displayRecipient}
                                </p>
                            </div>

                            <a
                                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-[var(--color-term-green)] hover:text-white text-xs underline font-display tracking-widest"
                            >
                                VIEW_ON_EXPLORER
                            </a>

                            <button
                                onClick={handleClose}
                                className="w-full py-3 px-4 bg-black border border-[var(--color-term-green)] text-[var(--color-term-green)] hover:bg-[var(--color-term-green)] hover:text-black font-display font-bold uppercase tracking-widest transition-none"
                            >
                                [ CLOSE_TERMINAL ]
                            </button>
                        </div>
                    )}

                    {step === "error" && (
                        <div className="space-y-6 text-center">
                            <div className="py-4">
                                <span className="text-[var(--color-term-alert)] text-4xl font-display">[ FAILED ]</span>
                            </div>

                            <div>
                                <p className="text-lg font-display text-[var(--color-term-alert)] mb-2">TRANSACTION ABORTED</p>
                                <p className="text-[var(--color-term-dim)] text-xs font-body break-all bg-[var(--color-term-dim)]/10 p-2 border border-[var(--color-term-dim)]">{error}</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleBack}
                                    className="flex-1 py-3 px-4 bg-black border border-[var(--color-term-green)] text-[var(--color-term-green)] hover:bg-[var(--color-term-green)] hover:text-black font-display font-bold uppercase tracking-widest transition-none"
                                >
                                    [ RETRY ]
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 py-3 px-4 bg-black border border-[var(--color-term-dim)] text-[var(--color-term-dim)] hover:text-white font-display font-bold uppercase tracking-widest transition-none"
                                >
                                    [ ABORT ]
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
