import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import FeaturesSection from "../components/home/FeaturesSection";
import BentoGridSection from "../components/home/BentoGridSection";
import ComparisonSection from "../components/home/ComparisonSection";
import SecuritySection from "../components/home/SecuritySection";
import StatsSection from "../components/home/StatsSection";
import CTASection from "../components/home/CTASection";
import TrustStrip from "../components/home/TrustStrip";
import { ScrollProgress } from "../components/magicui/scroll-progress";
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
      <div className="fixed inset-0 z-0 bg-grid opacity-75" />

      <Header />
      <ScrollProgress />

      <main className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <section className="home-page-section home-page-hero" id="top">
            <Hero />
          </section>
        </div>

        <TrustStrip />

        <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 md:px-10">
          <section className="home-page-section" id="signal">
            <StatsSection />
          </section>

          <section className="home-page-section" id="features">
            <FeaturesSection />
          </section>

          <section className="home-page-section" id="privacy">
            <BentoGridSection />
          </section>

          <section className="home-page-section" id="security">
            <SecuritySection />
          </section>

          <section className="home-page-section" id="comparison">
            <ComparisonSection />
          </section>

          <section className="home-page-section" id="cta">
            <CTASection />
          </section>
        </div>
      </main>
    </div>
  );
}
