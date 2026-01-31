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
      className={`group flex flex-col gap-4 p-4 ${sizeClasses[size]}`}
    >
      {/* Content */}
      <div className="flex flex-col h-full">
        {icon && (
          <div className="mb-4">
            <span className="material-symbols-outlined text-[var(--color-term-green)] text-3xl">
              {icon}
            </span>
          </div>
        )}

        <div className="space-y-2 grow">
          <h3 className="text-[var(--color-term-green)] text-2xl font-display font-semibold leading-tight tracking-widest uppercase">
            {title}
          </h3>
          <p className="text-[var(--color-term-green)] opacity-80 text-sm leading-relaxed font-body border-l border-[var(--color-term-dim)] pl-4">
            {description}
          </p>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}
