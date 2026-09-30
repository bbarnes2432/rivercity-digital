import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getChicagoReviews } from "@/lib/chicago-reviews";
import styles from "./ChicagoReviews.module.css";

function ReviewStars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">{"★".repeat(Math.round(rating))}<span className={styles.emptyStars}>{"★".repeat(5 - Math.round(rating))}</span></span>
    </span>
  );
}

// Server Component: mount below ChicagoProjectGallery inside a Suspense boundary
// with a null fallback, so a slow third-party response cannot delay the page.
export default async function ChicagoReviews() {
  const data = await getChicagoReviews();
  if (!data) return null;

  const reviews = data.reviews.slice(0, 3);

  return (
    <section className={`${styles.section} rcd-light`} aria-labelledby="chicago-reviews-heading">
      <div className="wd-container">
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>From our clients</p>
            <h2 className={styles.heading} id="chicago-reviews-heading">In their own words.</h2>
          </div>
          <a className={styles.summary} href={data.profileUrl} target="_blank" rel="noopener noreferrer">
            <span className={styles.rating}>{data.rating.toFixed(1)}<span>/ 5</span></span>
            <span><ReviewStars rating={data.rating} /><span className={styles.count}>{data.count.toLocaleString("en-US")} Google {data.count === 1 ? "review" : "reviews"}</span></span>
            <ArrowUpRight size={20} aria-hidden="true" />
            <span className={styles.srOnly}> — Read reviews on Google Maps (opens a new tab)</span>
          </a>
        </div>
        <div className={styles.grid}>
          {reviews.map((review) => (
            <figure className={styles.card} key={review.url}>
              <figcaption className={styles.authorRow}>
                {review.photoUrl && <Image className={styles.avatar} src={review.photoUrl} width={40} height={40} alt={`${review.author}'s profile photo`} unoptimized referrerPolicy="no-referrer" />}
                <div>
                  <strong>{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer" aria-label={`${review.author}'s Google Maps profile (opens a new tab)`}>{review.author}</a> : review.author}</strong>
                  {review.relativeTime && <span className={styles.date}>{review.relativeTime}</span>}
                </div>
              </figcaption>
              <ReviewStars rating={review.rating} />
              <blockquote className={styles.quote} lang={review.languageCode}>{review.text}</blockquote>
              <a className={styles.source} href={review.url} target="_blank" rel="noopener noreferrer">Read review on Google Maps <ArrowUpRight size={14} aria-hidden="true" /><span className={styles.srOnly}> (opens a new tab)</span></a>
            </figure>
          ))}
        </div>
        <div className={styles.attribution}>
          <a className={styles.googleLogo} href={data.profileUrl} target="_blank" rel="noopener noreferrer" aria-label="View River City Digital on Google Maps (opens a new tab)">
            {/* Unmodified DarkGray 2x PNG from Google's official attribution assets:
                https://developers.google.com/static/maps/documentation/images/Google_Maps_Attribution_Assets.zip */}
            <Image src="/assets/chicago/google-maps-attribution.png" alt="Google Maps" width={98} height={18} unoptimized />
          </a>
          <p>Showing up to three text reviews supplied by Google, in relevance order. No star-rating filter.</p>
          {data.attributions.length > 0 && <p className={styles.providers}>{data.attributions.map((attribution, index) => <span key={`${attribution.name}-${index}`}>{index > 0 && " · "}{attribution.url ? <a href={attribution.url} target="_blank" rel="noopener noreferrer">{attribution.name}</a> : attribution.name}</span>)}</p>}
          <p className={styles.legal}><a href="https://www.google.com/intl/en_us/help/terms_maps/" target="_blank" rel="noopener noreferrer">Google Maps terms</a><span aria-hidden="true"> · </span><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></p>
        </div>
      </div>
    </section>
  );
}
