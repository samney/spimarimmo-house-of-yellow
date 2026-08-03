# 06 — CMS Data Contract

## Goal

The CMS should control content and approved media, not arbitrary layout geometry. The section must remain visually governed by the design system.

## Suggested model

```ts
type MethodPhaseId = "before" | "during" | "after";

type MethodDocument = {
  id: string;
  label: string;
  kind: "media" | "schedule" | "flow" | "report" | "checklist";
  asset?: MediaReference;
  accessibleSummary: string;
};

type MethodDeliverable = {
  id: string;
  title: string;
  status: string;
  preview?: MediaReference;
  caseStudySlug?: string;
};

type MethodPhase = {
  id: MethodPhaseId;
  number: "01" | "02" | "03";
  label: string;
  title: string;
  description: string;
  mechanisms: string[];
  documents: MethodDocument[];
  statuses: string[];
  deliverablesHeading: string;
  deliverables: MethodDeliverable[];
  annotation: string;
  contextualCta: {
    label: string;
    href: string;
  };
};

type MethodSection = {
  eyebrow: string;
  heading: string;
  description: string;
  globalCta: {
    label: string;
    href: string;
  };
  phases: MethodPhase[];
};
```

## CMS validation

- Exactly three phases.
- Phase IDs are fixed.
- Phase numbers are fixed.
- Deliverable count is constrained to the supported composition.
- Status values come from an approved list.
- Media requires alt text or an accessible summary.
- Links require valid destinations.
- Empty optional media uses an approved poster/fallback.
- Do not publish invented numbers as placeholders.

## Layout controls excluded from CMS

Do not expose:

- arbitrary colors;
- arbitrary positioning;
- stage radius;
- phase rail direction;
- animation duration;
- freeform HTML;
- card count beyond supported limits;
- custom per-phase grid definitions.

## CRM boundary

This section is primarily explanatory. If a CTA opens a brochure request, proposal request, meeting request or exhibitor enquiry, the destination flow must preserve the project's transactional form requirements: consent, durable submission, deduplication, attribution, CRM sync, assignment and recovery.

Do not implement a visual-only form inside this section.

