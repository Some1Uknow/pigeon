import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import FeatureCard from "../components/home/FeatureCard";
import BentoCard from "../components/home/BentoCard";
import ComparisonCard from "../components/home/ComparisonCard";
import "./Home.css";

const features = [
  {
    icon: "lock",
    title: "Decentralized & Secure",
    description: "End-to-end encrypted messaging with no central servers. Your data is your own.",
    gradient: "bg-linear-to-br from-violet-600/10 to-purple-600/10",
  },
  {
    icon: "bolt",
    title: "Lightning Fast",
    description: "Leveraging the high-speed Solana network for instant message delivery.",
    gradient: "bg-linear-to-br from-blue-600/10 to-indigo-600/10",
  },
  {
    icon: "groups",
    title: "Community Owned",
    description: "A protocol governed by its users, ensuring a censorship-resistant platform.",
    gradient: "bg-linear-to-br from-purple-600/10 to-pink-600/10",
  },
];

const bentoFeatures = [
  {
    title: "Wallet-Native Identity",
    description: "No phone numbers, no email addresses. Your Solana wallet is your identity. Privacy from the start.",
    icon: "account_balance_wallet",
    gradient: "bg-linear-to-br from-violet-600/20 to-purple-600/20",
    size: "large" as const,
  },
  {
    title: "Real-time Sync",
    description: "WebSocket subscriptions ensure your messages arrive instantly without polling.",
    icon: "sync",
    gradient: "bg-linear-to-br from-blue-600/20 to-cyan-600/20",
    size: "small" as const,
  },
  {
    title: "Zero Metadata",
    description: "Only encrypted payloads touch the chain. No tracking, no profiling.",
    icon: "shield",
    gradient: "bg-linear-to-br from-indigo-600/20 to-violet-600/20",
    size: "small" as const,
  },
  {
    title: "Open Source",
    description: "Every line of code is public. Audit it yourself or trust the community review.",
    icon: "code",
    gradient: "bg-linear-to-br from-purple-600/20 to-pink-600/20",
    size: "small" as const,
  },
  {
    title: "ChaCha20-Poly1305",
    description: "Military-grade AEAD encryption using auditable Noble crypto libraries.",
    icon: "encrypted",
    gradient: "bg-linear-to-br from-pink-600/20 to-rose-600/20",
    size: "large" as const,
  },
];

