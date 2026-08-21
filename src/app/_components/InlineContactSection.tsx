import Section from "./Section";
import Container from "./Container";
import CallLink from "./CallLink";
import BookCallLink from "./BookCallLink";
import ContactForm from "./contact-form";

type Props = {
  /** Anchor id. The CtaBand and MobileStickyCta on the same page point here. */
  id?: string;
  eyebrow?: string;
  title?: string;
  lede?: string;
  /** Pre-selects "What are we looking at?" so the visitor answers one question
   *  fewer. Must match an <option> in <ContactForm /> or it selects nothing. */
  defaultService?: string;
  /** Reported with the call and booking events. Keep it page-specific so the
   *  reporting can tell a call from /about apart from one from /website-design. */
  context?: string;
};

/* The "three ways to start" block: call, book, or write — plus the form.
 *
 * This was inline on /website-design only, which was fine while that was the
 * one page paid traffic could land on. It isn't: the ad's sitelinks send clicks
 * to /about and /local-seo-optimization too, and /about turned out to produce
 * the most expensive clicks in the account. Those pages offered a CtaBand and
 * nothing else — a second click before anyone could actually convert.
 *
 * So the block became a component rather than a fourth copy-paste. Every page
 * that can receive an ad click now ends the same way, and there is one place to
 * change the copy when the offer changes.
 *
 * The order is deliberate and unchanged: phone first, booking second, form
 * last — ascending in how much the visitor has to commit before anything
 * happens. */
export default function InlineContactSection({
  id = "start",
  eyebrow = "Start here",
  title = "Tell us what you're working with.",
  lede,
  defaultService = "",
  context = "form-section",
}: Props) {
  return (
    <Section mode="working" id={id} className="tex-dots rcd-inline-contact-section">
      <Container narrow>
        <div className="rcd-inline-contact fx-stagger">
          <div className="rcd-inline-contact-head">
            <p className="t-eyebrow">{eyebrow}</p>
            <h2 className="t-h2">{title}</h2>
            <p className="t-lede">
              {lede ??
                "A few sentences is plenty. We\u2019ll come back with questions, a real timeline, and a real number. Same-day reply most days."}
            </p>
          </div>

          <div className="rcd-inline-contact-fast">
            <CallLink context={context} className="btn btn-primary btn-md" />
            <BookCallLink context={context} className="btn btn-secondary btn-md">
              Book a 30-min call
            </BookCallLink>
            <span className="rcd-inline-contact-or" aria-hidden="true">
              <span>or write us below</span>
            </span>
          </div>

          <div className="rcd-inline-contact-card">
            <ContactForm defaultService={defaultService} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
