export type SelectedProject = {
  // Folder under /public/work holding the live-hero assets. Screenshot-only
  // ("static") projects have no live hero, so they have no folder.
  preview?: "wellness-collective" | "mend" | "high-life-journeys";
  effect: "fluid" | "marble" | "video" | "static";
  id: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  website: string;
  domain: string;
  caseStudy?: string;
  headline: string;
  description: string;
  details: string[];
};

export const SELECTED_PROJECTS: SelectedProject[] = [
  {
    id: "wellness", preview: "wellness-collective", effect: "fluid", name: "The Wellness Collective", category: "Wellness · Brand & website",
    image: "/assets/portfolio-wellness-collective.webp",
    alt: "The Wellness Collective website with lavender illustrations and warm, welcoming typography",
    width: 1440, height: 798,
    website: "https://www.wellnesscollectivehub.com/", domain: "wellnesscollectivehub.com",
    caseStudy: "/work/the-wellness-collective",
    headline: "A welcoming first step toward better wellbeing.",
    description: "A welcoming design with clear services and an easy way to book a session.",
    details: ["Custom visual identity", "Clear service choices", "Session booking"],
  },
  {
    id: "mend", preview: "mend", effect: "marble", name: "Mend Health", category: "Healthcare · Custom website",
    image: "/assets/portfolio-mend-health.webp",
    alt: "Mend Health website with deep green tones and a clear appointment booking action",
    width: 1440, height: 798,
    website: "https://www.mendhealthmo.com/", domain: "mendhealthmo.com",
    caseStudy: "/work/mend-health",
    headline: "Make choosing care feel straightforward.",
    description: "Clear treatment information, pricing, and appointment booking for a local healthcare practice.",
    details: ["Treatment & pricing pages", "Local service-area pages", "Booking throughout"],
  },
  {
    id: "stjoseph", effect: "static", name: "St. Joseph Boat Rentals", category: "Boat rentals · Custom website & booking",
    image: "/assets/qc-sample-st-joseph.webp",
    alt: "St. Joseph Boat Rentals website with the St. Joseph lighthouse and pier on Lake Michigan behind hourly and multi-day booking buttons",
    width: 1440, height: 798,
    website: "https://www.stjosephboatrentals.com/", domain: "stjosephboatrentals.com",
    headline: "Book a boat without picking up the phone.",
    description: "Self-serve booking for hourly pontoon rentals and multi-day lake drop-offs, with captained trips and fishing charters alongside.",
    details: ["Online booking", "Rentals & charters", "Service-area pages"],
  },
  {
    id: "saucefix", effect: "static", name: "The Sauce Fix", category: "Hot sauce · Online store",
    image: "/assets/qc-sample-sauce-fix.webp",
    alt: "The Sauce Fix website with a hand-illustrated flaming skull behind the headline Fiercely Flavorful",
    width: 1440, height: 798,
    website: "https://thesaucefix.com/", domain: "thesaucefix.com",
    caseStudy: "/work/the-sauce-fix",
    headline: "A small-batch brand with a storefront to match.",
    description: "Small-batch Iowa hot sauce and salsa, with an online shop, recipes, and a list to join for the next batch.",
    details: ["Online shop", "Hand-drawn brand art", "Email list signup"],
  },
];
