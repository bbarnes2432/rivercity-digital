/* News-crawl style marquee — content scrolls horizontally on a loop.
 * Pauses on hover. Uses the .fx-marquee primitive from motion.css. */

type Props = {
  items: string[];
  /** Optional eyebrow shown to the left, fixed (doesn't scroll). */
  label?: string;
  /** Tone — light (cream) or dark (navy). */
  tone?: "light" | "dark";
};

export default function Ticker({ items, label, tone = "light" }: Props) {
  /* Render the items twice in the track so the loop is seamless. */
  const renderRow = (keyPrefix: string) =>
    items.map((it, i) => (
      <span key={`${keyPrefix}-${i}`} className="rcd-ticker-item">
        <span className="rcd-ticker-bullet" aria-hidden="true">·</span>
        {it}
      </span>
    ));

  return (
    <div className="rcd-ticker" data-tone={tone} aria-hidden="true">
      {label && <span className="rcd-ticker-label">{label}</span>}
      <div className="rcd-ticker-window fx-marquee">
        <div className="rcd-ticker-track fx-marquee-track">
          {renderRow("a")}
          {renderRow("b")}
        </div>
      </div>
    </div>
  );
}
