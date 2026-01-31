import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: "lock",
        title: "Private_by_Default",
        description: "Your messages are encrypted before they ever leave your device.",
    },
    {
        icon: "bolt",
        title: "Fast_on_Solana",
        description: "Messages land quickly using Solana's high-speed network.",
    },
    {
        icon: "groups",
        title: "Open_Source",
        description: "Open-source protocol anyone can audit or build on.",
    },
];

export default function FeaturesSection() {
    return (
        <div className="space-y-16 py-10 border-t border-b border-[var(--color-term-dim)] border-dashed">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end fade-in-up stagger-2">
                <div className="md:col-span-6">
                    <div className="text-[var(--color-term-dim)] text-sm font-body mb-2">
                        System_Check: <span className="text-[var(--color-term-green)]">OK</span>
                    </div>
                    <h2 className="text-[var(--color-term-green)] text-3xl md:text-4xl font-display font-semibold tracking-widest uppercase">
                        WHY_PIGEON?
                    </h2>
                </div>
                <p className="md:col-span-6 text-[var(--color-term-green)] opacity-80 text-base md:text-lg md:text-right font-body">
                    &gt; Executing protocol analysis... <br/>
                    &gt; Result: Secure, decentralized messaging.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-up stagger-3">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </div>
    );
}
