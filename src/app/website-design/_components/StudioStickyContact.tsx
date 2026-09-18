"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import CallLink from "@/app/_components/CallLink";

export default function StudioStickyContact() {
  const [formVisible, setFormVisible] = useState(false);
  useEffect(() => {
    const form = document.getElementById("wd-mockup-form");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  return <div className={`wd-sticky-contact${formVisible ? " is-hidden" : ""}`} aria-label="Quick contact">
    <a href="#start" className="wd-button wd-button-mint">Free mockup <ArrowUpRight size={16} /></a>
    <CallLink context="website-design-mobile-sticky" className="wd-sticky-call">Call River City</CallLink>
  </div>;
}
