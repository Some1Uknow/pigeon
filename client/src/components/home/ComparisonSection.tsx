const comparisonRows = [
  ["Private chat", "Yes", "Partial"],
  ["Native swap", "Yes", "No"],
  ["Native transfer", "Yes", "No"],
  ["Wallet sign-in", "Yes", "No"],
];

export default function ComparisonSection() {
  return (
    <div className="space-y-14">
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="home-section-label">
            <span className="material-symbols-outlined" aria-hidden="true">
              compare_arrows
            </span>
            Comparison
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-5xl">
            One private app, not many disconnected tools.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:pl-12 md:text-right md:text-lg">
          Pigeon keeps communication and action in one place.
        </p>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="grid grid-cols-3 border-b border-[rgba(119,117,117,0.2)] bg-[rgba(255,255,255,0.02)] px-6 py-4 font-label text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          <span>Capability</span>
          <span className="text-center text-[var(--color-secondary)]">Pigeon</span>
          <span className="text-center">Typical chat app</span>
        </div>

        {comparisonRows.map((row) => (
          <div
            key={row[0]}
            className="grid grid-cols-3 items-center border-b border-[rgba(119,117,117,0.12)] px-6 py-4 text-sm text-[var(--color-text-soft)] last:border-b-0"
          >
            <span>{row[0]}</span>
            <span className="text-center font-label text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-success)]">
              {row[1]}
            </span>
            <span className="text-center font-label text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {row[2]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
