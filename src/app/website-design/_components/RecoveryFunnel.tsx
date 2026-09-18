"use client";

import { useEffect } from "react";
import { trackFunnel } from "./funnel";

export default function RecoveryFunnel() {
  useEffect(() => {
    trackFunnel("landing_view", true);
    const form = document.getElementById("wd-mockup-form");
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { trackFunnel("mockup_view", true); observer?.disconnect(); }
    }, { threshold: 0.15 }) : null;
    if (form) observer?.observe(form);
    const clicks = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      const href = link?.getAttribute("href");
      if (href === "#start") trackFunnel("cta_mockup");
      else if (href?.startsWith("tel:")) trackFunnel("cta_call");
    };
    const root = document.querySelector(".wd-recovery");
    root?.addEventListener("click", clicks as EventListener);
    return () => { observer?.disconnect(); root?.removeEventListener("click", clicks as EventListener); };
  }, []);
  return null;
}
