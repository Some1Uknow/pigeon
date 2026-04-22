import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export function TextReveal({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={cn(
        "text-pretty leading-relaxed text-[var(--color-text-muted)] transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
