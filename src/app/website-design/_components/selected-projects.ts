export type SelectedProject = {
  preview: "wellness-collective" | "mend" | "high-life-journeys";
  effect: "fluid" | "marble" | "video";
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
    id: "highlife", preview: "high-life-journeys", effect: "video", name: "High Life Journeys", category: "Travel · Custom website",
    image: "/assets/portfolio-high-life-journeys.webp",
    alt: "High Life Journeys website featuring an ocean voyage and the headline Sail somewhere extraordinary",
    width: 1920, height: 1080,
    website: "https://www.highlifejourneys.com/", domain: "highlifejourneys.com",
    headline: "Turn a destination into something you can picture.",
    description: "A moving ocean scene, destination guides, and a simple way to ask about a trip.",
    details: ["Immersive motion", "Destination discovery", "Personal inquiry path"],
  },
];
