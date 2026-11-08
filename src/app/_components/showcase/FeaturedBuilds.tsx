"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { BUILDS, type Build } from "./builds";
import { useMotionPaused } from "./motion-pause";
import styles from "./FeaturedBuilds.module.css";

// Scroll speed inside the phone, in on-screen pixels per second.
const SPEED = 150;
const HOLD_TOP = 1200;
const HOLD_BOTTOM = 1600;

/* "Watch it scroll": a phone frame slowly scrolls the selected client site
 * from top to bottom, then moves on to the next build. Clicking a build jumps
 * to it. Motion stops on hover, while off screen or in a background tab, with
 * the site-wide pause, and entirely for reduced motion. The scroll runs on a
 * transform written straight to the image, so React only re-renders when the
 * selected build changes. */
export default function FeaturedBuilds({ heading, builds = BUILDS }: { heading: ReactNode; builds?: Build[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const sitePaused = useMotionPaused();
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const build = builds[index];
  const next = builds[(index + 1) % builds.length];
  const running = visible && !hovered && !sitePaused && !reduced;

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Position persists across pauses; it resets only when the build changes.
  const position = useRef({ id: "", offset: 0, held: 0 });
  useEffect(() => {
    const frame = viewport.current;
    const img = image.current;
    if (!frame || !img) return;
    if (position.current.id !== build.id) position.current = { id: build.id, offset: 0, held: 0 };
    const state = position.current;
    const paint = (distance: number) => {
      img.style.transform = `translate3d(0, ${-state.offset}px, 0)`;
      progress.current?.style.setProperty("--progress", String(distance > 0 ? state.offset / distance : 0));
    };
    const distanceNow = () => Math.max(0, frame.clientWidth * (build.shot.height / build.shot.width) - frame.clientHeight);
    paint(distanceNow());
    if (!running) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(64, now - last);
      last = now;
      if (!document.hidden) {
        const distance = distanceNow();
        if (state.offset <= 0 && state.held < HOLD_TOP) {
          state.held += elapsed;
        } else if (state.offset < distance) {
          state.offset = Math.min(distance, state.offset + (SPEED * elapsed) / 1000);
          state.held = 0;
        } else if ((state.held += elapsed) >= HOLD_BOTTOM) {
          setIndex(current => (current + 1) % builds.length);
          return;
        }
        paint(distance);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [build, builds.length, running]);

  const select = (target: number, focus = false) => {
    setIndex(target);
    if (focus) tabs.current[target]?.focus();
    // Keep the chosen tab in view on the mobile row without moving the page.
    tabs.current[target]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (event.key in keys) {
      event.preventDefault();
      select((index + keys[event.key] + builds.length) % builds.length, true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      select(event.key === "Home" ? 0 : builds.length - 1, true);
    }
  };

  return (
    <section ref={section} className={`${styles.section} rcd-light`} id="work" aria-labelledby="builds-heading">
      <div className="wd-container">
        {heading}
        <div className={styles.layout}>
          <div className={styles.list} role="tablist" aria-label="Client builds" aria-orientation="vertical" onKeyDown={onKeyDown}>
            {builds.map((item, i) => (
              <button
                key={item.id}
                ref={element => { tabs.current[i] = element; }}
                type="button"
                role="tab"
                id={`build-tab-${item.id}`}
                aria-selected={i === index}
                aria-controls="build-panel"
                tabIndex={i === index ? 0 : -1}
                className={styles.tab}
                onClick={() => select(i)}
              >
                <span className={styles.tabNumber}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.tabText}>
                  <strong>{item.name}</strong>
                  <span>{item.meta}</span>
                </span>
                {i === index && <span ref={progress} className={styles.tabProgress} aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className={styles.stage} id="build-panel" role="tabpanel" aria-labelledby={`build-tab-${build.id}`}>
            <div
              className={styles.phone}
              onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
              onPointerLeave={() => setHovered(false)}
            >
              <div className={styles.speaker} aria-hidden="true" />
              <div ref={viewport} className={styles.screen}>
                <Image
                  key={build.id}
                  ref={image}
                  className={styles.shot}
                  src={build.shot.src}
                  width={build.shot.width}
                  height={build.shot.height}
                  alt={`${build.name} website on a phone, scrolling from top to bottom`}
                  unoptimized
                  loading={visible ? "eager" : "lazy"}
                />
                {/* Warm the next build's screenshot while this one plays. */}
                {visible && next.id !== build.id && (
                  <Image className={styles.preload} src={next.shot.src} width={next.shot.width} height={next.shot.height} alt="" aria-hidden="true" unoptimized />
                )}
              </div>
            </div>
          </div>

          <div className={styles.details}>
            <p className={styles.detailsMeta}>{build.meta}</p>
            <h3 className={styles.detailsName}>{build.name}</h3>
            <ol className={styles.callouts}>
              {build.callouts.map((callout, i) => (
                <li key={callout}><span aria-hidden="true">{i + 1}</span>{callout}</li>
              ))}
            </ol>
            <a className={styles.visit} href={build.url} target="_blank" rel="noopener noreferrer">
              Visit the live site <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> {build.domain} (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
