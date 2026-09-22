"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SelectedProject } from "./selected-projects";
import type { LiveEffect } from "./portfolio/types";

// Local hero demonstrations: no embedded third-party pages, forms, or analytics.
// Screenshots remain visible until a video/effect has actually rendered.
export default function LiveProjectPreview({ project, paused, sizes }: { project: SelectedProject; paused: boolean; sizes: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);
  const media = `/work/${project.preview}`;

  useEffect(() => {
    if (!frame.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setNear(true);
    }, { rootMargin: "200px 0px" });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = frame.current;
    if (!near || paused || !element) return;
    let disposed = false;
    let teardown = () => {};
    if (project.effect === "video") {
      const player = video.current;
      if (!player) return;
      let visible = false;
      const sync = () => {
        if (visible && !document.hidden) player.play().catch(() => setLive(false));
        else player.pause();
      };
      const ready = () => setLive(true);
      const failed = () => setLive(false);
      const observer = new IntersectionObserver(entries => {
        visible = entries[entries.length - 1].isIntersecting; sync();
      });
      player.addEventListener("playing", ready);
      player.addEventListener("error", failed);
      document.addEventListener("visibilitychange", sync);
      observer.observe(element);
      return () => { observer.disconnect(); player.pause(); player.removeEventListener("playing", ready); player.removeEventListener("error", failed); document.removeEventListener("visibilitychange", sync); setLive(false); };
    }

    void (async () => {
      let renderer: import("three").WebGLRenderer | undefined;
      let effect: LiveEffect | undefined;
      try {
        const THREE = await import("three");
        const create = project.effect === "fluid"
          ? (await import("./portfolio/fluid-sky")).createFluidSky
          : (await import("./portfolio/mend-marble")).createMendMarble;
        if (disposed || !host.current) return;
        const canvasHost = host.current;
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        const activeRenderer = renderer;
        const fit = () => activeRenderer.setSize(canvasHost.clientWidth || 1, canvasHost.clientHeight || 1, false);
        fit();
        effect = create(THREE, renderer);
        const activeEffect = effect;
        canvasHost.appendChild(renderer.domElement);
        let raf = 0, last = 0, elapsed = 0, visible = false, rendered = false, lost = false;
        const draw = (now: number) => {
          const delta = Math.min((now - last) / 1000, .05);
          last = now; elapsed += delta;
          activeEffect.render(delta, elapsed);
          if (!rendered) { rendered = true; setLive(true); }
          raf = requestAnimationFrame(draw);
        };
        const sync = () => {
          cancelAnimationFrame(raf);
          if (visible && !document.hidden && !lost) { last = performance.now(); raf = requestAnimationFrame(draw); }
        };
        const observer = new IntersectionObserver(entries => { visible = entries[entries.length - 1].isIntersecting; sync(); });
        const resize = new ResizeObserver(fit);
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          activeEffect.pointer(Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)));
        };
        const leave = () => activeEffect.leave();
        const contextLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(raf); setLive(false); };
        observer.observe(element); resize.observe(canvasHost);
        element.addEventListener("pointermove", move, { passive: true });
        element.addEventListener("pointerleave", leave);
        element.addEventListener("pointercancel", leave);
        document.addEventListener("visibilitychange", sync);
        renderer.domElement.addEventListener("webglcontextlost", contextLost);
        teardown = () => {
          cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
          element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); element.removeEventListener("pointercancel", leave);
          document.removeEventListener("visibilitychange", sync);
          activeRenderer.domElement.removeEventListener("webglcontextlost", contextLost);
          activeEffect.dispose(); activeRenderer.dispose(); activeRenderer.domElement.remove();
        };
      } catch {
        effect?.dispose(); renderer?.dispose(); renderer?.domElement.remove(); setLive(false);
      }
    })();
    return () => { disposed = true; teardown(); setLive(false); };
  }, [near, paused, project.effect]);

  return <div ref={frame} className={`wd-live-preview wd-live-${project.effect}`} data-live={live && !paused ? "true" : "false"} role="img" aria-label={`${project.name} website hero preview`}>
    <Image className="wd-live-static" src={project.effect === "marble" ? project.image : `${media}/static.webp`} alt="" width={project.effect === "marble" ? project.width : 1920} height={project.effect === "marble" ? project.height : 1800} sizes={sizes} loading="lazy" />
    {project.effect === "video" ? <video className="wd-live-layer" ref={video} src={near && !paused ? `${media}/hero.mp4` : undefined} muted loop playsInline preload="none" disablePictureInPicture disableRemotePlayback tabIndex={-1} aria-hidden="true" /> : <div className="wd-live-layer" ref={host} aria-hidden="true" />}
    {project.effect === "marble" ? <div className="wd-live-foreground wd-mend-hero" aria-hidden="true"><div className="wd-mend-nav"><strong>MEND HEALTH</strong><span>CARE THAT MOVES YOU</span></div><div className="wd-mend-content"><span>SOFT TISSUE + CHIROPRACTIC · KIRKWOOD, MO</span><strong>Soft Tissue Expertise<br />to Keep You Active</strong><p>Focused, intuitive care, combining clinical expertise, hands-on therapy, chiropractic care, and rehabilitative movement strategies tailored to your needs.</p><span className="wd-mend-cta">Book an appointment</span></div></div> : <Image className="wd-live-foreground" src={`${media}/foreground.webp`} alt="" width={1920} height={1800} sizes={sizes} loading="lazy" aria-hidden="true" />}
  </div>;
}
