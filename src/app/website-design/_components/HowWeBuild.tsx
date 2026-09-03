import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";

/* Client deliverables and the decisions agreed before a full build. */

type Col = { name: string; sub: string; featured?: boolean; rows: { k: string; v: string }[] };

const COLS: Col[] = [
  {
    name: "Clear content",
    sub: "Help customers decide",
    featured: true,
    rows: [
      { k: "Your services", v: "Explain what you offer, who it's for, and where you work." },
      { k: "Reasons to trust you", v: "Give your reviews, project examples, and experience a clear place on the page." },
      { k: "The next step", v: "Make it easy to call, book an appointment, or send an inquiry." },
    ],
  },
  {
    name: "Custom design",
    sub: "Make your business easy to recognize",
    rows: [
      { k: "Your brand", v: "Layouts, typography, and colors designed around your business and content." },
      { k: "Mobile use", v: "Readable pages and accessible contact options on phones, tablets, and desktops." },
      { k: "Your approval", v: "Review the layouts and finished designs before development begins." },
    ],
  },
  {
    name: "A complete build",
    sub: "Prepare your site for launch",
    rows: [
      { k: "Development", v: "Custom development with performance checks and optimized images." },
      { k: "Search foundations", v: "Page titles, descriptions, sitemaps, and structured data that describe your business." },
      { k: "Launch and handover", v: "Domain setup, analytics, and access to your site, with support options explained." },
    ],
  },
];

const NUMBERS = [
  { n: "01", l: "Agree on the scope", d: "Know which pages and features are included before the build starts." },
  { n: "02", l: "Confirm the timeline", d: "Set a schedule around the project, your content, and design approvals." },
  { n: "03", l: "Review the price", d: "Get a project quote and discuss hosting and ongoing support costs." },
];

export default function HowWeBuild() {
  return (
    <Section mode="working" className="rcd-how rcd-light">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="What you get"
          title="A website built around your customers."
          lede="We plan the content, design the pages, and build the site around how people choose your business. Here's what that includes."
        />

        <div className="rcd-how-cols fx-stagger">
          {COLS.map((c) => (
            <article key={c.name} className="rcd-how-col" data-ours={c.featured ? "" : undefined}>
              <header className="rcd-how-col-h">
                <span className="rcd-how-col-tag">Included in your website</span>
                <h3>{c.name}</h3>
                <p>{c.sub}</p>
              </header>
              <ul>
                {c.rows.map((r) => (
                  <li key={r.k} data-good="">
                    <span className="rcd-how-mark" aria-hidden="true">✓</span>
                    <div>
                      <span className="rcd-how-k">{r.k}</span>
                      <span className="rcd-how-v">{r.v}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <ul className="rcd-how-numbers fx-stagger">
          {NUMBERS.map((x) => (
            <li key={x.l}>
              <span className="rcd-how-num">{x.n}</span>
              <span className="rcd-how-num-l">{x.l}</span>
              <span className="rcd-how-num-d">{x.d}</span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
