"use client";

import { useEffect, useRef, useState } from "react";
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

/** Two rows drifting in opposite directions; they stop on hover, on tap, and
 *  with the site-wide pause. Reduced motion gets plain swipeable rows. */
export function ReviewRows({ reviews }: { reviews: ReviewCard[] }) {
  const sitePaused = useMotionPaused();
  const reduced = useReducedMotion();
  const [held, setHeld] = useState(false);
  // Both rows carry every review (each row must be wider than the screen to
  // loop), offset so the same card never sits above itself. Only the first
  // row's first copy is exposed to screen readers and keyboards.
  const shift = Math.floor(reviews.length / 2);
  const rows = [reviews, [...reviews.slice(shift), ...reviews.slice(0, shift)]];

  return (
    <div
      className={styles.rows}
      data-paused={sitePaused || held}
      data-static={reduced}
      onPointerDown={event => { if (event.pointerType !== "mouse") setHeld(value => !value); }}
    >
      {rows.map((row, r) => (reduced && r > 0) ? null : (
        <div className={styles.row} key={r} data-direction={r ? "right" : "left"} aria-hidden={r > 0 || undefined} inert={r > 0 || undefined}>
          <div className={styles.track}>
            <div className={styles.group}>{row.map(review => <Card key={review.author} review={review} />)}</div>
            {!reduced && <div className={styles.group} aria-hidden="true" inert>{row.map(review => <Card key={review.author} review={review} />)}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
