/* =========================================================================
   /quad-cities — every word on the page lives here.
   =========================================================================

   This is a paid-traffic landing page, not an organic one. It carries
   `noindex, follow`, it is deliberately absent from the nav, the footer and
   the sitemap, and it is reachable by ad click or direct link only.

   RCD supplies final copy for the headline, the local angle, the service
   blocks and the FAQ. What's here is a working draft written to the spec's
   direction so the page ships complete — swap the strings, don't rebuild the
   page. Two hard rules from §5 apply to anything written here:

     1. No Quad Cities street address, anywhere. "Serving the Quad Cities" is
        true. A local address is not, and inventing one would destroy the
        exact credibility this page is built on.
     2. Nothing that implies a physical presence or staffed office there.
   ========================================================================= */

/* ---------- Phone ---------------------------------------------------------
   One constant, one component (<CallLink />). A call-tracking number can be
   swapped in here without touching a single section of the page. */
export const PHONE = {
  /** What a visitor reads. */
  display: "(636) 338-1408",
  /** E.164 for the tel: href. */
  href: "tel:+16363381408",
} as const;

export const EMAIL = "hello@rivercitydigitalco.com";

/* ---------- 1 · Hero ---------------------------------------------------- */
export const HERO = {
  eyebrow: "Davenport · Bettendorf · Rock Island · Moline",
  /** The differentiator is the first thing read. That is the whole point. */
  headline: "Quad Cities websites, built by a Davenport native.",
  subhead:
    "Custom website design — plus the local SEO and AI search visibility that gets the site found once it's live.",
  formHeading: "Tell us what you're working with.",
  formNote: "A real person reads this. Usually answered the same day.",
} as const;

/* ---------- 2 · The local angle ----------------------------------------- */
export const LOCAL_ANGLE = {
  title: "Same river. About three hundred miles.",
  /** First person on purpose. This is the one thing a competitor can't copy. */
  body: [
    "I grew up in Davenport. Boarding school down in Keokuk, then Loras College up in Dubuque — most of my life happened along one stretch of one river.",
    "River City Digital runs out of St. Louis now, about three hundred miles downstream on that same Mississippi. Same water, different bend.",
    "So when I say I know what it's like to run a business in a metro that the Chicago and Des Moines agencies treat as a rounding error — that isn't positioning. It's just where I'm from.",
  ],
  /** Upper Mississippi river miles, measured upstream from Cairo, Illinois.
   *  Lock & Dam 15 at Rock Island sits at ~mile 483; St. Louis at ~mile 180.
   *  Rounded, and labelled as approximate on the page. */
  gauge: [
    { place: "St. Louis", mile: "180" },
    { place: "Quad Cities", mile: "483" },
  ],
  gaugeNote:
    "Upper Mississippi river miles, measured upstream from Cairo, Illinois.",
} as const;

/* ---------- 3 · Work samples --------------------------------------------
   Screenshots, never live outbound links — sending paid traffic off this page
   to a third-party site is a leak we're paying for. Captions follow the
   spec's attribution language: accurate to a partnership, never claiming
   sole authorship. If a prospect asks about one of these on a call, the
   answer has to match the caption.

   `published` gates a sample without deleting it. Per §8, nothing here goes
   live without written confirmation on file. */
export type WorkSample = {
  slug: string;
  name: string;
  /** Canonical live domain. Never a *.amplifyapp.com staging URL — a staging
   *  URL visible in a screenshot or caption reads as unfinished work. */
  domain: string;
  what: string;
  attribution: string;
  img: string;
  alt: string;
  published: boolean;
};

