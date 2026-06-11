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
    slug: "lucky-puppy",
    name: "Lucky Puppy Custom Cuts",
    where: "Webster Groves, MO",
    sector: "Pet grooming",
    year: "2026",
    services: ["Website", "Local SEO"],
    blurb:
      "Rebuilt a slow, template-driven site into a fast custom storefront. Phone calls up 60% in the first month.",
    img: "/assets/portfolio-lucky-puppy.webp",
    brief:
      "Two locations, fully booked at one and half-empty at the other. The owner suspected the website but couldn't prove it. We agreed: ship a real site, then ask the question again in 60 days.",
    approach: [
      "Replaced the templated booking widget with a hand-coded slot picker that lets visitors filter by groomer and service in one page.",
      "Built a dedicated landing block per location with neighborhood-specific copy, parking notes, and street-level photos shot from across the street.",
      "Rebuilt schema from scratch: LocalBusiness with two areaServed entries, Service entries per groom type, and Review pull from Google.",
      "Compressed the bundle: removed three jQuery plugins, swapped a 1.4MB hero JPG for a 80KB WebP, eliminated render-blocking CSS.",
    ],
    results: [
      { value: "+60%", label: "Phone calls (mo. 1)" },
      { value: "1.1s", label: "Largest Contentful Paint" },
      { value: "x2", label: "Map Pack impressions" },
    ],
    pullquote: {
      text:
        "Both locations are booked two weeks out now. I stopped hearing 'I tried calling but it went to voicemail.'",
      cite: "Owner, Lucky Puppy Custom Cuts",
    },
    reflection:
      "We'd shoot the storefront photography differently — afternoon, not morning. The morning light flattened the brick. Live and learn.",
  },
  {
    slug: "shear-fantasy",
    name: "Shear Fantasy Salon",
    where: "Kirkwood, MO",
    sector: "Hair salon",
    year: "2026",
    services: ["Website", "Google Ads"],
    blurb:
      "New site + reworked Google Ads campaigns. Cost-per-booking dropped from $42 to $14.",
    img: "/assets/portfolio-shear-fantasy.webp",
    brief:
      "A 22-year-old salon that had quietly survived three website rebuilds and an ex-employee running their Google Ads account into the ground. The brief: stop the bleeding, then earn back the trust to grow.",
    approach: [
      "Audited the prior agency's Ads account. Found 38% of spend going to broad-match terms with zero booking history. Killed them on day one.",
      "Rebuilt the campaign tree around three high-intent keyword themes: balayage, men's cuts, and color correction.",
      "Replaced a one-page squeeze site with a six-page custom build — each color service on its own page, each with its own Ads landing.",
      "Wired a server-side conversion event so phone calls and form submits feed back into Google's bidder reliably.",
    ],
    results: [
      { value: "$14", label: "Cost per booking" },
      { value: "−67%", label: "Wasted spend" },
      { value: "+3.2x", label: "Booking volume" },
    ],
    pullquote: {
      text:
        "I'd given up on Google Ads. The new account is the first time I've understood where the money actually goes.",
      cite: "Co-owner, Shear Fantasy Salon",
    },
    reflection:
      "We'd start with the ad account before the site rebuild next time. The wasted spend was so loud it was masking everything else.",
  },
  {
    slug: "lovely-nails",
    name: "Lovely Nails",
    where: "Clayton, MO",
    sector: "Nail salon",
    year: "2026",
    services: ["Website", "Local SEO", "AI Search"],
    blurb:
      "Page 4 to Page 1 in 90 days. Now cited by ChatGPT and Perplexity for the category.",
    img: "/assets/portfolio-lovely-nails.webp",
    brief:
      "A second-generation salon in a saturated category. Five well-funded competitors, a shared shopping center, identical service menus. The owner wanted to stop competing on price.",
    approach: [
      "Rewrote the entire site as a series of editorial answer pages — 'what is gel-x', 'what's the difference between dip and acrylic' — each engineered to be the citation an AI engine would pick.",
      "Built FAQPage schema on every service page with answer bodies tuned for retrieval, not keyword density.",
      "Earned three local citations in the first month: a Riverfront Times feature, a Webster–Kirkwood Times Q&A, and a SLU student-led blog post.",
      "Ran a parallel local SEO play: GBP rebuild, 30 fresh photos, weekly post cadence, citation cleanup across 47 directories.",
    ],
    results: [
      { value: "Top 3", label: "Map Pack ranking" },
      { value: "Cited", label: "By ChatGPT + Perplexity" },
      { value: "+42%", label: "Bookings (mo. 3)" },
    ],
    pullquote: {
      text:
        "A customer came in asking for our gel-x because ChatGPT recommended us. We didn't even know that was possible.",
      cite: "Owner, Lovely Nails",
    },
    reflection:
      "The citation work was the unlock. Rankings followed; we'd have prioritized that earlier on prior projects.",
  },
  {
    slug: "pet-planet",
    name: "Pet Planet",
    where: "St. Charles, MO",
    sector: "Pet retail",
    year: "2026",
    services: ["Website", "Digital Marketing"],
    blurb:
      "New e-commerce build + Meta and Google Ads. First quarter outperformed the prior year by 38%.",
    img: "/assets/portfolio-pet-planet.webp",
    brief:
      "A regional pet supply shop with eight years of brand equity, a 14k-strong email list, and an e-commerce platform that hadn't shipped an order in 11 days. The fix had to land before the holiday quarter.",
    approach: [
      "Migrated the storefront from a discontinued platform to a hand-coded headless build, preserving every product URL and review.",
      "Built a fast, indexable category architecture so 1,200 SKUs were crawlable in a single sitemap pass.",
      "Stood up a Meta + Google Ads pair tuned for repeat purchase, not first-touch — ROAS optimized, not CTR.",
      "Wired Klaviyo flows for the 14k-list: post-purchase, browse-abandon, win-back. Email became 22% of revenue.",
    ],
    results: [
      { value: "+38%", label: "Q1 revenue YoY" },
      { value: "0.9s", label: "Median TTFB" },
      { value: "22%", label: "Revenue from email" },
    ],
    pullquote: {
      text:
        "We launched on a Tuesday. By Friday the staff was asking how to slow it down so they could pack orders.",
      cite: "Owner, Pet Planet",
    },
    reflection:
      "Email turned out to be the lever. We'd have started flow rebuilds during the migration freeze, not after.",
  },
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
];

export const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
