import type { Metadata } from "next";
import "../quad-cities.css";
import ThankYouConversion from "../../_components/ThankYouConversion";
import { QcFooter, QcHeader } from "../_components/QcChrome";
import CallLink from "../_components/CallLink";
import { EMAIL } from "../_data";

/* A real URL, not an inline success message.
 *
 * An inline confirmation means no URL change, which means the conversion event
 * never fires, which means both ad platforms optimize blind — they keep buying
 * whatever traffic looked busy rather than whatever traffic converted. */

export const metadata: Metadata = {
  title: "Thanks — River City Digital Co.",
  description: "Your note landed. We'll be in touch within a day, usually the same day.",
  robots: { index: false, follow: true },
};

export default function QuadCitiesThankYouPage() {
  return (
    <>
      {/* Gated on the flag the form arms just before redirecting, so it counts
          once per submission rather than once per visit to this URL. */}
      <ThankYouConversion source="quad-cities" />

      <QcHeader />

      <main id="main" className="qc-page qc-thanks">
        <section className="qc-section qc-section--deep qc-thanks-hero">
          <div className="qc-hero-water" aria-hidden="true" />
          <div className="qc-container qc-narrow">
            <p className="qc-hero-eyebrow">Got it</p>
            <h1 className="qc-thanks-title">That&rsquo;s landed.</h1>
            <p className="qc-lede qc-lede--light">
              We&rsquo;ll come back to you within a day — usually the same day. The person
              who reads your note is the person who&rsquo;d do the work.
            </p>

            <div className="qc-thanks-actions">
              <CallLink context="thank-you" className="qc-thanks-call" />
              <a href={`mailto:${EMAIL}`} className="qc-thanks-mail">
                {EMAIL}
              </a>
            </div>

            <p className="qc-thanks-note">
              If it&rsquo;s urgent, calling is faster than waiting on our reply.
            </p>
          </div>
        </section>
      </main>

      <QcFooter />
    </>
  );
}
