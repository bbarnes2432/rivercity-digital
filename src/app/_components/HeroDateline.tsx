"use client";

import { useEffect, useState } from "react";

type Filing = {
  date: string;
  text: string;
};

type Props = {
  filings: Filing[];
  /** Milliseconds between rotations. Defaults to 5000. */
  interval?: number;
};

export default function HeroDateline({ filings, interval = 5000 }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (filings.length <= 1) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setI((prev) => (prev + 1) % filings.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [filings.length, interval]);

  if (filings.length === 0) return null;

  return (
    <div className="rcd-hero-dateline" aria-live="polite" aria-atomic="true">
      <span className="rcd-hero-dateline-mark" aria-hidden="true">§</span>
      <span className="rcd-hero-dateline-track" key={i}>
        <span className="rcd-hero-dateline-date">{filings[i].date}</span>
        <span className="rcd-hero-dateline-sep" aria-hidden="true">·</span>
        <span className="rcd-hero-dateline-text">{filings[i].text}</span>
      </span>
    </div>
  );
}
