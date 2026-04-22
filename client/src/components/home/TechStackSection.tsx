import solanaLogo from "../../assets/logos/solana.png";
import heliusLogo from "../../assets/logos/helius.png";

const infraStack = [
  {
    name: "Solana network",
    logo: solanaLogo,
  },
  {
    name: "Helius RPC",
    logo: heliusLogo,
  },
];

export default function TechStackSection() {
  return (
    <div className="space-y-14">
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="home-section-label">
            <span className="material-symbols-outlined" aria-hidden="true">
              dns
            </span>
            Infrastructure
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-4xl">
            Lean stack. Fast execution.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:pl-12 md:text-right md:text-lg">
          Built on Solana with Helius for reliable reads and writes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {infraStack.map((item) => (
          <div key={item.name} className="card-surface flex items-center justify-between gap-6 p-6">
            <div className="flex items-center gap-4">
              <img src={item.logo} alt={item.name} className="h-10 w-auto object-contain logo-monochrome" />
              <span className="font-display text-xl font-bold text-[var(--color-text)]">{item.name}</span>
            </div>
            <span className="font-label text-[0.68rem] uppercase tracking-[0.12em] text-[var(--color-secondary)]">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
