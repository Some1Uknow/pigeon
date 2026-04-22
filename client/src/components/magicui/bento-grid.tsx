import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

export function BentoGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-6 md:grid-cols-6", className)}
      {...props}
    />
  );
}

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: ReactNode;
  eyebrow?: string;
}

export function BentoCard({
  title,
  description,
  icon,
  eyebrow,
  className,
  children,
  ...props
}: BentoCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border border-[rgba(119,117,117,0.18)] bg-[rgba(22,22,22,0.82)] p-6",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex h-full flex-col gap-5">
        {eyebrow && (
          <div className="font-label text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            {eyebrow}
          </div>
        )}
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[rgba(119,117,117,0.24)] bg-[var(--color-surface-low)] text-[var(--color-primary)]">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="font-display text-2xl font-bold leading-tight text-[var(--color-text)]">{title}</h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
        </div>
        {children && <div className="mt-auto">{children}</div>}
      </div>
    </article>
  );
}
