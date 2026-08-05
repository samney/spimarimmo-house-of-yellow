import { MobileShowcase } from "./MobileShowcase";

/* Sections 03 and 04.

   03 — "Pourquoi exposer avec SPIMARIMMO ?" is built from the approved design
   in docs/assets-UX-UI/Section3 and lives in `PillarsShowcase`: four tabbed
   pillars, each swapping the numbered lead column, the phone content and the
   closing experience line together.

   04 — "Notre méthode" lives in `components/public/home/method/MethodSection`
   (the three-state Dossier exposant system, SPIMARIMMO_NOTRE_METHODE_CLAUDE
   handoff) and mounts directly after this section. Its editorial introduction
   carries the [ 04 ] index and the accompaniment CTA, replacing the previous
   howWeRollIntroBlock columns (owner direction, 2026-08-03). */

export function ServicesSection() {
  return (
    <section className="servicesBlock noMargin" data-hide-header>
      <div className="innerAnimContainer">
        <div className="grainBackground dark" aria-hidden="true" />
        <div className="contentWrapper">
          <MobileShowcase />
        </div>
      </div>
    </section>
  );
}
