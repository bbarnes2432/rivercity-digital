import type { SelectedProject } from "../website-design/_components/selected-projects";

// Chicago's approved project proof is independent of unpublished STL portfolio edits.
export const LINDA_PROJECT: SelectedProject = {
  id: "lindas", effect: "static", name: "Linda’s Specialty Cheesecakes", category: "Local bakery · Custom website",
  image: "/assets/portfolio-lindas-cheesecakes.webp",
  alt: "Linda’s Specialty Cheesecakes website with cream and burgundy typography beside its handmade gingerbread chef mascot",
  width: 1440, height: 798,
  website: "https://lindascheesecakes.com/", domain: "lindascheesecakes.com",
  caseStudy: "/work/lindas-cheesecakes",
  headline: "From finding a favorite flavor to requesting a cake.",
  description: "A custom bakery website with a flavor menu, made-to-order requests, and a separate path for wholesale customers.",
  details: ["Flavor catalog", "Custom order requests", "Wholesale inquiries"],
};
