/* Canonical project data, extracted from the live reference (HOY-010/070 audits).
   Order matches the reference index page. Becomes Supabase seed data in HOY-040.
   Categories: primary from the audited table; full multi-tag sets verified for
   the first three (homepage cards); the rest carry the primary category until
   the per-project tag audit in HOY-080 (tracked in QUEUE). */

export type Project = {
  slug: string;
  title: string;
  year: string;
  sector: string;
  categories: string[];
  views: string;
  delivery: string;
  orientation: "landscape" | "portrait";
  video: string; // local path under /videos
  poster?: string;
};

export const CATEGORIES = [
  "Artists",
  "Corporate",
  "Events",
  "Employer branding",
  "Commercials",
  "Aftermovies",
  "Launches",
  "Social campaigns",
] as const;

export const PROJECTS: Project[] = [
  { slug: "oceanco-leviathan", title: "Oceanco – Leviathan", year: "'26", sector: "Luxury & yachting", categories: ["Corporate", "Commercials"], views: "7.100.000", delivery: "2 wks production + 2 wks post", orientation: "landscape", video: "/videos/featured-oceanco-1196251477-540p.mp4", poster: "/images/posters/Comp-3_11_33-600x439.jpg" },
  { slug: "la-fuente-x-amg", title: "La Fuente x AMG", year: "'26", sector: "Music", categories: ["Artists", "Commercials"], views: "5.800.000", delivery: "1 week pre-production + 2 shoot days", orientation: "landscape", video: "/videos/featured-lafuente-1204605394-540p.mp4", poster: "/images/posters/Comp-3_11_36-600x439.jpg" },
  { slug: "broederliefde-rotterdam-ahoy", title: "Broederliefde – Rotterdam Ahoy", year: "'26", sector: "Live music event", categories: ["Artists", "Events"], views: "1.900.000", delivery: "8 days", orientation: "portrait", video: "/videos/featured-broederliefde-1194133383-720p.mp4" },
  { slug: "srg-international-reeses", title: "SRG International – Reeses", year: "'26", sector: "FMCG brands", categories: ["Launches"], views: "3.500.000", delivery: "6 days", orientation: "portrait", video: "/videos/vid-1194285750-720p.mp4" },
  { slug: "klibansky-superman", title: "Klibansky – Superman", year: "'26", sector: "Art", categories: ["Commercials"], views: "2.800.000", delivery: "3 days", orientation: "portrait", video: "/videos/vid-1188024122-720p.mp4" },
  { slug: "xxl-nutrition-festival-activations", title: "XXL Nutrition – Festival Activations", year: "'26", sector: "Sport nutrition", categories: ["Commercials"], views: "2.600.000", delivery: "3 days", orientation: "portrait", video: "/videos/vid-1188098568-720p.mp4" },
  { slug: "qbuzz-smiley-campaign", title: "Qbuzz – Smiley Campaign", year: "'26", sector: "Public transport", categories: ["Social campaigns"], views: "2.200.000", delivery: "2 weeks", orientation: "landscape", video: "/videos/vid-1188074581-720p.mp4" },
  { slug: "porsche-employer-branding", title: "Porsche Employer Branding", year: "'23", sector: "Automotive", categories: ["Employer branding"], views: "3.600.000", delivery: "10 days", orientation: "portrait", video: "/videos/vid-1151543609-720p.mp4" },
  { slug: "glow-eindhoven-light-festival", title: "GLOW Eindhoven Light Festival", year: "'21 - '25", sector: "Light festival", categories: ["Aftermovies"], views: "9.500.000", delivery: "9 days", orientation: "portrait", video: "/videos/vid-1151558347-720p.mp4" },
  { slug: "de-hollandse-100-lymphco", title: "De Hollandse 100 – Lymph&Co", year: "'26", sector: "Sport event", categories: ["Events"], views: "1.100.000", delivery: "2 days", orientation: "landscape", video: "/videos/vid-1188086313-720p.mp4" },
  { slug: "streetgasm", title: "StreetGasm", year: "'25", sector: "Automotive", categories: ["Aftermovies"], views: "1.600.000", delivery: "6 days", orientation: "landscape", video: "/videos/vid-1188069712-720p.mp4" },
  { slug: "de-klerk-employer-branding", title: "De Klerk – Employer Branding", year: "'24", sector: "Green environments", categories: ["Employer branding"], views: "1.400.000", delivery: "3-4 weeks", orientation: "landscape", video: "/videos/vid-1194265974-720p.mp4" },
  { slug: "buddha-to-buddha-los-angeles", title: "Buddha to Buddha – Los Angeles", year: "'25", sector: "Lifestyle", categories: ["Commercials"], views: "1.300.000", delivery: "5 days", orientation: "landscape", video: "/videos/vid-1188638365-720p.mp4" },
  { slug: "the-space-dubai", title: "The Space Dubai", year: "'22", sector: "Event venue", categories: ["Commercials"], views: "1.200.000", delivery: "6 days", orientation: "landscape", video: "/videos/vid-1151544155-720p.mp4" },
  { slug: "htc", title: "HTC", year: "'25", sector: "Campus", categories: ["Corporate"], views: "950.000", delivery: "5 days", orientation: "landscape", video: "/videos/vid-1188043705-720p.mp4" },
  { slug: "salvia-bioelectronics", title: "Salvia BioElectronics", year: "'25", sector: "Medtech", categories: ["Commercials"], views: "780.000", delivery: "6 days", orientation: "landscape", video: "/videos/vid-1188055326-720p.mp4" },
  { slug: "ansu-fati-arriba-nutrition", title: "Ansu Fati – Arriba Nutrition", year: "'22", sector: "Brand ambassador", categories: ["Commercials"], views: "5.200.000", delivery: "3 days", orientation: "landscape", video: "/videos/vid-1148957680-720p.mp4" },
  { slug: "eiffel-employer-branding", title: "Eiffel Employer Branding", year: "'23", sector: "Employer Branding", categories: ["Employer branding"], views: "2.100.000", delivery: "9 days", orientation: "portrait", video: "/videos/vid-1151597998-720p.mp4" },
  { slug: "tmc-fundamentals", title: "TMC FUNdamentals", year: "'24 - '25", sector: "High-tech consultancy", categories: ["Social campaigns"], views: "1.800.000", delivery: "Ongoing / 4 days", orientation: "portrait", video: "/videos/vid-1194280833-720p.mp4" },
  { slug: "hotek-brand-video", title: "HOTEK Brand Video", year: "'23", sector: "Access control solutions", categories: ["Commercials"], views: "2.400.000", delivery: "6 days", orientation: "landscape", video: "/videos/vid-1151544468-540p.mp4" },
  { slug: "madunia-brand-launch", title: "Madunia Brand Launch", year: "'24", sector: "Restaurant", categories: ["Launches"], views: "3.200.000", delivery: "8 days", orientation: "landscape", video: "/videos/vid-1148957309-540p.mp4" },
];
