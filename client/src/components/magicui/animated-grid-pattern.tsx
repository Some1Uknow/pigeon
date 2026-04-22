import type { CSSProperties } from "react";
import { cn } from "../../utils/cn";

interface AnimatedGridPatternProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export function AnimatedGridPattern({
  className,
  size = 40,
  opacity = 0.1,
}: AnimatedGridPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("magic-grid-pattern", className)}
      style={
        {
          "--grid-size": `${size}px`,
          "--grid-opacity": opacity,
        } as CSSProperties
      }
    />
  );
}
