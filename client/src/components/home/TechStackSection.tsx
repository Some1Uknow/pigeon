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
        <div className="space-y-16 py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <h2 className="md:col-span-6 text-[var(--color-term-green)] text-3xl md:text-4xl font-display font-semibold tracking-widest uppercase">
                    INFRASTRUCTURE
                </h2>
                <p className="md:col-span-6 text-[var(--color-term-green)] opacity-80 text-base md:text-lg md:text-right font-body">
                    &gt; Dependencies loaded: Solana, Helius.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-16">
                {infraStack.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 group opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <img
                            src={item.logo}
                            alt={item.name}
                            className="h-10 w-auto object-contain logo-monochrome"
                        />
                        <span className="text-[var(--color-term-green)] font-semibold text-lg tracking-widest uppercase">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
