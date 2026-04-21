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
        <div className="panel-surface relative overflow-hidden rounded-xl p-6 md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative z-10 space-y-12">
                <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
                    <div className="md:col-span-6">
                        <div className="home-section-label">
                            <span className="material-symbols-outlined" aria-hidden="true">schema</span>
                            PRIVACY_ARCHITECTURE
                        </div>
                        <h2 className="mt-6 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                            Built from cryptographic modules, not policy promises.
                        </h2>
                    </div>
                    <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:text-right md:text-lg">
                        Wallet identity, local encryption, and on-chain coordination keep the protocol verifiable.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {bentoFeatures.map((feature, index) => (
                        <BentoCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </div>
    );
}
