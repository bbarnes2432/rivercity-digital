type Props = {
  size?: number;
  showPin?: boolean;
  pinColor?: string;
  outlineColor?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Stylized Missouri silhouette — used as a recurring brand mark.
 * Recognizable features: rectangular north/west borders, gentle
 * eastward bulge along the Mississippi (with St. Louis at the apex),
 * and the iconic Bootheel in the SE corner.
 * Optional teal pin marks the St. Louis location.
 */
export default function MissouriMark({
  size = 80,
  showPin = false,
  pinColor = "var(--accent)",
  outlineColor = "currentColor",
  className,
  ariaLabel,
}: Props) {
  const w = size;
  const h = (size * 90) / 100;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 90"
      fill="none"
      role={ariaLabel ? "img" : "presentation"}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
      className={className}
    >
      <path
        d="M 8 8
           L 80 8
           L 84 18
           L 88 30
           L 86 42
           L 82 54
           L 82 58
           L 86 58
           L 86 76
           L 76 76
           L 76 58
           L 8 58
           Z"
        stroke={outlineColor}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {showPin && <circle cx="84" cy="28" r="3.4" fill={pinColor} />}
    </svg>
  );
}