const techStack = [
  { 
    name: "Solana", 
    logo: "https://images.seeklogo.com/logo-png/42/2/solana-sol-logo-png_seeklogo-423095.png"
  },
  { 
    name: "Anchor", 
    logo: "https://camo.githubusercontent.com/590ccfb4e70a27673047ee879ed409981c05b2da403e60b4aaa7961ccdb46001/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f46565556614f3958454141756c764b3f666f726d61743d706e67266e616d653d736d616c6c"
  },
  { 
    name: "React", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  { 
    name: "TypeScript", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
  },
  { 
    name: "Vite", 
    logo: "https://vitejs.dev/logo.svg"
  },
  { 
    name: "Tailwind", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
  },
  { 
    name: "WebSocket", 
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg"
  },
];

export default function Home() {
  const { connected } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) navigate("/chats");
  }, [connected, navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-display bg-[#0A0A1A] text-[#E0E0E0]">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 radial-glow" />
      <div className="absolute inset-0 z-0 subtle-grid" />

      {/* Main content */}
      <div className="relative z-10 flex h-full grow flex-col">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Header />

          <main className="py-16 md:py-24 space-y-32">
            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <div className="space-y-12">
              <div className="text-center space-y-4 fade-in-up stagger-2">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.02em]">
                  Why Choose Pigeon?
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                  Built on cutting-edge technology to ensure your conversations stay private and fast.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up stagger-3">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>

            {/* Bento Grid - Deep Dive Features */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.02em]">
                  Privacy-First Architecture
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                  Every design decision prioritizes your privacy and security.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bentoFeatures.map((feature, index) => (
                  <BentoCard key={index} {...feature} />
                ))}
              </div>
            </div>

            {/* Comparison Section */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.02em]">
                  How Pigeon Compares
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                  See how we stack up against traditional messaging platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ComparisonCard
                  title="WhatsApp"
                  subtitle="Centralized messenger by Meta"
                  icon="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  gradient="bg-linear-to-br from-green-600/20 to-emerald-600/20"
                  features={[
                    {
                      feature: "E2E Encryption",
                      pigeon: true,
                      competitor: true,
                    },
                    {
                      feature: "Decentralized",
                      pigeon: true,
                      competitor: false,
                    },
                    {
                      feature: "No Metadata Collection",
                      pigeon: true,
                      competitor: false,
                    },
                    {
                      feature: "Open Source",
                      pigeon: true,
                      competitor: "Partial",
                    },
                    {
                      feature: "No Phone Number",
                      pigeon: true,
                      competitor: false,
                    },
                    {
                      feature: "Censorship Resistant",
                      pigeon: true,
                      competitor: false,
                    },
                  ]}
                />

                <ComparisonCard
                  title="Telegram"
                  subtitle="Cloud-based messenger"
                  icon="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
                  gradient="bg-linear-to-br from-blue-600/20 to-sky-600/20"
                  features={[
                    {
                      feature: "E2E Encryption",
                      pigeon: true,
                      competitor: "Secret Chats Only",
                    },
                    {
                      feature: "Decentralized",
                      pigeon: true,
                      competitor: false,
                    },
                    {
                      feature: "No Metadata Collection",
                      pigeon: true,
                      competitor: false,
                    },
                    {
                      feature: "Open Source",
                      pigeon: true,
                      competitor: "Client Only",
                    },
                    {
                      feature: "No Phone Number",
                      pigeon: true,
                      competitor: false,
                    },
                    {
                      feature: "Censorship Resistant",
                      pigeon: true,
                      competitor: false,
                    },
                  ]}
                />
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.02em]">
                  Built With Modern Tech
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                  Leveraging the best tools and libraries to deliver a secure, fast experience.
                </p>
              </div>

              <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 md:gap-4 overflow-x-auto">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="tech-badge px-5 py-3 rounded-xl flex items-center gap-3 whitespace-nowrap"
                  >
                    <img 
                      src={tech.logo} 
                      alt={tech.name}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-white font-semibold text-sm tracking-[-0.01em]">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Details */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.02em]">
                  Cryptographic Security
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                  Your messages are protected by battle-tested encryption algorithms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 bg-white/2">
                  <div className="absolute inset-0 bg-linear-to-br from-violet-600/10 to-purple-600/10" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-violet-400 text-2xl">
                          vpn_key
                        </span>
                      </div>
                      <h3 className="text-white text-xl font-bold">Key Exchange</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm leading-relaxed">
                        <strong className="text-white">X25519 (Curve25519)</strong> elliptic curve Diffie-Hellman for secure key agreement
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        <strong className="text-white">HKDF</strong> key derivation function to generate encryption keys
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 bg-white/2">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-indigo-600/10" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-400 text-2xl">
                          enhanced_encryption
                        </span>
                      </div>
                      <h3 className="text-white text-xl font-bold">Encryption</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm leading-relaxed">
                        <strong className="text-white">ChaCha20-Poly1305</strong> AEAD cipher for fast, authenticated encryption
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        <strong className="text-white">Noble Crypto</strong> libraries - lightweight, auditable, zero dependencies
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-[-0.02em]">
                  The Numbers Speak
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 bg-white/2 text-center stat-highlight">
                  <div className="absolute inset-0 bg-linear-to-br from-violet-600/10 to-purple-600/10" />
                  <div className="relative z-10 space-y-2">
                    <div className="text-5xl font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      0
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                      Servers Required
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 bg-white/2 text-center stat-highlight">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-indigo-600/10" />
                  <div className="relative z-10 space-y-2">
                    <div className="text-5xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      100%
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                      Open Source
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 bg-white/2 text-center stat-highlight">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-600/10 to-pink-600/10" />
                  <div className="relative z-10 space-y-2">
                    <div className="text-5xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ∞
                    </div>
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                      Privacy Guaranteed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-linear-to-br from-violet-600/20 via-purple-600/20 to-indigo-600/20" />
              <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                <h2 className="text-white text-4xl md:text-5xl font-bold tracking-[-0.02em]">
                  Ready to Take Back Your Privacy?
                </h2>
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                  Join the decentralized messaging revolution. No servers, no surveillance, no compromises.
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <WalletMultiButton className="flex min-w-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-linear-to-r from-violet-600 to-indigo-600 text-white text-base font-semibold leading-normal tracking-[-0.015em] transition-all duration-300 glow-effect bg-gradient-animate">
                    <span className="truncate">Get Started Now</span>
                  </WalletMultiButton>
                  <a
                    href="https://github.com/some1uknow/pigeon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-40 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-14 px-8 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-semibold leading-normal tracking-[-0.015em] transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="truncate">View on GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
