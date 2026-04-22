const productCards = [
  {
    title: "Chat",
    description: "Encrypted wallet-to-wallet messages for private coordination.",
    icon: "chat_bubble",
  },
  {
    title: "Swap",
    description: "Move from conversation to token action without changing context.",
    icon: "swap_horiz",
  },
  {
    title: "Transfer",
    description: "Send value directly to the wallet already in your private thread.",
    icon: "send_money",
  },
];

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
      <div className="space-y-6 md:col-span-5">
        <div className="home-section-label">
          <span className="material-symbols-outlined" aria-hidden="true">
            monitoring
          </span>
          Product detail
        </div>
        <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-5xl">
          Private by default.
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
          Chat, swap, and transfer stay in one wallet-native flow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:col-span-7 md:grid-cols-3">
        {productCards.map((card) => (
          <article key={card.title} className="glass-panel rounded-lg p-6">
            <span className="material-symbols-outlined mb-5 text-3xl text-[var(--color-secondary)]" aria-hidden="true">
              {card.icon}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-[var(--color-text)]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
