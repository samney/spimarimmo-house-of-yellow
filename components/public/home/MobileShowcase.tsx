"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

/* Section 03 — "Pourquoi exposer avec SPIMARIMMO ?" (§08).

   Structure follows the approved boards in docs/assets-UX-UI/Section3: chapter
   marker, heading and sub-heading, then the four pillar tabs, then a numbered
   lead column (title, body, CTA, closing notion) beside the phone.

   Styling stays this design system's: the foundation's dark band, type ladder,
   ink and gold. Nothing new is introduced.

   Inside the phone the boards deliberately show low-fidelity cards — an icon, a
   title, grey bars standing in for copy, a gold badge for confirmation. That is
   reproduced rather than "finished" into real UI: the point is to convey the
   shape of a flow, not to assert screens that do not exist. Each tab owns a
   sequence of those cards which loops on its own. */

type Card =
  | { kind: "form"; title: string; caption: string; fields: number }
  | { kind: "list"; title: string; rows: string[] }
  | { kind: "ring"; title: string; caption: string }
  | { kind: "badge"; title: string; caption: string }
  | { kind: "checks"; title: string; rows: string[] }
  | { kind: "media"; title: string; caption: string; tiles: number };

type Pillar = {
  num: string;
  tab: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  notion: string;
  chips: string[];
  cards: Card[];
};

const PILLARS: Pillar[] = [
  {
    num: "01",
    tab: "Clientèle qualifiée",
    title: "Une clientèle qualifiée",
    body: "Des visiteurs ayant un projet immobilier concret, identifiés avant leur arrivée au salon.",
    cta: { label: "Voir la méthode de qualification", href: "/exposer" },
    notion: "De la pré-inscription au rendez-vous qualifié.",
    chips: ["Pré-inscription", "Projet", "Budget", "Horizon", "Intention", "Rendez-vous"],
    cards: [
      { kind: "form", title: "Formulaire", caption: "Pré-inscription", fields: 4 },
      {
        kind: "list",
        title: "Profil qualifié",
        rows: ["Type de projet", "Budget", "Horizon d'achat", "Destination"],
      },
      { kind: "ring", title: "Intention", caption: "Intention vérifiée" },
      { kind: "badge", title: "Rendez-vous", caption: "Rendez-vous confirmé" },
      {
        kind: "checks",
        title: "Critères",
        rows: [
          "Projet immobilier",
          "Budget défini",
          "Horizon d'achat",
          "Intention d'achat",
          "Localisation ciblée",
        ],
      },
    ],
  },
  {
    num: "02",
    tab: "Présence internationale",
    title: "Une présence internationale",
    body: "France, Canada, Belgique, Royaume-Uni et Émirats Arabes Unis : un réseau de salons au plus près des marchés MRE.",
    cta: { label: "Explorer les salons par pays", href: "/salons" },
    notion: "Du Maroc vers les marchés MRE prioritaires.",
    chips: ["France", "Canada", "Belgique", "Royaume-Uni", "Émirats"],
    cards: [
      { kind: "media", title: "Réseau", caption: "Salons SPIMARIMMO", tiles: 4 },
      {
        kind: "list",
        title: "Destinations",
        rows: ["France", "Canada", "Belgique", "Royaume-Uni"],
      },
      { kind: "badge", title: "Édition", caption: "Prochaine édition" },
      {
        kind: "checks",
        title: "Marchés",
        rows: ["Diaspora MRE", "Investisseurs", "Primo-accédants", "Retour au Maroc"],
      },
    ],
  },
  {
    num: "03",
    tab: "Campagnes massives",
    title: "Des campagnes massives",
    body: "Une présence coordonnée sur les canaux qui comptent, avec des volumes, une couverture et des créations visibles.",
    cta: { label: "Voir l'étude de cas", href: "/etudes-de-cas" },
    notion: "Du plan média aux créations diffusées.",
    chips: ["Meta", "Instagram", "Google", "YouTube", "Emailing", "SMS", "Presse", "Influence"],
    cards: [
      { kind: "media", title: "Créations", caption: "Campagne exposants", tiles: 4 },
      {
        kind: "list",
        title: "Plan média",
        rows: ["Meta et Instagram", "Google et YouTube", "Emailing et SMS", "Presse et influence"],
      },
      { kind: "ring", title: "Couverture", caption: "Diffusion en cours" },
      { kind: "badge", title: "Preuve", caption: "Création diffusée" },
    ],
  },
  {
    num: "04",
    tab: "Accompagnement complet",
    title: "Un accompagnement complet",
    body: "Stand, communication, prise de rendez-vous, support commercial et suivi : chaque livrable est visible avant l'achat.",
    cta: { label: "Voir les livrables inclus", href: "/exposer" },
    notion: "De la préparation au suivi post-salon.",
    chips: ["Cadrage", "Stand", "Communication", "Rendez-vous", "Support", "Suivi"],
    cards: [
      { kind: "media", title: "Plan du stand", caption: "Cadrage validé", tiles: 2 },
      {
        kind: "list",
        title: "Livrables",
        rows: ["Brief validé", "Plan du stand", "Kit de communication", "Agenda de rendez-vous"],
      },
      { kind: "checks", title: "Support", rows: ["Support salon", "Suivi commercial", "Reporting"] },
      { kind: "badge", title: "Bilan", caption: "Rapport de suivi" },
    ],
  },
];

