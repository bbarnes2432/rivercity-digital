"use client";

import { useRef, useState } from "react";
import "./HookVideo.css";

type Props = {
  /** Path to the video file under /public. */
  src: string;
  /** Poster image shown before the video plays. */
  poster?: string;
  /** Overlay CTA label shown over the poster. */
  ctaLabel?: string;
  /** Smaller line under the CTA label. */
  ctaSub?: string;
};

/**
 * Click-to-play video with a poster and CTA overlay. Nothing autoplays — the
 * viewer taps the CTA, which starts the clip from the top with sound and native
 * controls. Reused on the home page and service landing pages.
 */
export default function HookVideo({
  src,
  poster,
  ctaLabel = "Watch the video",
  ctaSub = "Tap to play with sound",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = true;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <div className="rcd-hook-video" data-playing={playing}>
      <video
        ref={videoRef}
        className="rcd-hook-video-el"
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        aria-label={ctaLabel}
      />
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
