interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-start w-12 h-12">
        <span className="material-symbols-outlined text-[var(--color-term-green)] text-4xl">{icon}</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="text-[var(--color-term-green)] text-xl font-display font-semibold leading-tight tracking-widest uppercase">
          &gt; {title}
        </h3>
        <p className="text-[var(--color-term-green)] opacity-80 text-sm font-body leading-relaxed pl-4 border-l border-[var(--color-term-dim)]">
          {description}
        </p>
      </div>
    </div>
  );
}
