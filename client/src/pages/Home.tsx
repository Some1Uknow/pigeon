import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import pigeon from "../assets/pigeon.png";

export default function Home() {
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) navigate("/chats");
  }, [connected]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-[#0a0a0a] via-[#111111] to-[#1a1a1a]">
      <img src={pigeon} alt="Pigeon Logo" className="w-20 h-20 mb-6 opacity-90" />
      <h1 className="text-5xl font-bold mb-3 tracking-tight">
        Pigeon<span className="text-blue-500">.</span>
      </h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">
        A minimal decentralized chat built on <span className="text-blue-400">Solana</span>.  
        Talk. Connect. Stay uncensored.
      </p>

      <WalletMultiButton />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300 max-w-3xl">
        <div className="p-4 rounded-xl bg-[#141414]/70 backdrop-blur-md border border-white/5 hover:border-blue-500/40 transition">
          🪶 <b>Fully On-chain</b> — Messages live forever.
        </div>
        <div className="p-4 rounded-xl bg-[#141414]/70 backdrop-blur-md border border-white/5 hover:border-blue-500/40 transition">
          💬 <b>Anonymous</b> — No login, no data collection.
        </div>
        <div className="p-4 rounded-xl bg-[#141414]/70 backdrop-blur-md border border-white/5 hover:border-blue-500/40 transition">
          ⚡ <b>Fast & Minimal</b> — Built for modern Web3 users.
        </div>
      </div>
    </div>
  );
}
