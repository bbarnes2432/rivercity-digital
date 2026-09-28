import type { GoogleReviews as Reviews } from "@/lib/google-reviews";

// Real reviews from River City Digital's Google Business Profile, as returned
// by the Places API. Every card links back to the review on Google, and the
// author links to their Google profile, per Google's attribution rules.

function GoogleG() {
  return (
    <svg className="rcd-greview-g" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="rcd-greview-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {"★★★★★".slice(0, filled)}
      <span className="rcd-greview-stars-empty">{"★★★★★".slice(filled)}</span>
    </span>
  );
}

export default function GoogleReviews({ data, count = 3 }: { data: Reviews; count?: number }) {
  const reviews = data.reviews.slice(0, count);
  return (
    <>
      <a
        className="rcd-greview-summary"
        href={data.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <GoogleG />
        <strong>{data.rating.toFixed(1)}</strong>
        <Stars rating={data.rating} />
        <span>
          {data.count} Google {data.count === 1 ? "review" : "reviews"} · Read them on Google
        </span>
      </a>
      {reviews.length > 0 && (
        <div className="rcd-quote-grid fx-stagger">
          {reviews.map((r) => (
            <figure key={`${r.author}-${r.relativeTime}`} className="rcd-quote rcd-greview">
              <div className="rcd-greview-top">
                <Stars rating={r.rating} />
                <GoogleG />
              </div>
              <blockquote className="rcd-quote-body rcd-greview-body">{r.text}</blockquote>
              <figcaption className="rcd-quote-meta">
                <strong>
                  {r.authorUrl ? (
                    <a href={r.authorUrl} target="_blank" rel="noopener noreferrer">
                      {r.author}
                    </a>
                  ) : (
                    r.author
                  )}
                </strong>
                <span>
                  {r.relativeTime && `${r.relativeTime} · `}
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      Posted on Google
                    </a>
                  ) : (
                    "Posted on Google"
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <p className="rcd-greview-attribution">Reviews from Google Maps</p>
    </>
  );
}
