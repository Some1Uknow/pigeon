import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import pigeon from "../../assets/pigeon.png";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div className="fade-in-up flex flex-col gap-8 text-center lg:col-span-7 lg:text-left">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 font-label text-sm uppercase tracking-[0.12em] text-[var(--color-secondary)] lg:justify-start">
            <span className="material-symbols-outlined text-base" aria-hidden="true">terminal</span>
            &gt; Private_MSG --NO_MIDDLEMEN
          </div>
          <h1 className="text-gradient-chrome font-display text-5xl font-black uppercase leading-none md:text-7xl lg:text-8xl">
            PIGEON_
            <br />
            PROTOCOL
          </h1>
          <div className="mx-auto max-w-lg space-y-2 border-l-2 border-[rgba(119,117,117,0.32)] pl-4 text-left font-label text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base lg:mx-0">
            <p>// Connect wallet.</p>
            <p>// Chat encrypted.</p>
            <p>// Swap and transfer without leaving the thread.</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
          <WalletMultiButton className="btn-primary flex h-14 min-w-[11rem] items-center justify-center overflow-hidden px-7 text-sm">
            <span className="truncate">[ INITIALIZE_LINK ]</span>
          </WalletMultiButton>
          <a
            href="https://github.com/some1uknow/pigeon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex h-14 min-w-[9rem] items-center justify-center gap-2 px-7 text-sm"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">code</span>
            [ GITHUB ]
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
          <div className="glass-panel rounded-lg p-4">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">SERVERS_TRUSTED</span>
            <div className="font-display text-3xl font-bold text-[var(--color-secondary)]">0</div>
          </div>
          <div className="glass-panel rounded-lg p-4">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">PAYLOAD_ENCRYPTION</span>
            <div className="font-display text-3xl font-bold text-[var(--color-primary)]">100%</div>
          </div>
          <div className="glass-panel rounded-lg p-4">
            <span className="font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">SUPERAPP_STACK</span>
            <div className="mt-2 flex items-center gap-2 font-label text-sm text-[var(--color-secondary)]">
              <span className="status-dot" />
              CHAT / SWAP / PAY
            </div>
          </div>
        </div>
      </div>

      <div className="fade-in-up stagger-1 relative flex min-h-[360px] items-center justify-center lg:col-span-5">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(189,157,255,0.22),transparent_58%)] blur-2xl" />
        <div className="absolute bottom-10 h-20 w-72 rounded-full border border-[rgba(0,238,252,0.22)] bg-[rgba(0,238,252,0.06)] blur-sm" />
        <div className="glass-panel relative z-10 w-full max-w-xs rounded-xl p-6 md:max-w-sm md:p-8 lg:max-w-md">
          <img
            className="holographic-pigeon w-full object-contain opacity-95 mix-blend-lighten"
            src={pigeon}
            alt="Pigeon Protocol avatar"
          />
        </div>
      </div>
    </div>
  );
}
