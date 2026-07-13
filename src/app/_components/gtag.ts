// Helpers for firing Google Ads conversion events via gtag.js.
// The base tag is loaded by <GoogleTag /> in the root layout.

// Conversion action: "Form Submission – Thank You Page" (from the Google Ads
// event snippet). This is the send_to target — account ID + conversion label —
// exactly as Google generates it. The conversion only records when we fire
// gtag('event', 'conversion', { send_to: <this> }).
export const CONTACT_CONVERSION_SEND_TO = "AW-18272669855/2Bt9COmvsMccEJ-hi4lE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// The conversion must fire once per *form submission*, not once per visit to
// /thank-you. Otherwise a refresh, a back-button return, a bookmarked visit,
// or React StrictMode's double-invoked effect in dev each register an extra
// conversion. The forms arm this flag just before redirecting, and
// trackContactConversion consumes it — no flag, no fire.
//
// The in-memory flag covers the normal client-side redirect (router.push keeps
// the JS context alive); sessionStorage is a fallback in case the navigation
// ever happens as a full page load (e.g. version skew after a deploy).
const PENDING_KEY = "rcd-contact-conversion-pending";
let pendingInMemory = false;

export function markContactConversionPending(): void {
  if (typeof window === "undefined") return;
  pendingInMemory = true;
  try {
    sessionStorage.setItem(PENDING_KEY, "1");
  } catch {
    // Storage blocked — the in-memory flag still covers the SPA redirect.
  }
}

function consumeContactConversionPending(): boolean {
  let pending = pendingInMemory;
  pendingInMemory = false;
  try {
    if (sessionStorage.getItem(PENDING_KEY) === "1") {
      pending = true;
      sessionStorage.removeItem(PENDING_KEY);
    }
  } catch {
    // Storage blocked — fall through with the in-memory result.
  }
  return pending;
}

// Fire the form-submission conversion. The Google tag loads with strategy
// "afterInteractive", so on a slow or direct page load gtag may not exist yet
// at the moment this runs. Rather than dropping the conversion (the old
// behavior), we retry briefly until the tag is ready, then fire exactly once.
export function trackContactConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  if (!consumeContactConversionPending()) return;

  const fire = () => {
    if (typeof window.gtag !== "function") return false;
    window.gtag("event", "conversion", {
      send_to: CONTACT_CONVERSION_SEND_TO,
      ...params,
    });
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
