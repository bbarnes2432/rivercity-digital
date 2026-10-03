"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const NEIGHBORHOODS = ["Gold Coast", "Lincoln Park", "West Loop", "Wicker Park", "Logan Square", "Evanston", "Wilmette", "Winnetka", "Highland Park", "Lake Forest", "Barrington", "Arlington Heights", "Schaumburg", "Lake Zurich", "Crystal Lake", "McHenry", "Spring Grove", "Naperville", "Hinsdale", "Oak Brook"];

type RiverPoint = { x: number; y: number };
const pointText = ({ x, y }: RiverPoint) => `${x.toFixed(1)},${y.toFixed(1)}`;
const halfway = (a: RiverPoint, b: RiverPoint) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
function smoothRiver(points: RiverPoint[], closed = false) {
  if (points.length < 2) return "";
  const last = points[points.length - 1];
  let path = `M${pointText(closed ? halfway(last, points[0]) : points[0])}`;
  for (let index = closed ? 0 : 1; index < points.length - (closed ? 0 : 1); index++) {
    path += ` Q${pointText(points[index])} ${pointText(halfway(points[index], points[(index + 1) % points.length]))}`;
  }
  return path + (closed ? " Z" : ` L${pointText(last)}`);
}

export function NeighborhoodTicker() {
  const [paused, setPaused] = useState(false);
  return <div className="ch-neighborhoods" role="region" aria-label="Chicago and surrounding communities" data-paused={paused}>
    <div className="ch-ticker-window"><div className="ch-ticker-track"><ul>{NEIGHBORHOODS.map(name => <li key={name}>{name}<span aria-hidden="true">·</span></li>)}</ul><ul aria-hidden="true">{NEIGHBORHOODS.map(name => <li key={name}>{name}<span>·</span></li>)}</ul></div></div>
    <button type="button" className="ch-ticker-control" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play community names and river animation" : "Pause community names and river animation"} title={paused ? "Play community names and river animation" : "Pause community names and river animation"} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>
  </div>;
}

