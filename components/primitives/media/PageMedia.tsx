import { ResilientVideo } from "@/components/primitives/media/ResilientVideo";

/* Poster-backed media plane: poster as cover background, with an autoplaying
   muted loop on top wherever a deployable source exists.

   TRF-003 moved this out of the reference tree, but it still imported
   `localVideo` and the `PageVideo` type from `lib/content`, which TRF-004
   deletes. Both are now props, so the component carries no content dependency.

   It is not resolution-free, and TRF-006 corrects an earlier claim that it was:
   `imageRoot` still defaults to `/images` and the poster path is composed here.
   That default is the legacy convention and is expected to move into the SPIMAR
   media records in TRF-022.

   No route renders this component at present — TRF-004 deleted its only
   callers. It is retained engineering, not live code. */
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
