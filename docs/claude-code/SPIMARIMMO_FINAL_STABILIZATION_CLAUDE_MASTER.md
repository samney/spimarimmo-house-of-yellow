# SPIMARIMMO — FINAL DESIGN-SYSTEM RECOVERY, PRODUCT COMPLETION & DEPLOYMENT MASTER PLAN

**Document status:** Claude Code execution master  
**Prepared:** 2026-08-06  
**Repository:** `samney/spimarimmo-house-of-yellow`  
**Working checkout:** `C:\work\spimar`  
**Audited `main` baseline:** `d3e0f6ad00fe8e01d935ac31ccaf27c588004fd4`  
**Latest audited commit title:** `Section 07: finish the invitation card and the Apres canvas detail`  
**Deployment status at audit time:** Vercel reported `success` for the audited SHA.

---

## 0. How to use this document

This document is an **execution overlay** for the existing repository control plane.

It does **not** replace:

- `CLAUDE.md`
- `docs/claude-code/OPERATING-MODE.md`
- `docs/claude-code/DESIGN-CONTRACT.md`
- `docs/claude-code/ENGINEERING-CONTRACT.md`
- `docs/claude-code/ROUTES-PROGRAMME.md`
- `docs/claude-code/DECISIONS.md`
- `docs/claude-code/GATES.md`
- canonical SPIMAR specifications under `docs/spimar/`
- approved visual references under `docs/assets-UX-UI/`

Claude must use those documents as the existing architecture and governance system, then use this file as the **latest owner direction for finalization**.

Where this document conflicts with an older decision, this document is the latest explicit owner instruction. Record the superseding decision in `docs/claude-code/DECISIONS.md` in the same PR.

Do not restart the website.  
Do not replace the current system with a generic template.  
Do not refactor working code merely to make it look different.

---

# 1. Mission

Finalize SPIMARIMMO as a coherent, production-ready Next.js website.

The current implementation is substantial and generally clean, but it still contains:

- design-system drift;
- hard-coded visual values;
- section-specific private palettes;
- inconsistent typography and UI hierarchy;
- uneven animation quality;
- incomplete or generic route-page UX;
- weak conversion details on key exhibitor flows;
- missing media and unfinished UI states;
- inconsistent buttons, selects, cards and calls to action;
- deployment, form-durability and production-readiness risks.

The objective is to recover a single strong system across the entire website while preserving the strongest parts already implemented.

The result must be:

- visually coherent;
- faithful to the House of Yellow structural foundation;
- unmistakably SPIMARIMMO in identity and content;
- detailed rather than generic;
- responsive;
- accessible;
- secure;
- fast;
- maintainable;
- CMS-ready;
- deployable without emergency refactoring.

---

# 2. Audited current state

## 2.1 What is already strong

Do not redo these areas without evidence of a real defect:

- Next.js App Router architecture is established.
- FR and EN routing use `next-intl`.
- Server Components are the default architecture.
- Shared motion primitives already exist.
- GSAP, Lenis and project motion tokens are already present.
- A route audit and automated sweep already exist.
- The repository already has design and engineering contracts.
- A central lead action, `submitEnquiry`, already exists.
- Sitemap, robots handling and metadata infrastructure already exist.
- Current testing includes Vitest, Playwright and Axe.
- The latest audited commit reports passing TypeScript, ESLint, Prettier, tests and production build.
- Vercel reported a successful deployment for the audited `main` SHA.
- The existing route programme reports 21 audited routes and an established `PageHeader`.
- The common homepage section-heading skeleton is already measurably consistent.

This mission is therefore **system recovery and product completion**, not foundation recreation.

## 2.2 Confirmed design-system debt

The current design-system audit found:

- only about **16%** of L3 component tokens derive from L2 semantic tokens;
- about **67%** of L3 color properties hard-code colors;
- the original audit found **112 loose hex usages** outside `app/globals.css`;
- after shell cleanup, the tracked baseline was reduced to **102**;
- the largest remaining clusters are in:
  - `why-exhibit.css`;
  - `method.css`;
  - `visibility.css`;
- several sections use different near-identical paper, ink and gold values;
- changing the main gold token currently does not reliably re-skin the product.

The existing ratchet must not merely stop the number from increasing. This finalization phase must work the debt downward toward zero or a very small, explicitly documented exception list.

The audit must also expand beyond hex values. Raw `rgb()`, `rgba()`, `hsl()`, `hsla()`, `oklch()`, named colors and undocumented gradient colors can produce the same drift while escaping a hex-only guard.

