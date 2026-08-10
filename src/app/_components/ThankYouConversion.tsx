"use client";

import { useEffect } from "react";
import { trackContactConversion } from "./gtag";

// Fires the Google Ads "Contact Us" conversion when a visitor lands on
// /thank-you after submitting a form. The fire is gated on the pending flag
// the forms arm before redirecting, so it counts once per submission —
// refreshes, back-button returns, direct visits, and StrictMode's
// double-invoked dev effect don't register extra conversions.
export default function ThankYouConversion({
  /** Distinguishes which thank-you page fired it in reporting. */
  source = "thank-you",
}: { source?: string } = {}) {
  useEffect(() => {
    trackContactConversion({ source });
  }, [source]);

  return null;
}
