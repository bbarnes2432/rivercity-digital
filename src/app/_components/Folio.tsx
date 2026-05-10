/* Editorial section opener — `§ 03 / SERVICES · ─── · MAR 2026`.
 * Sits above a section's main h2 and turns every section into a "page"
 * in a filed report. */

type Props = {
  number: string | number;
  title: string;
  /** Right-side stamp, e.g. "MAR 2026" or "FILED FROM STL" */
  date?: string;
  /** Apply against dark sections (civic / civic-deep). */
  tone?: "light" | "dark";
};

export default function Folio({ number, title, date, tone = "light" }: Props) {
  const num = typeof number === "number" ? String(number).padStart(2, "0") : number;
  return (
    <div className="rcd-folio" data-tone={tone} aria-hidden="true">
      <span className="rcd-folio-num">§ {num}</span>
      <span className="rcd-folio-slash">/</span>
      <span className="rcd-folio-title">{title}</span>
      <span className="rcd-folio-rule" />
      {date && <span className="rcd-folio-date">{date}</span>}
    </div>
  );
}
