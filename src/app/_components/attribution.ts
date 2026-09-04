/* Campaign attribution: capture it on arrival, attach it to every lead.
 *
 * /api/contact already accepts utm_* and the click IDs, and the comment there
 * explains why they matter: they are what lets a *closed deal* be imported back
 * into Google as an offline conversion later, so bidding can learn to buy leads
 * that sign rather than leads that fill in a form. Nothing on the site was
 * sending them, so that door was shut.
 *
 * The click ID only appears on the landing URL. By the time someone reaches a
 * form it may be several navigations later, and Next's client router drops the
 * query string as soon as they move. So it is captured on first paint and kept
 * in sessionStorage for the rest of the visit.
 *
 * First write wins. A visitor who arrives on an ad, wanders off to a blog post
 * and comes back through an organic link should still be credited to the ad
 * that brought them, not to the empty query string of their second entrance. */

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

export type AttributionKey = (typeof KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORE_KEY = "rcd-attribution";

/** Read the current URL's campaign parameters and remember them for the visit. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const key of KEYS) {
      const value = params.get(key)?.trim();
      // 300 is what the API truncates to; no point storing more.
      if (value) found[key] = value.slice(0, 300);
    }
    if (!Object.keys(found).length) return;
    if (sessionStorage.getItem(STORE_KEY)) return; // first touch wins
    sessionStorage.setItem(STORE_KEY, JSON.stringify(found));
  } catch {
    // Storage blocked or a malformed query string — a lead without attribution
    // is still a lead, so this never throws into the page.
  }
}

/** Whatever was captured this visit, ready to merge into a form payload. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
