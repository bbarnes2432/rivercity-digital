"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const NEIGHBORHOODS = ["Gold Coast", "Lincoln Park", "West Loop", "Wicker Park", "Logan Square", "Evanston", "Wilmette", "Winnetka", "Highland Park", "Lake Forest", "Barrington", "Arlington Heights", "Schaumburg", "Lake Zurich", "Crystal Lake", "McHenry", "Spring Grove", "Naperville", "Hinsdale", "Oak Brook"];

export function NeighborhoodTicker() {
  const [paused, setPaused] = useState(false);
  return <div className="ch-neighborhoods" role="region" aria-label="Chicago and surrounding communities" data-paused={paused}>
    <div className="ch-ticker-window"><div className="ch-ticker-track"><ul>{NEIGHBORHOODS.map(name => <li key={name}>{name}<span aria-hidden="true">·</span></li>)}</ul><ul aria-hidden="true">{NEIGHBORHOODS.map(name => <li key={name}>{name}<span>·</span></li>)}</ul></div></div>
    <button type="button" className="ch-ticker-control" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play community names" : "Pause community names"} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
  </div>;
}

// A single decorative path follows section heights without changing reading order.
export function RiverThread() {
  const svg = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState({ width: 1440, height: 6500, path: "M1370 0 C1370 900 55 700 55 1500 S1370 2200 1370 3200 S55 4300 55 5200 S1370 6200 1370 6500" });
  useEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = host.clientWidth, height = host.clientHeight;
        const sections = [...host.querySelectorAll<HTMLElement>(":scope > section")];
        const gutter = width < 700 ? 12 : Math.max(25, (width - 1380) / 2);
        const xs = [width - gutter, gutter];
        let path = `M ${xs[0]} 0`, previous = 0;
        sections.forEach((section, index) => {
          const bottom = section.offsetTop + section.offsetHeight;
          const x = xs[index % 2], nextX = xs[(index + 1) % 2];
          path += ` C ${x} ${previous + 90}, ${x} ${bottom - 110}, ${x} ${bottom - 70}`;
          path += ` C ${x} ${bottom + 30}, ${nextX} ${bottom - 30}, ${nextX} ${bottom + 60}`;
          previous = bottom + 60;
        });
        setGeometry({width, height, path});
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    for (const section of host.querySelectorAll(":scope > section")) observer.observe(section);
    measure();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return <svg ref={svg} className="ch-river-thread" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true"><path d={geometry.path} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>;
}
