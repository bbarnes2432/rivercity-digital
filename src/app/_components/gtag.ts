// Helpers for firing Google Ads conversion events via gtag.js.
// The base tag is loaded by <GoogleTag /> in the root layout.

// Conversion goal: "Contact Us" (from the Google Ads event snippet).
export const CONTACT_CONVERSION_EVENT = "ads_conversion_Contact_Us_1";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fire the Contact Us conversion. Safe to call before gtag has loaded —
// it no-ops rather than throwing if the tag isn't present yet.
export function trackContactConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", CONTACT_CONVERSION_EVENT, params);
}