/* ---------------------------------------------------------------- low-fi kit */

const Bar = ({ w = "100%" }: { w?: string }) => (
  <span className="lofi__bar" style={{ width: w }} aria-hidden="true" />
);

const Glyph = () => <span className="lofi__glyph" aria-hidden="true" />;

function CardHead({ title }: { title: string }) {
  return (
    <div className="lofi__head">
      <span className="lofi__headIcon" aria-hidden="true" />
      <span className="lofi__headTitle">{title}</span>
      <span className="lofi__more" aria-hidden="true">
        •••
      </span>
    </div>
  );
}

function LofiCard({ card }: { card: Card }) {
  if (card.kind === "form") {
    return (
      <div className="lofi">
        <CardHead title={card.title} />
        <div className="lofi__caption">{card.caption}</div>
        <div className="lofi__track" aria-hidden="true">
          <span className="lofi__dot is-on" />
          <span className="lofi__dot" />
          <span className="lofi__dot" />
        </div>
        <div className="lofi__stack">
          {Array.from({ length: card.fields }, (_, i) => (
            <div className="lofi__field" key={i}>
              <Glyph />
              <Bar w={["78%", "64%", "70%", "56%"][i % 4]} />
            </div>
          ))}
        </div>
        <div className="lofi__cta" aria-hidden="true">
          <svg viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7.5 6 10.5 11 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (card.kind === "list") {
    return (
      <div className="lofi">
        <CardHead title={card.title} />
        <div className="lofi__stack">
          {card.rows.map((r) => (
            <div className="lofi__row" key={r}>
              <Glyph />
              <span className="lofi__rowText">
                <span className="lofi__label">{r}</span>
                <Bar w="100%" />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (card.kind === "checks") {
    return (
      <div className="lofi">
        <CardHead title={card.title} />
        <div className="lofi__stack">
          {card.rows.map((r) => (
            <div className="lofi__check" key={r}>
              <span className="lofi__tick" aria-hidden="true">
                <svg viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7.5 6 10.5 11 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="lofi__label">{r}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (card.kind === "ring") {
    return (
      <div className="lofi">
        <CardHead title={card.title} />
        <div className="lofi__center">
          <span className="lofi__ring" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" opacity="0.2" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="126"
                strokeDashoffset="30"
                transform="rotate(-90 24 24)"
              />
              <path
                d="M16 24.5 21.5 30 32 18.5"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="lofi__caption">{card.caption}</span>
          <Bar w="62%" />
        </div>
      </div>
    );
  }

  if (card.kind === "badge") {
    return (
      <div className="lofi">
        <CardHead title={card.title} />
        <div className="lofi__center">
          <span className="lofi__badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M9 15.5 11 17.5 15.5 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="lofi__caption">{card.caption}</span>
          <Bar w="62%" />
        </div>
      </div>
    );
  }

  return (
    <div className="lofi">
      <CardHead title={card.title} />
      <div className={`lofi__tiles lofi__tiles--${card.tiles}`} aria-hidden="true">
        {Array.from({ length: card.tiles }, (_, i) => (
          <span className="lofi__tile" key={i} />
        ))}
      </div>
      <div className="lofi__caption">{card.caption}</div>
      <Bar w="72%" />
    </div>
  );
}

/* ------------------------------------------------------------------ showcase */

const CARD_MS = 2400;

export function MobileShowcase() {
  const [tab, setTab] = useState(0);
  const [card, setCard] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Cards loop within a tab; completing a pass advances to the next tab, so the
  // whole section plays as views inside views without any manual input.
  useEffect(() => {
    if (paused || reduced.current) return;
    const total = PILLARS[tab].cards.length;
    const id = setTimeout(() => {
      if (card + 1 < total) setCard(card + 1);
      else {
        setCard(0);
        setTab((t) => (t + 1) % PILLARS.length);
      }
    }, CARD_MS);
    return () => clearTimeout(id);
  }, [tab, card, paused]);

  const pillar = PILLARS[tab];
  const current = pillar.cards[card];

  return (
    <div className="pillars">
      <div className="pillars__head">
        <div className="text medium">
          [ <span className="numIndex">{pillar.num}</span> ]
        </div>
        <h2 className="pillars__title">Pourquoi exposer avec SPIMARIMMO&nbsp;?</h2>
        <p className="pillars__sub">
          Quatre piliers de réponse, soutenus par des preuves concrètes.
        </p>
      </div>

      <div className="pillarTabs" role="tablist" aria-label="Piliers">
        {PILLARS.map((p, i) => (
          <button
            key={p.num}
            type="button"
            role="tab"
            id={`pillar-tab-${p.num}`}
            aria-selected={i === tab}
            aria-controls={`pillar-panel-${p.num}`}
            tabIndex={i === tab ? 0 : -1}
            className={`pillarTab${i === tab ? " is-active" : ""}`}
            onClick={() => {
              setTab(i);
              setCard(0);
            }}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const next =
                e.key === "ArrowRight"
                  ? (tab + 1) % PILLARS.length
                  : (tab - 1 + PILLARS.length) % PILLARS.length;
              setTab(next);
              setCard(0);
            }}
          >
            <span className="pillarTab__num">{p.num}</span>
            <span className="pillarTab__label">{p.tab}</span>
          </button>
        ))}
      </div>

      <div
        className="pillars__body"
        role="tabpanel"
        id={`pillar-panel-${pillar.num}`}
        aria-labelledby={`pillar-tab-${pillar.num}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="pillars__lead">
          <div className="pillars__bigNum">{pillar.num}</div>
          <h3 className="pillars__leadTitle">{pillar.title}</h3>
          <p className="pillars__leadBody">{pillar.body}</p>
          <Link className="pillars__cta" href={pillar.cta.href}>
            {pillar.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
          <p className="pillars__notion">
            <span className="pillars__dash" aria-hidden="true" />
            {pillar.notion}
          </p>
        </div>

        <div className="pillarPhone">
          <div className="pillarPhone__frame">
            <span className="pillarPhone__notch" aria-hidden="true" />
            <div className="pillarPhone__screen">
              <div className="pillarPhone__chips" aria-hidden="true">
                {pillar.chips.map((c) => (
                  <span className="pillarChip" key={c}>
                    {c}
                  </span>
                ))}
              </div>

              {/* Keyed so each card mounts fresh and plays its own entrance. */}
              <div className="pillarPhone__stage">
                <LofiCard card={current} key={`${pillar.num}-${card}`} />
              </div>

              <div className="pillarPhone__progress" aria-hidden="true">
                {pillar.cards.map((_, i) => (
                  <span className={`pillarPhone__pip${i === card ? " is-on" : ""}`} key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The loop is decorative; the same content is available as text. */}
      <p className="sr-only">
        {pillar.title}. {pillar.body} {pillar.notion}
      </p>
    </div>
  );
}
