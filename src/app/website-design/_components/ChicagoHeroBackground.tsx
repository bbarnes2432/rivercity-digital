"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export default function ChicagoHeroBackground({ src, mobileSrc, poster, mobilePoster }: { src?: string; mobileSrc?: string; poster?: string; mobilePoster?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  // Do not put an autoplay source in server HTML before motion preferences are known.
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  const canPlay = hydrated && !reduced;
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element || !src || !canPlay || failed) return;
    let visible = true;
    const update = () => {
      if (reduced || paused || document.hidden || !visible) element.pause();
      else void element.play().catch(() => {});
    };
    const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); update(); });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); element.pause(); };
  }, [src, mobileSrc, reduced, paused, canPlay, failed]);
  const togglePlayback = () => {
    if (playing) { setPaused(true); video.current?.pause(); }
    else {
      setPaused(false);
      // A direct gesture can retry playback when the browser blocked autoplay.
      void video.current?.play().catch(() => {});
    }
  };
  return <div className="wd-chicago-video-background">
    <div className="wd-chicago-video-poster" aria-hidden="true">
      {poster && <picture>
        {mobilePoster && <source media="(max-width: 760px)" srcSet={mobilePoster} />}
        {/* Native picture selects one local poster before hydration, including reduced-motion visits. */}
        <img src={poster} alt="" width={1440} height={810} fetchPriority="high" />
      </picture>}
    </div>
    {src && canPlay && !failed && <video ref={video} className="wd-chicago-video" data-ready={ready} muted loop playsInline autoPlay preload="none" aria-hidden="true" tabIndex={-1} onLoadedData={() => setReady(true)} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={event => {
      // Browsers also emit source errors for a nonmatching responsive candidate.
      // Only a video decode error or failure of the final source exhausts playback.
      if (event.target === event.currentTarget) setFailed(true);
    }}>
      {mobileSrc && <source media="(max-width: 760px)" src={mobileSrc} type="video/mp4" />}
      <source src={src} type="video/mp4" onError={() => setFailed(true)} />
    </video>}
    <div className="wd-chicago-video-shade" aria-hidden="true" />
    {src && canPlay && !failed && <button type="button" className="wd-video-background-control" onClick={togglePlayback}>{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? "Pause background" : "Play background"}</button>}
  </div>;
}
