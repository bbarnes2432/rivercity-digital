// River City Digital's Google Business Profile reviews, read live from the
// Places API (New) so the homepage only ever shows what's actually on Google.
//
// Needs GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID at build time AND at runtime
// (the fetch revalidates in the background on a live request), so both are
// also persisted into .env.production by amplify.yml. With either missing, or
// the API failing, this returns null and the page leaves reviews out rather
// than falling back to anything that isn't a real review.

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
  url?: string;
};

export type GoogleReviews = {
  rating: number;
  count: number;
  profileUrl: string;
  reviews: GoogleReview[];
};

type PlaceDetails = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: Array<{
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string; uri?: string };
  }>;
};

// A day. Reviews trickle in; there's no reason to spend an API call per visit.
const REVALIDATE_SECONDS = 60 * 60 * 24;

export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`Google Places reviews request failed: ${res.status} ${await res.text()}`);
      return null;
    }
    const place = (await res.json()) as PlaceDetails;
    if (!place.rating || !place.userRatingCount || !place.googleMapsUri) return null;

    // Kept in Google's own "most relevant" order and never filtered by star
    // rating: a curated subset of only the glowing ones would misrepresent
    // the profile, and the overall rating and count sit right above them.
    const reviews = (place.reviews ?? []).flatMap((r): GoogleReview[] => {
      const text = (r.originalText?.text ?? r.text?.text ?? "").trim();
      const author = r.authorAttribution?.displayName;
      if (!text || !author || !r.rating) return [];
      return [{
        author,
        authorUrl: r.authorAttribution?.uri,
        rating: r.rating,
        text,
        relativeTime: r.relativePublishTimeDescription ?? "",
        url: r.googleMapsUri,
      }];
    });

    return { rating: place.rating, count: place.userRatingCount, profileUrl: place.googleMapsUri, reviews };
  } catch (err) {
    console.error("Google Places reviews request failed", err);
    return null;
  }
}