## 2.3 Current latest-commit concern

The latest audited Section 07 work improves visual fidelity, but it also demonstrates the exact finalization risk:

- many component-local `vw` measurements;
- several raw `rgb()` color declarations;
- highly specific component styling that may not derive from the shared system.

Do not blindly undo the visual work. Preserve the composition, then migrate repeated color, type, spacing and motion decisions into the correct token layer.

## 2.4 Existing known unresolved items

Treat the following as active until reverified:

- homepage trust/promoter section duplication and composition;
- Section 04 header pattern drift;
- hard-coded French in remaining shared section content;
- homepage reduced-motion progress-bar defect;
- stale Section 04 tests;
- remaining raw color debt;
- incomplete social URLs;
- thin or owner-blocked legal/content pages;
- production durability of lead storage;
- final visual consistency across all non-home routes;
- final deployment parity between `main` and the public domain.

---

# 3. Authority and conflict resolution

Use this order:

1. Latest explicit owner direction in this file.
2. New owner decisions recorded during execution.
3. `CLAUDE.md` and `docs/claude-code/OPERATING-MODE.md`.
4. `DESIGN-CONTRACT.md` and `ENGINEERING-CONTRACT.md`.
5. Canonical SPIMAR specifications.
6. Approved screenshots and assets.
7. Current code, tests and rendered behavior.
8. Archived documents as provenance only.

## 3.1 Important interpretations

### “Make the link `#`”

The owner’s notation `#` means:

> The control must not navigate to another route yet.

Do not create fake pages. Do not allow the browser to jump to the top.

Use the most semantic implementation:

- a button when the action is not a link;
- a temporarily disabled link when it must visually remain a link;
- or a link with `preventDefault()` only where the exact DOM shape must remain.

Create one shared temporary-action pattern instead of scattering `href="#"`.

It must have:

- no route navigation;
- no page jump;
- clear focus behavior;
- no false success state;
- optional `data-temporary-target` for later replacement.

### “Dummy/random data”

Do not generate changing random values at runtime.

Use deterministic CMS-shaped fixtures with a visible `DÉMO` or equivalent disclosure. Keep them outside visual components and behind the existing data repository seam.

### “Styled dropdown, not native”

This latest owner decision supersedes the older preference for a visibly native select on the exhibitor offer flow.

The resulting control must still be accessible:

- keyboard navigation;
- focus management;
- correct labels;
- selected and disabled states;
- mobile usability;
- screen-reader semantics.

Do not add a dependency unless absolutely necessary and owner-approved.

### “Autoplay hero”

Autoplay means the hero visual begins without cursor interaction.

It must remain:

- muted;
- `playsInline`;
- bandwidth-conscious;
- pauseable where required;
- safe under reduced motion;
- backed by poster/fallback media.

Remove the boxed hero cursor interaction rather than simply restyling it.

---

# 4. Mandatory start protocol

Claude must complete this protocol before broad implementation.

## 4.1 Establish the exact baseline

From `C:\work\spimar`:

```powershell
git status
git fetch origin
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git log -1 --oneline
```

Requirements:

- working tree must be understood before editing;
- no destructive reset;
- no sweep commit;
- no mixing unrelated local work;
- create a dedicated branch from the latest accepted `origin/main`;
- record base SHA in the audit report.

Suggested branch:

```text
finalization/design-system-product-release
```

If the project already uses a different active branch strategy, follow the repository contract and record the decision.

## 4.2 Verify deployment parity

Before changing code:

1. Confirm the public deployment loads.
2. Confirm the public deployment corresponds to the intended `main` SHA.
3. Record:
   - deployed commit;
   - deployment URL;
   - build timestamp;
   - environment;
   - locale behavior;
   - any difference between repository and public deployment.

Do not assume a successful Vercel status means the custom/public domain visibly serves the same output.

## 4.3 Run the real baseline gates

Use the repository’s actual package manager and commands:

```powershell
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:routes
pnpm build
```

Then run the relevant production-mode E2E suite:

```powershell
pnpm test:e2e
```

Run backend verification where the touched scope includes forms or storage:

```powershell
pnpm verify:backend
```

Record actual exit codes and failures. Never summarize an unrun command as green.

## 4.4 Capture the visual baseline

Capture production-build screenshots, not only dev-mode screenshots.

Minimum viewports:

