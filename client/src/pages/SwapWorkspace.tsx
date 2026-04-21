import { useAppShellContext } from "./appShellContext";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function SwapWorkspace() {
  const { balance } = useAppShellContext();

  return (
    <main className="relative z-10 min-h-0 flex-1 overflow-y-auto bg-[rgba(14,14,14,0.58)]">
      <div className="flex justify-end px-4 pt-4 md:px-6 md:pt-6 lg:px-8 lg:pt-8">
        <div className="relative z-[10000]">
          <WalletMultiButton className="btn-primary flex h-11 min-w-[9rem] items-center justify-center px-4 text-xs" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pb-4 pt-4 md:px-6 md:pb-6 md:pt-4 lg:px-8 lg:pb-8 lg:pt-4">
        <section className="panel-surface rounded-xl p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-secondary)]">
                Swap
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                Swap tokens
              </h1>
            </div>
            <div className="rounded-md border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-low)] px-3 py-2 font-label text-xs text-[var(--color-text-muted)]">
              Balance:{" "}
              <span className="text-[var(--color-secondary)]">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading"}
              </span>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-5 md:p-6" aria-labelledby="swap-form-title">
          <h2 id="swap-form-title" className="sr-only">
            Swap form
          </h2>

          <div className="space-y-3">
            <SwapAmountCard label="From" ticker="SOL" amount="0.00" helper="You pay" />

            <div className="flex justify-center py-1">
              <button
                type="button"
                disabled
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(119,117,117,0.2)] bg-[var(--color-surface-low)] text-[var(--color-text-muted)]"
                aria-label="Swap direction"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  swap_vert
                </span>
              </button>
            </div>

            <SwapAmountCard label="To" ticker="USDC" amount="0.00" helper="You receive" />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-low)] px-3 py-2 text-xs">
            <span className="font-label uppercase tracking-[0.08em] text-[var(--color-text-muted)]">Route</span>
            <span className="font-label text-[var(--color-text)]">SOL -&gt; USDC</span>
          </div>

          <button
            type="button"
            disabled
            className="mt-4 min-h-12 w-full rounded-md border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-high)] px-4 font-label text-sm uppercase text-[var(--color-text-muted)]"
          >
            Swap disabled
          </button>
        </section>
      </div>
    </main>
  );
}

function SwapAmountCard({ label, ticker, amount, helper }: { label: string; ticker: string; amount: string; helper: string }) {
  return (
    <label className="block rounded-lg border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-black)] p-4">
      <span className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{label}</span>
      <div className="mt-3 flex min-h-16 items-center gap-3">
        <input
          type="text"
          readOnly
          value={amount}
          className="min-w-0 flex-1 bg-transparent font-label text-4xl font-bold text-[var(--color-text)]"
        />
        <span className="rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-high)] px-3 py-2 font-label text-sm text-[var(--color-text)]">
          {ticker}
        </span>
      </div>
      <span className="mt-2 block text-xs text-[var(--color-text-muted)]">{helper}</span>
    </label>
  );
}
