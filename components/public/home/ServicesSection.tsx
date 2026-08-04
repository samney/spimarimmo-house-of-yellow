import { WhyExhibitSection } from "./why-exhibit/WhyExhibitSection";

/* Sections 03 and 04.

   03 — "Pourquoi exposer avec SPIMARIMMO ?" lives in `why-exhibit/`: the
   four-state benefit system (tab rail, copy column, fixed phone, evidence
   cards and connector network) built from the SPIMARIMMO_WHY_EXHIBIT handoff
   references. It replaces the earlier `MobileShowcase` lo-fi composition
   (owner direction, 2026-08-04).

   04 — "Notre méthode" lives in `components/public/home/method/MethodSection`
   (the three-state Dossier exposant system) and mounts directly after this
   section.

   The `.servicesBlock` shell is kept: it carries the page's section rhythm and
   the `data-hide-header` behaviour that lets the section reclaim the viewport
   while it is on screen. */

export function ServicesSection() {
  return (
    <section className="servicesBlock noMargin" data-hide-header>
      <WhyExhibitSection />
    </section>
  );
}
