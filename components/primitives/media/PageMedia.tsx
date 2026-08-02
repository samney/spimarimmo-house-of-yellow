import { ResilientVideo } from "@/components/primitives/media/ResilientVideo";

/* Poster-backed media plane: poster as cover background, with an autoplaying
   muted loop on top wherever a deployable source exists.

   TRF-003 moved this out of the reference tree, but it still imported
   `localVideo` and the `PageVideo` type from `lib/content`, which TRF-004
   deletes. Both are now props, so the primitive resolves nothing itself and
   carries no content dependency. SPIMAR media records supply `poster` and
   `src` in TRF-022. */
export type PageMediaSource = {
  /** Poster image path, relative to `imageRoot`. */
  poster: string;
  /** Deployable video source, or undefined to render poster-only. */
  src?: string;
};

export function PageMedia({
  media,
  className = "",
  imageRoot = "/images",
}: {
  media: PageMediaSource;
  className?: string;
  imageRoot?: string;
}) {
  const poster = `${imageRoot}/${media.poster}`;
  return (
    <div
      className={`imageWrapper playerBackground ${className}`.trim()}
      style={{ backgroundImage: `url('${poster}')` }}
    >
      <ResilientVideo
        className="mediaPlane--fill"
        src={media.src}
        poster={poster}
        data-cursor="video"
      />
    </div>
  );
}
