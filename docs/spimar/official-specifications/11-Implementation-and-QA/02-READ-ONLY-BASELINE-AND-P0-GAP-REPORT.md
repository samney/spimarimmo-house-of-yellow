# Read-Only Baseline and P0 Gap Report

**Document ID:** `SPM-ENG-M0-001`  
**Repository baseline:** `samney/spimarimmo-house-of-yellow@c5291959d461039fa1aad22140f4e699788a26c1`  
**Mode:** `READ_ONLY`  
**Decision:** `READY_FOR_DEPLOYMENT_IDENTITY_AND_REPAIR_APPROVAL`

## 1. Executive result

The House of Yellow source foundation is accessible, reproducible and buildable. It is not yet safe to treat as the accepted SPIMAR implementation baseline.

The code currently passes TypeScript and production build, but the deployed-media strategy is incomplete, the hero has no failure fallback, staging indexing is not protected, executable tests are absent, and the contact substitute writes to non-durable serverless filesystem storage.

No SPIMAR content, black/gold identity mapping, CMS/CRM migration or route expansion should start until the smaller foundation repair is reviewed and accepted.

## 2. Baseline summary

| Dimension | Result |
|---|---|
| Repository/branch | Public repository; default `main` verified |
| Immutable source | `c5291959d461039fa1aad22140f4e699788a26c1` |
| Production build | Pass; 57 static pages |
| Type safety | Pass |
| Lint | 0 errors, 1 warning |
| Unit tests | No tests found |
| Formatting | 22 files fail check |
| Locales | EN and FR; AR/RTL not implemented in clone |
| Video map | 154 local paths |
| Tracked/deployable videos | 0 |
| Environment example | Valid local draft; absent from remote `main` |
| Deployment identity | Vercel build/source commit not supplied |

## 3. P0 defects and repair contracts

### `REF-P0-001` — missing deployable media

**Evidence**

- `lib/content/local-videos.json` contains 154 `/videos/*.mp4` mappings.
- `HeroSection.tsx`, project tiles and page/detail components consume those paths.
- `.gitignore` excludes `/public/videos/`.
- The repository contains no `public/videos/` directory.

**Required decision before implementation**

Select a rights-approved delivery strategy. The repair must not silently commit the 504 MB local House of Yellow corpus or hotlink expiring/reference URLs. Accepted implementation shapes are a controlled object/CDN media adapter or a deliberately smaller rights-cleared staging corpus that preserves representative layouts and motion.

**Acceptance**

- every published media reference resolves;
- missing URLs fail automated checks;
- media source, rights owner, expiry and fallback are explicit;
- production-critical pages never become visually empty when video is unavailable.

### `REF-P0-002` — missing hero resilience

**Evidence**

The homepage hero video has autoplay/muted/loop behavior but no poster, responsive source selection, error state, reduced-motion branch or constrained-network fallback.

**Acceptance**

- separate optimized mobile and desktop posters;
- intentional visual state on error, denial, reduced motion and data saving;
- black/gold-compatible media primitive that can later accept SPIMAR assets;
- no layout shift and no inaccessible autoplay dependency.

### `REF-P0-003` — staging indexing exposure

**Evidence**

No environment-aware `robots` metadata or `X-Robots-Tag` policy is present in `next.config.ts`, `middleware.ts` or route metadata. The public Vercel URL is not the final SPIMAR domain.

**Acceptance**

- preview/staging responses send `X-Robots-Tag: noindex, nofollow, noarchive`;
- production indexing is controlled separately by approved route state;
- automated tests cover preview, staging and production behavior;
- canonical URLs are not pointed at the staging domain.

## 4. Additional entry risks

| ID | Severity | Finding | Required disposition |
|---|---:|---|---|
| `M0-P1-001` | P1 | No unit tests; E2E runner exists without an intake suite | Add the smallest asset, metadata and fallback tests with the repair |
| `M0-P1-002` | P1 | Contact submissions use `.data` filesystem persistence | Disable as production truth or replace later through the approved durable-store/outbox architecture |
| `M0-P1-003` | P1 | Environment naming conflict: `CONTACT_NOTIFICATION_TO` vs `CONTACT_NOTIFY_TO` comments | Standardize on the approved contract before provider work |
| `M0-P1-004` | P1 | EN/FR only; SPIMAR contract requires FR/EN/AR + RTL | Carry to neutral-foundation work; do not patch into parity repair |
| `M0-P2-001` | P2 | 22 files fail Prettier | Isolate a mechanical formatting change; do not mix with behavior repair |
| `M0-P2-002` | P2 | Next.js warns that `middleware` convention is deprecated | Migrate to `proxy` only in a tested, isolated change |

## 5. Proposed first editable slice

The first branch after deployment identity is recorded should be deliberately narrow:

1. `ENG-005` — create the integration branch from the verified baseline and record the source/deployment pair.
2. `ENG-010A` — introduce a provider-neutral media manifest/resolver and automated missing-asset validation; do not migrate all video bytes into Git.
3. `ENG-011` — implement responsive hero posters and explicit media error/reduced-motion fallback.
4. `ENG-012` — enforce environment-aware staging noindex and add executable tests.
5. Re-run typecheck, lint, build, new tests and representative desktop/mobile/reduced-motion checks.

This slice must not include SPIMAR copy replacement, sitemap expansion, black/gold component reskinning, CMS/CRM schema activation or production provider credentials.

## 6. Information required from Samney

From the Vercel deployment page, provide only non-secret metadata:

- deployment ID or deployment URL;
- deployment creation time;
- source branch;
- source commit SHA shown by Vercel;
- whether the URL is Preview or Production.

After that mapping is recorded, approve the bounded repair slice. Real environment values are not required and must not be pasted into project documents.

## 7. Convergence boundary retained

The final sequence remains unchanged:

1. freeze and repair the House of Yellow foundation;
2. validate the reusable layout, responsive, motion and interaction primitives;
3. neutralize House of Yellow identity/content/contact/legal residue;
4. map the approved SPIMAR black/gold system, 48 targets and 144 states;
5. expand CMS, CRM, forms, multilingual/RTL and operational workflows;
6. harden, test and release.

The clone remains the implementation foundation. This report prevents the repair phase from becoming a parallel clean-slate website.
