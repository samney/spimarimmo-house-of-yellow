"use client";

import { useState, useSyncExternalStore, type VideoHTMLAttributes } from "react";

type PlaybackPolicy = "allowed" | "poster" | "reduced-motion" | "save-data";

type NetworkInformation = EventTarget & {
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

function getPlaybackPolicy(): PlaybackPolicy {
  if (typeof window === "undefined") return "poster";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced-motion";
  }
  if ((navigator as NavigatorWithConnection).connection?.saveData) {
    return "save-data";
  }
  return "allowed";
}

function subscribeToPlaybackPolicy(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = (navigator as NavigatorWithConnection).connection;
  motionQuery.addEventListener("change", onStoreChange);
  connection?.addEventListener("change", onStoreChange);

  return () => {
    motionQuery.removeEventListener("change", onStoreChange);
    connection?.removeEventListener("change", onStoreChange);
  };
}

type ResilientVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "children" | "className" | "poster" | "src"
> & {
  src: string | null | undefined;
  poster: string;
  mobilePoster?: string;
  className?: string;
  videoClassName?: string;
  label?: string;
  priority?: boolean;
};

export function ResilientVideo({
  src,
  poster,
  mobilePoster,
  className = "",
  videoClassName = "video",
  label,
  priority = false,
  muted = true,
  loop = true,
  playsInline = true,
  autoPlay = true,
  preload = "metadata",
  ...videoProps
}: ResilientVideoProps) {
  const playbackPolicy = useSyncExternalStore(
    subscribeToPlaybackPolicy,
    getPlaybackPolicy,
    () => "poster",
  );
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const shouldLoadVideo = Boolean(src) && playbackPolicy === "allowed" && !failed;
  const mediaState = !src
    ? "unavailable"
    : failed
      ? "error"
      : playbackPolicy === "allowed"
        ? ready
          ? "ready"
          : "loading"
        : playbackPolicy;

  return (
    <span
      className={`mediaPlane ${className}`.trim()}
      data-media-state={mediaState}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <picture className="mediaPlane__poster">
        {mobilePoster && <source media="(max-width: 580px)" srcSet={mobilePoster} />}
        <img
          src={poster}
          alt=""
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </picture>
      {shouldLoadVideo && (
        <video
          {...videoProps}
          className={`mediaPlane__video ${videoClassName}`.trim()}
          src={src ?? undefined}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          autoPlay={autoPlay}
          preload={preload}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={(event) => {
            setReady(true);
            videoProps.onCanPlay?.(event);
          }}
          onError={(event) => {
            setFailed(true);
            setReady(false);
            videoProps.onError?.(event);
          }}
        />
      )}
    </span>
  );
}
