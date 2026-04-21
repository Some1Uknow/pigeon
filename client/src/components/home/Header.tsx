import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import pigeon from "../../assets/pigeon.png";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[rgba(119,117,117,0.16)] bg-[rgba(14,14,14,0.56)] px-6 shadow-2xl backdrop-blur-xl md:px-12">
      <a href="/" className="flex min-h-10 items-center gap-4" aria-label="Pigeon Protocol home">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(189,157,255,0.38)] bg-[var(--color-surface-low)] p-1.5">
          <img src={pigeon} alt="" className="h-full w-full object-contain holographic-pigeon" />
        </div>
        <h2 className="font-display text-xl font-black uppercase leading-tight text-[var(--color-primary)]">
          PIGEON_PROTOCOL
        </h2>
      </a>

      <div className="flex flex-1 justify-end gap-4 md:gap-8">
        <nav className="hidden items-center gap-8 font-display text-sm uppercase tracking-[0.03em] md:flex" aria-label="Primary navigation">
          <a
            className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            href="#features"
          >
            Terminal
          </a>
          <a
            className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            href="#privacy"
          >
            Nodes
          </a>
          <a
            className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            href="#tech"
          >
            Bridge
          </a>
          <a
            className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            href="https://github.com/some1uknow/pigeon"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </nav>
        <WalletMultiButton className="btn-primary flex h-11 min-w-[7.5rem] items-center justify-center overflow-hidden px-4 text-xs md:min-w-[9rem] md:px-5 md:text-sm">
          <span className="truncate">CONNECT_WALLET</span>
        </WalletMultiButton>
      </div>
    </header>
  );
}
