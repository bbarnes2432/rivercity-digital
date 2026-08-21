/* One source of truth for how a human reaches River City Digital.
 *
 * These lived in quad-cities/_data.ts, which was fine while /quad-cities was
 * the only page that showed a phone number. The St. Louis pages need one too,
 * so they moved here and that file re-exports them — a second copy would be a
 * second thing to forget when a call-tracking number gets swapped in.
 *
 * Swap PHONE here and every rendered instance follows. */

export const PHONE = {
  /** What a visitor reads. */
  display: "(636) 338-1408",
  /** E.164 for the tel: href. */
  href: "tel:+16363381408",
} as const;

export const EMAIL = "hello@rivercitydigitalco.com";

/* The 30-minute discovery call. Highest-intent action on the site and, until
 * now, the only one that left no trace anywhere — it is an outbound link to
 * Calendly, so nothing on our side ever fired. <BookCallLink /> exists so the
 * click is at least visible in reporting; see the note there about why the
 * click is not counted as a completed lead. */
export const CALENDLY_URL = "https://calendly.com/hello-rivercitydigitalco/30min";
