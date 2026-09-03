"use client";

import { ReactNode } from "react";
import { PHONE } from "../_data";
import { trackClickToCallConversion, trackLeadEvent } from "../../_components/gtag";

type Props = {
  /** Where on the page this instance sits — reported with the event so the
   *  header, hero and closing CTAs can be compared. */
  context: string;
  className?: string;
  /** Defaults to the formatted number itself. */
  children?: ReactNode;
  /** Small phone glyph before the label. */
  icon?: boolean;
};

/* The only thing on this page that renders a phone number.
 *
 * Both the number and the tel: href come from one constant in _data.ts, so a
 * call-tracking number can be swapped in without touching a single section —
 * which is the whole reason this is a component and not an <a> tag repeated
 * six times. */
export default function CallLink({ context, className, children, icon = true }: Props) {
  return (
    <a
      href={PHONE.href}
      className={className}
      onClick={() => {
        trackLeadEvent("click_to_call", { context, page: "/quad-cities" });
        trackClickToCallConversion({ context, page: "/quad-cities" });
      }}
    >
      {icon && (
        <svg
          className="qc-call-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )}
      <span>{children ?? PHONE.display}</span>
    </a>
  );
}