- 1920 × 1080;
- 1536 × 1024;
- 1024 × 768;
- 768 × 1024;
- 390 × 844;
- 360 × 800.

Capture both FR and EN for representative routes.

Capture:

- normal motion;
- reduced motion;
- keyboard focus;
- open dropdowns;
- open accordions;
- active filters;
- form validation;
- mobile menu;
- WhatsApp panel;
- important empty and demo states.

## 4.5 Produce a delta audit

Do not produce another generic repository audit.

Create:

```text
docs/finalization/
├── 00-baseline-and-deployment-parity.md
├── 01-current-delta-audit.md
├── 02-design-token-debt.md
├── 03-motion-and-interaction-delta.md
├── 04-route-completion-matrix.md
├── 05-production-risk-register.md
├── 06-performance-and-bundle-report.md
├── 07-security-and-form-durability.md
└── 08-release-verification.md
```

The delta audit must explicitly separate:

- already solved;
- regressed;
- still open;
- blocked by owner content;
- newly requested in this file.

---

# 5. Non-negotiable implementation principles

## 5.1 No redesign from scratch

Preserve:

- the House of Yellow-derived editorial rhythm;
- the current page structure where it works;
- approved section compositions;
- existing strong visual devices;
- existing route/data seams;
- existing accessibility and testing infrastructure.

Improve the weak parts without flattening the strong parts.

## 5.2 No design-system drift

A new visual value must be one of:

1. an existing L2 semantic token;
2. a justified new L2 semantic token used by multiple surfaces;
3. a local L3 token derived from L2;
4. a documented, measured exception for an illustration or visual replica.

Loose raw values must not become the normal styling method.

## 5.3 No generic UI

Do not solve pages with generic SaaS cards and random grids.

Every page must reflect its purpose:

- exhibition discovery;
- exhibitor conversion;
- market education;
- case-study proof;
- resource discovery;
- visual event evidence;
- support and qualification.

## 5.4 No invented production claims

No unvalidated:

- dates;
- visitor counts;
- prices;
- partner names;
- venues;
- availability;
- legal copy;
- results.

Fixtures must be visibly disclosed and excluded from an approved production release unless the owner explicitly keeps them.

## 5.5 One system, many compositions

Consistency does not mean every section looks identical.

Reuse:

- tokens;
- typography roles;
- button families;
- card anatomy;
- input behavior;
- focus behavior;
- motion vocabulary;
- spacing rhythm;
- media treatment;
- responsive rules.

Allow page-specific composition inside those rules.

---

# 6. Phase 1 — Design-system recovery

This phase blocks broad page polishing.

## 6.1 Token debt reduction

Audit every style source for:

- hex values;
- `rgb()` and `rgba()`;
- `hsl()` and `hsla()`;
- `oklch()` and other raw color functions;
- named colors;
- raw repeated durations;
- raw repeated easing values;
- repeated border radii;
- repeated shadows;
- repeated spacing values;
- repeated type sizes;
- repeated z-index values;
- arbitrary Tailwind values;
- inline styles.

Expand the design-system guard to detect raw colors outside approved locations.

Approved exception locations must be explicit, such as:

- SVG illustration internals;
- image masks;
- measured visual-replica canvases;
- test fixtures.

Each exception requires a comment explaining why semantic theming is not appropriate.

## 6.2 Required outcome

Target:

- zero new raw color debt;
- materially lower the current recorded baseline;
- ideally eliminate all raw product colors from ordinary component styles;
- document any remaining exception by file and line;
- ensure re-pointing the brand gold visibly re-skins the product.

## 6.3 Typography system

Normalize and enforce:

- Display;
- Hero title;
- Page title;
- Section title;
- Subsection title;
- Card title;
- Lead;
- Body large;
- Body;
- Small;
- Label;
- Eyebrow;
- Metadata;
- Button text;
- Caption.

Validate:

- font family;
- weight;
- line-height;
- letter spacing;
- maximum line length;
- wrapping;
- FR and EN expansion;
- mobile scaling.

Do not allow every component to redefine a private type ladder.

## 6.4 Layout and spacing

Consolidate:

- page gutters;
- section vertical rhythm;
- section maximum width;
- content measures;
- grid gaps;
- card padding;
- header offset;
- sticky/stacked section geometry;
- footer spacing;
- mobile touch floors.

Repeated measured `vw` values should become tokens when they represent a shared role.

Do not tokenize every one-off illustration coordinate.

