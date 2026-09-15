// Helpers for firing Google Ads conversion events via gtag.js.
// The base tag is loaded by <GoogleTag /> in the root layout.

// Conversion action: "Lead form submission" (from the Google Ads event
// snippet). This is the send_to target — account ID + conversion label —
// exactly as Google generates it. The conversion only records when we fire
// gtag('event', 'conversion', { send_to: <this> }).
//
// Replaces "Form Submission – Thank You Page", whose label was
// AW-18272669855/2Bt9COmvsMccEJ-hi4lE. That action sat in Google's "Page views"
// category, so the account was nominally optimizing toward people viewing a
// page rather than toward leads. Category is fixed to the action, not editable,
// so correcting it meant a new action and a new label. The old one keeps its
// history and is demoted to a secondary action.
//
// Copy this string by hand at your peril — it contains both a digit 1 and a
// lowercase L. Take it from the event snippet in the Ads UI.
export const CONTACT_CONVERSION_SEND_TO = "AW-18272669855/Xo1xCOeAm-UcEJ-hi4lE";

// Conversion action: "Calendly booking click", in Google's "Book appointment"
// category. Same warning as above — this label contains a lowercase L, not a
// one, and both an o and an O. Take it from the event snippet, never a
// screenshot.
//
// The action carries a fixed $375 value set in the Ads UI, so nothing here
// passes `value`: with "use the same value for each conversion" Google ignores
// whatever the tag sends. $375 is half of the $750 a lead is worth, because
// opening a scheduler is not the same as booking, and the drop-off in between
// belongs in the number rather than being quietly rounded up.
//
// It is deliberately kept out of bidding, behind two independent guards, because
// creating it promoted "Book appointment" to an account-default goal and thereby
// silently added it to what Smart Bidding chases:
//
//   1. The action itself is marked *secondary*, so it reports into "All
//      conversions" and is never used for optimization. (Google forces the first
//      action in a category to be primary at creation time and only lets you
//      demote it afterwards, so this cannot be set until the action exists.)
//   2. The campaign is pinned to campaign-specific conversion goals — phone call
//      leads and lead form submissions — rather than account-default, so it is
//      also immune to whatever else lands in the account defaults later.
//
// Either one alone would do it. Both, because the failure is silent and the
// symptom is money spent buying people who open a scheduler and abandon it.
export const BOOK_CALL_CONVERSION_SEND_TO = "AW-18272669855/8xdTCKT7oOUcEJ-hi4lE";

// Conversion action: "Click to call (website)", in Google's "Contact" category.
// A tap on the site's phone number. Same label warning as the two above — this
// one contains a zero (not an O) right after the hyphen, and a lowercase L
// (not a one) in "hi4lE". Taken from the event snippet and verified character
// by character, never off a screenshot.
//
// This action was made secondary on September 14, 2026. Keep it for measuring
// phone-button intent, including taps that do not become connected calls.
// Actual website calls use the separate WEBSITE_CALL action configured in
// website-call-tracking.ts, with a 60-second minimum duration and primary goal.
// Never fire that actual-call conversion from this click handler.
//
// As with Calendly, no `value` is passed from here: the action is set to "use
// the same value for each conversion", so Google ignores whatever the tag sends.
export const CLICK_TO_CALL_CONVERSION_SEND_TO = "AW-18272669855/qO_3CNOS3-0cEJ-hi4lE";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    oaiq?: (...args: unknown[]) => void;
  }
}

// The lead events the site reports on. Keep this list closed: new pages get
// distinguished in reporting by page path and UTM, never by inventing an event
// name. Fragmenting the names is how you end up with two platforms optimizing
// against two different definitions of a conversion.
//
// book_call_click was added when the Calendly links were finally instrumented.
// It is a new *kind* of action rather than a per-page rename of an existing one
// — which is the thing this list exists to prevent — so it earns a name.
export type LeadEvent =
  | "form_submit"
  | "quote_request"
  | "click_to_call"
  | "book_call_click";

// The OpenAI pixel accepts only its own closed vocabulary of event names, so
// our names have to be translated rather than passed through — an unrecognized
// name is dropped as "unsupported_event_name", not recorded as a custom event.
//
// click_to_call is deliberately NOT reported as lead_created. A tap on a phone
// number is intent, not a completed hand-off; counting it as a lead would let
// OpenAI optimize toward taps that never connect, which is the same
// conversion-definition drift the closed LeadEvent list exists to prevent.
// It goes through oaiq's documented "custom" escape hatch instead, keeping the
// distinction visible in reporting without inflating the lead count.
//
// book_call_click sits in the same bucket and for the same reason: the visitor
// leaves for calendly.com and whether they finish scheduling happens off-site,
// where we cannot observe it. A completed booking becomes a real lead only when
// it is imported back as an offline conversion against the stored gclid.
const OAIQ_LEAD_EVENT: Record<LeadEvent, "lead_created" | "custom"> = {
  form_submit: "lead_created",
  quote_request: "lead_created",
  click_to_call: "custom",
  book_call_click: "custom",
};

