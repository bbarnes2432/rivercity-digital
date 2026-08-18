"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Page views for client-side navigations, split out of <OpenAiPixel /> so the
// init snippet itself can stay in a server component and be inlined into the
// SSR HTML. A "use client" component's inline <Script> is only injected after
// hydration, which delays the pixel by the whole JS boot on exactly the
// bounce-prone paid traffic it exists to measure.
//
// The first pathname is skipped: the init snippet already measured it.
export default function OpenAiPixelRouteEvents() {
  const pathname = usePathname();
  const seenFirstPath = useRef(false);

  useEffect(() => {
    if (!seenFirstPath.current) {
      seenFirstPath.current = true;
      return;
    }
    window.oaiq?.("measure", "page_viewed", {
      type: "contents",
      contents: [{ id: pathname, name: document.title, content_type: "page" }],
    });
  }, [pathname]);

  return null;
}
