import { useState, useCallback, useEffect } from "react";
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

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, handleClose]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-body">
            <button
                type="button"
                className="absolute inset-0 bg-[rgba(5,5,5,0.78)] backdrop-blur-md"
                onClick={handleClose}
                aria-label="Close transfer modal"
            />

            <div className="glass-panel relative z-10 w-full max-w-md rounded-xl">
                <div className="flex items-center justify-between border-b border-[rgba(119,117,117,0.16)] p-4">
                    <div>
                        <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">
                            Private payment
                        </p>
                        <h2 className="font-display text-xl font-bold uppercase text-[var(--color-text)]">
                            {step === "success" ? "TX_CONFIRMED" : step === "error" ? "TX_FAILED" : "INIT_TRANSFER"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="min-h-10 min-w-10 rounded-md text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-bright)] hover:text-[var(--color-text)]"
                        aria-label="Close transfer modal"
                    >
                        X
                    </button>
                </div>

                <div className="p-6">
                    {step === "amount" && (
                        <div className="space-y-6">
                            <p className="rounded-md border border-[rgba(119,117,117,0.16)] bg-[var(--color-surface-low)] px-3 py-2 text-center font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                                Target: <span className="text-[var(--color-secondary)]">{displayRecipient}</span>
                            </p>

                            <div className="grid grid-cols-3 gap-3">
                                {TIP_PRESETS.map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => handlePresetClick(preset.lamports)}
                                        className={`min-h-12 rounded-md border px-3 font-label text-sm font-bold uppercase transition-colors ${
                                            selectedAmount === preset.lamports && !customAmount
                                                ? "border-[rgba(189,157,255,0.58)] bg-[rgba(189,157,255,0.16)] text-[var(--color-primary)]"
                                                : "border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] text-[var(--color-text-muted)] hover:border-[rgba(0,238,252,0.42)] hover:text-[var(--color-secondary)]"
                                        }`}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>

                            <label className="block">
                                <span className="mb-2 block font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                                    Custom amount
                                </span>
                                <div className="flex min-h-12 items-center rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] px-4 focus-within:border-[var(--color-secondary)]">
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        step="0.001"
                                        min="0"
                                        placeholder="0.00"
                                        value={customAmount}
                                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                                        className="min-w-0 flex-1 border-0 bg-transparent font-label text-lg text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
                                    />
                                    <span className="font-label text-sm text-[var(--color-secondary)]">SOL</span>
                                </div>
                            </label>

                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={selectedAmount <= 0}
                                className="btn-primary min-h-12 w-full px-4 text-sm disabled:opacity-50"
                            >
                                [ Proceed ]
                            </button>
                        </div>
                    )}

                    {step === "confirm" && (
                        <div className="space-y-6">
                            <div className="border-b border-[rgba(119,117,117,0.16)] pb-5 text-center">
                                <p className="mb-2 font-display text-4xl font-bold text-[var(--color-primary)]">
                                    {lamportsToSol(selectedAmount)} SOL
                                </p>
                                <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                                    to {displayRecipient}
                                </p>
                            </div>

                            <div className="panel-surface space-y-3 rounded-lg p-4 font-label text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-text-muted)]">Amount</span>
                                    <span className="text-[var(--color-text)]">{lamportsToSol(selectedAmount)} SOL</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-text-muted)]">Network Fee</span>
                                    <span className="text-[var(--color-text)]">~0.000005 SOL</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="btn-secondary min-h-12 flex-1 px-4 text-sm disabled:opacity-50"
                                >
                                    [ Back ]
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendTip}
                                    disabled={isLoading}
                                    className="btn-primary min-h-12 flex-1 px-4 text-sm disabled:opacity-50"
                                >
                                    {isLoading ? "Processing..." : "[ Confirm ]"}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-[rgba(67,215,135,0.1)] text-[var(--color-success)]">
                                <span className="material-symbols-outlined text-4xl" aria-hidden="true">check_circle</span>
                            </div>

                            <div>
                                <p className="mb-1 font-display text-2xl font-bold uppercase text-[var(--color-text)]">Transfer complete</p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {lamportsToSol(selectedAmount)} SOL to {displayRecipient}
                                </p>
                            </div>

                            <a
                                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-10 items-center justify-center rounded-md px-3 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)] hover:bg-[var(--color-surface-bright)]"
                            >
                                View on explorer
                            </a>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="btn-secondary min-h-12 w-full px-4 text-sm"
                            >
                                [ Close terminal ]
                            </button>
                        </div>
                    )}

                    {step === "error" && (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-[rgba(255,110,132,0.1)] text-[var(--color-error)]">
                                <span className="material-symbols-outlined text-4xl" aria-hidden="true">error</span>
                            </div>

                            <div>
                                <p className="mb-2 font-display text-2xl font-bold uppercase text-[var(--color-error)]">Transaction aborted</p>
                                <p className="break-all rounded-md border border-[rgba(255,110,132,0.24)] bg-[rgba(255,110,132,0.08)] p-3 text-left text-xs leading-relaxed text-[var(--color-text-muted)]">
                                    {error || "The payment could not be completed."}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="btn-primary min-h-12 flex-1 px-4 text-sm"
                                >
                                    [ Retry ]
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn-secondary min-h-12 flex-1 px-4 text-sm"
                                >
                                    [ Abort ]
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
