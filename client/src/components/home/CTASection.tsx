import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function CTASection() {
    return (
        <div className="band-surface rounded-none border-l border-r border-[var(--color-term-dim)]">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                <div className="md:col-span-7 space-y-6">
                    <h2 className="text-[var(--color-term-green)] text-4xl md:text-5xl font-display font-semibold tracking-widest uppercase">
                        INITIALIZE_CHAT_SESSION
                    </h2>
                    <p className="text-[var(--color-term-green)] opacity-80 text-lg md:text-xl leading-relaxed font-body">
                        &gt; Waiting for user input... <br/>
                        &gt; Connect wallet to begin encrypted transmission.
                    </p>
                </div>
                <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-4 justify-start md:justify-end">
                    <WalletMultiButton className="flex min-w-40 cursor-pointer items-center justify-center overflow-hidden h-14 px-8 text-base font-display leading-normal tracking-widest uppercase btn-primary rounded-none">
                        <span className="truncate">EXECUTE_LAUNCH</span>
                    </WalletMultiButton>
                    <a
                        href="https://github.com/some1uknow/pigeon"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-40 cursor-pointer items-center justify-center gap-2 overflow-hidden h-14 px-8 text-[var(--color-term-green)] text-base font-display leading-normal tracking-widest uppercase transition-none btn-ghost rounded-none border border-[var(--color-term-dim)] hover:bg-[var(--color-term-dim)]"
                    >
                        <span className="truncate">[ SOURCE_CODE ]</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
