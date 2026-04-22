import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BorderBeam } from "../magicui/border-beam";

export default function CTASection() {
  return (
    <div className="band-surface p-8 md:p-12">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="relative z-10 grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        <div className="space-y-6 md:col-span-7">
          <div className="font-label text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-secondary)]">
            Ready
          </div>
          <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-5xl">
            Start in seconds.
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
            Open the app and move in one private flow.
          </p>
        </div>
        <div className="flex flex-col justify-start gap-4 sm:flex-row md:col-span-5 md:justify-end">
          <div className="relative overflow-hidden rounded-md">
            <WalletMultiButton className="btn-primary relative z-10 flex h-12 min-w-40 items-center justify-center overflow-hidden px-6 text-sm">
              <span className="truncate">Open app</span>
            </WalletMultiButton>
            <BorderBeam duration={8} />
          </div>
          <a
            href="https://github.com/some1uknow/pigeon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex h-12 min-w-40 items-center justify-center gap-2 overflow-hidden px-6 text-sm"
          >
            <span className="truncate">View code</span>
          </a>
        </div>
      </div>
    </div>
  );
}
