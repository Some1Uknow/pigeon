import ComparisonCard from "./ComparisonCard";

export default function ComparisonSection() {
    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
                <div className="md:col-span-6">
                    <div className="home-section-label">
                        <span className="material-symbols-outlined" aria-hidden="true">compare_arrows</span>
                        COMPETITOR_ANALYSIS
                    </div>
                    <h2 className="mt-6 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                        The difference is where trust lives.
                    </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:text-right md:text-lg">
                    Centralized messengers can encrypt content and still own identity, routing, and product rails.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <ComparisonCard
                    title="WHATSAPP"
                    subtitle="Centralized_Entity"
                    icon="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    features={[
                        {
                            feature: "E2E_ENCRYPTION",
                            pigeon: true,
                            competitor: true,
                        },
                        {
                            feature: "DECENTRALIZED",
                            pigeon: true,
                            competitor: false,
                        },
                        {
                            feature: "NO_PHONE_REQ",
                            pigeon: true,
                            competitor: false,
                        },
                        {
                            feature: "OPEN_SOURCE",
                            pigeon: true,
                            competitor: "PARTIAL",
                        },
                        {
                            feature: "NO_AD_TRACKING",
                            pigeon: true,
                            competitor: false,
                        },
                        {
                            feature: "CENSORSHIP_RES",
                            pigeon: true,
                            competitor: false,
                        },
                    ]}
                />

                <ComparisonCard
                    title="TELEGRAM"
                    subtitle="Cloud_Entity"
                    icon="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                    features={[
                        {
                            feature: "E2E_ENCRYPTION",
                            pigeon: true,
                            competitor: "SECRET_CHATS_ONLY",
                        },
                        {
                            feature: "DECENTRALIZED",
                            pigeon: true,
                            competitor: false,
                        },
                        {
                            feature: "NO_PHONE_REQ",
                            pigeon: true,
                            competitor: false,
                        },
                        {
                            feature: "OPEN_SOURCE",
                            pigeon: true,
                            competitor: "CLIENT_ONLY",
                        },
                        {
                            feature: "NO_AD_TRACKING",
                            pigeon: true,
                            competitor: false,
                        },
                        {
                            feature: "CENSORSHIP_RES",
                            pigeon: true,
                            competitor: false,
                        },
                    ]}
                />
            </div>
        </div>
    );
}
