"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMotionPaused } from "./motion-pause";
import type { ReviewCard } from "./review-cards";
import styles from "./ReviewsShowcase.module.css";

function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setSeen(true); }, { threshold: 0.6 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [seen]);
  return [ref, seen] as const;
}

/** "5.0" counts up and the stars fill one by one when the header scrolls in. */
export function RatingHeader({ rating, count, profileUrl }: { rating: number; count: number; profileUrl: string }) {
  const [ref, seen] = useSeen<HTMLAnchorElement>();
  const reduced = useReducedMotion();
  const number = useRef<HTMLSpanElement>(null);
  const animate = seen && !reduced;

  // The server renders the real figure (no-JS and crawlers see it); once
  // hydrated, start from zero so the count-up has somewhere to come from.
  useEffect(() => {
    if (number.current && !seen && !reduced) number.current.textContent = "0.0";
  }, [seen, reduced]);

  useEffect(() => {
    const element = number.current;
    if (!element || !animate) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      element.textContent = (rating * eased).toFixed(1);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, rating]);

  const filled = Math.round(rating);
  return (
    <a ref={ref} className={styles.rating} href={profileUrl} target="_blank" rel="noopener noreferrer" data-seen={seen || reduced}>
      <span className={styles.ratingNumber} aria-hidden="true"><span ref={number}>{rating.toFixed(1)}</span></span>
      <span className={styles.ratingSide}>
        <span className={styles.ratingStars} aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={styles.ratingStar} data-on={i < filled} style={{ transitionDelay: `${250 + i * 160}ms` }}>★</span>
          ))}
        </span>
        <span className={styles.ratingCount}>{count.toLocaleString("en-US")} Google {count === 1 ? "review" : "reviews"}</span>
        <span className={styles.ratingLink}>Read reviews on Google <ArrowUpRight size={14} aria-hidden="true" /></span>
      </span>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5 from {count} Google reviews. Read reviews on Google Maps (opens a new tab).</span>
    </a>
  );
}

function Card({ review }: { review: ReviewCard }) {
  return (
    <figure className={styles.card}>
      <span className={styles.cardStars} role="img" aria-label="5 out of 5 stars">★★★★★</span>
      <blockquote className={styles.quote}>“{review.text}”</blockquote>
      <figcaption className={styles.cardFooter}>
        <strong>{review.author}</strong>
        {review.business && (review.url
          ? <a href={review.url} target="_blank" rel="noopener noreferrer">{review.business}<ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          : <span>{review.business}</span>)}
      </figcaption>
    </figure>
  );
}

const noopSubscribe = () => () => {};

/* Two drifting rows need at least this many reviews to fill wide screens. */
const TWO_ROW_MINIMUM = 12;

/** Rows drifting in opposite directions; they stop on hover, on tap, and
 *  with the site-wide pause. Reduced motion gets plain swipeable rows. */
export function ReviewRows({ reviews }: { reviews: ReviewCard[] }) {
  const sitePaused = useMotionPaused();
  const reduced = useReducedMotion();
  const [held, setHeld] = useState(false);
  // Each review shows once per loop. A row has to be wider than the screen to
  // loop, so the reviews only split into two rows once there are enough to
  // fill both; until then they share one row.
  const rows = reviews.length >= TWO_ROW_MINIMUM
    ? [reviews.filter((_, i) => i % 2 === 0), reviews.filter((_, i) => i % 2 === 1)]
    : [reviews];
  // The second copy that makes the loop seamless is added after hydration and
  // hidden from assistive tech, so the page source and text views list each
  // review exactly once.
  const looping = useSyncExternalStore(noopSubscribe, () => true, () => false);

  return (
    <div
      className={styles.rows}
      data-paused={sitePaused || held}
      data-static={reduced}
      data-looping={looping}
      onPointerDown={event => { if (event.pointerType !== "mouse") setHeld(value => !value); }}
    >
      {rows.map((row, r) => (
        <div className={styles.row} key={r} data-direction={r ? "right" : "left"}>
          <div className={styles.track}>
            <div className={styles.group}>{row.map(review => <Card key={review.author} review={review} />)}</div>
            {looping && !reduced && <div className={styles.group} aria-hidden="true" inert>{row.map(review => <Card key={review.author} review={review} />)}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
