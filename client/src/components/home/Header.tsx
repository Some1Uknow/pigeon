import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import pigeon from "../../assets/pigeon.png";

export default function Header() {
  return (
    <header className="fixed inset-x-4 top-4 z-50 mx-auto max-w-[1280px] rounded-xl border border-[rgba(119,117,117,0.18)] bg-[rgba(14,14,14,0.78)] shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-4 md:px-6">
        <a href="/" className="flex min-h-10 items-center gap-3" aria-label="Pigeon Protocol home">
          <div className="flex h-9 w-9 items-center justify-center p-1.5">
            <img src={pigeon} alt="" className="h-full w-full object-contain" />
          </div>
          <h2 className="font-display text-lg font-bold tracking-[-0.01em] text-[var(--color-text)] md:text-xl">
            Pigeon Superapp
          </h2>
        </a>

        <div className="flex flex-1 justify-end gap-4 md:gap-8">
          <nav className="hidden items-center gap-7 font-label text-[0.7rem] uppercase tracking-[0.12em] md:flex" aria-label="Primary navigation">
            <a
              className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              href="#features"
            >
              Product
            </a>
            <a
              className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              href="#privacy"
            >
              Privacy
            </a>
            <a
              className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              href="#security"
            >
              Security
            </a>
            <a
              className="min-h-10 content-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              href="#comparison"
            >
              Compare
            </a>
          </nav>
          <WalletMultiButton className="btn-primary flex h-12 min-w-40 items-center justify-center overflow-hidden px-6 text-sm">
            <span className="truncate">Open app</span>
          </WalletMultiButton>
        </div>
      </div>
    </header>
  );
}
