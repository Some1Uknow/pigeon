import ComparisonCard from "./ComparisonCard";

export default function ComparisonSection() {
    return (
        <div className="space-y-16 py-10 border-t border-[var(--color-term-dim)] border-dashed">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <h2 className="md:col-span-6 text-[var(--color-term-green)] text-3xl md:text-4xl font-display font-semibold tracking-widest uppercase">
                    COMPETITOR_ANALYSIS
                </h2>
                <p className="md:col-span-6 text-[var(--color-term-green)] opacity-80 text-base md:text-lg md:text-right font-body">
                    &gt; Benchmarking against centralized entities...
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