export const WORK_SAMPLES: WorkSample[] = [
  {
    // Lead with this one: the booking engine is the most impressive thing in
    // the set and it demonstrates capability well beyond a brochure site.
    slug: "st-joseph-boat-rentals",
    name: "St. Joseph Boat Rentals",
    domain: "stjosephboatrentals.com",
    what:
      "Boat rental and charter operation. Full booking engine with real-time availability, self-serve reservations, and 45+ service-area pages.",
    attribution: "A recent build by our development partner",
    img: "/assets/qc-sample-st-joseph.webp",
    alt: "St. Joseph Boat Rentals homepage — lighthouse and pier on Lake Michigan behind a booking call to action",
    published: true,
  },
  {
    slug: "shaun-michael-construction",
    name: "Shaun Michael Construction",
    domain: "shaunmichaelinc.com",
    what:
      "High-end construction and remodeling. Premium visual design, deep service architecture, and a full project portfolio.",
    attribution: "A recent build by our development partner",
    img: "/assets/qc-sample-shaun-michael.webp",
    alt: "Shaun Michael Construction homepage — oceanfront interior remodel behind the company wordmark",
    published: true,
  },
  {
    slug: "the-sauce-fix",
    name: "The Sauce Fix",
    domain: "thesaucefix.com",
    what:
      "Small-batch hot sauce brand. Custom direct-to-consumer storefront built around limited drops — proof this works past service businesses.",
    attribution: "Built by our team",
    img: "/assets/qc-sample-sauce-fix.webp",
    alt: "The Sauce Fix homepage — illustrated flame-and-skull artwork behind a shop call to action",
    published: true,
  },
  {
    slug: "the-wellness-collective",
    name: "The Wellness Collective",
    domain: "wellnesscollectivehub.com",
    what:
      "Wellness and therapy practice. Distinctive brand-led design with booking built into the site.",
    attribution: "Built by our team",
    img: "/assets/qc-sample-wellness.webp",
    alt: "The Wellness Collective homepage — a person walking a stone labyrinth above the sea",
    published: true,
  },
];

/* ---------- 4 · What a custom site gets you ------------------------------
   Orientation, not education. Handles "why not Wix" without saying "Wix". */
export const CUSTOM_BLOCKS = [
  {
    title: "It's built, not assembled",
    body:
      "A template is a compromise somebody else made before they knew anything about your business. Yours gets built around how you actually sell.",
  },
  {
    title: "It's fast because there's nothing extra in it",
    body:
      "No page builder, no eleven plugins fighting each other. Speed moves rankings and it moves conversions, and it's the first thing a template gives away.",
  },
  {
    title: "The structure is built for search from day one",
    body:
      "Page architecture, headings, schema, internal links. Retrofitting that onto a template costs more than doing it right once.",
  },
  {
    title: "No monthly platform tax",
    body:
      "You own the site and the domain. No plan tier deciding which features you're allowed to have this year.",
  },
] as const;

/* ---------- 5 · And then people have to find it --------------------------
   The pivot into SEO / AI search visibility. Plant the idea; don't sell the
   monthly program on this page. */
export const FIND_IT = {
  title: "And then people have to find it.",
  lede: "A website nobody finds is a brochure.",
  points: [
    "Local search still decides who gets the call. The Map Pack, the rankings under it, the profile, the citations — that's what puts you in front of somebody ready to buy today.",
    "But people increasingly skip the search box. They ask an assistant a whole question — \"who's the best remodeler in Bettendorf\" — and take the answer it gives.",
    "An assistant can only recommend what somebody wrote down. If your site never answered the question, it can't be the source, and a competitor's answer gets read out instead.",
    "Nobody in the Quad Cities is selling this yet. That's not a gap that stays open long.",
  ],
} as const;

/* ---------- 6 · Video ----------------------------------------------------
   RCD is producing this. Leave `src` null and the section doesn't render —
   the page has to ship clean whether or not the file lands by launch.

   When it does land: muted or click-to-play only, never autoplay with sound,
   captions burned in or track-based, under 90 seconds, lazy with a poster,
   and below the fold. Video is the fastest way to wreck a Lighthouse score
   and landing page experience feeds Quality Score directly. */
