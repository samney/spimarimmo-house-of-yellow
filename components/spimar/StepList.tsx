import { Inview } from "@/components/primitives/motion/Inview";

/* Offset step sequence — the foundation's method treatment.

   Each step reveals on its own `Inview`, so the sequence resolves as the reader
   scrolls rather than all at once. The asymmetric measure and the pulled-out
   index number are what make it read as a path instead of a list; the mobile
   regime collapses that composition rather than scaling it down.

   Content is caller-supplied. This component invents no step, label or claim. */
export type Step = { title: string; body: string };

export function StepList({ steps }: { steps: Step[] }) {
  if (steps.length === 0) return null;
  return (
    <div className="spimarSteps">
      {steps.map((step, index) => (
        <Inview key={step.title} as="div" className="spimarStep">
          <span className="spimarStep__number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="spimarStep__marker" aria-hidden="true" />
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </Inview>
      ))}
    </div>
  );
}
