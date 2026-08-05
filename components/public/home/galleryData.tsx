import { VisitorsIcon } from "./impactIcons";
import { CameraIcon, MicIcon } from "./visibilityIcons";
import { ImageIcon } from "./galleryIcons";

/* Shared gallery media registry.

   Single source for both surfaces: the homepage "Preuve terrain" section (a
   curated teaser with a hard display budget) and the /ressources/galerie
   listing page (the full library, which grows as validated media lands).
   Demo previews only — the catalog's demoBadge and editionPending states
   stay honest until real edition media is validated. */

export type CategoryKey = "stands" | "affluence" | "rendezvous" | "conferences" | "networking";
export type GalleryIconComponent = (props: { className?: string }) => React.JSX.Element;

export type MediaItem = {
  readonly id: string;
  readonly file: string;
  readonly category: CategoryKey;
  readonly kind: "video" | "photo";
  readonly Icon: GalleryIconComponent;
};

export const GALLERY_CATEGORIES: readonly CategoryKey[] = [
  "stands",
  "affluence",
  "rendezvous",
  "conferences",
  "networking",
];

export const MEDIA: readonly MediaItem[] = [
  { id: "film", file: "film-edition", category: "stands", kind: "video", Icon: CameraIcon },
  { id: "stand", file: "stand-presentation", category: "stands", kind: "photo", Icon: ImageIcon },
  { id: "rdv", file: "rendez-vous", category: "rendezvous", kind: "photo", Icon: VisitorsIcon },
  { id: "affluence", file: "affluence", category: "affluence", kind: "photo", Icon: VisitorsIcon },
  { id: "conference", file: "conference", category: "conferences", kind: "photo", Icon: MicIcon },
  { id: "interview", file: "interview", category: "conferences", kind: "photo", Icon: CameraIcon },
  {
    id: "networking",
    file: "networking",
    category: "networking",
    kind: "photo",
    Icon: VisitorsIcon,
  },
  { id: "espace", file: "espace-stand", category: "stands", kind: "photo", Icon: ImageIcon },
];