// Decorative river: banks and water share one path through the section gutters.
export function RiverThread() {
  const svg = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const [geometry, setGeometry] = useState({ width: 1440, height: 6500, water: "", depth: "", course: "", length: 0 });
  useEffect(() => {
    const host = svg.current?.parentElement;
    if (!host) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = host.clientWidth, height = host.clientHeight;
        const sections = [...host.querySelectorAll<HTMLElement>(":scope > section")];
        const contentWidths = sections.map(section => section.firstElementChild?.clientWidth ?? 0).filter(value => value > width / 2 && value < width);
        const margin = contentWidths.length ? (width - Math.max(...contentWidths)) / 2 : 48;
        const gutter = Math.max(8, margin / 2);
        const bend = Math.min(42, gutter * .58);
        const xs = [width - gutter, gutter];
        let path = `M ${xs[0]} 0`, previous = 0;
        sections.forEach((section, index) => {
          const bottom = section.offsetTop + section.offsetHeight;
          const x = xs[index % 2], nextX = xs[(index + 1) % 2];
          const span = bottom - 68 - previous;
          const direction = index % 2 ? 1 : -1;
          path += ` C ${x + bend * direction} ${previous + span * .14}, ${x - bend * direction} ${previous + span * .24}, ${x} ${previous + span * .38}`;
          path += ` C ${x + bend * direction * .7} ${previous + span * .56}, ${x - bend * direction} ${previous + span * .78}, ${x} ${bottom - 68}`;
          // Cross through the whitespace between sections, away from the copy.
          const middle = width * (index % 2 ? .46 : .54);
          path += ` C ${x} ${bottom + 46}, ${x + (middle - x) * .48} ${bottom - 27}, ${middle} ${bottom + 5}`;
          path += ` C ${middle + (nextX - middle) * .55} ${bottom + 39}, ${nextX} ${bottom - 36}, ${nextX} ${bottom + 68}`;
          previous = bottom + 68;
        });
        // Vary the banks naturally instead of drawing a uniform-width stripe.
        // This runs only when layout changes; there is no scroll/animation loop.
        const guide = document.createElementNS("http://www.w3.org/2000/svg", "path");
        guide.setAttribute("d", path);
        const length = guide.getTotalLength();
        const samples = Math.ceil(length / 16);
        const bankA: RiverPoint[] = [], bankB: RiverPoint[] = [], depthA: RiverPoint[] = [], depthB: RiverPoint[] = [];
        const halfWidth = Math.min(17, margin * .23);
        for (let index = 0; index <= samples; index++) {
          const distance = length * index / samples;
          const point = guide.getPointAtLength(distance);
          const before = guide.getPointAtLength(Math.max(0, distance - 1));
          const after = guide.getPointAtLength(Math.min(length, distance + 1));
          const dx = after.x - before.x, dy = after.y - before.y;
          const magnitude = Math.hypot(dx, dy) || 1;
          const normalX = -dy / magnitude, normalY = dx / magnitude;
          // Open into wider pools at crossings; stay narrow beside the content.
          const crossing = Math.pow(Math.abs(dx / magnitude), 3);
          const bankWidth = (halfWidth + crossing * (width < 700 ? 6 : 11)) * (.8 + .18 * Math.sin(distance / 137) + .1 * Math.sin(distance / 51));
          const coordinate = (offset: number) => ({ x: point.x + normalX * offset, y: point.y + normalY * offset });
          bankA.push(coordinate(bankWidth));
          bankB.push(coordinate(-bankWidth * (.93 + .1 * Math.sin(distance / 83))));
          depthA.push(coordinate(bankWidth * (.34 + .15 * Math.sin(distance / 93))));
          depthB.push(coordinate(-bankWidth * (.5 + .1 * Math.sin(distance / 121))));
        }
        setGeometry({width, height, water: smoothRiver([...bankA, ...bankB.reverse()], true), depth: smoothRiver([...depthA, ...depthB.reverse()], true), course: path, length});
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    for (const section of host.querySelectorAll(":scope > section")) observer.observe(section);
    measure();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const river = svg.current;
    const ticker = river?.parentElement?.previousElementSibling;
    if (!river) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (reduced.matches || document.hidden || ticker?.getAttribute("data-paused") === "true") river.pauseAnimations();
      else river.unpauseAnimations();
    };
    const observer = new MutationObserver(syncMotion);
    if (ticker) observer.observe(ticker, {attributes: true, attributeFilter: ["data-paused"]});
    reduced.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    syncMotion();
    return () => { observer.disconnect(); reduced.removeEventListener("change", syncMotion); document.removeEventListener("visibilitychange", syncMotion); };
  }, []);
  const rippleCount = geometry.length ? Math.ceil(geometry.length / 145) : 0;
  const flowSeconds = geometry.length / 23;
  return <svg ref={svg} className="ch-river-thread" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <path id={`${id}-course`} d={geometry.course} />
      {/* The filtered tile is only 128px square, not a page-sized filter surface. */}
      <filter id={`${id}-water-grain`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".045 .085" numOctaves="2" seed="12" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues=".08 .58" />
          <feFuncG type="table" tableValues=".32 .79" />
          <feFuncB type="table" tableValues=".37 .82" />
          <feFuncA type="table" tableValues="0 .7" />
        </feComponentTransfer>
      </filter>
      <pattern id={`${id}-water-tile`} patternUnits="userSpaceOnUse" width="128" height="128">
        <rect width="128" height="128" filter={`url(#${id}-water-grain)`} />
        <path d="M-16 31 Q12 19 45 31 T112 31 T179 31 M-38 91 Q-10 79 23 91 T90 91 T157 91" fill="none" stroke="#b1d5d5" strokeOpacity=".3" strokeWidth="1.4" />
        <path d="M-41 64 Q-9 48 22 64 T86 64 T150 64" fill="none" stroke="#357780" strokeOpacity=".25" strokeWidth="2.3" />
      </pattern>
      <radialGradient id={`${id}-current-tone`}><stop stopColor="#357780" stopOpacity=".38" /><stop offset="1" stopColor="#357780" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-ripple-tone`}><stop stopColor="#91c3c7" stopOpacity="0" /><stop offset=".45" stopColor="#c1dedc" stopOpacity=".65" /><stop offset="1" stopColor="#91c3c7" stopOpacity="0" /></linearGradient>
      <clipPath id={`${id}-banks`}><path d={geometry.water} /></clipPath>
    </defs>
    <g strokeLinejoin="round">
      <path className="ch-river-shore" d={geometry.water} />
      <path className="ch-river-water" d={geometry.water} />
      <path className="ch-river-depth" d={geometry.depth} />
      <g clipPath={`url(#${id}-banks)`}>
        <path className="ch-river-surface" d={geometry.water} fill={`url(#${id}-water-tile)`} />
        {Array.from({length: rippleCount}, (_, index) => <g className="ch-river-current" key={index}>
          {/* Every ripple uses the same increasing path distance, including bends. */}
          <animateMotion dur={`${flowSeconds}s`} begin={`${-flowSeconds * index / rippleCount}s`} rotate="auto" repeatCount="indefinite" calcMode="paced">
            <mpath href={`#${id}-course`} />
          </animateMotion>
          <g transform={`scale(${.78 + (index % 4) * .1} ${.72 + (index % 3) * .15})`}>
            <ellipse rx="53" ry="24" fill={`url(#${id}-current-tone)`} />
            <path d="M-46 -8 Q-17 -17 14 -6 T49 -3 Q20 -1 5 -4 T-46 -8 M-31 7 Q-3 0 28 10 Q9 13 -8 9 T-31 7" fill={`url(#${id}-ripple-tone)`} />
          </g>
        </g>)}
      </g>
    </g>
  </svg>;
}
