export type CaseStudy = {
  slug: string;
  name: string;
  where: string;
  sector: string;
  year: string;
  services: string[];
  blurb: string;
  img: string;
  /* Long-form content used on /work/[slug] */
  brief: string;
  approach: string[];
  results: { value: string; label: string }[];
  pullquote?: { text: string; cite: string };
  reflection: string;
};

export const PROJECTS: CaseStudy[] = [
  {
    slug: "the-sauce-fix",
    name: "The Sauce Fix",
    where: "Iowa",
    sector: "Small-batch hot sauce",
    year: "2026",
    services: ["Website", "E-commerce"],
    blurb:
      "A custom direct-to-consumer storefront for a maker who grows, ferments, and bottles every batch by hand — built to sell out drops and grow the list between them.",
    img: "/assets/portfolio-sauce-fix.webp",
    brief:
      "A small-batch sauce maker in Iowa who grows their own peppers and bottles only one or two batches a year. The product was the easy part — the brief was to build a storefront that could handle a limited drop, take orders cleanly, and keep fans warm during the long stretches when nothing's in stock.",
    approach: [
      "Built a fast custom storefront from scratch — product pages, cart, and checkout tuned for a single-maker shop rather than a bloated platform template.",
      "Designed the experience around the drop model: a clear in-stock / sold-out state, and an email capture for 'join the list for the next batch' front and center.",
      "Leaned the design into the brand — the hand-illustrated flame-and-skull identity carried through the site instead of a generic e-commerce theme.",
      "Set up the basics for direct-to-consumer ordering and shipping so the maker can run the whole thing without an agency in the loop.",
    ],
    results: [
      { value: "Live", label: "Custom DTC storefront" },
      { value: "Drop-ready", label: "Built for limited batches" },
      { value: "List", label: "Email capture between drops" },
    ],
    reflection:
      "The drop model rewards anticipation. Next iteration we'd build a proper notify-when-live flow so the list converts the moment a batch goes up, not a day later.",
  },
  {
    slug: "confetti-and-co",
    name: "Confetti & Co.",
    where: "Troy, MO",
    sector: "Event styling & party rentals",
    year: "2026",
    services: ["Website", "Local SEO"],
    blurb:
      "A bright, bookable site for a family-run party styling business — balloon garlands and luxury teepee sleepovers across the St. Louis metro.",
    img: "/assets/portfolio-confetti-co.webp",
    brief:
      "A family-run business styling balloon garlands and luxury teepee sleepovers for Troy, Wentzville, and the wider St. Louis metro. They were booking through DMs and word of mouth. The brief: a site that looks as polished as the parties and makes it easy for a parent to picture the setup and reach out.",
    approach: [
      "Built a custom site that leads with the look — full-bleed imagery of real setups so the styling sells itself before a word of copy.",
      "Made inquiry the through-line: clear calls to book on every page so a visitor can reach out the moment they're sold.",
      "Wrote local copy around the actual service area — Troy, Wentzville, and the St. Louis metro — so the business shows up for the towns it actually serves.",
      "Carried the soft, celebratory brand palette through the whole build instead of forcing it into an off-the-shelf template.",
    ],
    results: [
      { value: "Live", label: "Custom bookable site" },
      { value: "Metro", label: "Local service-area copy" },
      { value: "Brand", label: "Styled to match the work" },
    ],
    reflection:
      "A gallery this visual wants fresh photos often. Next step we'd set up an easy way for the owners to drop in new event shots themselves, so the site stays as current as their last party.",
  },
  {
    slug: "lindas-cheesecakes",
    name: "Linda's Specialty Cheesecakes",
    where: "Winfield, MO",
    sector: "Handmade cheesecakes",
    year: "2026",
    services: ["Website"],
    blurb:
      "A custom site for a made-to-order cheesecake baker — 39 signature flavors, a request-to-order form Linda confirms by text, and a wholesale path for restaurants and markets.",
    img: "/assets/portfolio-lindas-cheesecakes.webp",
    brief:
      "Linda baked her first batch for her daughter's wedding rehearsal dinner in 2018 and was taking orders by that Thanksgiving. Now every cheesecake is handmade to order — 39 signature flavors plus flavors of the month — and sold at markets and craft fairs from Lake St. Louis to Winfield and through a string of local restaurants. Every order is custom and priced by Linda directly. The brief: a site that shows off the menu, turns a taste at a market table into an order, and gives restaurants a way to carry the cakes.",
    approach: [
      "Built the order path around how Linda actually works: a four-step request form — who, what, when, details — that ends with Linda texting to confirm flavors, pricing, and pickup, instead of a checkout that can't quote a custom cake.",
      "Put the full 39-flavor menu on a page of its own with the best sellers flagged, and made flavors searchable right inside the order form.",
      "Gave wholesale its own page and inquiry form for restaurants, cafés, and markets, with inspection, delivery, and minimums answered before the first call.",
      "Listed every restaurant and market that carries the cheesecakes, each linked to a map, so a first-timer can try a slice before ordering a whole cake.",
      "Marked up the bakery's contact details and FAQ as structured data, so search engines and AI tools can read sizes, notice, and pickup answers straight from the page.",
    ],
    results: [
      { value: "Live", label: "Custom order-request site" },
      { value: "39", label: "Flavors, searchable in the order form" },
      { value: "2", label: "Order paths, retail and wholesale" },
    ],
    reflection:
      "Flavors of the month change all year, and right now they're announced on Facebook. Next step we'd give Linda a simple way to post the current flavor on the site herself, so the menu is as fresh as the market table.",
  },
  {
    slug: "mend-health",
    name: "Mend Health",
    where: "Kirkwood, MO",
    sector: "Chiropractic & soft tissue",
    year: "2026",
    services: ["Website", "Local SEO"],
    blurb:
      "A custom site for a solo chiropractic and soft tissue practice — a page per service, six service-area pages, and booking from anywhere on the site.",
    img: "/assets/portfolio-mend-health.webp",
    brief:
      "A solo practice run by a chiropractor who spent close to a decade doing clinical massage before earning the DC. That combination is the whole value proposition, and it doesn't fit the standard chiropractic-site mould — neither does a direct-pay model where you book time rather than a procedure. The brief: a site that explains both before somebody books, and that shows up in the specific suburbs the practice draws from.",
    approach: [
      "Built the service architecture around what's actually sold — soft tissue therapy and chiropractic care each get their own page, under an overview that explains why they're offered together.",
      "Gave the direct-pay model a Pricing page of its own. \"You book time, not a procedure\" is a real differentiator, but only if a visitor hits it before the booking form.",
      "Wrote a service-area page per town — Kirkwood, Clayton, Frontenac, Ladue, Webster Groves, Des Peres — rather than one page listing all six.",
      "Structured the blog by condition instead of by date: TMJ, upper cross syndrome, head-forward posture, psoas and lower back, desk-work injuries. People search the symptom, not the treatment.",
      "Put booking one click from every page, with the contact form doubling as the booking path so there's no second system to maintain.",
    ],
    results: [
      { value: "6", label: "Service-area pages" },
      { value: "By condition", label: "Blog built for how people search" },
      { value: "Direct pay", label: "Explained before the booking form" },
    ],
    reflection:
      "A condition-led blog only compounds if it keeps getting written. We'd agree a realistic cadence up front — even one post a month — rather than launching with five and letting it go quiet.",
  },
  {
    slug: "the-wellness-collective",
    name: "The Wellness Collective",
    where: "St. Louis, MO",
    sector: "Therapy & wellness",
    year: "2026",
    services: ["Website"],
    blurb:
      "A brand-led build for a practice that spans clinical therapy and spiritual work — custom illustration, its own type system, and booking on the page.",
    img: "/assets/portfolio-wellness-collective.webp",
    brief:
      "A licensed clinical social worker whose practice covers therapy and coaching on one side and Reiki, tarot, intuitive readings, workshops and dance fitness on the other — plus Sacred Compass, her own framework of practical tools. The hard part isn't any one of those. It's holding them on a single site without the clinical credentials making the spiritual work look unserious, or the spiritual work making the clinical credentials look negotiable.",
    approach: [
      "Built a visual identity for the site rather than picking one — illustrated lavender field, custom type pairing, a palette that reads calm without tipping into cliché.",
      "Structured Services so therapy and coaching sit alongside readings, Reiki and workshops as peers, so a visitor arriving for one doesn't feel they've landed in the wrong place.",
      "Gave Sacred Compass a named place on the homepage as the throughline connecting the clinical and the intuitive, instead of burying it as a product.",
      "Put session booking directly on the page, so the path from reading about a service to holding a slot is one click.",
    ],
    results: [
      { value: "Custom", label: "Illustration and type system" },
      { value: "One site", label: "Clinical and spiritual work, side by side" },
      { value: "On page", label: "Session booking" },
    ],
    /* A real, verbatim Google review — two non-adjacent passages from Angelita
       Pritchett's review joined with an ellipsis, wording untouched inside each.
       Same review quoted on /quad-cities. Never paraphrase this. */
    pullquote: {
      text:
        "From our very first meeting, they took the time to truly understand not just what I wanted my website to look like, but where I want my business to grow over the next several years. […] They aren't just building me a website—they're helping me build a brand.",
      cite: "Angelita Pritchett, The Wellness Collective (Google review)",
    },
    reflection:
      "The protected resource library is still a later phase. Knowing it was coming, we'd have wired the gated-content plumbing during the build instead of leaving it as a retrofit.",
  },
];

export const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
