# SPIMARIMMO — Pourquoi exposer implementation handoff

This bundle is the implementation contract for the four-state **Pourquoi exposer avec SPIMARIMMO ?** section.

## Start here

1. Read `prompts/CLAUDE_WHY_EXHIBIT_PIXEL_PARITY.md`.
2. Read `PIXEL_PARITY_SPEC.md` and `ASSET_MANIFEST.md`.
3. Inspect all four files in `reference-screens/` at their native 1536 × 1024 size.
4. Use `assets/runtime/*.webp` in production. Keep `assets/generated-masters/*.png` as source masters.
5. Recreate interface, text, charts, lines, flags, icons, phone frame and document cards in code. Never crop those elements from a reference screenshot.

## Bundle contents

- `reference-screens/`: the exact four target views supplied for this implementation.
- `assets/generated-masters/`: six new high-resolution source images with no UI or text baked in.
- `assets/runtime/`: optimized WebP copies of those six assets.
- `assets/reused/`: seven previously approved assets reused across tabs 01, 03 and 04.
- `ASSET_MANIFEST.md`: exact placement-to-file mapping and crop instructions.
- `PIXEL_PARITY_SPEC.md`: geometry, responsive, motion, accessibility and parity rules.
- `prompts/CLAUDE_WHY_EXHIBIT_PIXEL_PARITY.md`: executable Claude Code master prompt.
- `SHA256SUMS`: integrity hashes for every bundled file.

## Critical implementation rule

The screenshots are **visual references, not implementation assets**. The phone and surrounding evidence cards must be real components. Only the photographs and architectural render listed in the asset manifest are raster images.

