"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CALENDLY_URL } from "./contact-info";
import { trackBookCallConversion, trackLeadEvent } from "./gtag";

type Props = {
  /** Where on the page this instance sits, reported with the event. */
  context: string;
  className?: string;
  children: ReactNode;
};

/* "Book a 30-min call" — the outbound Calendly link.
 *
 * Every one of these was a plain <a>, which meant the highest-intent action on
 * the site was the one action no platform could see. Someone could click a $30
 * ad, read the page, book a discovery call, and Google Ads would record a
 * bounce.
 *
 * Two things fire here, and the split is the whole point. Google Ads gets a
 * real conversion, so the click stops being invisible in the reporting — but
 * against the "Book appointment" action, which is deliberately not one of the
 * campaign's bidding goals. Meta and OpenAI get book_call_click as a custom
 * event rather than a lead.
 *
 * Nothing counts it as a completed lead, because it isn't one: what we observe
 * is a *click*, and whether the visitor finishes scheduling happens on
 * calendly.com where we cannot see it. Feeding it to bidding as a lead would
 * teach the algorithms to buy people who open a scheduler and abandon it.
 *
 * Closing that last gap properly means importing completed bookings back from
 * Calendly as offline conversions against the stored gclid. Until that exists,
 * this counts the intent honestly and keeps it out of the bidding. */
export default function BookCallLink({ context, className, children }: Props) {
  const pathname = usePathname();

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackLeadEvent("book_call_click", { context, page: pathname });
        trackBookCallConversion();
      }}
    >
      {children}
    </a>
  );
}