// Report a lead event to every analytics destination configured on the page.
//
// gtag() fans out to whatever the base tag has been configured with, so these
// land in Google Ads today and will land in GA4 the moment a G- property is
// added to <GoogleTag /> — no per-page change needed.
//
// The fbq call is deliberately unguarded by any pixel ID of our own: when the
// existing RCD Meta pixel is added to the layout, fbq becomes defined and these
// start firing. Until then it's a no-op, not an error.
//
// oaiq is the odd one out and does not receive `params`. It validates event
// props against a closed schema and *drops the whole event* on any field it
// doesn't document — customer_action permits only type/amount/currency, so
// forwarding our context keys would silently lose the conversion rather than
// annotate it. The context is not lost: OpenAI records the page URL with the
// event anyway, which is where `page` and `context` were being read from.
export function trackLeadEvent(
  name: LeadEvent,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  // Each destination is optional. A pixel error after email delivery must not
  // turn a successful inquiry into a form error or stop the other destinations.
  try { window.gtag?.("event", name, params); } catch { /* Analytics only. */ }
  try { window.fbq?.("trackCustom", name, params); } catch { /* Analytics only. */ }
  try {
    if (OAIQ_LEAD_EVENT[name] === "custom") {
      // custom_event_name belongs in the options argument, not the props.
      window.oaiq?.("measure", "custom", { type: "custom" }, { custom_event_name: name });
    } else {
      window.oaiq?.("measure", "lead_created", { type: "customer_action" });
    }
  } catch { /* Analytics only. */ }
}

// The conversion must fire once per *form submission*, not once per visit to
// /thank-you. Otherwise a refresh, a back-button return, a bookmarked visit,
// or React StrictMode's double-invoked effect in dev each register an extra
// conversion. A successful form claims its pending token before redirecting.
// Repeated effects cannot claim it again in this document. Storage is cleared
// once queued (or after the bounded timeout), so a full navigation before tag
// readiness can still resume the pending event on the thank-you page.
//
// The in-memory flag covers the normal client-side redirect (router.push keeps
// the JS context alive); sessionStorage is a fallback in case the navigation
// ever happens as a full page load (e.g. version skew after a deploy).
const PENDING_KEY = "rcd-contact-conversion-pending";
let pendingInMemory: string | null = null;
let pendingSequence = 0;
const claimedPending = new Set<string>();

export function markContactConversionPending(): void {
  if (typeof window === "undefined") return;
  pendingInMemory = `pending-${Date.now()}-${++pendingSequence}`;
  try {
    sessionStorage.setItem(PENDING_KEY, pendingInMemory);
  } catch {
    // Storage blocked — the in-memory flag still covers the SPA redirect.
  }
}

function claimContactConversionPending(): string | null {
  let pending = pendingInMemory;
  try {
    pending ||= sessionStorage.getItem(PENDING_KEY);
  } catch {
    // Storage blocked — fall through with the in-memory result.
  }
  if (!pending || claimedPending.has(pending)) return null;
  claimedPending.add(pending);
  pendingInMemory = null;
  return pending;
}

function finishContactConversion(pending: string): void {
  try {
    // A second submission can start while the first waits for Google. Do not
    // let the first event remove the newer submission's pending identity.
    if (sessionStorage.getItem(PENDING_KEY) === pending) {
      sessionStorage.removeItem(IDENTITY_KEY);
      sessionStorage.removeItem(PENDING_KEY);
    }
  } catch { /* The in-memory claim still prevents duplicate effects. */ }
}

/* Enhanced conversions.
 *
 * Successful forms supply matching data alongside the conversion. The stored
 * identity also supports the thank-you fallback for an older form version.
 * Configure that data when the Google tag is ready, immediately before the
 * corresponding conversion. A delayed tag must not lose the explicit data.
 * Google's recent "No recent data" diagnostic does not establish its cause.
 *
 * Passing the identifiers explicitly lets Google match the conversion to the
 * signed-in Google account that clicked the ad, which recovers conversions
 * that cookie-based attribution drops. Google normalizes and SHA-256 hashes
 * these in the browser before anything leaves it; the raw values never reach
 * Google and never reach us beyond the form post we already receive.
 *
 * Values are removed from sessionStorage when the event is queued or the
 * bounded tag retry expires. Until then, same-tab storage allows a full-page
 * navigation to resume the pending event. No longer-lived storage is added.
 *
 * Normalization follows Google's rules: email trimmed and lowercased, phone
 * in E.164. Anything we cannot put in that shape is left out rather than sent
 * malformed, since a bad identifier is worse than a missing one — it can match
 * the wrong person.
 */
type ConversionIdentity = {
  email?: string;
  phone?: string;
  name?: string;
};

const IDENTITY_KEY = "rcd-conversion-identity";
let identityInMemory: ConversionIdentity | null = null;

// US numbers only, which is every number this business takes. Ten digits gets
// a +1; eleven starting with 1 is already country-coded. Anything else is a
// typo or an international number we cannot safely normalize, so it is dropped.
function toE164(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
}

