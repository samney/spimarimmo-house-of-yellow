# Asset Manifest

All image references are included inside this package. Do not regenerate or substitute them during the initial parity gates.

## Approved generated screens

| Phase | File | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| 01 — Avant | `references/generated/notre-methode-01-avant.png` | 1536 × 1024 | `11ea5b64939716ada32d4d966dfa1c9d72361c73bbd17db20e6f136cda48348c` |
| 02 — Pendant | `references/generated/notre-methode-02-pendant.png` | 1536 × 1024 | `2ddceb94094202d68da84e19c6d4e633d195ac447fc6661d504b6f95337551a8` |
| 03 — Après | `references/generated/notre-methode-03-apres.png` | 1536 × 1024 | `da4f65773ba2bd446a45d750500079f21d02a5217b9676f92ee1dd24fdbeee72` |

## Current implementation reference

| File | Purpose | Dimensions | SHA-256 |
| --- | --- | --- | --- |
| `references/current/notre-methode-current-before-redesign.png` | Captures the existing “Pourquoi exposer” and static “Notre méthode” composition before redesign | 1536 × 1024 | `a459f2ad3c0f9ec6f146464f4d8b7bdb4382d75c62ea7bddc8d8494648c2d9bd` |

## Usage rules

1. Use the generated screens as golden visual references.
2. Use the current screenshot only to understand existing content and identify the old structure being replaced.
3. Never ship any full reference screenshot as a page background.
4. Production photography must use approved repository assets or explicit poster fallbacks.
5. Production document thumbnails may be recreated as HTML/CSS or exported as optimized layered assets.
6. Preserve reference aspect ratio during comparison.
7. Record any intentional difference in the implementation report.

