import solanaLogo from "../../assets/logos/solana.png";
import heliusLogo from "../../assets/logos/helius.png";

const infraStack = [
    {
        name: "SOLANA_NETWORK",
        logo: solanaLogo,
    },
    {
        name: "HELIUS_RPC",
        logo: heliusLogo,
    },
];

export default function TechStackSection() {
    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
                <div className="md:col-span-6">
                    <div className="home-section-label">
                        <span className="material-symbols-outlined" aria-hidden="true">dns</span>
                        INFRASTRUCTURE
                    </div>
                    <h2 className="mt-6 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                        Protocol infrastructure.
                    </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:text-right md:text-lg">
                    Solana provides the global coordination layer. Helius keeps the client fast on devnet.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {infraStack.map((item, index) => (
                    <div
                        key={index}
                        className="card-surface group relative overflow-hidden p-8"
                    >
                        <div className="absolute right-4 top-4 rounded-sm border border-[rgba(119,117,117,0.24)] bg-[var(--color-surface-black)] px-3 py-1">
                            <div className="flex items-center gap-2 font-label text-xs text-[var(--color-secondary)]">
                                <span className="status-dot" />
                                ACTIVE
                            </div>
                        </div>
                        <div className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">NET_0{index + 1}</div>
                        <div className="mt-4 flex items-center gap-5">
                            <img
                                src={item.logo}
                                alt={item.name}
                                className="h-12 w-auto object-contain logo-monochrome"
                            />
                            <span className="font-display text-2xl font-bold uppercase text-[var(--color-text)]">
                                {item.name}
                            </span>
                        </div>
                        <div className="mt-8 flex h-20 items-end gap-1 border-b border-[rgba(119,117,117,0.18)] opacity-70 transition-opacity group-hover:opacity-100">
                            {[40, 64, 36, 82, 54, 92].map((height) => (
                                <div
                                    key={height}
                                    className="w-full bg-[rgba(189,157,255,0.32)]"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
