
export default function SecuritySection() {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
                <div className="md:col-span-6">
                    <div className="home-section-label">
                        <span className="material-symbols-outlined" aria-hidden="true">shield_locked</span>
                        SECURITY_LAYER
                    </div>
                    <h2 className="mt-6 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                        How messages stay private.
                    </h2>
                </div>
                <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:text-right md:text-lg">
                    We use proven cryptography so only you and the recipient can read messages.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="card-surface relative overflow-hidden p-8">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-bright)]">
                                <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]" aria-hidden="true">
                                    vpn_key
                                </span>
                            </div>
                            <h3 className="font-display text-xl font-bold uppercase text-[var(--color-text)]">Shared Key</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                                <strong className="text-[var(--color-text)]">X25519</strong> creates a shared secret between two wallets
                            </p>
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                                <strong className="text-[var(--color-text)]">HKDF</strong> turns that secret into encryption keys
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card-surface relative overflow-hidden p-8">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-bright)]">
                                <span className="material-symbols-outlined text-2xl text-[var(--color-secondary)]" aria-hidden="true">
                                    enhanced_encryption
                                </span>
                            </div>
                            <h3 className="font-display text-xl font-bold uppercase text-[var(--color-text)]">Message Lock</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                                <strong className="text-[var(--color-text)]">ChaCha20-Poly1305</strong> seals each message end-to-end
                            </p>
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                                <strong className="text-[var(--color-text)]">Noble Crypto</strong> libraries are lightweight and auditable
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
