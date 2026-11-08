"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMotionPaused } from "./motion-pause";
import styles from "./DetailTiles.module.css";

/* One standout custom feature per build. Clips were recorded from each live
 * site on November 8, 2026 (ring viewer spun by mouse, squeegee wiped by a
 * scripted pointer, before/after slider dragged). Stills pan slowly instead. */
type Tile = {
  id: string;
  client: string;
  headline: string;
  size: "large" | "standard";
  url: string;
  media:
    | { kind: "clip"; mp4: string; webm: string; poster: string; width: number; height: number }
    | { kind: "still"; src: string; width: number; height: number };
};

const clip = (id: string, width: number, height: number) => ({
  kind: "clip" as const,
  mp4: `/assets/builds/${id}.mp4`,
  webm: `/assets/builds/${id}.webm`,
  poster: `/assets/builds/${id}-poster.webp`,
  width,
  height,
});

const TILES: Tile[] = [
  { id: "seth", client: "Seth Anthony Atelier", headline: "Spin the ring before you buy it", size: "large", url: "https://sethanthony.com/", media: clip("seth", 800, 632) },
  { id: "alwaysclean", client: "Always Clean", headline: "A hero that wipes itself clean", size: "standard", url: "https://www.alwaysclean.biz/", media: clip("alwaysclean", 640, 480) },
  { id: "wellness", client: "The Wellness Collective", headline: "A calm, animated welcome", size: "standard", url: "https://www.wellnesscollectivehub.com/", media: clip("wellness", 640, 426) },
  { id: "lindas", client: "Linda’s Specialty Cheesecakes", headline: "A flavor menu that makes you hungry", size: "standard", url: "https://lindascheesecakes.com/", media: { kind: "still", src: "/assets/builds/lindas-tile.webp", width: 900, height: 1069 } },
  { id: "robinsons", client: "Robinson’s Contracting", headline: "Real jobs, real photos", size: "standard", url: "https://robinsonsbuilds.com/", media: clip("robinsons", 640, 382) },
  { id: "mend", client: "Mend Health", headline: "Pricing and booking, no guesswork", size: "standard", url: "https://www.mendhealthmo.com/", media: { kind: "still", src: "/assets/builds/mend-tile.webp", width: 900, height: 938 } },
];

function TileClip({ media, label, playing }: { media: Extract<Tile["media"], { kind: "clip" }>; label: string; playing: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = video.current;
    if (!element || reduced) return;
    let inView = false;
    const sync = () => {
      if (playing && inView && !document.hidden) void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.35 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); element.pause(); };
  }, [playing, reduced]);

  // Reduced motion gets the still frame only; the clip is never loaded.
  if (reduced) {
    return <Image className={styles.media} src={media.poster} width={media.width} height={media.height} alt={label} unoptimized loading="lazy" />;
  }
  return (
    <video
      ref={video}
      className={styles.media}
      poster={media.poster}
      width={media.width}
      height={media.height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      disablePictureInPicture
      disableRemotePlayback
    >
      <source src={media.webm} type="video/webm" />
      <source src={media.mp4} type="video/mp4" />
    </video>
  );
}

export default function DetailTiles({ heading }: { heading: ReactNode }) {
  const paused = useMotionPaused();
  return (
    <section className={`${styles.section} rcd-light`} aria-labelledby="details-heading">
      <div className="wd-container">
        {heading}
        <ul className={styles.grid}>
          {TILES.map(tile => {
            const label = `${tile.client}: ${tile.headline.toLowerCase()}`;
            return (
              <li key={tile.id} className={styles.tile} data-size={tile.size}>
                <div className={styles.frame} data-kind={tile.media.kind}>
                  {tile.media.kind === "clip"
                    ? <TileClip media={tile.media} label={label} playing={!paused} />
                    : <Image className={`${styles.media} ${styles.pan}`} src={tile.media.src} width={tile.media.width} height={tile.media.height} alt={label} unoptimized loading="lazy" />}
                </div>
                <div className={styles.caption}>
                  <h3>{tile.headline}</h3>
                  <a href={tile.url} target="_blank" rel="noopener noreferrer">
                    {tile.client}<span className="sr-only"> website (opens in a new tab)</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
