import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { REVIEW_EXCERPTS } from "./review-excerpts";

import styles from "./ChicagoReviews.module.css";
import ReviewTicker from "./ReviewTicker";

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">{"★".repeat(Math.round(rating))}<span className={styles.emptyStars}>{"★".repeat(5 - Math.round(rating))}</span></span>
    </span>
  );
}

export default function ChicagoReviews({ market = "chicago" }: { market?: "chicago" | "st-louis" }) {
  const data = REVIEW_EXCERPTS;
  const headingId = `${market}-reviews-heading`;
  const reviews = data.reviews;

  return (
    <section className={`${styles.section} rcd-light`} aria-labelledby={headingId}>
      <div className="wd-container">
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>From our clients</p>
            <h2 className={styles.heading} id={headingId}>In their own words.</h2>
          </div>
          <a className={styles.summary} href={data.profileUrl} target="_blank" rel="noopener noreferrer">
            <span className={styles.rating}>{data.rating.toFixed(1)}<span>/ 5</span></span>
            <span><ReviewStars rating={data.rating} /><span className={styles.count}>{data.count.toLocaleString("en-US")} Google {data.count === 1 ? "review" : "reviews"}</span></span>
            <ArrowUpRight size={20} aria-hidden="true" />
            <span className={styles.srOnly}> — Read reviews on Google Maps (opens a new tab)</span>
          </a>
        </div>
        <ReviewTicker count={reviews.length}>
          {reviews.map((review) => (
            <figure className={styles.card} key={review.author}>
              <figcaption className={styles.authorRow}>
                <div>
                  <strong>{review.author}</strong>
                </div>
              </figcaption>
              <ReviewStars rating={review.rating} />
              <blockquote className={styles.quote}>{review.text}</blockquote>
              <a className={styles.source} href={review.url} target="_blank" rel="noopener noreferrer">Read reviews on Google Maps <ArrowUpRight size={14} aria-hidden="true" /><span className={styles.srOnly}> (opens a new tab)</span></a>
            </figure>
          ))}
        </ReviewTicker>
        <div className={styles.attribution}>
          <a className={styles.googleLogo} href={data.profileUrl} target="_blank" rel="noopener noreferrer" aria-label="View River City Digital on Google Maps (opens a new tab)">
            {/* Unmodified DarkGray 2x PNG from Google's official attribution assets:
                https://developers.google.com/static/maps/documentation/images/Google_Maps_Attribution_Assets.zip */}
            <Image src="/assets/chicago/google-maps-attribution.png" alt="Google Maps" width={98} height={18} unoptimized />
          </a>
          <p>Google review excerpts · Rating and count checked {data.checked}.</p>
          <p className={styles.legal}><a href="https://www.google.com/intl/en_us/help/terms_maps/" target="_blank" rel="noopener noreferrer">Google Maps terms</a><span aria-hidden="true"> · </span><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></p>
        </div>
      </div>
    </section>
  );
}
