# SPIMARIMMO — Foundation Contract

Inventory of accepted primitives and their expansion classification. The
foundation controls design language; the specification controls content.

| Primitive | Location | Classification |
| --- | --- | --- |
| Type scale (`--text-*`, vw-based, 1080/580 regimes) | `app/globals.css` | Preserve unchanged |
| Colour tokens (`--spimar-*` with `--hoy-*` aliases) | `app/globals.css` | Preserve unchanged |
| `contentWrapper`, `hoyCols` (colLabel/colMain/colIndex) | `shell.css` | Preserve unchanged |
| Numbered chapter marker `[ nn ]` | `home.css` | Preserve unchanged |
| Pill button + `Marquee` label | `Marquee.tsx`, `shell.css` | Preserve unchanged |
| `SplitTitle` reveal | `SplitTitle.tsx` | Preserve unchanged |
| `Counter` odometer | `Counter.tsx` | Preserve — needs sourced values |
| `ResilientVideo` / `mediaPlane` | `ResilientVideo.tsx` | Preserve unchanged |
| `.project` card (media/tags/title/stats) | `home.css` | Extend carefully — event card |
| `.projects` row | `home.css` | Extended: wraps for open-ended sets |
| Header (left nav / centre mark / rounded CTA) | `SiteHeader.tsx` | Preserve architecture, replace content |
| Header mark | `logos.tsx` | Replaced — `SpimarWordmark`, same 159x34 viewBox |
| `logoSection` marquee | `home.css` | Extend — needs SPIMAR partner logos |
| `cultureQuoteAnimationBlock` | `pages.css` | Preserve — standing pages, closing |
| `grainBackground` | `globals.css` | Preserve — media fallback plane |
| Official SPIMARIMMO logo asset | — | **Missing (blocker)** |
| Approved event media / partner logos | — | **Missing (blocker)** |
