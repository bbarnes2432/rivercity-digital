import type { Metadata } from "next";
import "./quad-cities.css";
import Faq from "../_components/Faq";
import Folio from "../_components/Folio";
import ScrollReveal from "../_components/ScrollReveal";
import { QcFooter, QcHeader } from "./_components/QcChrome";
import QcForm from "./_components/QcForm";
import QcVideo from "./_components/QcVideo";
import SampleFrame from "./_components/SampleFrame";
import CallLink from "./_components/CallLink";
import QcStickyCall from "./_components/QcStickyCall";
import {
  CLOSING,
  CUSTOM_BLOCKS,
  FAQ,
  FIND_IT,
  HERO,
  LOCAL_ANGLE,
  REVIEW,
  STEPS,
  VIDEO,
  WORK_SAMPLES,
} from "./_data";

/* =========================================================================
   /quad-cities — paid traffic landing page
   =========================================================================

   Deliberately NOT indexed. A page built purely to receive ad traffic, then
   indexed and competing in organic results, is exactly what Google's doorway
   page guidance targets — and it would compete against our own service pages
   for the same terms. `follow` stays on so internal links still pass normally.

   For the same reason this page is not linked from the main nav or the footer
   and is absent from the sitemap. It is reachable by ad click and direct link
   only. It is also NOT disallowed in robots.txt: blocking the crawl would stop
   Google from ever reading the noindex it's supposed to obey.

   One page, not four. People there say "the Quad Cities", not their individual
   city, and four near-identical pages with the city name swapped is a doorway
   pattern. Geographic relevance comes from ad targeting, not from the URL.
   ========================================================================= */

export const metadata: Metadata = {
  title: "Quad Cities Web Design | River City Digital Co.",
  description:
    "Custom websites for Quad Cities businesses — Davenport, Bettendorf, Rock Island and Moline. Built by a Davenport native.",
  robots: { index: false, follow: true },
};

const publishedSamples = WORK_SAMPLES.filter((sample) => sample.published);

/* Section numbers are derived, not hard-coded. The video section only renders
   once RCD's file lands, and a static §05 sitting on "How it works" today that
   silently becomes §06 tomorrow is the kind of detail that makes a page look
   unmaintained. Listed in render order; a section that doesn't render doesn't
   take a number. */
const NUMBERED_SECTIONS: string[] = [
  "local-angle",
  "work",
  "custom",
  "find",
  ...(VIDEO.src ? ["video"] : []),
  "how",
  "faq",
];

const folio = (key: string) => NUMBERED_SECTIONS.indexOf(key) + 1;

