import type { CSSProperties } from "react";
import { cn } from "../../utils/cn";

interface BorderBeamProps {
  className?: string;
  duration?: number;
}

export function BorderBeam({ className, duration = 7 }: BorderBeamProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("magic-border-beam", className)}
      style={{ animationDuration: `${duration}s` } as CSSProperties}
    />
  );
}