export const VIDEO: {
  src: string | null;
  poster: string | null;
  captions: string | null;
  heading: string;
  lede: string;
} = {
  src: null,
  poster: null,
  captions: null,
  heading: "Ninety seconds, if you'd rather hear it.",
  lede: "Who we are, what we build, and why a Davenport kid is running a studio out of St. Louis.",
};

/* ---------- 7 · Review ---------------------------------------------------
   A real, recent five-star Google review — quoted in part and attributed to
   the platform, not dressed up as a stock testimonial card. Two non-adjacent
   passages from Angelita Pritchett's review, joined with an ellipsis; the
   wording inside each is verbatim. Never paraphrase a review and keep it in
   quotation marks — that turns a real record into an invented one.

   Set to null and the section doesn't render. Do not fill it with anything
   that isn't a real review. */
export const REVIEW: {
  quote: string;
  author: string;
  meta: string;
  platform: string;
  stars: number;
} | null = {
  quote:
    "From our very first meeting, they took the time to truly understand not just what I wanted my website to look like, but where I want my business to grow over the next several years. […] They aren't just building me a website—they're helping me build a brand.",
  author: "Angelita Pritchett",
  meta: "The Wellness Collective",
  platform: "Google review",
  stars: 5,
};

/* ---------- 8 · How it works --------------------------------------------- */
export const STEPS = [
  {
    n: "01",
    title: "A call",
    body:
      "Twenty minutes. What you sell, who buys it, what isn't working now. No deck, no pitch deck disguised as a discovery call.",
  },
  {
    n: "02",
    title: "A plan",
    body:
      "What we'd build, what it costs, how long it takes — in writing, before you commit to anything.",
  },
  {
    n: "03",
    title: "The build",
    body:
      "We build it, you review it, it goes live. Then we decide together whether getting found is the next thing to work on.",
  },
] as const;

/* ---------- 9 · FAQ ------------------------------------------------------
   Answers must be server-rendered and present in the HTML on load, with
   native <details>/<summary> triggers — the same technical standard we hold
   client sites to. No FAQPage schema on this page: it's noindex, so schema
   serves no purpose and the combination is contradictory. */
export const FAQ = [
  {
    q: "How long does a build take?",
    a: "Most sites launch two to three weeks after kickoff. Bigger builds — custom functionality, a lot of pages — take longer. You get a real timeline before you commit, not after.",
  },
  {
    q: "What does it cost?",
    a: "It depends on what the site has to do, so we quote after the call instead of guessing at a number here. What we can tell you now: it's a project price you approve in writing up front, and there's no monthly platform fee bolted onto it.",
  },
  {
    q: "Do I own the site when it's done?",
    a: "Yes. The site and the domain are yours. If you ever want to move it somewhere else, you can, and we'll help you do it.",
  },
  {
    q: "You're based in St. Louis. Does that matter for a Quad Cities business?",
    a: "We serve the Quad Cities. We don't have an office there and we're not going to pretend we do — the owner grew up in Davenport, which is the reason this market is on our list at all. Everything else runs the way it does for every client: calls, screen shares, and email. You'll be working with the person doing the work either way.",
  },
  {
    q: "What happens after launch?",
    a: "You can take the keys and run it yourself, or keep us on for search and upkeep. Website builds are project-based. Ongoing search work is a longer engagement, because it takes months to compound — we'll say that plainly before you sign anything rather than after.",
  },
] as const;

/* ---------- 10 · Closing CTA --------------------------------------------- */
export const CLOSING = {
  title: "Let's see what you're working with.",
  body:
    "Tell us about the business and what the site needs to do. We'll come back with a straight answer about whether we're the right fit — including when we're not.",
} as const;

/* ---------- Form --------------------------------------------------------
   Five fields. Every additional field costs conversions. The dropdown is
   worth more than three demographic fields — it says what the call is about
   before we dial, and routes website-first versus SEO-first conversations. */
export const LOOKING_FOR = [
  "New website",
  "Fix or improve my current site",
  "More leads / better visibility",
  "Not sure yet",
] as const;
