import { useEffect } from "react";
import pigeon from "../assets/pigeon.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) navigate("/chats");
  }, [connected, navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-display bg-[#0A0A1A] text-[#E0E0E0]">
      <style>{`
        .glow-effect {
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3), 0 0 20px rgba(157, 0, 255, 0.3), 0 0 30px rgba(255, 0, 255, 0.2);
        }
        .glow-effect:hover {
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(157, 0, 255, 0.5), 0 0 45px rgba(255, 0, 255, 0.4);
        }
        .glassmorphism-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .bg-gradient-animate {
            background-size: 200% 200%;
            animation: gradient-animation 15s ease infinite;
        }
        @keyframes gradient-animation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .holographic-pigeon {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.7)) drop-shadow(0 0 35px rgba(157, 0, 255, 0.5));
            transition: transform 0.3s ease-out;
        }
        .holographic-pigeon:hover {
            transform: scale(1.05) rotateY(10deg);
        }
        .subtle-grid {
            background-image:
                linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(157, 0, 255, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        .radial-glow {
            background-image: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0, 255, 255, 0.15), transparent 70%),
                              radial-gradient(ellipse 40% 60% at 30% 70%, rgba(157, 0, 255, 0.15), transparent 70%),
                              radial-gradient(ellipse 40% 60% at 70% 30%, rgba(255, 0, 255, 0.1), transparent 70%);
        }
      `}</style>

      <div className="absolute inset-0 z-0 radial-glow"></div>
      <div className="absolute inset-0 z-0 subtle-grid"></div>

  <div className="relative z-10 flex h-full grow flex-col">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between whitespace-nowrap py-6 border-b border-solid border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10">
                <img src={pigeon} alt="Pigeon" className="w-10 h-10 object-contain" />
              </div>
              <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Pigeon Protocol</h2>
            </div>

            <div className="hidden md:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <a className="text-sm font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="#">Features</a>
                <a className="text-sm font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="#">Roadmap</a>
                <a className="text-sm font-medium leading-normal text-gray-300 hover:text-white transition-colors" href="#">Docs</a>
              </div>
              <WalletMultiButton className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00FF] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 glow-effect bg-gradient-animate">
                <span className="truncate">Launch App</span>
              </WalletMultiButton>
            </div>
          </header>

          <main className="py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col gap-6 text-center lg:text-left">
                <h1 className="text-white text-5xl md:text-6xl font-black leading-tight tracking-tighter">
                  The Future of Private Messaging is Here.
                </h1>
                <h2 className="text-gray-300 text-lg md:text-xl font-normal leading-normal max-w-lg mx-auto lg:mx-0">
                  Experience truly secure, serverless chat powered by the speed of the Solana blockchain.
                </h2>
                <div className="flex-wrap gap-4 flex justify-center lg:justify-start mt-4">
                  <WalletMultiButton className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF00FF] text-white text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 glow-effect bg-gradient-animate">
                    <span className="truncate">Launch App</span>
                  </WalletMultiButton>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/10 hover:bg-white/20 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors">
                    <span className="truncate">Read the Whitepaper</span>
                  </button>
                  {/* Wallet button is now the Launch App CTA above */}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <img className="holographic-pigeon max-w-xs md:max-w-sm lg:max-w-md" data-alt="A 3D holographic wireframe pigeon logo, glowing with blue and purple neon light" src={pigeon} alt="Holographic pigeon" />
              </div>
            </div>

            <div className="mt-24 md:mt-32">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-4 p-6 rounded-xl glassmorphism-card">
                  <span className="material-symbols-outlined text-[#00FFFF] text-3xl">lock</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-lg font-bold leading-tight">Decentralized &amp; Secure</h2>
                    <p className="text-gray-400 text-sm font-normal leading-normal">End-to-end encrypted messaging with no central servers. Your data is your own.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-6 rounded-xl glassmorphism-card">
                  <span className="material-symbols-outlined text-[#00FFFF] text-3xl">bolt</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-lg font-bold leading-tight">Lightning Fast</h2>
                    <p className="text-gray-400 text-sm font-normal leading-normal">Leveraging the high-speed Solana network for instant message delivery.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-6 rounded-xl glassmorphism-card">
                  <span className="material-symbols-outlined text-[#00FFFF] text-3xl">groups</span>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-white text-lg font-bold leading-tight">Community Owned</h2>
                    <p className="text-gray-400 text-sm font-normal leading-normal">A protocol governed by its users, ensuring a censorship-resistant platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* background and fonts applied on the root container; removed stray div */}
    </div>
  );
}
