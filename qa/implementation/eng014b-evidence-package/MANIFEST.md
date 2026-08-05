# ENG-014B Evidence Package — PR #4 review gate

- **Repository:** samney/spimarimmo-house-of-yellow
- **PR:** https://github.com/samney/spimarimmo-house-of-yellow/pull/4 (draft — do not merge without owner approval)
- **Expected head commit:** `6136057b4be06ffc5da1cbb0d773643896a7350e`
- **Base (`origin/main`):** `55e1fcd7da7ab4865bd566c711a3061d57c1e6ce`
- **Captured:** 2026-08-01, local production build (`next start`, port 3212) of the PR head in `C:\work\spimar`, Playwright Chromium.
- **Consent handling:** every capture follows real-visitor behavior — the Complianz-equivalent banner is answered (Deny) before interaction.

## The eight required screenshots

| # | File | State |
|---|---|---|
| 1 | `01-desktop-1440x900--grid.png` | Desktop 1440×900 — grid opening: 21-project floating constellation, HOY letterform behind media, filter dock |
| 2 | `02-desktop-1440x900--list.png` | Desktop 1440×900 — list state: 21 compact rows (year / title / sector / category / views / delivery) |
| 3 | `03-desktop-1440x900--filter-open.png` | Desktop 1440×900 — full-viewport translucent filter overlay, 8 categories |
| 4 | `04-desktop-1440x900--filter-active.png` | Desktop 1440×900 — active filter (ARTISTS selected → 2 visible), Reset available |
| 5 | `05-mobile-390x844--grid.png` | Mobile 390×844 — responsive constellation, filter dock, no horizontal overflow |
| 6 | `06-mobile-390x844--list.png` | Mobile 390×844 — list state, 21 rows |
| 7 | `07-mobile-390x844--filter-open.png` | Mobile 390×844 — filter overlay open |
| 8 | `08-mobile-390x844--filter-active.png` | Mobile 390×844 — active filter (ARTISTS selected → 2 visible), Reset available |

## Supplementary

- `supplementary--fr-grid--1440x900.png` — `/fr/made-by-yellow` (HTTP 200, 21 projects). **Byte-identical to #1 by design:** French copy is a later queue item (HOY-110), so the FR route currently renders pixel-identically to EN; the QA JSON independently records the FR navigation, status and project count.
- `supplementary--reduced-motion--1440x900.png` — `prefers-reduced-motion: reduce` context; grid visible, list reachable.
- `eng014b-qa-results.json` — 23 machine-verified checks (viewport geometry incl. scroll height 5470px desktop / 5405px mobile, `scrollWidth == clientWidth` overflow assertions, filter/reset/Escape behavior, tab isolation `0/21` focusable in inactive panel, zero `/videos/` requests, hero poster-only, zero console/page/hydration errors).

## Per-file SHA-256

```
A7FCA019FDF6C529C69E83C842FFD840D26BC23DEC54B47DC250CD073CBB0392  01-desktop-1440x900--grid.png
F902573EE9AA92CD5405954784A746D1FC065891CD8F9F5A05642CC6F0CD66DF  02-desktop-1440x900--list.png
0AAF204302F7BEDDD3E8ADE917CF4CA04F18B3FEB4783326C4E24655DA413C38  03-desktop-1440x900--filter-open.png
6673E58002062EABD43305DA6D07B16D5F30731BEB6396AE584EEE44A1AAD893  04-desktop-1440x900--filter-active.png
F5CE1ADF02FAEAB02C4759C1ED3564732965AD09F7D7982664801D18D724EAE4  05-mobile-390x844--grid.png
4702E199ED5C12D55024C0A6A3C802BBC9FF61E16EF2053181D7D67336190B9F  06-mobile-390x844--list.png
98EBF45D40CC1B945B284CB1534F1A6845F0CDAD77EB1013239E528240A354DB  07-mobile-390x844--filter-open.png
34254F6E39A4DD239540FE370575E304D94458C148993DAFB492231CED966410  08-mobile-390x844--filter-active.png
826334E53F3CFB5BDB4F0ACEF77226A755A4D7FADCA936D72759082D18FF2043  eng014b-qa-results.json
A7FCA019FDF6C529C69E83C842FFD840D26BC23DEC54B47DC250CD073CBB0392  supplementary--fr-grid--1440x900.png
AEE7FAA0304F634608774BEB86D94970B7B54895EA6A78DC2529A60F1623071E  supplementary--reduced-motion--1440x900.png
```
