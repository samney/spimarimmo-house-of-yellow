/* Culture + How We Roll page content — extracted verbatim from the live site
   (qa/pages-data.json + qa/{culture,how-we-roll}-main.html, crawled 2026-07-31).
   CMS-shaped: moves into Supabase at HOY-040/120. */

export type PageVideo = {
  /** Vimeo playback id (served locally via localVideo()) */
  id: string;
  /** Poster / background image filename under /images */
  poster: string;
};

export type CultureDiscipline = {
  /** Column layout variant: 1 = icon|media|text, 2 = text|media|icon, 3 = icon|media(pushed right)|text */
  style: 1 | 2 | 3;
  index: string;
  label: string;
  text: string;
  video: PageVideo;
};

/* ===== /culture/ ===== */

export const CULTURE = {
  title: "Culture - HOY | House Of Yellow",
  metaDesc:
    "We’re a creative content agency that moves at the speed of your ambition. From idea to production and beyond. Where speed meets craftsmanship.",
  header: {
    index: "01",
    label: "Our Culture",
    titles: [
      "At House of Yellow , we mix hungry young creators with seasoned pros who’ve seen it all.",
      "That combo? It means we don’t just make things look good, we make them work. Top-of-their-game creators who speak the language of culture and feel what audiences respond to.",
    ],
    tagline: "Fast. Smart. With flavour.",
  },
  /* Discipline items in page order; style: 1 = icon|media|text, 2 = text|media|icon, 3 = icon|media(text-left variant)|text */
  items: [
    {
      style: 1,
      index: "02",
      label: "Creative",
      text: "Creative is where it all begins. From raw idea to refined concept, we shape stories that stick. We think, write, and build the blueprint, turning vision into something real before the first frame is even shot.",
      video: { id: "1188020746", poster: "Comp-1_1-800x1067.jpg" },
    },
    {
      style: 2,
      index: "03",
      label: "3d Animator",
      text: "We bring ideas into motion. From static designs to dynamic worlds, our 3D animators shape visuals with depth, detail, and precision. Built to elevate every frame beyond the expected.",
      video: { id: "1188018691", poster: "Comp-1-800x1067.jpg" },
    },
    {
      style: 3,
      index: "04",
      label: "Editor",
      text: "This is where it all comes together. Our editors shape the story in the final cut, refining every frame, every beat, and every transition into a seamless whole.",
      video: { id: "1151544155", poster: "353d5bb5-393f70ba.jpg" },
    },
  ] as CultureDiscipline[],
  quote: {
    text: "That combo? It means we don’t just make things look good, we make them work. We speak the language of culture, feel the pulse of the audience, and turn big ideas into bold content.",
    person: "Vinal Hindocha",
  },
  itemsAfterQuote: [
    {
      style: 1,
      index: "05",
      label: "2d Animator",
      text: "Every frame tells a story. From first sketch to final animation: we design, draw, and animate with precision, shaping movement that connects and captivates.",
      video: { id: "1188021523", poster: "Comp-1_3-800x1067.jpg" },
    },
    {
      style: 2,
      index: "06",
      label: "Director",
      text: "Every story starts with vision. From concept to final cut: we direct, guide, and shape every frame with creative precision and cultural insight.",
      video: { id: "1194133383", poster: "Comp-1_26_7-800x1067.jpg" },
    },
  ] as CultureDiscipline[],
  forWho: {
    index: "07",
    label: "For who?",
    titles: [
      "Bold. Original. Built for brands who want to lead, not follow.",
      "All under one roof. All for the bold.",
    ],
  },
  works: {
    index: "08",
    label: "The works",
    intro:
      "Every frame tells our story too, of passion, agility, and the pursuit of brilliance. This is Made by Yellow. A showcase of the work we proudly shaped together with our partners.",
    projects: [
      {
        slug: "oceanco-leviathan",
        title: "Oceanco – Leviathan",
        tags: ["Corporate", "Commercials"],
        views: "7.100.000",
        delivery: "2 wks production + 2 wks post",
        video: { id: "1196251477", poster: "Comp-3_11_33-600x439.jpg" },
      },
      {
        slug: "la-fuente-x-amg",
        title: "La Fuente x AMG",
        tags: ["Artists", "Commercials"],
        views: "5.800.000",
        delivery: "1 week pre-production + 2 shoot days",
        video: { id: "1204605394", poster: "Comp-3_11_36-600x439.jpg" },
      },
      {
        slug: "broederliefde-rotterdam-ahoy",
        title: "Broederliefde – Rotterdam Ahoy",
        tags: ["Artists", "Events", "+1"],
        views: "1.900.000",
        delivery: "8 days",
        video: { id: "1194133383", poster: "Comp-1_26_7-600x800.jpg" },
      },
    ],
  },
};

/* ===== /how-we-roll/ ===== */

export type HwrTextItem = {
  number: string; // e.g. "01 - 1" (rendered "[ 01 - 1 ]")
  title: string;
  body: string;
};

