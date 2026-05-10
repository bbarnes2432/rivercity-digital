import Image from "next/image";
import Button from "./Button";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  body: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  imageSrc: string;
  imageAlt: string;
};

/**
 * Editorial photo break — half-bleed STL photo on the left, navy copy
 * panel on the right. Slots once between heavier sections to interrupt
 * card-grid rhythm with a cinematic moment.
 */
export default function PhotoBand({
  eyebrow,
  title,
  body,
  ctaHref,
  ctaLabel,
  imageSrc,
  imageAlt,
}: Props) {
  return (
    <div className="rcd-photo-band fx-reveal">
      <div className="rcd-photo-band-img">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 880px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="rcd-photo-band-copy">
        <p className="rcd-photo-band-eyebrow">{eyebrow}</p>
        <h2 className="rcd-photo-band-title">{title}</h2>
        <p className="rcd-photo-band-body">{body}</p>
        {ctaHref && ctaLabel && (
          <Button href={ctaHref} variant="ghost" size="md" arrow>
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
