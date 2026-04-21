interface ComparisonFeature {
  feature: string;
  pigeon: boolean;
  competitor: boolean | string;
}

interface ComparisonCardProps {
  title: string;
  subtitle: string;
  icon: string;
  features: ComparisonFeature[];
}

export default function ComparisonCard({
  title,
  subtitle,
  icon,
  features,
}: ComparisonCardProps) {
  return (
    <div className="card-surface flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-surface-bright)]">
          {icon.startsWith('http') ? (
            <img src={icon} alt={title} className="w-10 h-10 object-contain logo-monochrome" />
          ) : (
            <span className="text-4xl text-[var(--color-primary)]">{icon}</span>
          )}
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold uppercase text-[var(--color-text)]">
            {title}
          </h3>
          <p className="mt-1 font-label text-xs uppercase tracking-[0.08em] text-[var(--color-text-muted)]">TYPE: {subtitle}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-4 font-label">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 border-b border-[rgba(119,117,117,0.24)] pb-3">
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            FEATURE
          </div>
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-secondary)]">
              PIGEON
            </span>
          </div>
          <div className="text-center text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            {title}
          </div>
        </div>

        {/* Table Rows */}
        {features.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 border-b border-[rgba(119,117,117,0.12)] py-3 last:border-0"
          >
            <div className="truncate text-sm font-medium text-[var(--color-text-soft)]">
              {item.feature}
            </div>
            <div className="flex justify-center">
              {item.pigeon ? (
                <span className="text-xs text-[var(--color-success)]">[ PASS ]</span>
              ) : (
                <span className="text-xs text-[var(--color-error)]">[ FAIL ]</span>
              )}
            </div>
            <div className="flex justify-center text-center">
              {typeof item.competitor === "boolean" ? (
                item.competitor ? (
                  <span className="text-xs text-[var(--color-success)]">[ PASS ]</span>
                ) : (
                  <span className="text-xs text-[var(--color-error)]">[ FAIL ]</span>
                )
              ) : (
                <span className="text-xs font-medium uppercase text-[var(--color-warning)]">
                  [{item.competitor}]
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
