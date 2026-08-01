# ENG-014B Evidence Register

**Classification:** `SUPPORTING_VERIFIED_EXTERNAL_BYTES_PENDING`  
**PR:** https://github.com/samney/spimarimmo-house-of-yellow/pull/4  
**Implementation:** `6136057b4be06ffc5da1cbb0d773643896a7350e`  
**Merge:** `4ee1131f9e325dd4ce865d4036238bdccb38a626`

## Evidence package identity

- Original path: `C:\work\spimar\qa\implementation\ENG-014B-EVIDENCE-PACKAGE.zip`
- Size: 1,875,071 bytes
- SHA-256: `6D47F7DFA7066F258A9E848A1CCCBDFCEBA508D6A15C5379482C52ED357EE51C`
- Review verdict: `APPROVED_FOR_OWNER_MERGE`
- QA JSON result: 23/23 checks

## Reported contents

- Eight required screenshots:
  - desktop 1440×900: grid, list, filter-open, active-filter;
  - mobile 390×844: grid, list, filter-open, active-filter.
- Supplementary French and reduced-motion captures.
- QA JSON with measurements.
- `MANIFEST.md` with per-file SHA-256 and PR/commit provenance.

The mobile active-filter state was captured after the earlier 22-check run. The French supplementary capture was byte-identical to EN because French copy remained a later queue item; navigation independently returned 200 with 21 projects.

## Portability status

The package bytes are not present in this migration workspace or project Library. Do not recreate screenshots, JSON or manifest from this record. Close blocker `MIG-3` by copying the original ZIP, verifying the exact hash, and publishing it to a durable repository-accessible evidence location.
