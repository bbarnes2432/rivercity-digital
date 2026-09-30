import "server-only";

import { cache } from "react";
import { connection } from "next/server";
import type { GoogleReview, GoogleReviews } from "./google-reviews";

export type ChicagoReview = GoogleReview & {
  url: string;
  photoUrl?: string;
  languageCode?: string;
};

export type ChicagoReviewsData = Omit<GoogleReviews, "reviews"> & {
  reviews: ChicagoReview[];
  attributions: Array<{ name: string; url?: string }>;
};

type PlaceDetails = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  attributions?: Array<{ provider?: string; providerUri?: string }>;
  reviews?: Array<{
    rating?: number;
    text?: { text?: string; languageCode?: string };
    originalText?: { text?: string; languageCode?: string };
    relativePublishTimeDescription?: string;
    googleMapsUri?: string;
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }>;
};

function httpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function validRating(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 5;
}

// The standard Places terms do not permit a daily cache of review content.
// Keep Google content out of the Data Cache, ISR and build output. React cache
// only deduplicates calls within one server render; it is not persistent storage.
// https://developers.google.com/maps/documentation/places/web-service/policies
// https://cloud.google.com/maps-platform/terms/maps-service-terms#14-places-api-legacy-and-new
// The server-only GOOGLE_CHICAGO_REVIEWS_ENABLED=true flag is an explicit opt-in.
// Existing homepage credentials alone must not activate new API usage: Google
// reviews trigger the Enterprise + Atmosphere SKU, and a daily content cache is
// not available under the standard terms. With the flag AND both credentials,
// this makes one Places request per Chicago page render, subject to account
// pricing/quota. No polling, retries, background jobs or stale fallback.
export const getChicagoReviews = cache(async (): Promise<ChicagoReviewsData | null> => {
  await connection();

  if (process.env.GOOGLE_CHICAGO_REVIEWS_ENABLED !== "true") return null;

  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  if (!key || !placeId) return null;

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews,attributions",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) return null;

    const place = (await response.json()) as PlaceDetails;
    const profileUrl = httpsUrl(place.googleMapsUri);
    if (
      !validRating(place.rating) ||
      !Number.isInteger(place.userRatingCount) ||
      !place.userRatingCount ||
      place.userRatingCount < 1 ||
      !profileUrl
    ) return null;

    // Preserve Google's relevance order and each full original review. Do not
    // select by star rating. A card needs its author, text and direct source.
    const reviews = (place.reviews ?? []).flatMap((review): ChicagoReview[] => {
      const content = review.originalText?.text ? review.originalText : review.text;
      const text = content?.text?.trim();
      const author = review.authorAttribution?.displayName?.trim();
      const url = httpsUrl(review.googleMapsUri);
      if (!text || !author || !url || !validRating(review.rating)) return [];
      return [{
        author,
        authorUrl: httpsUrl(review.authorAttribution?.uri),
        photoUrl: httpsUrl(review.authorAttribution?.photoUri),
        rating: review.rating,
        text,
        languageCode: content?.languageCode,
        relativeTime: review.relativePublishTimeDescription ?? "",
        url,
      }];
    });
    if (!reviews.length) return null;

    return {
      rating: place.rating,
      count: place.userRatingCount,
      profileUrl,
      reviews,
      attributions: (place.attributions ?? []).flatMap((attribution) => (
        attribution.provider
          ? [{ name: attribution.provider, url: httpsUrl(attribution.providerUri) }]
          : []
      )),
    };
  } catch {
    // A missing configuration, timeout or API failure must never produce
    // invented proof, stale reviews, leaked credentials or an empty section.
    return null;
  }
});
