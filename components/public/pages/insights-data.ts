/* Blog / analyses fixtures (D-026, 2026-08-06). Provisional editorial
   content the owner reviews before any real publication claim: articles are
   deliberately advice- and process-oriented, carry no figure, price, date
   commitment or partner name, and the listing rides the validation
   disclaimer. Imagery reuses validated assets only. The analyses card on
   /ressources/exposants deep-links into the same records — one content
   system, end to end. */

export type InsightCategory = "marche" | "conseils" | "analyses";

export type InsightArticle = {
  readonly slug: string;
  readonly category: InsightCategory;
  readonly title: { readonly fr: string; readonly en: string };
  readonly excerpt: { readonly fr: string; readonly en: string };
  readonly image: string;
  readonly minutes: number;
  readonly body: { readonly fr: readonly string[]; readonly en: readonly string[] };
};

export const INSIGHTS: readonly InsightArticle[] = [
  {
    slug: "le-marche-mre-en-synthese",
    category: "analyses",
    title: {
      fr: "Le marché MRE, en synthèse : ce qui structure la demande.",
      en: "The MRE market in brief: what structures demand.",
    },
    excerpt: {
      fr: "Six motivations organisent les projets immobiliers de la diaspora — et chacune appelle un discours commercial différent.",
      en: "Six motivations organise the diaspora's property projects — each calls for a different sales conversation.",
    },
    image: "/images/mre/residence-principale.jpg",
    minutes: 6,
    body: {
      fr: [
        "Résidence principale, pied-à-terre, retour au pays, retraite, investissement patrimonial, transmission : les projets des Marocains résidant à l'étranger ne se ressemblent pas, et les traiter comme un seul public revient à ne convaincre personne. Chaque motivation porte son propre horizon de décision, son budget type et ses objections.",
        "Pour un promoteur, la conséquence est directe : le même programme se présente différemment selon que le visiteur prépare une installation durable ou une valorisation patrimoniale. Le premier veut des preuves de qualité de vie ; le second, des éléments de rendement et de gestion.",
        "Le salon est précisément l'endroit où ces conversations se différencient. Un visiteur pré-inscrit arrive avec un projet déclaré — l'équipe commerciale sait avant la poignée de main quelle histoire elle doit raconter.",
        "La version complète de cette synthèse, avec ses sources et sa méthodologie, est publiée après validation.",
      ],
      en: [
        "Primary residence, pied-à-terre, return home, retirement, wealth investment, family transmission: the projects of Moroccans living abroad do not resemble each other, and treating them as one audience means convincing no one. Each motivation carries its own decision horizon, typical budget and objections.",
        "For a developer the consequence is direct: the same programme is presented differently depending on whether the visitor is preparing a durable installation or a wealth play. The first wants proof of quality of life; the second, elements of yield and management.",
        "The show floor is precisely where these conversations differentiate. A pre-registered visitor arrives with a declared project — the sales team knows before the handshake which story to tell.",
        "The full brief, with sources and methodology, is published after validation.",
      ],
    },
  },
  {
    slug: "preparer-sa-strategie-salon",
    category: "analyses",
    title: {
      fr: "Préparer sa stratégie salon : les décisions à prendre avant d'exposer.",
      en: "Preparing your show strategy: decisions to make before exhibiting.",
    },
    excerpt: {
      fr: "L'essentiel d'une édition réussie se joue avant l'ouverture — objectifs, offre présentée, équipe et suivi.",
      en: "Most of a successful edition happens before the doors open — objectives, offer, team and follow-up.",
    },
    image: "/images/mre/investissement-patrimonial.jpg",
    minutes: 5,
    body: {
      fr: [
        "Un salon n'est pas une dépense de visibilité : c'est un dispositif commercial daté, avec un avant, un pendant et un après. Les exposants qui convertissent sont ceux qui décident tôt de ce qu'ils viennent chercher — notoriété, base de contacts ou réservations — car chaque objectif commande un stand, un discours et un staffing différents.",
        "La deuxième décision structurante est l'offre présentée. Un programme unique bien raconté vaut mieux qu'un catalogue complet survolé : le visiteur retient une proposition claire, un prix d'appel honnête et une prochaine étape simple.",
        "Enfin, le suivi se prépare avant le salon, pas après. Qui rappelle, sous quel délai, avec quel support — ces réponses doivent exister avant le premier visiteur. Un contact qualifié perd de la valeur chaque jour où il attend.",
      ],
      en: [
        "A show is not a visibility expense: it is a dated sales operation with a before, a during and an after. Exhibitors who convert are those who decide early what they came for — awareness, a contact base or bookings — because each objective commands a different stand, pitch and staffing.",
        "The second structuring decision is the offer presented. One programme told well beats a full catalogue skimmed: the visitor remembers a clear proposition, an honest entry price and a simple next step.",
        "Finally, follow-up is prepared before the show, not after. Who calls back, within what delay, with which material — those answers must exist before the first visitor. A qualified contact loses value every day it waits.",
      ],
    },
  },
  {
    slug: "entretien-direction-commerciale",
    category: "analyses",
    title: {
      fr: "Entretien : ce qu'une direction commerciale attend d'un salon.",
      en: "Interview: what a sales director expects from a show.",
    },
    excerpt: {
      fr: "Du volume de contacts à la qualité des rendez-vous — comment une équipe de vente juge une édition.",
      en: "From contact volume to meeting quality — how a sales team judges an edition.",
    },
    image: "/images/mre/retour-au-maroc.jpg",
    minutes: 4,
    body: {
      fr: [
        "Le premier indicateur d'une direction commerciale n'est pas le nombre de visiteurs du salon : c'est la proportion de conversations utiles par jour d'exposition. Dix rendez-vous préparés valent mieux que cent passages sans projet.",
        "Le deuxième critère est la traçabilité. Un contact sans projet noté, sans budget ni horizon, redevient un inconnu dès le lundi suivant. L'équipe attend du dispositif salon qu'il structure la captation — pas seulement qu'il attire.",
        "Cet entretien complet, avec l'identité de son intervenant, est publié après validation.",
      ],
      en: [
        "A sales director's first indicator is not the show's visitor count: it is the proportion of useful conversations per exhibition day. Ten prepared meetings beat a hundred walk-bys without a project.",
        "The second criterion is traceability. A contact without a recorded project, budget or horizon becomes a stranger again by the following Monday. The team expects the show setup to structure capture — not merely to attract.",
        "The full interview, with its speaker's identity, is published after validation.",
      ],
    },
  },
  {
    slug: "acheter-au-maroc-depuis-letranger",
    category: "conseils",
    title: {
      fr: "Acheter au Maroc depuis l'étranger : le parcours en clair.",
      en: "Buying in Morocco from abroad: the journey made clear.",
    },
    excerpt: {
      fr: "Du repérage à distance à la signature — les étapes qu'un acheteur MRE doit anticiper.",
      en: "From remote scouting to signature — the steps an MRE buyer should anticipate.",
    },
    image: "/images/mre/residence-principale.jpg",
    minutes: 7,
    body: {
      fr: [
        "Acheter à distance impose une discipline différente d'un achat local : les visites se préparent, les documents se vérifient plus tôt et la confiance se construit sur des preuves plutôt que sur des impressions.",
        "Le repérage commence par le projet, pas par le bien. Ville, quartier, usage, horizon : un cadre clair élimine l'essentiel des annonces avant la première visite — et transforme un séjour au pays en semaine décisive plutôt qu'en tournée d'agences.",
        "Les salons dédiés à la diaspora concentrent cette préparation : les promoteurs présents, les programmes comparables et les interlocuteurs bancaires réunis au même endroit, à une date connue d'avance.",
      ],
      en: [
        "Buying remotely demands a different discipline from a local purchase: visits are prepared, documents are checked earlier, and trust is built on proof rather than impressions.",
        "Scouting starts with the project, not the property. City, neighbourhood, use, horizon: a clear frame eliminates most listings before the first visit — and turns a trip home into a decisive week rather than an agency tour.",
        "Diaspora-dedicated shows concentrate that preparation: the developers present, comparable programmes and banking contacts gathered in one place, on a date known in advance.",
      ],
    },
  },
  {
    slug: "reussir-son-stand-exposant",
    category: "conseils",
    title: {
      fr: "Réussir son stand : l'exposant que les visiteurs retiennent.",
      en: "A stand that works: the exhibitor visitors remember.",
    },
    excerpt: {
      fr: "Lisibilité de l'offre, rythme d'équipe et captation structurée — ce qui distingue un stand qui convertit.",
      en: "A readable offer, team rhythm and structured capture — what sets a converting stand apart.",
    },
    image: "/destinations/paris.png",
    minutes: 5,
    body: {
      fr: [
        "Un stand réussi se lit en trois secondes : qui expose, quoi, où, et pour qui. Tout ce qui retarde ces quatre réponses — visuels surchargés, catalogues empilés, messages génériques — coûte des conversations.",
        "Le rythme d'équipe compte autant que le décor. Un binôme qui accueille pendant qu'un autre approfondit maintient le stand ouvert aux nouveaux visiteurs sans abandonner les conversations engagées.",
        "Enfin, chaque échange doit laisser une trace exploitable : projet, budget, horizon, prochain contact. La meilleure édition du monde ne vaut que ce que son fichier de suivi permet d'en faire.",
      ],
      en: [
        "A good stand reads in three seconds: who is exhibiting, what, where, and for whom. Everything that delays those four answers — overloaded visuals, stacked catalogues, generic messaging — costs conversations.",
        "Team rhythm matters as much as the décor. One pair welcoming while another goes deeper keeps the stand open to new visitors without abandoning engaged conversations.",
        "Finally, every exchange must leave a usable trace: project, budget, horizon, next contact. The best edition in the world is only worth what its follow-up file allows.",
      ],
    },
  },
  {
    slug: "financer-un-achat-mre",
    category: "marche",
    title: {
      fr: "Financer un achat immobilier en tant que MRE : les bases.",
      en: "Financing a property purchase as an MRE: the basics.",
    },
    excerpt: {
      fr: "Revenus à l'étranger, financement au Maroc — les principes que tout acheteur de la diaspora doit connaître.",
      en: "Income abroad, financing in Morocco — the principles every diaspora buyer should know.",
    },
    image: "/destinations/bruxelles.png",
    minutes: 6,
    body: {
      fr: [
        "Le financement d'un bien au Maroc avec des revenus perçus à l'étranger obéit à des règles spécifiques, et les connaître tôt évite de découvrir tard qu'un dossier est incomplet. La préparation documentaire est l'essentiel du travail.",
        "Les conditions précises — taux, quotités, pièces exigées — varient selon les établissements et évoluent dans le temps : elles se vérifient auprès des banques elles-mêmes, idéalement en amont du projet. Plusieurs sont présentes sur les salons dédiés à la diaspora, précisément pour cette étape.",
        "Un guide détaillé du financement MRE, vérifié avec des partenaires bancaires, est publié après validation.",
      ],
      en: [
        "Financing a Moroccan property with income earned abroad follows specific rules, and knowing them early avoids discovering late that a file is incomplete. Document preparation is most of the work.",
        "Precise conditions — rates, ratios, required documents — vary by institution and change over time: they are verified with the banks themselves, ideally ahead of the project. Several attend diaspora-dedicated shows precisely for that step.",
        "A detailed MRE financing guide, verified with banking partners, is published after validation.",
      ],
    },
  },
];

export const INSIGHT_PAGE_SIZE = 6;