export const HOW_WE_ROLL = {
  title: "How we roll - HOY | House Of Yellow",
  metaDesc:
    "We’re a creative content agency that moves at the speed of your ambition. From idea to production and beyond. Where speed meets craftsmanship.",
  header: {
    /* Live site renders the index literally as "[ xx ]" (observed) */
    index: "xx",
    label: "This is how we roll",
    titles: [
      "Behind every story we create lies a method: listen first, co-create boldly, and deliver with precision. Flexible, fast, and focused, this is what working with House of Yellow feels like.",
    ],
    tagline: "Fast. Smart. With flavour.",
  },
  introPair: {
    landscape: { id: "1196251479", poster: "Comp-3_11_34-600x439.jpg" },
    portrait: { id: "1188108650", poster: "Comp-1_24-600x800.jpg" },
  },
  phase1: {
    title: "Phase 1: The Blueprint – Strategize & Design",
    items: [
      {
        number: "01 - 1",
        title: "Concept & Storytelling",
        body: "We collaborate to define your core message, target audience, and the desired emotional impact. From this, we develop a powerful concept and refine it into a detailed script that forms the backbone of your story.",
      },
      {
        number: "01 - 2",
        title: "Visualizing the Narrative",
        body: "Our creative team translates the script into visual blueprints. Through detailed storyboards and comprehensive shot lists, we map out every scene, camera angle, and movement, ensuring a cohesive visual flow.",
      },
      {
        number: "01 - 3",
        title: "Pre-Production Mastery",
        body: "We handle all the essential groundwork: expert casting for actors and extras, selecting top-tier equipment (cameras, lighting, sound gear), scouting and securing ideal locations, and assembling a dedicated crew of industry professionals. Every detail is meticulously planned to guarantee a seamless production.",
      },
    ] as HwrTextItem[],
    media: {
      landscape: { id: "1188112895", poster: "Comp-3_11_4-600x439.jpg" },
      portrait: { id: "1188108680", poster: "Comp-1_23-600x800.jpg" },
    },
  },
  phase2: {
    title: "Phase 2: The Studio – Capture & Create",
    squares: {
      first: { id: "1188110341", poster: "Comp-1_18-600x600.jpg" },
      second: { id: "1188110477", poster: "Comp-1_27-600x600.jpg" },
    },
    items: [
      {
        number: "02 - 1",
        title: "Precision Setup",
        body: "We meticulously set up the scene, optimizing lighting and sound environments to perfection. Our crew prepares the set, actors are briefed and styled, and every technical element is fine-tuned for optimal capture.",
      },
      {
        number: "02 - 2",
        title: "Dynamic Filming",
        body: "Under the expert guidance of our director, we capture the essence of your story. Our cinematographers masterfully frame each shot, while our audio engineers ensure pristine sound recording. We focus on securing diverse takes and maintaining absolute continuity across all scenes.",
      },
      {
        number: "02 - 3",
        title: "Quality Assurance",
        body: "Throughout filming, we rigorously monitor footage quality, ensuring technical excellence and confirming all planned shots are secured. Daily data backups safeguard every precious moment captured.",
      },
    ] as HwrTextItem[],
  },
  midPair: {
    landscape: { id: "1188112929", poster: "Comp-3_11_3-600x439.jpg" },
    portrait: { id: "1188108593", poster: "Comp-1_26-600x800.jpg" },
  },
  phase3: {
    title: "Phase 3: The Polish – Edit & Elevate",
    items: [
      {
        number: "03 - 1",
        title: "Crafting the Narrative",
        body: "Our editors meticulously assemble the footage, starting with a logical assembly edit and progressively refining it into a compelling fine cut. This stage brings your story to life, ensuring optimal pacing and flow.",
      },
      {
        number: "03 - 2",
        title: "Sonic Excellence",
        body: "We elevate your video with professional sound design and audio mixing. Dialogues are clarified, immersive sound effects are integrated, and carefully selected music is layered to enhance the emotional resonance, creating a rich auditory experience.",
      },
      {
        number: "03 - 3",
        title: "Visual Perfection",
        body: "Our post-production specialists apply expert color correction for visual consistency and perform artistic color grading to establish the perfect mood and aesthetic. We seamlessly integrate visual effects (VFX) and dynamic motion graphics (titles, logos) to add a layer of sophistication and brand polish.",
      },
    ] as HwrTextItem[],
    media: {
      landscape: { id: "1188112952", poster: "Comp-3_11_2-600x439.jpg" },
      portrait: { id: "1188108612", poster: "Comp-1_25-600x800.jpg" },
    },
  },
  readyToGo: {
    index: "01",
    label: "Ready to go?",
    titles: [
      "Working with House of Yellow feels like having an in-house team, but with outsider firepower.",
      "You’ll see it. You’ll feel it. And your audience will too.",
    ],
  },
};
