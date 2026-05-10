"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".fx-reveal",
  ".fx-stagger",
  ".fx-blur-in",
  ".fx-scale-in",
  ".fx-slide-left",
  ".fx-slide-right",
  ".fx-letter",
  ".fx-mask-rise",
  ".fx-tick",
  ".deco-rule--draw",
].join(", ");

/**
 * Wires up reveal-on-scroll for any element with one of the fx-* reveal classes.
 * Adds `data-revealed="true"` once they enter the viewport.
 * Also splits .fx-letter children into per-word spans for the letter-stagger.
 * Renders nothing — purely behavioral.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    /* Letter-stagger preprocessing: wrap each whitespace-separated word in a
     * .fx-word span so the CSS can stagger them. We do this before observing. */
    document.querySelectorAll<HTMLElement>(".fx-letter").forEach((el) => {
      if (el.dataset.lettered === "true") return;
      const original = el.innerText;
      if (!original) return;
      const wrapped = original
        .split(/(\s+)/)
        .map((part, i) => {
          if (/^\s+$/.test(part)) return part;
          return `<span class="fx-word" style="--w:${i};">${part}</span>`;
        })
        .join("");
      el.innerHTML = wrapped;
      el.dataset.lettered = "true";
    });

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) =>
        el.setAttribute("data-revealed", "true"),
      );
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-revealed", "true");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => io.observe(el));

    /* Set inline --i index for stagger children where not already set */
    document.querySelectorAll<HTMLElement>(".fx-stagger").forEach((parent) => {
      Array.from(parent.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        if (!el.style.getPropertyValue("--i")) {
          el.style.setProperty("--i", String(idx));
        }
      });
    });

    return () => io.disconnect();
  }, []);

  return null;
}
