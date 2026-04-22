export default function SecuritySection() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="home-section-label">
            <span className="material-symbols-outlined" aria-hidden="true">
              shield_locked
            </span>
            Security
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-5xl">
            Clear cryptography. Clear approvals.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:pl-12 md:text-right md:text-lg">
          Strong defaults protect messages and actions.
        </p>
      </div>

      <div className="card-surface p-8 md:p-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-[var(--color-text)]">
              Messaging
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
                X25519 + HKDF build secure shared keys.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
                ChaCha20-Poly1305 protects each message.
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-[var(--color-text)]">
              Actions
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                Wallet signatures approve swaps and transfers.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                No password account layer is required.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
