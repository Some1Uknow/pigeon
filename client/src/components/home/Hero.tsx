import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import pigeon from "../../assets/pigeon.png";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
      <div className="flex flex-col gap-8 text-center lg:text-left fade-in-up">
        <div className="space-y-4">
          <h1 className="text-[var(--color-term-green)] text-5xl md:text-7xl font-display leading-[0.95] tracking-widest uppercase">
            <span className="mr-4 text-[var(--color-term-dim)]">&gt;</span>
            Private_MSG
            <br />
            --no-middlemen
          </h1>
          <p className="text-[var(--color-term-green)] opacity-80 text-base md:text-lg font-body leading-relaxed max-w-lg mx-auto lg:mx-0 border-l-2 border-[var(--color-term-dim)] pl-4">
            <span className="text-[var(--color-term-dim)]">//</span> Connect wallet. 
            <br/>
            <span className="text-[var(--color-term-dim)]">//</span> Chat encrypted. 
            <br/>
            <span className="text-[var(--color-term-dim)]">//</span> No logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <WalletMultiButton className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden h-12 px-6 text-xl font-display leading-normal tracking-widest uppercase glow-effect btn-primary">
            <span className="truncate">[ INITIALIZE_LINK ]</span>
          </WalletMultiButton>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 opacity-80 border-t border-dashed border-[var(--color-term-dim)] w-fit mx-auto lg:mx-0 mt-4 px-4 pt-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="h-6 w-auto object-contain logo-monochrome"
            loading="lazy"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
            alt="Telegram"
            className="h-6 w-auto object-contain logo-monochrome"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex items-center justify-center fade-in-up stagger-1 relative">
        <img
          className="holographic-pigeon max-w-xs md:max-w-sm lg:max-w-md relative z-10"
          src={pigeon}
          alt="Pixelated pigeon"
        />
      </div>
    </div>
  );
}
