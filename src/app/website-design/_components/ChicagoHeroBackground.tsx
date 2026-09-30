"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type HeroVideoClip = { id: string; src: string; mobileSrc: string; webmSrc?: string; mobileWebmSrc?: string; poster: string; mobilePoster: string };
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

function Poster({ clip }: { clip?: HeroVideoClip }) {
  return <div className="wd-chicago-video-poster" aria-hidden="true">
    {clip && <picture>
      <source media="(max-width: 760px)" srcSet={clip.mobilePoster} />
      {/* Daylight is also the no-JavaScript/reduced-motion experience. */}
      <img src={clip.poster} alt="" width={1440} height={810} fetchPriority="high" />
    </picture>}
  </div>;
}

function ClipPlayer({ clip, active, paused, loop, onPlaying, onPause, onNearEnd, onEnded, onFailed }: {
  clip: HeroVideoClip; active: boolean; paused: boolean; loop: boolean;
  onPlaying: () => void; onPause: () => void; onNearEnd: () => void; onEnded: () => void; onFailed: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = false;
    const sync = () => {
      if (!active || paused || document.hidden || !visible) element.pause();
      else void element.play().catch(() => {});
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); element.pause(); };
  }, [active, paused]);

  return <video ref={video} className="wd-chicago-video" data-clip={clip.id} data-active={active} data-ready={ready}
    muted loop={loop} playsInline preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture disableRemotePlayback
    onLoadedData={() => setReady(true)} onPlaying={() => { if (active) onPlaying(); }} onPause={() => { if (active) onPause(); }}
    onTimeUpdate={event => {
      const element = event.currentTarget;
      if (active && !paused && element.duration - element.currentTime <= 3) onNearEnd();
    }}
    onEnded={() => { if (active) onEnded(); }}
    onError={event => { if (event.target === event.currentTarget) onFailed(); }}>
    {clip.mobileWebmSrc && <source media="(max-width: 760px)" src={clip.mobileWebmSrc} type="video/webm" />}
    <source media="(max-width: 760px)" src={clip.mobileSrc} type="video/mp4" />
    {clip.webmSrc && <source src={clip.webmSrc} type="video/webm" />}
    {/* Only the final candidate failing exhausts responsive source selection. */}
    <source src={clip.src} type="video/mp4" onError={onFailed} />
  </video>;
}

function Playlist({ clips }: { clips: readonly HeroVideoClip[] }) {
  const host = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState(0);
  const [failed, setFailed] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [prepareNext, setPrepareNext] = useState(false);
  const available = clips.map((_, index) => index).filter(index => !failed.includes(index));
  const current = available.includes(cursor) ? cursor : available.find(index => index >= cursor) ?? available[0] ?? 0;
  const next = available[(available.indexOf(current) + 1) % available.length];
  // Buffer just one upcoming clip near the cut. Keep its keyed player when it
  // becomes active, so switching does not restart the download.
  const mounted = available.length ? [current, ...(prepareNext && next !== current ? [next] : [])] : [];
  const advance = () => { setCursor(next); setPrepareNext(false); setPlaying(false); };
  const toggle = () => {
    const element = host.current?.querySelector<HTMLVideoElement>('video[data-active="true"]');
    if (playing) { setPaused(true); element?.pause(); }
    else { setPaused(false); void element?.play().catch(() => {}); }
  };
  return <div ref={host} className="wd-chicago-playlist" data-current-clip={clips[current]?.id}>
    <Poster clip={clips[available.length ? current : 0]} />
    {mounted.map(index => <ClipPlayer key={clips[index].id} clip={clips[index]} active={index === current} paused={paused}
      loop={available.length === 1} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onNearEnd={() => setPrepareNext(true)} onEnded={advance}
      onFailed={() => setFailed(previous => previous.includes(index) ? previous : [...previous, index])} />)}
    <div className="wd-chicago-video-shade" aria-hidden="true" />
    {available.length > 0 && <button type="button" className="wd-video-background-control" onClick={toggle}>
      {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? "Pause background" : "Play background"}
    </button>}
  </div>;
}

export default function ChicagoHeroBackground({ clips = [] }: { clips?: readonly HeroVideoClip[] }) {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  return <div className="wd-chicago-video-background">
    {hydrated && !reduced && clips.length > 0 ? <Playlist clips={clips} /> : <>
      <Poster clip={clips[0]} /><div className="wd-chicago-video-shade" aria-hidden="true" />
    </>}
  </div>;
}
