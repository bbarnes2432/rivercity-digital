import type { ReactNode } from "react";
import Image from "next/image";
import { getGoogleReviews } from "@/lib/google-reviews";
import { REVIEW_CARDS, REVIEW_FALLBACK } from "./review-cards";
import { RatingHeader, ReviewRows } from "./ReviewsMotion";
import styles from "./ReviewsShowcase.module.css";

/* Animated Google reviews for Home, Website Design and Chicago.
 * The rating and review count come from the Places API through the same
 * daily-revalidated request the homepage already makes, so they stay current
 * without edits. Without the API (local builds, an outage) they fall back to
 * the figures last checked by hand. Review text is hand-picked on our side:
 * the API returns only five reviews and we can't choose which. */
export default async function ReviewsShowcase({ heading, id = "reviews", container = "wd-container" }: { heading: ReactNode; id?: string; container?: string }) {
  const live = await getGoogleReviews();
  const rating = live?.rating ?? REVIEW_FALLBACK.rating;
  const count = live?.count ?? REVIEW_FALLBACK.count;
  const profileUrl = REVIEW_FALLBACK.profileUrl;

  return (
    <section className={`${styles.section} rcd-light`} id={id} aria-labelledby={`${id}-heading`}>
      <div className={container}>
        <div className={styles.top}>
          <div>{heading}</div>
          <RatingHeader rating={rating} count={count} profileUrl={profileUrl} />
        </div>
      </div>
      <ReviewRows reviews={REVIEW_CARDS} />
      <div className={container}>
        <div className={styles.attribution}>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" aria-label="View River City Digital on Google Maps (opens a new tab)">
            {/* Unmodified DarkGray 2x PNG from Google's official attribution assets. */}
            <Image src="/assets/chicago/google-maps-attribution.png" alt="Google Maps" width={98} height={18} unoptimized />
          </a>
          <p>Excerpts from Google reviews. {live ? "Rating and count from Google, updated daily." : "Rating and count checked by hand."}</p>
          <p className={styles.legal}>
            <a href="https://www.google.com/intl/en_us/help/terms_maps/" target="_blank" rel="noopener noreferrer">Google Maps terms</a>
            <span aria-hidden="true"> · </span>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>
          </p>
        </div>
      </div>
    </section>
  );
}
