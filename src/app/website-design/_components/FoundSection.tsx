import { Braces, LayoutList, Gauge, MapPin, MessageSquareText, Radar, type LucideIcon } from "lucide-react";
import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";
import FoundDemo from "./FoundDemo";

/* Found on Google. Cited by AI.
 *
 * The comparison before this ends on control over page structure, metadata
 * and structured data. This is what that control buys: a search result with
 * the rich pieces Google only shows when the site gives it the data, and an
 * AI answer that names the business and cites the site. Both are drawn live,
 * cycling through three St. Louis examples, then the six things every build
 * ships with that make both happen. */

const SIGNALS: { Icon: LucideIcon; t: string; d: string }[] = [
  { Icon: Braces, t: "Structured data on every page", d: "Schema for your business, services, reviews, FAQs and service areas, written into the code. Google reads it for rich results. AI assistants read it to know who you are." },
  { Icon: LayoutList, t: "One job per page", d: "Real headings, clean HTML, a page for each service and each area. Crawlers and language models both understand what a page is about without guessing." },
  { Icon: Gauge, t: "Fast by construction", d: "Hand-coded, no plugins, images sized for the device. Lighthouse 95+ is the floor, and speed is a ranking signal on both phones and desktops." },
  { Icon: MapPin, t: "Local signals", d: "Service-area pages, consistent name, address and phone, map embeds and local schema for the neighbourhoods you actually serve." },
  { Icon: MessageSquareText, t: "Copy that answers", d: "The questions people ask, answered plainly on the page. That is what AI Overviews and assistants quote when someone asks who to call." },
  { Icon: Radar, t: "Wired at launch", d: "Search Console, analytics, sitemap and robots submitted on day one. We check that Google has indexed the site rather than assume it." },
];

export default function FoundSection() {
  return (
    <Section id="found" mode="civic-deep" className="rcd-found">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="SEO and AEO, built in"
          title="Found on Google. Cited by AI."
          lede="Search engine optimization gets you into Google's results. Answer engine optimization gets you named when someone asks ChatGPT, Perplexity or Google's AI Overview who to call. Every site we build ships with both, out of the box. No SEO plugin, no add-on package."
        />

        <FoundDemo />

        <div className="rcd-found-more fx-reveal">
          <p className="rcd-found-label">What makes it happen</p>
          <h3>Six things every build ships with.</h3>
        </div>
        <ul className="rcd-found-grid fx-stagger">
          {SIGNALS.map(({ Icon, t, d }) => (
            <li key={t} className="rcd-found-signal">
              <span className="rcd-found-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.7} /></span>
              <h4>{t}</h4>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
