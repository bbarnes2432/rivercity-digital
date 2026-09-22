"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import CallLink from "@/app/_components/CallLink";

export default function StudioStickyContact() {
  const [formVisible, setFormVisible] = useState(true);
  useEffect(() => {
    const targets = document.querySelectorAll(".wd-hero, #wd-mockup-form, #final-request");
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setFormVisible(visible.size > 0);
    });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  return <div className={`wd-sticky-contact${formVisible ? " is-hidden" : ""}`} aria-label="Quick contact">
    <a href="#start" className="wd-button wd-button-mint">Free mockup <ArrowUpRight size={16} /></a>
    <CallLink context="website-design-mobile-sticky" className="wd-sticky-call">Call River City</CallLink>
  </div>;
}
