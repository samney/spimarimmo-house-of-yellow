import { localVideo } from "@/lib/content/project-content";
import type { PageVideo } from "@/lib/content/pages";
import { ResilientVideo } from "@/components/public/media/ResilientVideo";

/* Reference .imageWrapper.playerBackground: poster as cover background,
   autoplaying muted loop video on top (play-on-scroll refinement pending). */
export function PageMedia({ media, className = "" }: { media: PageVideo; className?: string }) {
  const src = localVideo(media.id);
  return (
    <div
      className={`imageWrapper playerBackground ${className}`.trim()}
      style={{ backgroundImage: `url('/images/${media.poster}')` }}
    >
      <ResilientVideo
        className="mediaPlane--fill"
        src={src}
        poster={`/images/${media.poster}`}
        data-cursor="video"
      />
    </div>
  );
}