## 6.5 Component system

Inventory before creating.

Consolidate only where it reduces real drift:

- buttons;
- temporary non-navigation actions;
- page headers;
- section headings;
- editorial cards;
- listing rows;
- filters;
- pagination;
- dropdown/select;
- inputs;
- textarea;
- checkboxes;
- accordion;
- modal/popover shell;
- media frame;
- loading, empty and error states;
- bottom CTA;
- logo container;
- form stepper.

Do not create a giant abstraction that makes page-specific art direction impossible.

---

# 7. Phase 2 — Motion and interaction recovery

## 7.1 Use the existing foundation

Use:

- existing GSAP infrastructure;
- existing Lenis integration;
- existing project motion tokens;
- current reduced-motion tests.

Do not add another animation library.

## 7.2 Motion rules

Motion must:

- clarify hierarchy;
- support state change;
- preserve content access;
- remain smooth on mid-range mobile devices;
- stop cleanly under reduced motion;
- avoid layout shift;
- avoid repeated re-animation fatigue.

Remove:

- arbitrary per-section easing;
- unnecessarily long entrance delays;
- duplicate title animation;
- pointer-only interactions;
- animation that blocks reading;
- animation that exists only as decoration without supporting the experience.

## 7.3 Hero

Required final behavior:

- remove the boxed custom cursor interaction;
- hero media autoplays without a click;
- use approved poster/fallback;
- keep playback muted and inline;
- do not hide critical copy behind media state;
- provide a sensible reduced-motion fallback;
- avoid loading an oversized video on constrained mobile conditions;
- verify autoplay behavior on Chromium, Firefox and WebKit behavior where available.

## 7.4 Text hierarchy animation

Choose and enforce a small vocabulary:

- hero reveal;
- page-header reveal;
- section-title reveal;
- statistic reveal;
- content/card reveal.

Do not split every paragraph into animated characters or words.

## 7.5 Stacked homepage sections

Audit the current Section 03+ stacking implementation.

Requirements:

- no content clipping;
- no inaccessible tall sections;
- no sticky overlap bugs;
- consistent z-index and edge treatment;
- correct bottom-pinning for sections taller than the viewport;
- normal document flow on small screens where stacking is harmful;
- no animation under reduced motion;
- no trapped keyboard focus;
- no broken anchor scrolling.

Preserve the existing strong stack concept, but make its contract explicit and reusable.

---

# 8. Phase 3 — Global chrome

## 8.1 Navigation

The main navigation dropdowns for the salon entries are anchor-style temporary items, not new full routes.

Requirements:

- desktop dropdown;
- mobile equivalent;
- keyboard support;
- Escape closes;
- click outside closes;
- current focus returns correctly;
- temporary entries do not navigate;
- no browser jump to the top;
- no duplicate salon labels without contextual distinction.

## 8.2 WhatsApp assistant

Build a polished contextual pre-chat panel inspired by the existing AljaridaPro pattern.

Flow:

1. User opens the WhatsApp control.
2. A compact conversational panel appears.
3. The panel explains what assistance is available.
4. User chooses a prepared question.
5. The selected context creates the outgoing message.
6. User explicitly confirms opening WhatsApp.

Suggested intents:

- Devenir exposant;
- Choisir un salon;
- Télécharger la brochure;
- Comprendre les offres;
- Demander un accompagnement;
- Poser une question commerciale.

Requirements:

- mobile and desktop;
- keyboard accessible;
- predictable close;
- focus trap only if implemented as a modal;
- no immediate external navigation on first click;
- no coverage of critical CTA content;
- dynamic visual contrast when crossing yellow sections;
- use semantic theme state, not hard-coded scroll coordinates;
- production contact details from the centralized contact module;
- graceful absence when no WhatsApp number is configured.

## 8.3 Footer

Rebuild/refine the footer as a complete professional product footer.

Include only relevant validated items:

- brand statement;
- primary navigation;
- resources;
- exhibitor links;
- contact details;
- social placeholders or real links;
- locale control where appropriate;
- legal links;
- copyright;
- optional newsletter only if real.

All temporarily inactive navigation must follow the shared no-navigation pattern.

Footer must be:

- visually integrated;
- responsive;
- readable;
- not excessively tall;
- free of inherited tag-selector bugs;
- consistent with the fixed/reveal shell behavior.

---

# 9. Phase 4 — Homepage exact requirements

## 9.1 Hero