function normalizeIdentity(identity: ConversionIdentity): Record<string, unknown> | null {
  const out: Record<string, unknown> = {};

  const email = typeof identity.email === "string" ? identity.email.trim().toLowerCase() : "";
  // This form does not collect a full postal address. Email is the required
  // matching key; phone alone is not sufficient for enhanced conversions.
  if (!email || !email.includes("@")) return null;
  out.email = email;

  const phone = typeof identity.phone === "string" ? identity.phone.trim() : "";
  if (phone) {
    const e164 = toE164(phone);
    if (e164) out.phone_number = e164;
  }

  // Address matching requires first/last name, country and postal code. Do
  // not send an incomplete address or add fields to the lead form for it.

  return out;
}

// Called by the successful-submission helper (or an older form version),
// alongside markContactConversionPending.
export function markConversionIdentity(identity: ConversionIdentity): void {
  if (typeof window === "undefined") return;
  identityInMemory = identity;
  try {
    sessionStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  } catch {
    // Storage blocked — the in-memory copy still covers the SPA redirect.
  }
}

function consumeConversionIdentity(): ConversionIdentity | null {
  let identity = identityInMemory;
  identityInMemory = null;
  try {
    const raw = sessionStorage.getItem(IDENTITY_KEY);
    if (!identity && raw) identity = JSON.parse(raw) as ConversionIdentity;
  } catch {
    // Storage blocked or the value was not JSON — use the in-memory copy.
  }
  return identity;
}

// Report a conversion to Google Ads, waiting for the tag if it isn't up yet.
//
// The Google tag loads with strategy "afterInteractive", so on a slow or direct
// page load gtag may not exist at the moment a conversion happens. Rather than
// dropping it (the old behavior), we retry until the tag is ready and then fire
// exactly once. Every conversion on the site goes through here, so this retry
// exists once instead of being reinvented, subtly differently, per call site.
function fireConversion(
  sendTo: string,
  params: Record<string, unknown>,
  userData: Record<string, unknown> | null = null,
  onSettled: () => void = () => {},
): void {
  const fire = () => {
    if (typeof window.gtag !== "function") return false;
    // Keep the matching data and conversion in the same readiness callback.
    // This ordering applies to both an already-ready and a delayed tag.
    try {
      if (userData) window.gtag("set", "user_data", userData);
    } catch { /* Matching failure must not prevent the base conversion. */ }
    try {
      window.gtag("event", "conversion", { send_to: sendTo, ...params });
      return true;
    } catch {
      // Retry only an unavailable/throwing tag, using the same bounded window.
      // Never throw into a successful form's delivery handler.
      return false;
    }
  };

  // Fast path: tag already present. The usual case, whether we arrived by
  // client-side redirect from the form page or the visitor has been reading
  // long enough for the tag to have loaded.
  if (fire()) { onSettled(); return; }

  // Slow/direct load: poll until gtag is available, up to ~10s.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (fire() || tries > 40) { clearInterval(timer); onSettled(); }
  }, 250);
}

// Fire the form-submission conversion. Gated on the pending flag above, so a
// refresh of /thank-you cannot mint a second conversion out of one submission.
export function trackContactConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const pending = claimContactConversionPending();
  if (!pending) return;

  // Consume once now, then let fireConversion set the matching data only
  // when the tag is ready. Repeated thank-you effects cannot arm another send.
  const identity = consumeConversionIdentity();
  const userData = identity ? normalizeIdentity(identity) : null;
  fireConversion(CONTACT_CONVERSION_SEND_TO, params, userData, () => finishContactConversion(pending));
}

// Call only after /api/contact confirms production delivery. Queue the Google
// event here: navigating to or loading /thank-you is not part of lead success.
// The pending claim deduplicates a later effect in this document. A full-page
// navigation can resume the stored event if the tag is not ready yet.
export function trackSuccessfulLead(
  identity: ConversionIdentity,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  markConversionIdentity(identity);
  markContactConversionPending();
  trackContactConversion(params);
  trackLeadEvent("form_submit", params);
}

// Fire the Calendly conversion. No pending-flag gate here: the click itself is
// the secondary event. Form events need the gate because the success handler
// and compatibility thank-you effect may both run for one submission.
//
// Repeat clicks are collapsed by the action's "count: one" setting in Google
// Ads, which dedupes to one conversion per ad click server-side, where it can
// see across page loads and sessions and we cannot.
export function trackBookCallConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  fireConversion(BOOK_CALL_CONVERSION_SEND_TO, params);
}

// Fire the click-to-call conversion. Like the Calendly one, the click is the
// event and happens on the page where it is observed, so there is no pending
// flag to survive a redirect. Repeat taps collapse to one conversion per ad
// click through the action's "count: one" setting, which dedupes server-side
// across page loads and sessions in a way the page cannot.
export function trackClickToCallConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  fireConversion(CLICK_TO_CALL_CONVERSION_SEND_TO, params);
}
