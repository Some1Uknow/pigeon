
export default function StatsSection() {
    return (
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
                <div className="home-section-label">
                    <span className="material-symbols-outlined" aria-hidden="true">monitoring</span>
                    LIVE_METRICS
                </div>
                <h2 className="mt-6 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                    Superapp primitives, measured in trust removed.
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:col-span-8 md:grid-cols-3">
                <div className="glass-panel rounded-lg p-6">
                    <div className="stat-highlight mb-2 font-display text-5xl font-bold">
                        0
                    </div>
                    <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        SERVERS_TRUSTED
                    </p>
                </div>

                <div className="glass-panel rounded-lg p-6">
                    <div className="mb-2 font-display text-5xl font-bold text-[var(--color-primary)]">
                        100%
                    </div>
                    <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        PAYLOAD_ENCRYPTION
                    </p>
                </div>

                <div className="glass-panel rounded-lg p-6">
                    <div className="mb-2 flex items-center gap-3 font-label text-xl text-[var(--color-secondary)]">
                        <span className="status-dot" />
                        SYNCING
                    </div>
                    <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                        RECENT_BLOCKS
                    </p>
                </div>
            </div>
        </div>
    );
}
