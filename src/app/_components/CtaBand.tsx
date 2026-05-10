import { ReactNode } from "react";
import Section from "./Section";
import Container from "./Container";
import Button from "./Button";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  id?: string;
};

export default function CtaBand({
  eyebrow,
  title,
  lede,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  id,
}: Props) {
  return (
    <Section mode="civic-deep" id={id} className="rcd-cta-band section--bg-pop-river">
      <Container>
        <div className="rcd-cta-inner">
          {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
          <h2 className="t-display-2">{title}</h2>
          {lede && <p className="t-lede">{lede}</p>}
          <div className="rcd-cta-actions">
            <Button href={primaryHref} size="lg" arrow>{primaryLabel}</Button>
            {secondaryHref && secondaryLabel && (
              <Button href={secondaryHref} size="lg" variant="ghost">{secondaryLabel}</Button>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
