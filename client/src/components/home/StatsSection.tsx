
export default function StatsSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pt-10">
            <div className="md:col-span-4">
                <h2 className="text-[var(--color-term-green)] text-3xl md:text-4xl font-display font-semibold tracking-widest uppercase">
                    METRICS
                </h2>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                    <div className="text-6xl font-display font-semibold text-[var(--color-term-green)] mb-2">
                        0
                    </div>
                    <p className="text-[var(--color-term-dim)] text-sm font-body uppercase tracking-widest">
                        SERVERS_TRUSTED
                    </p>
                </div>

                <div className="text-center">
                    <div className="text-6xl font-display font-semibold text-[var(--color-term-green)] mb-2">
                        100%
                    </div>
                    <p className="text-[var(--color-term-dim)] text-sm font-body uppercase tracking-widest">
                        PAYLOAD_ENCRYPTION
                    </p>
                </div>

                <div className="text-center">
                    <div className="text-6xl font-display font-semibold text-[var(--color-term-green)] mb-2">
                        10
                    </div>
                    <p className="text-[var(--color-term-dim)] text-sm font-body uppercase tracking-widest">
                        RECENT_BLOCKS
                    </p>
                </div>
            </div>
        </div>
    );
}
