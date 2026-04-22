import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import pigeon from "../../assets/pigeon.png";
import { TextReveal } from "../magicui/text-reveal";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="fade-in-up flex flex-col gap-8 lg:col-span-7">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 font-label text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-secondary)]">
            <span className="material-symbols-outlined text-base" aria-hidden="true">
              shield
            </span>
            Built on Solana
          </div>
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-[var(--color-text)] md:text-7xl">
            The Privacy Superapp
          </h1>
          <TextReveal className="max-w-2xl text-base md:text-lg">
            Private chat, swap, and transfer in one wallet-native app.
          </TextReveal>
        </div>

        <div className="flex flex-wrap gap-4">
          <WalletMultiButton className="btn-primary flex h-12 min-w-40 items-center justify-center overflow-hidden px-6 text-sm">
            <span className="truncate">Open app</span>
          </WalletMultiButton>
          <a
            href="https://github.com/some1uknow/pigeon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex h-12 min-w-40 items-center justify-center gap-2 px-6 text-sm"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              code
            </span>
            View code
          </a>
        </div>
      </div>

      <div className="fade-in-up stagger-1 relative lg:col-span-5">
        <img
          className="mx-auto w-full max-w-xs object-contain opacity-95 md:max-w-sm lg:mx-0 lg:ml-auto"
          src={pigeon}
          alt="Pigeon Protocol avatar"
        />
      </div>
    </div>
  );
}