- Remove custom cursor box.
- Visual autoplays without interaction.
- Preserve approved content and layout.
- Validate media fallback and performance.
- Maintain clean CTA hierarchy.
- Do not reintroduce House of Yellow trademarks or media.

## 9.2 Section 02 — Salons par pays

- Reduce the supporting copy from four lines toward a clean two-line composition.
- Remove routes that unnecessarily expand limited salon data.
- Keep the component expandable because the number of salons is limited.
- Remove demo badge where the owner requested removal from this surface.
- “Découvrir le salon” must currently not navigate.
- Do not create a detail route solely to satisfy the button.
- Preserve a clear future data seam for real salon details.

## 9.3 Section 03 — Pourquoi exposer

- “Voir la méthode de qualification” currently does not navigate.
- All other tab CTAs must use the same temporary no-navigation pattern.
- Preserve tab state and keyboard behavior.
- Remove hard-coded French and complete EN parity.
- Migrate Section 03’s private palette to semantic tokens.
- Preserve the strongest current evidence-canvas implementation.

## 9.4 Section 04 — Notre méthode

- Remove “Découvrir notre accompagnement”.
- All tab CTAs currently do not navigate.
- Repair the off-pattern heading hierarchy.
- Update stale tests to the real DOM contract.
- Remove hard-coded French.
- Migrate private palette and spacing decisions to the system.
- Keep useful stage detail and visual depth.

## 9.5 Section 05 — Chiffres clés

- Add the missing headline number treatment.
- Use deterministic mock fixture values only.
- Mark sample data clearly as demo/unvalidated.
- Do not use runtime-random numbers.
- CTA currently does not navigate.
- Keep or clearly present:
  - “Données officielles publiées après validation des sources.”
- Ensure statistics remain understandable without animation.

## 9.6 Section 06 — Comprendre le marché MRE

- Remove “Télécharger l’étude”.
- Right-side CTA currently does not navigate.
- Maintain strong editorial hierarchy.
- Avoid introducing unsupported market claims.
- Keep content CMS-shaped for future reports and studies.

## 9.7 Section 07 — Votre visibilité

- Remove “Découvrir notre dispositif”.
- Add or repair the missing “Séquence CRM” visual.
- Redesign the weak “Rendez-vous” card.
- Add or repair the missing “Rendez-vous qualifiés” visual.
- Preserve the latest invitation and after-event canvas improvements.
- Migrate raw product colors to semantic/L3-derived tokens.
- Review component-local typography so it remains legible outside a single 1536px reference viewport.
- Validate at 1920, 1536, 1024, 768, 390 and 360.

## 9.8 Section 08 — Trust/promoters

Resolve the active punch-list items:

- merge duplicate versions;
- keep the stronger first direction;
- use approved copy;
- remove “Voir tous les promoteurs”;
- keep the clean autoplay logo band;
- make logos more legible;
- replace play/pause with the agreed expand-all behavior;
- use 20+ clearly fictional/demo companies only if the owner-approved content fixture requires it;
- improve hierarchy and composition;
- remove excess bottom spacing;
- fix the reduced-motion progress indicator.

Do not publish invented real partner names.

## 9.9 La preuve par les résultats

- Repair the right-side hierarchy.
- Place the logo inside a clean rounded container or structured box.
- Remove the triangle treatment.
- All temporary links currently do not navigate.
- Preserve proof hierarchy:
  - context;
  - intervention;
  - result;
  - evidence;
  - next step.
- Any result number must be validated or visibly demo-labelled.

## 9.10 Homepage Offres exposants section

- Apply the actual SPIMAR design system.
- Replace the foreign/inconsistent button.
- Use the approved button family.
- Style dropdowns intentionally.
- Replace black inner pills with the correct primary yellow where requested.
- Improve depth, spacing, comparison clarity and selection feedback.
- Current CTA does not navigate.
- Keep the full conversion page as the real destination once activated.

---

# 10. Phase 5 — Route-page product completion

## 10.1 Salons

This is a priority product page.

Remove the old numbered label `[ 04 ] Salons`.

Build a high-quality exhibition calendar/discovery experience with:

- branded PageHeader;
- upcoming and past distinction;
- calendar, timeline or schedule treatment suited to the available data;
- country, city and edition context;
- filters only where useful;
- status and date clarity;
- strong exhibitor CTA;
- loading state;
- empty state;
- one-result state;
- long-list state;
- responsive behavior;
- CMS-shaped fixtures;
- no invented published facts.

