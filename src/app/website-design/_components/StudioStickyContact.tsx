"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import CallLink from "@/app/_components/CallLink";
import BookCallLink from "@/app/_components/BookCallLink";

/* `book` is the service-page version: "Book a free call" opens Calendly. The
 * focused paid pages keep an anchor to their own on-page form. */
export default function StudioStickyContact({ primaryLabel = "Free mockup", book = false }: { primaryLabel?: string; book?: boolean }) {
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
    {book
      ? <BookCallLink context="website-design-mobile-sticky" className="wd-button wd-button-mint">Book a free call <ArrowUpRight size={16} /></BookCallLink>
      : <a href="#start" className="wd-button wd-button-mint">{primaryLabel} <ArrowUpRight size={16} /></a>}
    <CallLink context="website-design-mobile-sticky" className="wd-sticky-call">{book ? "Call us" : "Call River City"}</CallLink>
  </div>;
}
