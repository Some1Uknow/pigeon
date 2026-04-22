import { TextReveal } from "../magicui/text-reveal";

const workflowSteps = [
  {
    title: "Connect your wallet",
    description: "Sign in once and keep the same identity everywhere.",
  },
  {
    title: "Start a private chat",
    description: "Messages are encrypted before they leave your device.",
  },
  {
    title: "Swap or transfer",
    description: "Move from message to action without leaving the app.",
  },
];

export default function FeaturesSection() {
  return (
    <div className="space-y-14">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
        <div className="space-y-5 md:col-span-5">
          <div className="home-section-label">
            <span className="material-symbols-outlined" aria-hidden="true">
              route
            </span>
            How it works
          </div>
          <h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-5xl">
            Simple flow. No context switching.
          </h2>
          <TextReveal className="max-w-lg text-base md:text-lg">
            The app is built for one path: connect, talk, and act.
          </TextReveal>
        </div>

        <ol className="space-y-4 md:col-span-7">
          {workflowSteps.map((step, index) => (
            <li key={step.title} className="card-surface grid grid-cols-[auto_1fr] gap-5 p-6">
              <div className="font-label text-[0.68rem] uppercase tracking-[0.14em] text-[var(--color-secondary)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold tracking-[-0.01em] text-[var(--color-text)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
