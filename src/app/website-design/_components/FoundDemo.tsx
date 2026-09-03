"use client";

import { useEffect, useRef, useState } from "react";

/* Two panels, drawn live. Left: a Google result for a St. Louis search,
 * with the rich pieces (rating, sitelinks, a question) that only appear
 * when the site hands Google the data. Right: an AI assistant answering
 * the same need by name and citing the site. The search is typed out, the
 * result lands, the answer arrives, then the next example. Illustrative
 * businesses, not clients. */

type Example = {
  query: string;
  name: string;
  url: string;
  title: string;
  snippet: string;
  rating: string;
  reviews: string;
  links: string[];
  faq: string;
  question: string;
  answer: string;
};

const EXAMPLES: Example[] = [
  {
    query: "chiropractor near kirkwood mo",
    name: "Kirkwood Spine & Sport",
    url: "kirkwoodspineandsport.com",
    title: "Chiropractor in Kirkwood, MO | Kirkwood Spine & Sport",
    snippet: "Chiropractic and soft-tissue care in Kirkwood. Same-week appointments, most insurance accepted. Serving Kirkwood, Webster Groves and Des Peres.",
    rating: "4.9",
    reviews: "128 Google reviews",
    links: ["Book online", "Services", "Insurance", "Pricing"],
    faq: "Do you take walk-ins?",
    question: "Who's a good chiropractor near Kirkwood that does soft tissue work?",
    answer: "Kirkwood Spine & Sport in Kirkwood, MO offers chiropractic and soft-tissue therapy, with same-week appointments and most major insurance accepted. They also serve Webster Groves and Des Peres.",
  },
  {
    query: "emergency plumber st charles",
    name: "Gateway Plumbing Co.",
    url: "gatewayplumbingco.com",
    title: "24/7 Emergency Plumber in St. Charles, MO | Gateway Plumbing",
    snippet: "Licensed plumbers on call day and night across St. Charles County. Burst pipes, water heaters, drain cleaning. Upfront pricing, no overtime fees.",
    rating: "4.8",
    reviews: "212 Google reviews",
    links: ["Call now", "Water heaters", "Drain cleaning", "Service areas"],
    faq: "How fast can you get here?",
    question: "Is there a plumber in St. Charles that comes out at night?",
    answer: "Gateway Plumbing Co. runs 24/7 emergency service across St. Charles County with upfront pricing and no overtime fees. They handle burst pipes, water heaters and drain cleaning.",
  },
  {
    query: "wedding florist st louis",
    name: "Bloom & Bramble",
    url: "bloomandbramble.co",
    title: "Wedding Florist in St. Louis | Bloom & Bramble",
    snippet: "Custom wedding florals for St. Louis venues, from the Botanical Garden to Soulard. Consultations by appointment. Booking 2026 dates now.",
    rating: "5.0",
    reviews: "64 Google reviews",
    links: ["Weddings", "Portfolio", "Pricing guide", "Contact"],
    faq: "How far in advance should I book?",
    question: "Who does wedding flowers in St. Louis for a Botanical Garden wedding?",
    answer: "Bloom & Bramble is a St. Louis wedding florist that designs for venues including the Missouri Botanical Garden and Soulard, with consultations by appointment and 2026 dates open.",
  },
];

/* One example's timeline, in ms from its start. */
const TYPE_MS = 55; // per character
const RESULT_AFTER = 420; // after the last character
const ASK_AFTER = 900;
const ANSWER_AFTER = 1700;
const HOLD = 4200; // after the answer, before the next example

type Phase = 0 | 1 | 2 | 3; // typing, result shown, question asked, answer shown
type Run = { i: number; typed: number; phase: Phase };

