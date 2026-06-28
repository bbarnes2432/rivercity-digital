// Helpers for firing Google Ads conversion events via gtag.js.
// The base tag is loaded by <GoogleTag /> in the root layout.

// Conversion goal: "Contact Us" (from the Google Ads event snippet).
export const CONTACT_CONVERSION_EVENT = "ads_conversion_Contact_Us_1";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fire the Contact Us conversion. The Google tag loads with strategy
// "afterInteractive", so on a slow or direct page load gtag may not exist yet
// at the moment this runs. Rather than dropping the conversion (the old
// behavior), we retry briefly until the tag is ready, then fire exactly once.
export function trackContactConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  const fire = () => {
    if (typeof window.gtag !== "function") return false;
    window.gtag("event", CONTACT_CONVERSION_EVENT, params);
    return true;
  };

  // Fast path: tag already present (the usual case after a client-side
  // redirect from the form page, where gtag loaded on the prior page).
  if (fire()) return;

  // Slow/direct load: poll until gtag is available, up to ~10s.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (fire() || tries > 40) clearInterval(timer);
  }, 250);
}
