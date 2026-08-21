"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { PHONE } from "./contact-info";
import { trackLeadEvent } from "./gtag";

type Props = {
  /** Where on the page this instance sits — reported with the event so the
   *  nav, hero and form CTAs can be compared against each other rather than
   *  collapsing into one undifferentiated "someone tapped the number". */
  context: string;
  className?: string;
  /** Defaults to the formatted number itself. */
  children?: ReactNode;
  /** Small phone glyph before the label. */
  icon?: boolean;
};

/* The site-wide tracked phone link.
 *
 * The /quad-cities page has had one of these since August; the rest of the
 * site had no phone number at all, which meant the ~40% of local-service leads
 * that arrive by phone had nowhere to land. This is the same component with
 * the page taken from the router instead of hard-coded, so it can be dropped
 * anywhere.
 *
 * Renders the number as text as well as in the href on purpose: a visitor on a
 * desktop needs to be able to read and dial it, not just tap it. */
export default function CallLink({ context, className, children, icon = true }: Props) {
  const pathname = usePathname();

  return (
    <a
      href={PHONE.href}
      className={className}
      onClick={() => trackLeadEvent("click_to_call", { context, page: pathname })}
    >
      {icon && <Phone size={15} strokeWidth={2} aria-hidden="true" />}
      <span>{children ?? PHONE.display}</span>
    </a>
  );
}