export default function FoundDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [run, setRun] = useState<Run>({ i: 0, typed: 0, phase: 0 });
  const ex = EXAMPLES[run.i];

  // Start when the panels are in view. Under reduced motion it never starts,
  // and the first example simply stands there whole.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (!reduced) setOn(true);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The timeline for the current example, then on to the next. Every state
  // change is scheduled, none synchronous, so a change of example resets the
  // typing and the phase in the same update that advances it.
  useEffect(() => {
    if (!on) return;
    const n = EXAMPLES[run.i].query.length;
    const ids: number[] = [];
    const at = (ms: number, patch: Partial<Run>) => ids.push(window.setTimeout(() => setRun((r) => ({ ...r, ...patch })), ms));
    for (let k = 1; k <= n; k++) at(k * TYPE_MS, { typed: k });
    const typedAt = n * TYPE_MS;
    at(typedAt + RESULT_AFTER, { phase: 1 });
    at(typedAt + RESULT_AFTER + ASK_AFTER, { phase: 2 });
    at(typedAt + RESULT_AFTER + ANSWER_AFTER, { phase: 3 });
    ids.push(window.setTimeout(() => setRun((r) => ({ i: (r.i + 1) % EXAMPLES.length, typed: 0, phase: 0 })), typedAt + RESULT_AFTER + ANSWER_AFTER + HOLD));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [on, run.i]);

  // Before it starts (and under reduced motion) the first example is whole.
  const show = !on;
  const { i, typed, phase } = run;
  const query = show ? ex.query : ex.query.slice(0, typed);
  const result = show || phase >= 1;
  const asked = show || phase >= 2;
  const answered = show || phase >= 3;

  return (
    <div ref={root} className="rcd-found-panels fx-reveal" aria-label="A search result and an AI answer, illustrated">
      <figure className="rcd-found-panel rcd-found-serp" data-live={on ? "" : undefined}>
        <figcaption className="rcd-found-tag"><b>SEO</b> Google search</figcaption>
        <div className="rcd-serp">
          <div className="rcd-serp-bar">
            <span className="rcd-serp-g" aria-hidden="true">G</span>
            <span className="rcd-serp-q">{query}<i className="rcd-serp-caret" data-on={!show && phase === 0 ? "" : undefined} /></span>
            <span className="rcd-serp-go" aria-hidden="true" />
          </div>
          <div className="rcd-serp-tabs"><span data-on="">All</span><span>Maps</span><span>Images</span><span>News</span></div>
          <div className="rcd-serp-result" data-on={result ? "" : undefined} key={i}>
            <div className="rcd-serp-site">
              <span className="rcd-serp-fav" aria-hidden="true">{ex.name.charAt(0)}</span>
              <div><b>{ex.name}</b><span>{ex.url}</span></div>
            </div>
            <p className="rcd-serp-title">{ex.title}</p>
            <p className="rcd-serp-rating"><span className="rcd-serp-stars" aria-hidden="true">★★★★★</span> {ex.rating} · {ex.reviews}</p>
            <p className="rcd-serp-snip">{ex.snippet}</p>
            <div className="rcd-serp-links">{ex.links.map((l) => <span key={l}>{l}</span>)}</div>
            <div className="rcd-serp-faq"><span>{ex.faq}</span><i aria-hidden="true" /></div>
          </div>
        </div>
      </figure>

      <figure className="rcd-found-panel rcd-found-ai">
        <figcaption className="rcd-found-tag"><b>AEO</b> AI answers</figcaption>
        <div className="rcd-ai">
          <div className="rcd-ai-head"><i aria-hidden="true" />Assistant</div>
          <div className="rcd-ai-thread" key={i}>
            <p className="rcd-ai-user" data-on={asked ? "" : undefined}>{ex.question}</p>
            <div className="rcd-ai-answer" data-on={answered ? "" : undefined}>
              <p>{ex.answer}</p>
              <div className="rcd-ai-sources">
                <span>Sources</span>
                <em>{ex.url}</em>
                <em>google.com/maps</em>
              </div>
            </div>
            <div className="rcd-ai-typing" data-on={asked && !answered ? "" : undefined} aria-hidden="true"><i /><i /><i /></div>
          </div>
        </div>
      </figure>

      <p className="rcd-found-note">Illustrative businesses and results, not client data.</p>
    </div>
  );
}
