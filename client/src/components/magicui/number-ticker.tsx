import { useEffect, useMemo, useState } from "react";
import { cn } from "../../utils/cn";

interface NumberTickerProps {
  value: number;
  startValue?: number;
  decimalPlaces?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberTicker({
  value,
  startValue = 0,
  decimalPlaces = 0,
  duration = 1200,
  prefix = "",
  suffix = "",
  className,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(startValue);

  useEffect(() => {
    let animationFrame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (value - startValue) * easedProgress;

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, startValue, value]);

  const formatted = useMemo(
    () =>
      displayValue.toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [decimalPlaces, displayValue],
  );

  return (
    <span className={cn("tabular-nums tracking-tight", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
