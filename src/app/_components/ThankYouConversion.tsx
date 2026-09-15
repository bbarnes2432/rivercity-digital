"use client";

import { useEffect } from "react";
import { trackContactConversion } from "./gtag";

// Fallback for an older form version or a full-page navigation before Google
// is ready. Current forms claim the event on delivery success. A same-document
// effect cannot claim it twice; queued events have no stored pending token, so
// a refresh, back-button return or direct visit cannot create another event.
export default function ThankYouConversion({
  /** Distinguishes which thank-you page fired it in reporting. */
  source = "thank-you",
}: { source?: string } = {}) {
  useEffect(() => {
    trackContactConversion({ source });
  }, [source]);

  return null;
}
