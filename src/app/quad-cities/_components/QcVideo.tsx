"use client";

import { useRef, useState } from "react";

type Props = {
  src: string;
  poster: string | null;
  /** WebVTT track, if the captions aren't burned into the file. */
  captions: string | null;
};

/* Click-to-play only, and `preload="none"` so not a single video byte is
 * fetched until somebody asks for it. Video is the fastest way to wreck a
 * Lighthouse score, and landing page experience feeds Quality Score directly —
 * on this page speed is a cost line, not a nicety. The poster is a plain <img>
 * with native lazy loading rather than next/image so it can't compete with the
 * hero for LCP. */
export default function QcVideo({ src, poster, captions }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    video.controls = true;
    video.play().catch(() => {
      // Autoplay policy or a codec the browser won't take — the native
      // controls are already visible, so the viewer can start it themselves.
    });
    setPlaying(true);
  }

  return (
    <div className="qc-video" data-playing={playing}>
      <video
        ref={videoRef}
        className="qc-video-el"
        src={src}
        poster={poster ?? undefined}
        preload="none"
        playsInline
      >
        {captions && (
          <track kind="captions" src={captions} srcLang="en" label="English" default />
        )}
      </video>

      {!playing && (
        <button type="button" className="qc-video-cta" onClick={play}>
          <span className="qc-video-play" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="qc-video-label">Play the video</span>
          <span className="qc-video-sub">Under 90 seconds</span>
        </button>
      )}
    </div>
  );
}
