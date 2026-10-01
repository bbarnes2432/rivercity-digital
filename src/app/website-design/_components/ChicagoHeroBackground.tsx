"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type HeroVideoClip = { id: string; src: string; mobileSrc: string; webmSrc?: string; mobileWebmSrc?: string; poster: string; mobilePoster: string };
type Playback = { mobile: boolean; webm: boolean };

export function heroVideoSource(clip: HeroVideoClip, playback: Playback, fallback = false) {
  const mp4 = playback.mobile ? clip.mobileSrc : clip.src;
  const webm = playback.mobile ? clip.mobileWebmSrc : clip.webmSrc;
  return playback.webm && !fallback && webm ? webm : mp4;
}

function ClipPlayer({ clip, playback, active, paused, loop, onPlaying, onPause, onNearEnd, onEnded, onFailed }: {
  clip: HeroVideoClip; playback: Playback; active: boolean; paused: boolean; loop: boolean;
  onPlaying: () => void; onPause: () => void; onNearEnd: () => void; onEnded: () => void; onFailed: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);
  const src = heroVideoSource(clip, playback, fallback);
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
  }, [active, paused, src]);

  // Select one size/format; only fetch the MP4 fallback after a WebM failure.
  return <video ref={video} src={src} className="wd-chicago-video" data-clip={clip.id} data-active={active} data-ready={ready}
    muted loop={loop} playsInline preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture disableRemotePlayback
    onLoadedData={() => setReady(true)} onPlaying={() => { if (active) onPlaying(); }} onPause={() => { if (active) onPause(); }}
    onTimeUpdate={event => {
      const element = event.currentTarget;
      if (active && !paused && !element.paused && element.duration - element.currentTime <= 3) onNearEnd();
    }}
    onEnded={() => { if (active) onEnded(); }}
    onError={() => {
      const mp4 = playback.mobile ? clip.mobileSrc : clip.src;
      if (src !== mp4 && !fallback) { setReady(false); setFallback(true); }
      else onFailed();
    }} />;
}

function Playlist({ clips, playback }: { clips: readonly HeroVideoClip[]; playback: Playback }) {
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
  return <div ref={host} className="wd-chicago-playlist" data-current-clip={clips[current]?.id} data-video-size={playback.mobile ? "mobile" : "desktop"}>
    {mounted.map(index => <ClipPlayer key={clips[index].id} clip={clips[index]} playback={playback} active={index === current} paused={paused}
      loop={available.length === 1} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onNearEnd={() => setPrepareNext(true)} onEnded={advance}
      onFailed={() => setFailed(previous => previous.includes(index) ? previous : [...previous, index])} />)}
    {available.length > 0 && <button type="button" className="wd-video-background-control" onClick={toggle}>
      {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? "Pause background" : "Play background"}
    </button>}
  </div>;
}

export default function ChicagoHeroBackground({ clips = [] }: { clips?: readonly HeroVideoClip[] }) {
  const reduced = useReducedMotion();
  const poster = useRef<HTMLImageElement>(null);
  const [playback, setPlayback] = useState<Playback | null>(null);
  const first = clips[0];
  useEffect(() => {
    const image = poster.current;
    if (reduced || !image || !first) return;
    let cancelled = false, scheduled = false;
    let frame1 = 0, frame2 = 0, idle = 0, timer = 0;
    const start = () => {
      if (cancelled) return;
      const media = document.createElement("video");
      setPlayback({ mobile: window.matchMedia("(max-width: 760px)").matches, webm: !!media.canPlayType('video/webm; codecs="vp9"') });
    };
    const afterPaint = () => {
      if (cancelled || scheduled) return;
      scheduled = true;
      frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => {
          if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 1000 });
          else timer = window.setTimeout(start, 0);
        });
      });
    };
    const loaded = () => { void image.decode().catch(() => {}).then(afterPaint); };
    image.addEventListener("load", loaded);
    image.addEventListener("error", afterPaint);
    if (image.complete) loaded();
    return () => {
      cancelled = true;
      image.removeEventListener("load", loaded); image.removeEventListener("error", afterPaint);
      cancelAnimationFrame(frame1); cancelAnimationFrame(frame2); window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [first, reduced]);

  return <div className="wd-chicago-video-background" data-media-loading="poster-first-v2">
    {/* Keep the same daylight picture through hydration and every clip switch.
        Avoid extra poster requests and new image candidates at each transition. */}
    <div className="wd-chicago-video-poster" aria-hidden="true">{first && <picture>
      <source media="(max-width: 760px)" srcSet={first.mobilePoster} />
      <img ref={poster} src={first.poster} alt="" width={1440} height={810} fetchPriority="high" loading="eager" />
    </picture>}</div>
    {playback && !reduced && clips.length > 0 && <Playlist clips={clips} playback={playback} />}
    <div className="wd-chicago-video-shade" aria-hidden="true" />
  </div>;
}
