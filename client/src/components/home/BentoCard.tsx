interface BentoCardProps {
  title: string;
  description: string;
  icon?: string;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
}

export default function BentoCard({
  title,
  description,
  icon,
  size = "medium",
  children,
}: BentoCardProps) {
  const sizeClasses = {
    small: "md:col-span-1",
    medium: "md:col-span-1",
    large: "md:col-span-2",
  };

  return (
    <div
      className={`bento-card group flex flex-col gap-4 p-6 ${sizeClasses[size]}`}
    >
      {/* Content */}
      <div className="flex flex-col h-full">
        {icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-bright)]">
            <span className="material-symbols-outlined text-2xl text-[var(--color-secondary)]" aria-hidden="true">
              {icon}
            </span>
          </div>
        )}

        <div className="space-y-2 grow">
          <h3 className="font-display text-2xl font-bold uppercase leading-tight text-[var(--color-text)]">
            {title}
          </h3>
          <p className="border-l border-[rgba(119,117,117,0.28)] pl-4 text-sm leading-relaxed text-[var(--color-text-muted)]">
            {description}
          </p>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
