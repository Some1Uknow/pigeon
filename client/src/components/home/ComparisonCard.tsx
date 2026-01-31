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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12">
          {icon.startsWith('http') ? (
            <img src={icon} alt={title} className="w-10 h-10 object-contain logo-monochrome" />
          ) : (
            <span className="text-4xl text-[var(--color-term-green)]">{icon}</span>
          )}
        </div>
        <div>
          <h3 className="text-[var(--color-term-green)] text-2xl font-display font-semibold tracking-widest uppercase">
            {title}
          </h3>
          <p className="text-[var(--color-term-dim)] text-xs mt-1 uppercase">TYPE: {subtitle}</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-4 font-body">
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 pb-3 border-b border-[var(--color-term-dim)] border-dashed">
          <div className="text-[var(--color-term-dim)] text-xs font-semibold uppercase tracking-wider">
            FEATURE
          </div>
          <div className="text-center">
            <span className="text-[var(--color-term-green)] text-xs font-semibold uppercase tracking-wider">
              PIGEON
            </span>
          </div>
          <div className="text-center text-[var(--color-term-dim)] text-xs font-semibold uppercase tracking-wider">
            {title}
          </div>
        </div>

        {/* Table Rows */}
        {features.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 py-3 border-b border-[var(--color-term-dim)]/10 last:border-0"
          >
            <div className="text-[var(--color-term-green)] opacity-90 text-sm font-medium truncate">
              {item.feature}
            </div>
            <div className="flex justify-center">
              {item.pigeon ? (
                <span className="text-[var(--color-term-green)] text-xs">[ PASS ]</span>
              ) : (
                <span className="text-[var(--color-term-alert)] text-xs">[ FAIL ]</span>
              )}
            </div>
            <div className="flex justify-center text-center">
              {typeof item.competitor === "boolean" ? (
                item.competitor ? (
                  <span className="text-[var(--color-term-green)] text-xs">[ PASS ]</span>
                ) : (
                  <span className="text-[var(--color-term-alert)] text-xs">[ FAIL ]</span>
                )
              ) : (
                <span className="text-[var(--color-term-alert)] text-xs font-medium uppercase">
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
