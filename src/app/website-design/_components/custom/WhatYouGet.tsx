"use client";

import Image from "next/image";
import { type CSSProperties, useRef } from "react";
import { Check } from "lucide-react";
import { useScrollProgress } from "./use-scroll-progress";

/* What you get, custom look (Brandon's Nov 9, 2026 brief, pages 7 and 10).
 * A real client site stays in place in a browser frame while the checklist
 * ticks off one item at a time as the visitor scrolls, and the preview moves
 * between three real builds as the list goes. On phones the preview sits on
 * top and the list ticks as it enters view. Reduced motion and the pause
 * toggle show the finished list. Screenshots are the live sites' home pages,
 * captured November 9, 2026. */
const ITEMS = [
  "Custom design, built from scratch",
  "Clear writing for every page",
  "Search setup: titles, descriptions, schema, and speed",
  "Tap-to-call, forms, and booking",
  "Tested on phones and tablets",
  "Forms and phone links tested",
  "Accessibility checked",
  "Images optimized",
  "Analytics and conversion tracking on",
  "Redirects from your old site",
  "You own your site, code, and domain",
];

const SITES = [
  { id: "mend", name: "Mend Health", place: "Kirkwood, MO", domain: "mendhealthmo.com", until: 6 },
  { id: "sethanthony", name: "Seth Anthony", place: "St. Charles, MO", domain: "sethanthony.com", until: 9 },
  { id: "lindas", name: "Linda’s Specialty Cheesecakes", place: "Winfield, MO", domain: "lindascheesecakes.com", until: ITEMS.length + 1 },
];

export default function WhatYouGet() {
  const list = useRef<HTMLOListElement>(null);
  const { progress, still } = useScrollProgress(list, 0.72, 0.5);
  const checked = still ? ITEMS.length : Math.min(ITEMS.length, Math.floor(progress * ITEMS.length + 0.35));
  const active = SITES.findIndex(site => checked < site.until);
  const current = SITES[active === -1 ? SITES.length - 1 : active];

  return (
    <section className="cl-section cl-get" id="included" aria-labelledby="included-heading">
      <div className="cl-container cl-get-layout">
        <div className="cl-get-preview">
          <figure className="cl-browser">
            <div className="cl-browser-frame">
            <div className="cl-browser-bar" aria-hidden="true"><span /><span /><span /><em>{current.domain}</em></div>
            <div className="cl-browser-view">
              {SITES.map(site => (
                <Image
                  key={site.id}
                  src={`/assets/builds/desk-${site.id}.webp`}
                  width={1280}
                  height={800}
                  sizes="(max-width: 900px) 92vw, 600px"
                  alt={`The ${site.name} home page, designed and built by River City Digital`}
                  data-active={site === current || undefined}
                  aria-hidden={site === current ? undefined : true}
                />
              ))}
            </div>
            </div>
            <figcaption>{current.name} · {current.place}</figcaption>
          </figure>
        </div>
        <div className="cl-get-copy">
          <p className="cl-eyebrow">What you get</p>
          <h2 id="included-heading" className="cl-heading">Everything a great site needs.<span className="cl-second">Checked before launch.</span></h2>
          <ol className="cl-checklist" ref={list}>
            {ITEMS.map((item, index) => (
              <li key={item} data-checked={index < checked || undefined} data-next={index === checked || undefined}>
                <span className="cl-check" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                {item}
              </li>
            ))}
          </ol>
          <div className="cl-check-progress" aria-hidden="true">
            <span style={{ "--cl-checked": checked / ITEMS.length } as CSSProperties} />
          </div>
          <p className="cl-check-count" aria-hidden="true">{checked} of {ITEMS.length} checked</p>
        </div>
      </div>
    </section>
  );
}
