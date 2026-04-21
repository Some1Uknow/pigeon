import FeatureCard from "./FeatureCard";

const features = [
    {
        icon: "lock",
        title: "Zero Trust Base",
        description: "Messages are encrypted before they leave the device. Wallet signatures prove identity without accounts.",
    },
    {
        icon: "bolt",
        title: "Sub-Second UX",
        description: "Solana settlement, websocket updates, and local encryption keep the thread feeling immediate.",
    },
    {
        icon: "hub",
        title: "Superapp Rail",
        description: "Chat, swap, and transfer actions sit in one encrypted wallet-to-wallet command surface.",
    },
];

export default function FeaturesSection() {
    return (
        <div className="space-y-16">
            <div className="fade-in-up stagger-2 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
                <div className="md:col-span-6">
                    <div className="home-section-label">
                        <span className="material-symbols-outlined" aria-hidden="true">folder_open</span>
                        WHY_PIGEON.SYS
                    </div>
                    <h2 className="mt-6 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                        Private messaging becomes the wallet home base.
                    </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:text-right md:text-lg">
                    Pigeon removes server trust from conversation and expands the thread into token movement.
                </p>
            </div>

            <div className="fade-in-up stagger-3 grid grid-cols-1 gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </div>
    );
}
