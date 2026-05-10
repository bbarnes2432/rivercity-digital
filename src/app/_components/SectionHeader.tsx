import { ReactNode } from "react";
import Folio from "./Folio";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "center" | "left";
  id?: string;
  className?: string;
  /** Folio number — when set, renders a ledger-entry section opener
   * above the eyebrow/title. */
  folio?: string | number;
  /** Folio title (defaults to the eyebrow string if it's a string). */
  folioTitle?: string;
  /** Folio date stamp, e.g. "MAR 2026". */
  folioDate?: string;
  /** Tone for the folio (defaults to light). */
  folioTone?: "light" | "dark";
};

export default function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "center",
  id,
  className,
  folio,
  folioTitle,
  folioDate,
  folioTone,
}: Props) {
  const resolvedFolioTitle =
    folioTitle ?? (typeof eyebrow === "string" ? eyebrow : undefined);
  return (
    <header
      className={`section-head${className ? " " + className : ""}`}
      data-align={align}
      id={id}
    >
      {folio !== undefined && resolvedFolioTitle && (
        <Folio
          number={folio}
          title={resolvedFolioTitle}
          date={folioDate}
          tone={folioTone}
        />
      )}
      {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
      <h2 className="t-h2">{title}</h2>
      {lede && <p className="t-lede">{lede}</p>}
    </header>
  );
}
