"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import Container from "@/app/_components/Container";
import SectionHeader from "@/app/_components/SectionHeader";
import { PROJECTS, type CaseStudy } from "@/app/work/_data";
import { useStage } from "@/components/three/stage-context";

/* Eight projects on one rail. Replaces three separate showings that had grown
 * on this page — a "Featured Website of the Month" block, a "Two we shipped
 * lately" pair, and a link out to /work — with one place that has all of them,
 * with the real results on the back of each card.
 *
 * The DOM is the content: every screenshot is a real <Image>, every result
 * and quote is real text, every link is a real link. The 3D slab is painted
 * OVER the screenshot by the shared Stage canvas once it exists, and the
 * moment it doesn't — no WebGL, reduced motion, a struggling phone — nothing
 * is missing, because nothing was ever only in the canvas. */

/* Numbers first. The four with hard results lead; the four whose results are
   qualitative ("Live", "Custom") follow. */
const ORDER = [
  "lucky-puppy",
  "shear-fantasy",
  "lovely-nails",
  "pet-planet",
  "the-sauce-fix",
  "mend-health",
  "the-wellness-collective",
  "confetti-and-co",
];

/* Only the live URLs we actually know. work/_data.ts carries none, and a
   guessed domain in a browser-chrome bar is worse than no link. The three
   here came from the page's previous Featured and Recent-examples blocks. */
const LIVE: Record<string, string> = {
  "the-sauce-fix": "https://thesaucefix.com",
  "mend-health": "https://www.mendhealthmo.com/",
  "the-wellness-collective": "https://wellnesscollectivehub.com/",
};

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Card({ p, index }: { p: CaseStudy; index: number }) {
  const { SlabView } = useStage();
  const shot = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  /* Two states on purpose. `flipped` drives the CSS turn immediately.
     `slabVisible` waits for the turn to finish: a View tracks its box with
     getBoundingClientRect, and mid-rotation that rect is a moving, squashed
     projection — drawing into it looks broken. So the slab hides the instant
     a flip starts and only returns once the card is flat again. */
  const [slabVisible, setSlabVisible] = useState(true);

  const live = LIVE[p.slug];
  const chromeUrl = live ? hostOf(live) : `rivercitydigitalco.com/work/${p.slug}`;

  const flip = (to: boolean) => {
    setSlabVisible(false);
    setFlipped(to);
  };
  const onTurned = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform" || e.target !== e.currentTarget) return;
    if (!flipped) setSlabVisible(true);
  };

  return (
    <figure className="rcd-rail-card" data-flipped={flipped} role="listitem">
      <div className="rcd-rail-flip" onTransitionEnd={onTurned}>
        {/* ── Front ── */}
        <div className="rcd-rail-face rcd-rail-front" aria-hidden={flipped} inert={flipped}>
          <span className="rcd-example-chrome" aria-hidden="true">
            <span className="rcd-example-dots"><i /><i /><i /></span>
            <span className="rcd-example-url">{chromeUrl}</span>
          </span>
          <div ref={shot} className="rcd-rail-shot">
            <Image
              src={p.img}
              alt={`${p.name} — ${p.sector} in ${p.where}`}
              width={1440}
              height={798}
              loading={index < 2 ? "eager" : "lazy"}
              sizes="(max-width: 720px) 86vw, 560px"
            />
            {SlabView && <SlabView track={shot} src={p.img} visible={slabVisible && !flipped} />}
          </div>
          <button type="button" className="rcd-rail-flipbtn" onClick={() => flip(true)}>
            See the results <RotateCcw size={14} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>

        {/* ── Back ── */}
        <div className="rcd-rail-face rcd-rail-back" aria-hidden={!flipped} inert={!flipped}>
          <p className="rcd-rail-back-eyebrow">{p.name} · {p.where}</p>
          <dl className="rcd-rail-results">
            {p.results.map((r) => (
              <div key={r.label}>
                <dt>{r.value}</dt>
                <dd>{r.label}</dd>
              </div>
            ))}
          </dl>
          {p.pullquote && (
            <blockquote className="rcd-rail-quote">
              <p>&ldquo;{p.pullquote.text}&rdquo;</p>
              <cite>{p.pullquote.cite}</cite>
            </blockquote>
          )}
          <div className="rcd-rail-back-actions">
            <Link href={`/work/${p.slug}`} className="btn btn-primary btn-md">Read the case study</Link>
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-md">
                Visit the live site
              </a>
            )}
            <button type="button" className="rcd-rail-flipbtn rcd-rail-flipbtn--back" onClick={() => flip(false)}>
              <RotateCcw size={14} strokeWidth={2.2} aria-hidden="true" /> Back
            </button>
          </div>
        </div>
      </div>

      <figcaption className="rcd-example-body">
        <p className="rcd-example-meta">{p.sector} · {p.services.join(" · ")}</p>
        <h3 className="rcd-example-name">{p.name}</h3>
        <p className="rcd-example-what">{p.blurb}</p>
      </figcaption>
    </figure>
  );
}

export default function WorkRail() {
  const { request } = useStage();
  const rail = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);

  /* Ask for the Stage when the rail is within reach, not on page load. This
     is the only thing that ever causes three.js to download. */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          request();
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [request]);

  const projects = ORDER.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(
    (p): p is CaseStudy => !!p,
  );

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".rcd-rail-card");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section ref={section} className="section section--civic-deep rcd-rail-section" data-theme="dark">
      <Container>
        <SectionHeader
          eyebrow="Selected work · Filed from St. Louis"
          title="Eight we shipped."
          lede="Real businesses, real numbers, real owners we still talk to. Turn any card over for the results."
        />
        <div className="rcd-rail-nav" aria-hidden="true">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous project"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next project"><ArrowRight size={18} /></button>
        </div>
      </Container>
      <div ref={rail} className="rcd-rail" role="list" aria-label="Selected work">
        {projects.map((p, i) => (
          <Card key={p.slug} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
