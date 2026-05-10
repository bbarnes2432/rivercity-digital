"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
};

type Props = {
  items: TocItem[];
};

/**
 * Editorial table of contents for articles. Sticky on the side, scroll-spy
 * active state, smooth-scroll on click. Generated from the article's h2
 * blocks server-side; this component just renders + wires interactivity.
 */
export default function ArticleToc({ items }: Props) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -65% 0px", threshold: 0 },
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="rcd-toc" aria-label="Table of contents">
      <p className="rcd-toc-label">In this filing</p>
      <ol className="rcd-toc-list">
        {items.map((it, i) => (
          <li
            key={it.id}
            className="rcd-toc-item"
            data-active={activeId === it.id ? "true" : "false"}
          >
            <a href={`#${it.id}`}>
              <span className="rcd-toc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="rcd-toc-text">{it.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
