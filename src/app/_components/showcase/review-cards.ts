import { REVIEW_EXCERPTS } from "../../chicago-web-design/review-excerpts";

/* Hand-picked excerpts for the animated reviews section. The wording and
 * names come from review-excerpts.ts, verified on Google Maps (Oct 23, 2026),
 * which also leaves out the two reviews the brief excludes. Where a reviewer
 * is a client with a live site, the card links to it.
 * New five-star reviews (Upright, Robinson's, Main Street) go in
 * review-excerpts.ts first, copied from our Google profile. */
const CLIENT_SITES: Record<string, { business: string; url?: string }> = {
  "Angelita Pritchett": { business: "The Wellness Collective", url: "https://www.wellnesscollectivehub.com/" },
  "Jennifer Morrow": { business: "Mend Health", url: "https://www.mendhealthmo.com/" },
  "Samantha Hoggard": { business: "The Peaceful Pet" },
};

export type ReviewCard = { author: string; text: string; business?: string; url?: string };

export const REVIEW_CARDS: ReviewCard[] = REVIEW_EXCERPTS.reviews.map(review => ({
  author: review.author,
  text: review.text.replace(/\s{2,}/g, " ").trim(),
  ...CLIENT_SITES[review.author],
}));

export const REVIEW_FALLBACK = {
  rating: REVIEW_EXCERPTS.rating,
  count: REVIEW_EXCERPTS.count,
  profileUrl: REVIEW_EXCERPTS.profileUrl,
};
