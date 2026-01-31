
export default function SecuritySection() {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                <h2 className="md:col-span-6 text-white text-3xl md:text-4xl font-display font-semibold tracking-[0.08em] uppercase">
                    How Your Messages Stay Private
                </h2>
                <p className="md:col-span-6 text-white/70 text-base md:text-lg md:text-right">
                    We use proven cryptography so only you and the recipient can read messages.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative overflow-hidden rounded-3xl p-8 card-surface">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white/80 text-2xl">
                                    vpn_key
                                </span>
                            </div>
                            <h3 className="text-white text-xl font-display font-semibold tracking-[0.06em] uppercase">Shared Key</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-white/70 text-sm leading-relaxed">
                                <strong className="text-white">X25519</strong> creates a shared secret between two wallets
                            </p>
                            <p className="text-white/70 text-sm leading-relaxed">
                                <strong className="text-white">HKDF</strong> turns that secret into encryption keys
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl p-8 card-surface">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white/80 text-2xl">
                                    enhanced_encryption
                                </span>
                            </div>
                            <h3 className="text-white text-xl font-display font-semibold tracking-[0.06em] uppercase">Message Lock</h3>
                        </div>
                        <div className="space-y-3">
                            <p className="text-white/70 text-sm leading-relaxed">
                                <strong className="text-white">ChaCha20-Poly1305</strong> seals each message end-to-end
                            </p>
                            <p className="text-white/70 text-sm leading-relaxed">
                                <strong className="text-white">Noble Crypto</strong> libraries are lightweight and auditable
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
