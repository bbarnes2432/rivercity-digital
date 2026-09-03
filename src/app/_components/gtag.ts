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
// Why taps and not connected calls. Google's other option is a forwarding
// number, which swaps the displayed number and counts a call only once it runs
// past a duration threshold. That hides the calls nobody picks up — and an
// unanswered call is a lead the ad genuinely produced, so it should not be
// invisible to reporting or to bidding. It would also put an unfamiliar number
// on a site whose whole pitch is that you reach the person who built it.
//
// The cost of counting taps is that a tap is not a call. That is the same
// objection the OAIQ_LEAD_EVENT table above raises about click_to_call, and it
// still stands. Two things keep it in bounds:
//
//   1. The action carries a fixed $500 in the Ads UI, against $750 for a form
//      submission. A tap is worth less than a captured lead because some share
//      of taps never dial, and bidding should not treat them as equal.
//   2. Mobile is ~86% of this campaign's spend, and on a phone a tap opens the
//      dialer with the number already filled in. That is a far shorter gap
//      between intent and action than a scheduler-open, which is why the
//      Calendly action is kept out of bidding and this one is not.
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
  window.gtag?.("event", name, params);
  window.fbq?.("trackCustom", name, params);

  if (OAIQ_LEAD_EVENT[name] === "custom") {
    // custom_event_name belongs in the options argument, not the props.
    window.oaiq?.("measure", "custom", { type: "custom" }, { custom_event_name: name });
  } else {
    window.oaiq?.("measure", "lead_created", { type: "customer_action" });
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

/* Enhanced conversions.
 *
 * Google Ads reported the lead-form action as "Needs attention" with one
 * issue: enhanced conversions were running in Automatic mode only, where the
 * tag guesses at form fields by scraping the page. That guess cannot work
 * here at all — the conversion fires on /thank-you, a page with no form on it
 * — so the match rate was whatever Automatic could scrape from an empty page.
 *
 * Passing the identifiers explicitly lets Google match the conversion to the
 * signed-in Google account that clicked the ad, which recovers conversions
 * that cookie-based attribution drops. Google normalizes and SHA-256 hashes
 * these in the browser before anything leaves it; the raw values never reach
 * Google and never reach us beyond the form post we already receive.
 *
 * The values ride in sessionStorage for exactly as long as the redirect from
 * the form to /thank-you takes, then are deleted whether or not the
 * conversion fired. Same-origin, same tab, and gone on close.
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

  const email = identity.email?.trim().toLowerCase();
  if (email && email.includes("@")) out.email = email;

  const phone = identity.phone?.trim();
  if (phone) {
    const e164 = toE164(phone);
    if (e164) out.phone_number = e164;
  }

  // Google wants first and last separately, lowercased and stripped of
  // punctuation. A single-word name yields a first name and no last name,
  // which is valid — a wrong last name would not be.
  const name = identity.name?.trim().replace(/\s+/g, " ").toLowerCase();
  if (name) {
    const parts = name.split(" ").map((w) => w.replace(/[^\p{L}\p{M}'-]/gu, "")).filter(Boolean);
    if (parts.length) {
      const address: Record<string, string> = { first_name: parts[0] };
      if (parts.length > 1) address.last_name = parts[parts.length - 1];
      out.address = address;
    }
  }

  return Object.keys(out).length ? out : null;
}

// Called by the forms just before they redirect, alongside
// markContactConversionPending.
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
    sessionStorage.removeItem(IDENTITY_KEY);
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
): void {
  const fire = () => {
    if (typeof window.gtag !== "function") return false;
    window.gtag("event", "conversion", { send_to: sendTo, ...params });
    return true;
  };

  // Fast path: tag already present. The usual case, whether we arrived by
  // client-side redirect from the form page or the visitor has been reading
  // long enough for the tag to have loaded.
  if (fire()) return;

  // Slow/direct load: poll until gtag is available, up to ~10s.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (fire() || tries > 40) clearInterval(timer);
  }, 250);
}

// Fire the form-submission conversion. Gated on the pending flag above, so a
// refresh of /thank-you cannot mint a second conversion out of one submission.
export function trackContactConversion(
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  if (!consumeContactConversionPending()) return;

  // Identity first, conversion second: gtag applies user_data to events sent
  // after the set call, so firing before it would send the conversion
  // unenhanced. Consume it either way so a blocked or absent identity cannot
  // leak into a later conversion on the same tab.
  const identity = consumeConversionIdentity();
  const userData = identity ? normalizeIdentity(identity) : null;
  if (userData && typeof window.gtag === "function") {
    window.gtag("set", "user_data", userData);
  }

  fireConversion(CONTACT_CONVERSION_SEND_TO, params);
}

// Fire the Calendly conversion. No pending-flag gate here, and that asymmetry
// is deliberate: the form has to arm a flag because the conversion happens on a
// *different page* than the submission, and any other arrival at that page must
// not count. A Calendly click has no redirect to survive — the click is the
// event, on the page where it happens.
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
