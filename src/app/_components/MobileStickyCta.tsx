"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CallLink from "./CallLink";

type Props = {
  href: string;
  label: string;
  /** Pixel scroll position before the bar appears. Defaults to ~one viewport. */
  showAfter?: number;
  /** ID of an element near which the bar should hide (e.g. the contact form). */
  hideNearId?: string;
  /** Set false to drop the call button and show only the primary action. */
  call?: boolean;
};

/* The mobile sticky bar: call on the left, the page's own primary action on
 * the right.
 *
 * It used to be a single button pointing at the form. On the ads landing page
 * that made the phone the one lead route with no persistent way to reach it,
 * even though phone is the faster path for a local service and mobile is the
 * large majority of paid traffic. The call button is the same tracked
 * <CallLink /> used everywhere else, so a tap here reports the lead event and
 * fires the click-to-call conversion without this component knowing anything
 * about either.
 *
 * The call button is deliberately the narrower, quieter one: it takes only the
 * width its label needs, and the primary action keeps the rest of the row and
 * the accent colour. */
export default function MobileStickyCta({
  href,
  label,
  showAfter = 520,
  hideNearId = "contact",
  call = true,
}: Props) {
  const LinkElement = href.includes("#") ? "a" : Link;
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
      <div className="rcd-mobile-cta-row" data-call={call ? "" : undefined}>
        {call && (
          <CallLink context="mobile-sticky" className="rcd-mobile-cta-call">
            Call
          </CallLink>
        )}
        <LinkElement href={href} className="rcd-mobile-cta-btn">
          <span>{label}</span>
          <span className="rcd-mobile-cta-arr" aria-hidden="true" />
        </LinkElement>
      </div>
    </div>
  );
}
