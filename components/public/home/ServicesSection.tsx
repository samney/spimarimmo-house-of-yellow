import { MobileShowcase } from "./MobileShowcase";

/* Section 03.

   03 — "Pourquoi exposer avec SPIMARIMMO ?" is built from the approved design
   in docs/assets-UX-UI/Section3 and lives in `PillarsShowcase`: four tabbed
   pillars, each swapping the numbered lead column, the phone content and the
   closing experience line together.

   04 — "Notre méthode" moved to `components/public/home/method/MethodSection`
   (the three-state Dossier exposant system) and mounts directly after this
   section in the homepage composition. */

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