Do not settle for a generic card grid.

## 10.2 Études de cas

Remove `[ 09 ] Études de cas`.

Implement the end-to-end flow.

### Listing

- editorial rows;
- image on the left;
- heading;
- summary;
- metadata;
- details action;
- filters;
- result count;
- pagination;
- empty state;
- loading state.

### Detail

- strong page header;
- challenge;
- context;
- method;
- execution;
- result;
- validated metrics or demo disclosure;
- media;
- related case studies;
- back path;
- conversion CTA;
- metadata and structured data.

## 10.3 Bibliothèque

Create a complete resource-discovery experience.

Possible content types:

- market studies;
- guides;
- brochures;
- reports;
- checklists;
- exhibition documents.

Support:

- featured resource;
- type filters;
- topic filters;
- market/country filters;
- search;
- result count;
- pagination;
- resource details;
- related resources;
- download/request CTA;
- empty and loading states.

Use approved or clearly demo-labelled images and files.

## 10.4 Ressources exposants

Use the homepage’s editorial design language while adapting it to a child page.

Requirements:

- PageHeader;
- clear exhibitor context;
- polished section sequence;
- complete “Analyses pour décider” user flow;
- listing and detail behavior where entries require depth;
- FAQ-directed bottom CTA when activated;
- clear next steps;
- consistent conversion hierarchy.

Do not simply duplicate homepage sections without page-level framing.

## 10.5 Galerie

Replace the generic implementation with a purposeful media experience.

Support as appropriate:

- photo/video distinction;
- event filter;
- country filter;
- year filter;
- pagination or progressive load;
- accessible lightbox;
- captions;
- keyboard navigation;
- optimized media;
- loading;
- empty results;
- mobile gestures only when robust.

The page must feel like evidence of real event quality, not an image dump.

## 10.6 Blog / Insights

Implement:

- featured article;
- clean article cards;
- image;
- category or pill;
- heading;
- excerpt;
- date;
- reading time where real;
- filters/search;
- pagination;
- article detail;
- related articles;
- conversion CTA;
- metadata;
- article structured data.

## 10.7 FAQ

Keep the accordion foundation.

Improve:

- typography;
- contrast;
- line length;
- category clarity;
- open/closed rhythm;
- keyboard behavior;
- focus visibility;
- optional search only if it adds value;
- direct contact exit;
- exhibitor CTA hierarchy.

## 10.8 Offres exposants — conversion page

This is one of the most important routes.

Remove the page’s `[ 10 ] Offres exposants` section label.

Audit and polish every step:

1. edition selection;
2. offer comparison;
3. selected services/options;
4. project context;
5. qualification;
6. contact details;
7. consent;
8. review;
9. submit;
10. success or recovery.

Requirements:

- custom branded dropdown;
- clear selected state;
- consistent button family;
- accurate progress;
- no state loss on Back;
- focus moves on step change;
- field-level validation;
- server-authoritative validation;
- duplicate submission handling;
- retry and error recovery;
- mobile completion;
- trust signals;
- direct contact alternative;
- polished “Parlez-nous de votre projet” step;
- no generic third-party-form appearance.

---

# 11. Phase 6 — Forms, backend and CMS readiness

## 11.1 Production durability is a release gate

A local JSONL or filesystem write is not durable on a serverless Vercel deployment.

Before claiming production-ready forms:

- identify the active `createLead` adapter;
- prove where production data persists;
- verify the required environment variables;
- submit through the deployed environment;
- verify the durable record;
- verify duplicate behavior;
- verify failure behavior;
- verify no PII is logged.

If production storage is not configured:

- do not claim the form is production-ready;
- either connect the approved persistent backend;
- or explicitly block/disable production submission with an honest state.

## 11.2 One lead funnel

Keep public lead acquisition on the established `submitEnquiry` contract unless an owner-approved architecture decision changes it.

Do not create competing pipelines.

## 11.3 Form security

Validate:

- server-side Zod;
- client UX validation;
- honeypot;
- rate limiting;
- consent;
- deduplication;
- truthful status mapping;
- CSRF considerations appropriate to the action model;
- secret isolation;
- safe logging;
- abuse behavior;
- accessible errors;
- focus after error and success.

## 11.4 CMS readiness

Do not build the full CMS unless requested.

Prepare stable typed models and adapters for:

