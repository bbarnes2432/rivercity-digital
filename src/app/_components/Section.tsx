import { ReactNode } from "react";

type Mode = "letterhead" | "working" | "civic" | "civic-deep" | "sunken";
type Pad = "default" | "tight" | "loose";

type Props = {
  children: ReactNode;
  mode?: Mode;
  pad?: Pad;
  id?: string;
  className?: string;
  ariaLabelledby?: string;
  ariaLabel?: string;
};

export default function Section({
  children,
  mode = "letterhead",
  pad = "default",
  id,
  className,
  ariaLabelledby,
  ariaLabel,
}: Props) {
  const padClass = pad === "tight" ? " section--tight" : pad === "loose" ? " section--loose" : "";
  const isDark = mode === "civic" || mode === "civic-deep";
  return (
    <section
      id={id}
      data-theme={isDark ? "dark" : undefined}
      className={`section section--${mode}${padClass}${className ? " " + className : ""}`}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}
