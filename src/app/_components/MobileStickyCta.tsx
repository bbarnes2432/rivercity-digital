"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  href: string;
  label: string;
  /** Pixel scroll position before the bar appears. Defaults to ~one viewport. */
  showAfter?: number;
  /** ID of an element near which the bar should hide (e.g. the contact form). */
  hideNearId?: string;
};

export default function MobileStickyCta({
  href,
  label,
  showAfter = 520,
  hideNearId = "contact",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        let near = false;
        if (hideNearId) {
          const el = document.getElementById(hideNearId);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Hide when the target is within or above the viewport.
            near = rect.top < window.innerHeight - 80;
          }
        }
        setVisible(y > showAfter && !near);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [showAfter, hideNearId]);

  return (
    <div className="rcd-mobile-cta" data-visible={visible} aria-hidden={!visible}>
      <Link href={href} className="rcd-mobile-cta-btn">
        <span>{label}</span>
        <span className="rcd-mobile-cta-arr" aria-hidden="true" />
      </Link>
    </div>
  );
}
