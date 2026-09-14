"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Enhance server-rendered content; without JS, every section stays visible. */
export default function StudioMotion() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const page = document.querySelector<HTMLElement>(".wd-page");
    if (!page) return;

    const elements = Array.from(page.querySelectorAll<HTMLElement>("[data-entrance]"));
    const timers = new Map<HTMLElement, number>();
    const inset = Math.min(96, Math.round(window.innerHeight * 0.12));
    const finish = (element: HTMLElement) => {
      window.clearTimeout(timers.get(element));
      timers.delete(element);
      element.dataset.enterState = "done";
      observer.unobserve(element);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (element.dataset.enterState !== "pending") return;
        // Fast scrolling and anchor jumps must never strand hidden content.
        if (entry.boundingClientRect.bottom <= 0) {
          finish(element);
        } else if (entry.isIntersecting) {
          element.dataset.enterState = "running";
          observer.unobserve(element);
          // Release transforms even if animationend is interrupted or absent.
          timers.set(element, window.setTimeout(() => finish(element), 1800));
        }
      });
    }, { rootMargin: "0px 0px -" + inset + "px 0px", threshold: 0 });

    elements.forEach((element) => {
      // Don't hide content a visitor can already see, including a deep link.
      if (element.getBoundingClientRect().top < window.innerHeight - inset) {
        element.dataset.enterState = "done";
      } else {
        element.dataset.enterState = "pending";
        observer.observe(element);
      }
    });

    const onAnimationEnd = (event: AnimationEvent) => {
      const element = event.target;
      if (element instanceof HTMLElement && element.dataset.enterState === "running") finish(element);
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const element = event.target.closest<HTMLElement>("[data-entrance]");
      if (element) finish(element);
    };
    page.addEventListener("animationend", onAnimationEnd);
    page.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      page.removeEventListener("animationend", onAnimationEnd);
      page.removeEventListener("focusin", onFocus);
      elements.forEach((element) => delete element.dataset.enterState);
    };
  }, [reducedMotion]);

  return null;
}
