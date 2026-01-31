import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import pigeon from "../../assets/pigeon.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap py-6 border-b border-[var(--color-term-dim)] bg-[var(--color-term-bg)] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 border border-[var(--color-term-green)] p-1">
          <img src={pigeon} alt="Pigeon" className="w-full h-full object-contain holographic-pigeon" />
        </div>
        <h2 className="text-[var(--color-term-green)] text-xl font-display font-semibold leading-tight tracking-widest uppercase">
          PIGEON_PROTOCOL
        </h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9 font-body text-sm">
          <a
            className="text-[var(--color-term-dim)] hover:text-[var(--color-term-green)] hover:underline decoration-1 underline-offset-4"
            href="#features"
          >
            ./features
          </a>
          <a
            className="text-[var(--color-term-dim)] hover:text-[var(--color-term-green)] hover:underline decoration-1 underline-offset-4"
            href="#comparison"
          >
            ./roadmap
          </a>
          <a
            className="text-[var(--color-term-dim)] hover:text-[var(--color-term-green)] hover:underline decoration-1 underline-offset-4"
            href="#tech"
          >
            ./docs
          </a>
          <a
            className="text-[var(--color-term-dim)] hover:text-[var(--color-term-green)] transition-none"
            href="https://github.com/some1uknow/pigeon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <span className="font-display">[ GITHUB ]</span>
          </a>
        </div>
        <WalletMultiButton className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden h-10 px-5 text-sm font-display leading-normal tracking-widest uppercase btn-primary rounded-none">
          <span className="truncate">CONNECT_WALLET</span>
        </WalletMultiButton>
      </div>
    </header>
  );
}
