// Featured client builds for the scroll-wall hero and the "watch it scroll"
// section (Brandon's Nov 2026 build brief, order and callouts as written).
// Screenshots are full-page captures of each live site at phone width
// (390 CSS px), taken November 8, 2026, exported to WebP at 560px wide and
// trimmed to WebP's 16,000px height limit. Recapture when a site changes.
// Pasture to Porch joins once it launches.

export type Build = {
  id: string;
  name: string;
  meta: string;
  callouts: [string, string, string];
  url: string;
  domain: string;
  /** Full-page phone screenshot for the scrolling frame. */
  shot: { src: string; width: number; height: number };
  /** Top of the page, for the hero wall columns. */
  wall: { src: string; width: number; height: number };
};

const shot = (id: string, height: number) => ({ src: `/assets/builds/build-${id}.webp`, width: 560, height });
const wall = (id: string) => ({ src: `/assets/builds/wall-${id}.webp`, width: 300, height: 1500 });

export const BUILDS: Build[] = [
  {
    id: "alwaysclean", name: "Always Clean", meta: "Cleaning · Quad Cities",
    callouts: ["A foggy-window hero you wipe clear like a squeegee", "Commercial and residential services, each explained", "A simple way to request a quote"],
    url: "https://www.alwaysclean.biz/", domain: "alwaysclean.biz",
    shot: shot("alwaysclean", 11763), wall: wall("alwaysclean"),
  },
  {
    id: "sethanthony", name: "Seth Anthony Atelier", meta: "Fine jewelry · St. Louis",
    callouts: ["A 3D ring viewer customers can spin", "A custom front end on Shopify", "A storefront built around the pieces"],
    url: "https://sethanthony.com/", domain: "sethanthony.com",
    shot: shot("sethanthony", 4845), wall: wall("sethanthony"),
  },
  {
    id: "robinsons", name: "Robinson’s Contracting", meta: "Roofing & exteriors · Moscow Mills, MO",
    callouts: ["Real project photography, before and after", "Repairs and exterior work explained clearly", "Direct contact with the owner"],
    url: "https://robinsonsbuilds.com/", domain: "robinsonsbuilds.com",
    shot: shot("robinsons", 14663), wall: wall("robinsons"),
  },
  {
    id: "lindas", name: "Linda’s Specialty Cheesecakes", meta: "Bakery · Winfield, MO",
    callouts: ["A flavor menu worth browsing", "Made-to-order requests", "A separate path for wholesale customers"],
    url: "https://lindascheesecakes.com/", domain: "lindascheesecakes.com",
    shot: shot("lindas", 15999), wall: wall("lindas"),
  },
  {
    id: "upright", name: "Upright Appraisal", meta: "Real estate appraisal · Webster Groves, MO",
    callouts: ["A scrolling ticker of the lenders and banks served", "A two-state map of the 8 counties covered", "A dedicated path for referring attorneys and CPAs"],
    url: "https://uprightappraisal.com/", domain: "uprightappraisal.com",
    shot: shot("upright", 15999), wall: wall("upright"),
  },
  {
    id: "wellness", name: "The Wellness Collective", meta: "Wellness · Brand & website",
    callouts: ["A custom visual identity with an animated hero", "Clear service choices", "Session booking"],
    url: "https://www.wellnesscollectivehub.com/", domain: "wellnesscollectivehub.com",
    shot: shot("wellness", 15999), wall: wall("wellness"),
  },
  {
    id: "mend", name: "Mend Health", meta: "Healthcare · Kirkwood, MO",
    callouts: ["Treatment and pricing pages", "Local service-area pages", "Booking throughout"],
    url: "https://www.mendhealthmo.com/", domain: "mendhealthmo.com",
    shot: shot("mend", 15999), wall: wall("mend"),
  },
  {
    id: "stjoseph", name: "St. Joseph Boat Rentals", meta: "Boat rentals · St. Joseph, MI",
    callouts: ["Self-serve online booking", "Hourly pontoon and multi-day lake drop-off rentals", "Captained trips and fishing charters"],
    url: "https://www.stjosephboatrentals.com/", domain: "stjosephboatrentals.com",
    shot: shot("stjoseph", 15999), wall: wall("stjoseph"),
  },
];
