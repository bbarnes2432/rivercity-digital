"use client";

import { useEffect, useState } from "react";
import CallLink from "./CallLink";

/* Slim mobile call bar. Appears once the hero form has scrolled away and
 * hides again over the closing CTA, so it never covers the thing it's meant
 * to be a shortcut to.
 *
 * A bar, not an overlay: Google and Meta both police intrusive interstitials
 * on ad destinations, and a modal or a takeover here would put the campaign at
 * risk. The page reserves matching bottom padding so it never sits on top of
 * content either. */
export default function QcStickyCall() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const closing = document.getElementById("closing");
      const nearClosing = closing
        ? closing.getBoundingClientRect().top < window.innerHeight - 80
        : false;
      setVisible(window.scrollY > 620 && !nearClosing);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // `inert` rather than aria-hidden alone: the bar is still in the layout
    // when hidden, and aria-hidden over focusable links would leave them
    // tabbable but unannounced.
    <div className="qc-sticky" data-visible={visible} inert={!visible}>
      <a className="qc-sticky-ghost" href="#start">
        Get a plan
      </a>
      <CallLink context="sticky-mobile" className="qc-sticky-call">
        Call now
      </CallLink>
    </div>
  );
}