export default function QuadCitiesPage() {
  return (
    <>
      <QcHeader />

      <main id="main" className="qc-page">
        {/* ---- 1 · Hero + form ------------------------------------------
            The single highest-impact requirement on the page: ad traffic
            arrives with no context and no patience, so the form sits beside
            the headline on desktop and directly under it on mobile — never
            below a full-height hero image, never after the video. The hero
            carries no photograph at all, which keeps a text node as the LCP
            element and nothing heavy in front of it. */}
        <section className="qc-hero">
          <div className="qc-hero-water" aria-hidden="true" />
          <div className="qc-container qc-hero-inner">
            <div className="qc-hero-copy">
              <p className="qc-hero-eyebrow">{HERO.eyebrow}</p>
              <h1 className="qc-hero-title">{HERO.headline}</h1>
              <p className="qc-hero-sub">{HERO.subhead}</p>
              <ul className="qc-hero-proof">
                <li>Custom built, no templates</li>
                <li>Two to three weeks, typical</li>
                <li>You own the site</li>
              </ul>
            </div>

            <div className="qc-hero-form" id="start">
              <h2 className="qc-form-heading">{HERO.formHeading}</h2>
              <QcForm variant="hero" />
              <p className="qc-form-foot">
                {HERO.formNote} Or call{" "}
                <CallLink context="hero-form" className="qc-form-call" icon={false} />.
              </p>
            </div>
          </div>
        </section>

        {/* ---- 2 · The local angle ---------------------------------------
            Immediately below the hero because it is the differentiator, not
            an afterthought. The one thing a competing agency cannot copy. */}
        <section className="qc-section qc-section--paper">
          <div className="qc-container qc-narrow">
            <Folio number={folio("local-angle")} title="The local angle" date="Mile 483" />
            <h2 className="qc-h2">{LOCAL_ANGLE.title}</h2>
            <div className="qc-angle-body fx-reveal">
              {LOCAL_ANGLE.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="qc-gauge fx-reveal" aria-hidden="true">
              {LOCAL_ANGLE.gauge.map((point, i) => (
                <div className="qc-gauge-point" key={point.place}>
                  <span className="qc-gauge-mile">Mile {point.mile}</span>
                  <span className="qc-gauge-tick" />
                  <span className="qc-gauge-place">{point.place}</span>
                  {i === 0 && <span className="qc-gauge-span">≈ 300 river miles</span>}
                </div>
              ))}
            </div>
            <p className="qc-gauge-note">{LOCAL_ANGLE.gaugeNote}</p>
          </div>
        </section>

        {/* ---- 3 · Work samples -------------------------------------------
            Proof early — cold traffic needs it before it needs detail. */}
        <section className="qc-section qc-section--deep">
          <div className="qc-container">
            <Folio number={folio("work")} title="Recent work" tone="dark" />
            <h2 className="qc-h2 qc-h2--light">Sites we&rsquo;ve shipped.</h2>
            <p className="qc-lede qc-lede--light">
              Four builds, none of them a template. Screenshots below — we&rsquo;re not going
              to send you off this page to go look at them.
            </p>

            <div className="qc-samples fx-stagger">
              {publishedSamples.map((sample) => (
                <SampleFrame key={sample.slug} sample={sample} />
              ))}
            </div>
          </div>
        </section>

        {/* ---- 4 · What a custom site gets you ---------------------------
            Handles the "why not a template" objection. Orientation, not
            education — short blocks, no essay. */}
        <section className="qc-section qc-section--paper">
          <div className="qc-container">
            <Folio number={folio("custom")} title="Custom vs. template" />
            <h2 className="qc-h2">What you actually get for building it properly.</h2>

            <div className="qc-blocks fx-stagger">
              {CUSTOM_BLOCKS.map((block, i) => (
                <div className="qc-block" key={block.title}>
                  <span className="qc-block-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="qc-block-title">{block.title}</h3>
                  <p className="qc-block-body">{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 5 · And then people have to find it ------------------------
            The pivot from website to search. Plant the idea — don't sell the
            monthly program here. */}
        <section className="qc-section qc-section--sunken">
          <div className="qc-container qc-narrow">
            <Folio number={folio("find")} title="Getting found" />
            <h2 className="qc-h2">{FIND_IT.title}</h2>
            <p className="qc-lede qc-lede--strong">{FIND_IT.lede}</p>

            <ul className="qc-points fx-stagger">
              {FIND_IT.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- 6 · Video --------------------------------------------------
            Below the fold, never above the form. Renders only when RCD's file
            is in place; until then the section collapses cleanly and the page
            reads as if it was never meant to be there. */}
        {VIDEO.src && (
          <section className="qc-section qc-section--deep">
            <div className="qc-container qc-narrow">
              <Folio number={folio("video")} title="Ninety seconds" tone="dark" />
              <h2 className="qc-h2 qc-h2--light">{VIDEO.heading}</h2>
              <p className="qc-lede qc-lede--light">{VIDEO.lede}</p>
              <QcVideo src={VIDEO.src} poster={VIDEO.poster} captions={VIDEO.captions} />
            </div>
          </section>
        )}

        {/* ---- 7 · Review -------------------------------------------------
            A real Google review, quoted in part and attributed to the
            platform. Collapses if REVIEW is null rather than falling back to
            an invented testimonial. */}
        {REVIEW && (
          <section className="qc-section qc-section--paper qc-section--tight">
            <div className="qc-container qc-narrow">
              <figure className="qc-review fx-reveal">
                <div
                  className="qc-review-stars"
                  role="img"
                  aria-label={`${REVIEW.stars} out of 5 stars`}
                >
                  {Array.from({ length: REVIEW.stars }, (_, i) => (
                    <svg key={i} width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="qc-review-quote">{REVIEW.quote}</blockquote>
                <figcaption className="qc-review-cite">
                  <strong>{REVIEW.author}</strong>
                  <span>{REVIEW.meta}</span>
                  <span className="qc-review-platform">{REVIEW.platform}</span>
                </figcaption>
              </figure>
            </div>
          </section>
        )}

        {/* ---- 8 · How it works ------------------------------------------
            Removes the fear of an open-ended commitment. */}
        <section className="qc-section qc-section--sunken">
          <div className="qc-container">
            <Folio number={folio("how")} title="How it works" />
            <h2 className="qc-h2">Three steps. Then you decide.</h2>

            <ol className="qc-steps fx-stagger">
              {STEPS.map((step) => (
                <li className="qc-step" key={step.n}>
                  <span className="qc-step-n">{step.n}</span>
                  <h3 className="qc-step-title">{step.title}</h3>
                  <p className="qc-step-body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- 9 · FAQ ---------------------------------------------------
            Native <details>/<summary> with the answers server-rendered and
            present in the HTML on load — the same technical standard we hold
            client sites to. No FAQPage schema: the page is noindex, so schema
            would serve no purpose and the combination is contradictory. */}
        <section className="qc-section qc-section--paper">
          <div className="qc-container qc-narrow">
            <Folio number={folio("faq")} title="Questions" />
            <h2 className="qc-h2">Before you call.</h2>
            <Faq items={FAQ.map((item) => ({ q: item.q, a: item.a }))} />
          </div>
        </section>

        {/* ---- 10 · Closing CTA -------------------------------------------
            Nobody scrolls back up, so the form repeats in full rather than
            pointing at an anchor. */}
        <section className="qc-section qc-section--deep qc-closing" id="closing">
          <div className="qc-hero-water" aria-hidden="true" />
          <div className="qc-container qc-closing-inner">
            <div className="qc-closing-copy">
              <h2 className="qc-h2 qc-h2--light">{CLOSING.title}</h2>
              <p className="qc-lede qc-lede--light">{CLOSING.body}</p>
              <p className="qc-closing-call">
                Rather talk it through?{" "}
                <CallLink context="closing" className="qc-closing-call-link" />
              </p>
            </div>

            <div className="qc-hero-form">
              <QcForm variant="closing" />
            </div>
          </div>
        </section>
      </main>

      <QcFooter />
      <QcStickyCall />
      <ScrollReveal />
    </>
  );
}