- salons;
- editions;
- destinations;
- case studies;
- resources;
- articles;
- gallery albums/media;
- FAQs;
- offers;
- partners;
- testimonials;
- statistics;
- lead submissions.

Visual components must not import fixture objects directly.

---

# 12. Phase 7 — Next.js production optimization

The current stack includes Next.js 16, React 19, Tailwind 4, GSAP, Lenis, next-intl, Supabase tooling, React Hook Form and Zod.

Optimize the existing stack rather than replacing it.

## 12.1 Rendering

Audit:

- Server vs Client Component boundaries;
- full-section client islands;
- hydration cost;
- duplicated data fetches;
- waterfalls;
- cache/revalidation strategy;
- static-generation opportunities;
- dynamic route behavior;
- loading and error boundaries.

## 12.2 JavaScript and animation cost

Measure:

- route bundle sizes;
- shared chunks;
- GSAP cost;
- Lenis initialization;
- client component scope;
- unused dependencies;
- duplicate libraries;
- third-party scripts.

Do not add a bundle analyzer package unless approved; use existing Next.js build output and available tooling first.

## 12.3 Images and video

Validate:

- `next/image`;
- correct `sizes`;
- explicit dimensions/aspect ratio;
- priority only above the fold;
- lazy loading;
- format and compression;
- poster images;
- no oversized mobile downloads;
- no layout shift;
- no hotlinked production assets.

## 12.4 Fonts

Validate:

- `next/font`;
- necessary weights only;
- fallback behavior;
- no duplicate loading;
- stable rendering;
- FR/EN glyph coverage.

## 12.5 Performance budgets

Use these acceptance targets for representative production routes:

- LCP ≤ 2.5 seconds;
- CLS ≤ 0.1;
- INP ≤ 200 ms;
- no major hydration warning;
- no avoidable long main-thread task during initial interaction;
- no horizontal overflow;
- no uncontrolled autoplay cost on small devices.

Record actual measured environment and limitations.

---

# 13. Phase 8 — Accessibility, security, SEO and release

## 13.1 Accessibility

Maintain the existing Axe coverage and add interaction-specific validation.

Verify:

- one meaningful `h1`;
- heading order;
- keyboard navigation;
- visible focus;
- skip link;
- dialogs/popovers;
- dropdown semantics;
- accordion semantics;
- touch targets;
- contrast;
- reduced motion;
- screen-reader labels;
- form error announcements;
- meaningful link/button roles;
- media alternatives;
- zoom and reflow.

Axe zero violations is necessary but not sufficient.

## 13.2 Security

Audit:

- exposed environment variables;
- service-role usage;
- RLS;
- form endpoints;
- rate limiting;
- unsafe HTML;
- external links;
- security headers;
- CSP compatibility;
- clickjacking protection;
- MIME sniffing protection;
- referrer policy;
- permissions policy;
- dependency vulnerabilities;
- source-map strategy;
- error leakage.

Run:

```powershell
pnpm audit
```

Do not blindly apply breaking dependency upgrades.

## 13.3 SEO

Validate:

- unique title and description;
- canonical URLs;
- FR/EN alternates;
- sitemap;
- robots behavior;
- Open Graph;
- social images;
- Article structured data;
- Event structured data where validated;
- FAQ structured data where eligible;
- Breadcrumb structured data;
- no accidental indexing of demos or unfinished pages.

## 13.4 Release candidate

The release candidate requires:

- independent review;
- deployment configuration review;
- production environment review;
- form durability proof;
- visual comparison;
- route matrix sign-off;
- rollback boundary.

---

# 14. Route completion matrix

For every public route, record:

- route;
- locale;
- page purpose;
- primary user;
- primary CTA;
- implementation status;
- data source;
- demo state;
- design-system compliance;
- motion compliance;
- responsive status;
- accessibility status;
- SEO status;
- form/backend dependency;
- missing asset;
- owner blocker;
- test evidence;
- final verdict.

Do not mark a page complete from one desktop screenshot.

---

# 15. Mandatory quality gates

## Gate A — Baseline

Pass only when:

- exact base SHA recorded;
- deployment parity recorded;
- baseline commands run;
- baseline screenshots captured;
- current known failures documented.

## Gate B — Design system

Pass only when:

- token debt is materially reduced;
- no new raw color debt;
- typography hierarchy is consistent;
- button/input/select families are unified;
- system tests pass;
- representative visual comparison passes.

## Gate C — Motion

Pass only when:

