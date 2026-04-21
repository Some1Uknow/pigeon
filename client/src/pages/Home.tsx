import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import FeaturesSection from "../components/home/FeaturesSection";
import BentoGridSection from "../components/home/BentoGridSection";
import ComparisonSection from "../components/home/ComparisonSection";
import TechStackSection from "../components/home/TechStackSection";
import SecuritySection from "../components/home/SecuritySection";
import StatsSection from "../components/home/StatsSection";
import CTASection from "../components/home/CTASection";
import "./Home.css";

export default function Home() {
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) navigate("/app/chats");
  }, [connected, navigate]);

  return (
    <div className="home-shell app-bg relative min-h-screen w-full overflow-x-hidden font-body text-[var(--color-text)]">
      <div className="fixed inset-0 z-0 bg-noise" />
      <div className="fixed inset-0 z-0 bg-grid" />

      <Header />

      <main className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-24 pt-28 md:px-12 lg:px-24">
        <section className="min-h-[620px] py-8">
          <Hero />
        </section>

        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-[rgba(119,117,117,0.16)] bg-[var(--color-surface)] py-4">
          <div className="flex whitespace-nowrap">
            <div className="animate-marquee flex items-center gap-12 font-label text-xs tracking-[0.2em] text-[var(--color-text-muted)]">
              <span>X25519 SECURE HANDSHAKE</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>CHACHA20-POLY1305</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>WALLET-TO-WALLET CHAT</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>SWAP PREVIEW</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>TRANSFER RAILS</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>NO CENTRAL SERVERS</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>X25519 SECURE HANDSHAKE</span>
              <span className="text-[var(--color-secondary)]">/</span>
              <span>CHACHA20-POLY1305</span>
            </div>
          </div>
        </section>

        <div className="space-y-28 py-24 md:space-y-36 md:py-32">
          <section>
            <StatsSection />
          </section>

          <section id="features">
            <FeaturesSection />
          </section>

          <section id="privacy">
            <BentoGridSection />
          </section>

          <section id="security">
            <SecuritySection />
          </section>

          <section id="comparison">
            <ComparisonSection />
          </section>
          
          <section id="tech">
            <TechStackSection />
          </section>

          <section id="cta">
            <CTASection />
          </section>
        </div>
      </main>
    </div>
  );
}
