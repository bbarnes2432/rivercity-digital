"use client";

import { useEffect, useRef, useState } from "react";
import "./HookVideo.css";

type Props = {
  /** Path to the video file under /public. */
  src: string;
  /** Poster image shown before the video plays. */
  poster?: string;
  /** Optional short, silent clip that loops in place of the poster until the viewer presses play. */
  previewSrc?: string;
  /** Overlay CTA label shown over the poster. */
  ctaLabel?: string;
  /** Smaller line under the CTA label. */
  ctaSub?: string;
  /** Landing pages can defer the media download until the visitor presses play. */
  preload?: "none" | "metadata" | "auto";
};

/**
 * Click-to-play video with a poster and CTA overlay. Nothing with sound autoplays — the
 * viewer taps the CTA, which starts the clip from the top with sound and native
 * controls. With `previewSrc`, a muted preview loop plays under the CTA once the player
 * is near the viewport (never with reduced motion). Reused on the home page and service
 * landing pages.
 */
export default function HookVideo({
  src,
  poster,
  previewSrc,
  ctaLabel = "Watch the video",
  ctaSub = "Tap to play with sound",
  preload = "metadata",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    const clip = previewRef.current;
    if (!previewSrc || !clip || playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clip.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          clip.pause();
          return;
        }
        if (!clip.getAttribute("src")) clip.src = previewSrc;
        clip.play().then(() => setPreviewing(true)).catch(() => {});
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(clip);
    return () => observer.disconnect();
  }, [previewSrc, playing]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = true;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPreviewing(false);
    setPlaying(true);
  };

  return (
    <div className="rcd-hook-video" data-playing={playing} data-previewing={previewing}>
      <video
        ref={videoRef}
        className="rcd-hook-video-el"
        src={src}
        poster={poster}
        playsInline
        preload={preload}
        aria-label={ctaLabel}
      />
      {previewSrc && !playing && (
        <video
          ref={previewRef}
          className="rcd-hook-video-preview"
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      {!playing && (
        <button
          type="button"
          className="rcd-hook-video-cta"
          onClick={play}
          aria-label={ctaLabel}
        >
          <span className="rcd-hook-video-play" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="rcd-hook-video-cta-text">{ctaLabel}</span>
          <span className="rcd-hook-video-cta-sub">{ctaSub}</span>
        </button>
      )}
    </div>
  );
}
