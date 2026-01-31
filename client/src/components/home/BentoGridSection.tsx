import BentoCard from "./BentoCard";

const bentoFeatures = [
    {
        title: "WALLET_ID_ONLY",
        description: "No metadata linked. Wallet address is the only identifier.",
        icon: "account_balance_wallet",
        size: "large" as const,
    },
    {
        title: "REALTIME_SYNC",
        description: "WebSocket connection established. Zero latency updates.",
        icon: "sync",
        size: "small" as const,
    },
    {
        title: "NO_TRACKING",
        description: "Zero analytics. Zero cookies. Zero profiling.",
        icon: "shield",
        size: "small" as const,
    },
    {
        title: "OPEN_SOURCE",
        description: "Codebase public. Auditability: 100%.",
        icon: "code",
        size: "small" as const,
    },
    {
        title: "ENCRYPTION_STANDARD",
        description: "ChaCha20-Poly1305. Military grade message sealing.",
        icon: "encrypted",
        size: "large" as const,
    },
];

export default function BentoGridSection() {
    return (
        <div className="space-y-16 py-10 border-t border-[var(--color-term-dim)] border-dashed">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <h2 className="md:col-span-6 text-[var(--color-term-green)] text-3xl md:text-4xl font-display font-semibold tracking-widest uppercase">
                    PRIVACY_ARCHITECTURE
                </h2>
                <p className="md:col-span-6 text-[var(--color-term-green)] opacity-80 text-base md:text-lg md:text-right font-body">
                    &gt; Analyzing security protocols... <br/>
                    &gt; All systems green.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bentoFeatures.map((feature, index) => (
                    <BentoCard key={index} {...feature} />
                ))}
            </div>
        </div>
    );
}
