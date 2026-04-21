import { useSearchParams } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { truncateAddress, getNetworkLabel } from "../utils/format";
import { useAppShellContext } from "./appShellContext";

export default function TransferWorkspace() {
  const [searchParams] = useSearchParams();
  const { chat, connection, balance } = useAppShellContext();
  const recipient = searchParams.get("to") || chat.activeChat?.receiver || "";
  const endpoint = (connection as { rpcEndpoint?: string }).rpcEndpoint ?? "";
  const hasRecipient = recipient.length > 0;

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
                Transfer
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold uppercase text-[var(--color-text)] md:text-4xl">
                Send tokens
              </h1>
            </div>
            <div className="rounded-md border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-low)] px-3 py-2 font-label text-xs text-[var(--color-text-muted)]">
              Network: <span className="text-[var(--color-secondary)]">{getNetworkLabel(endpoint)}</span>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-xl p-5 md:p-6" aria-labelledby="transfer-form-title">
          <h2 id="transfer-form-title" className="sr-only">
            Transfer form
          </h2>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                Recipient
              </span>
              <input
                type="text"
                readOnly
                value={recipient}
                placeholder="Select a chat or paste wallet address"
                className="h-12 w-full rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] px-4 font-label text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_140px]">
              <label className="block">
                <span className="mb-2 block font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  Amount
                </span>
                <input
                  type="text"
                  readOnly
                  value="0.00"
                  className="h-14 w-full rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] px-4 font-label text-2xl font-bold text-[var(--color-text)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  Asset
                </span>
                <input
                  type="text"
                  readOnly
                  value="SOL"
                  className="h-14 w-full rounded-md border border-[rgba(119,117,117,0.22)] bg-[var(--color-surface-black)] px-4 font-label text-sm text-[var(--color-text)]"
                />
              </label>
            </div>

            <div className="rounded-md border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-low)] px-3 py-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-label uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  Balance
                </span>
                <span className="font-label text-[var(--color-text)]">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading"}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-label uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  Recipient
                </span>
                <span className="font-label text-[var(--color-text)]">
                  {hasRecipient ? truncateAddress(recipient) : "Not selected"}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="min-h-12 w-full rounded-md border border-[rgba(119,117,117,0.18)] bg-[var(--color-surface-high)] px-4 font-label text-sm uppercase text-[var(--color-text-muted)]"
            >
              Transfer disabled
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
