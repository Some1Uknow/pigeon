import { Marquee } from "../magicui/marquee";

const trustSignals = [
  "Private chat",
  "Private swap",
  "Private transfer",
  "Wallet sign-in",
];

export default function TrustStrip() {
  return (
    <section className="relative border-y border-[rgba(119,117,117,0.14)] bg-[var(--color-surface)] py-4">
      <Marquee pauseOnHover className="[--duration:32s]">
        {trustSignals.map((signal) => (
          <div key={signal} className="flex items-center gap-6 px-2">
            <span className="font-label text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {signal}
            </span>
            <span className="text-[var(--color-secondary)]">•</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