- hero behavior matches latest owner direction;
- shared motion vocabulary is used;
- stack behavior is stable;
- reduced motion is complete;
- mobile interaction remains smooth.

## Gate D — Homepage

Pass only when every homepage note in this file is resolved or explicitly blocked.

## Gate E — Route pages

Pass only when listing/detail flows and all required states are complete.

## Gate F — Forms/backend

Pass only when deployed form persistence is proven or production submission is honestly blocked.

## Gate G — Quality

Pass only when:

- TypeScript;
- lint;
- formatting;
- unit tests;
- route tests;
- E2E;
- Axe;
- build;
- performance;
- security checks

are recorded.

## Gate H — Release

Pass only after independent review, deployment verification and rollback documentation.

---

# 16. Required deliverables

Claude must produce or update:

```text
docs/finalization/
├── 00-baseline-and-deployment-parity.md
├── 01-current-delta-audit.md
├── 02-design-token-debt.md
├── 03-motion-and-interaction-delta.md
├── 04-route-completion-matrix.md
├── 05-production-risk-register.md
├── 06-performance-and-bundle-report.md
├── 07-security-and-form-durability.md
└── 08-release-verification.md
```

Also ensure the repository has accurate:

```text
.env.example
DEPLOYMENT.md
PRODUCTION_CHECKLIST.md
```

Do not duplicate existing documents when an update is more correct.

---

# 17. Reporting format after each phase

Report:

1. Base and head SHA.
2. Scope completed.
3. Files changed.
4. Defects found.
5. Defects fixed.
6. Strong behavior intentionally preserved.
7. Design-system debt before and after.
8. Commands run and real results.
9. Browser/viewports/locales tested.
10. Screenshots/evidence.
11. Known differences.
12. Owner blockers.
13. Rollback boundary.
14. Recommended next phase.

Do not say “done” when the work is only visually plausible.

---

# 18. Prohibited behavior

Do not:

- rebuild the application from scratch;
- discard the existing contracts;
- replace custom work with generic UI kits;
- introduce a new design direction;
- invent production content;
- claim mock numbers as official;
- hide failures with TypeScript suppressions;
- weaken lint or test gates;
- add dependencies casually;
- use raw colors as an easy shortcut;
- create route pages just to satisfy inactive CTAs;
- report local file writes as production durability;
- change both homepage and route architecture blindly in one uncontrolled commit;
- commit generated screenshots or heavy evidence unless the repository gate requires it;
- merge without owner authority;
- overwrite unrelated parallel-session work.

---

# 19. Final completion criteria

The mission is complete only when:

- the latest deployed build matches the approved repository SHA;
- the public website uses one recognizable design system;
- the House of Yellow-derived structural rhythm remains intact;
- SPIMAR branding and content are consistent everywhere;
- raw color and private-palette debt is eliminated or explicitly justified;
- typography and spacing are coherent;
- hero media works without cursor interaction;
- motion is controlled and accessible;
- all homepage notes are resolved;
- route listings and detail flows are implemented end to end;
- conversion forms are polished;
- production lead persistence is proven;
- CMS-shaped data seams remain clean;
- desktop, tablet and mobile are validated;
- FR and EN are validated;
- no horizontal overflow remains;
- no critical console or hydration errors remain;
- all release gates are recorded;
- the production build is fast, secure and deployable;
- deployment and rollback documentation are complete.

---

# 20. Claude Code kickoff instruction

Use the following instruction together with this file:

> Read `CLAUDE.md`, then `docs/claude-code/OPERATING-MODE.md`, then this master file.  
> Treat this file as the latest owner direction and as an overlay on the existing control plane.  
> Do not begin broad refactoring immediately.  
> First complete Phase 0: establish the exact Git/deployment baseline, run the existing gates, render the public site, compare it with the audited `main` state, and produce the delta audit.  
> Reuse the current foundation and preserve proven work.  
> After the audit, execute the phases in order, committing bounded changes and reporting real evidence.  
> Never claim production readiness until deployment parity, design-system consistency, form durability, performance, accessibility, security and the full route matrix are verified.

---

# 21. First Claude response expected

Claude’s first response should contain:

- exact current branch and SHA;
- whether the checkout is clean;
- whether `HEAD` matches `origin/main`;
- whether the public deployment matches the intended SHA;
- baseline command results;
- the top five confirmed remaining risks;
- the first bounded implementation slice;
- files expected to change;
- no implementation claim before the baseline is complete.
