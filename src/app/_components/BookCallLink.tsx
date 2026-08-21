"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CALENDLY_URL } from "./contact-info";
import { trackLeadEvent } from "./gtag";

type Props = {
  /** Where on the page this instance sits, reported with the event. */
  context: string;
  className?: string;
  children: ReactNode;
};

/* "Book a 30-min call" — the outbound Calendly link.
 *
 * Every one of these was a plain <a> until now, which meant the highest-intent
 * action on the site was the one action no platform could see. Someone could
 * click a $30 ad, read the page, book a discovery call, and Google Ads would
 * record a bounce.
 *
 * What this fires is a *click*, not a booking — the visitor leaves for
 * calendly.com and whether they finish the flow happens somewhere we cannot
 * observe. So it is reported as book_call_click and, like click_to_call,
 * deliberately not counted as a completed lead. Counting the click would let
 * the bidding algorithms optimize toward people who open a scheduler and
 * abandon it, which is worse than not counting it at all.
 *
 * Closing that last gap properly means importing completed bookings back from
 * Calendly as offline conversions against the stored gclid. Until that exists,
 * this at least makes the intent visible instead of invisible. */
export default function BookCallLink({ context, className, children }: Props) {
  const pathname = usePathname();

  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackLeadEvent("book_call_click", { context, page: pathname })}
    >
      {children}
    </a>
  );
}
