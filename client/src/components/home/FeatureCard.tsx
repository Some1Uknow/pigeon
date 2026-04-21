interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card-surface group flex h-full flex-col gap-6 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[rgba(119,117,117,0.28)] bg-[var(--color-surface-bright)] transition-colors group-hover:border-[rgba(189,157,255,0.5)]">
        <span className="material-symbols-outlined text-2xl text-[var(--color-primary)]" aria-hidden="true">{icon}</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-xl font-bold uppercase leading-tight text-[var(--color-text)]">
          {title}
        </h3>
        <p className="border-l border-[rgba(119,117,117,0.28)] pl-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
