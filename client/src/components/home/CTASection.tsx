import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function CTASection() {
    return (
        <div className="band-surface p-8 md:p-12">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
            <div className="relative z-10 grid grid-cols-1 items-center gap-10 md:grid-cols-12">
                <div className="space-y-6 md:col-span-7">
                    <div className="font-label text-sm uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                        SYSTEM_READY
                    </div>
                    <h2 className="font-display text-4xl font-bold uppercase text-[var(--color-text)] md:text-5xl">
                        INITIALIZE_CHAT_SESSION
                    </h2>
                    <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
                        Connect a wallet to open encrypted chat. Swap and transfer surfaces are now part of the same superapp shell.
                    </p>
                </div>
                <div className="flex flex-col justify-start gap-4 sm:flex-row md:col-span-5 md:justify-end">
                    <WalletMultiButton className="btn-primary flex h-14 min-w-40 items-center justify-center overflow-hidden px-8 text-sm">
                        <span className="truncate">[ EXECUTE_LAUNCH ]</span>
                    </WalletMultiButton>
                    <a
                        href="https://github.com/some1uknow/pigeon"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary flex h-14 min-w-40 items-center justify-center gap-2 overflow-hidden px-8 text-sm"
                    >
                        <span className="truncate">[ SOURCE_CODE ]</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
