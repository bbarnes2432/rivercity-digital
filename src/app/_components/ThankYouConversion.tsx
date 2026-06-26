"use client";

import { useEffect } from "react";
import { trackContactConversion } from "./gtag";

// Fires the Google Ads "Contact Us" conversion once, on mount, when a
// visitor lands on /thank-you after submitting a form. Centralizing the
// conversion here means every contact-style form counts the same way.
export default function ThankYouConversion() {
  useEffect(() => {
    trackContactConversion({ source: "thank-you" });
  }, []);

  return null;
}
