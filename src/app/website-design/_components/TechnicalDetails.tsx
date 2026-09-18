"use client";

import { ReactNode, useEffect, useRef } from "react";

// Keep existing technical content and deep links available without putting the
// whole comparison/software journey ahead of a paid visitor's inquiry.
export default function TechnicalDetails({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const revealLinkedSection = () => {
      let id: string;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const target = document.getElementById(id);
      if (target && root.current?.contains(target)) {
        root.current.open = true;
        requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
      }
    };
    revealLinkedSection();
    addEventListener("hashchange", revealLinkedSection);
    return () => removeEventListener("hashchange", revealLinkedSection);
  }, []);
  return <details ref={root} className="wd-technical-details" id="website-details"><summary className="wd-container"><span>Want the technical detail?<small>Compare platforms, search foundations and custom business tools.</small></span><span aria-hidden="true">+</span></summary>{children}</details>;
}
