import { BentoCard, BentoGrid } from "../magicui/bento-grid";

const privacyCards = [
  {
    title: "Wallet identity",
    description: "Use one wallet identity across the whole product.",
    icon: "account_balance_wallet",
    className: "md:col-span-2",
    eyebrow: "Identity",
  },
  {
    title: "Local encryption",
    description: "Messages are encrypted before network delivery.",
    icon: "encrypted",
    className: "md:col-span-2",
    eyebrow: "Privacy",
  },
  {
    title: "One private flow",
    description: "Chat, swap, and transfer share the same trust model.",
    icon: "sync_alt",
    className: "md:col-span-2",
    eyebrow: "Flow",
  },
];

export default function BentoGridSection() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="home-section-label">
            <span className="material-symbols-outlined" aria-hidden="true">
              schema
            </span>
            Privacy model
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-5xl">
            Privacy is the foundation.
          </h2>
        </div>
        <p className="text-base leading-relaxed text-[var(--color-text-muted)] md:col-span-6 md:pl-12 md:text-right md:text-lg">
          One system powers every action.
        </p>
      </div>

      <BentoGrid>
        {privacyCards.map((card) => (
          <BentoCard
            key={card.title}
            title={card.title}
            description={card.description}
            className={card.className}
            eyebrow={card.eyebrow}
            icon={
              <span className="material-symbols-outlined text-xl" aria-hidden="true">
                {card.icon}
              </span>
            }
          />
        ))}
      </BentoGrid>
    </div>
  );
}
