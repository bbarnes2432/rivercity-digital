import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";

/* How we build — the stack, and why.
 *
 * A light chapter between the demonstrations and the build. The pitch is
 * plain: every site we ship is hand-coded on Next.js, the framework behind
 * some of the largest sites on the web, and that is a different thing from
 * a WordPress theme or a Wix template. Three cards, ours first and largest,
 * each answering the same five questions; then three numbers. Everything
 * reveals as it arrives. */

type Col = { name: string; sub: string; ours?: boolean; rows: { k: string; v: string; good: boolean }[] };

const COLS: Col[] = [
  {
    name: "Ours",
    sub: "Hand-coded on Next.js",
    ours: true,
    rows: [
      { k: "What's underneath", v: "Code written for you, from a blank file. Every page is its own decisions.", good: true },
      { k: "Speed", v: "Pages built ahead of time and served from servers near your visitor. Nothing to boot.", good: true },
      { k: "Google & AI search", v: "Real HTML on every page, schema markup, Core Web Vitals in the green — built in.", good: true },
      { k: "Security", v: "No admin login to attack, no plugins to patch. Nothing to break into.", good: true },
      { k: "Who owns it", v: "You. Your code, in your repository, hosted anywhere you like.", good: true },
    ],
  },
  {
    name: "WordPress",
    sub: "A theme plus plugins",
    rows: [
      { k: "What's underneath", v: "Someone else's theme, bent to fit, plus the plugins it takes to do the rest.", good: false },
      { k: "Speed", v: "Every visit runs PHP and a database before a byte is sent.", good: false },
      { k: "Google & AI search", v: "Depends on the theme, the SEO plugin, and how well they get along.", good: false },
      { k: "Security", v: "A login page on the open web and a plugin list to keep patched — forever.", good: false },
      { k: "Who owns it", v: "You, with a maintenance bill and a theme licence that isn't yours.", good: false },
    ],
  },
  {
    name: "Wix",
    sub: "A drag-and-drop template",
    rows: [
      { k: "What's underneath", v: "A template. The layout choices were made before you arrived.", good: false },
      { k: "Speed", v: "A shared page builder loads first, then your page. You don't control the weight.", good: false },
      { k: "Google & AI search", v: "Limited control over structure, speed and the markup search engines read.", good: false },
      { k: "Security", v: "Handled by the platform, on the platform's terms.", good: false },
      { k: "Who owns it", v: "Rented. Leave the platform and the site does not come with you.", good: false },
    ],
  },
];

const NUMBERS = [
  { n: "0", l: "plugins to patch", d: "There is no plugin layer. Nothing to update, nothing to break." },
  { n: "95+", l: "Lighthouse, every page", d: "Performance, accessibility, SEO and best practices, held on every build." },
  { n: "1", l: "codebase, and it's yours", d: "Your repository, your hosting, no subscription standing between you and your site." },
];

export default function HowWeBuild() {
  return (
    <Section mode="working" className="rcd-how rcd-light">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="How we build · The stack"
          title="Built on Next.js. Not WordPress. Not Wix."
          lede="Next.js is the framework behind some of the largest sites on the web. We hand-code every site on it — which is a different thing from a theme with your logo in it, and it shows in every number Google measures."
        />

        <div className="rcd-how-cols fx-stagger">
          {COLS.map((c) => (
            <article key={c.name} className="rcd-how-col" data-ours={c.ours ? "" : undefined}>
              <header className="rcd-how-col-h">
                <span className="rcd-how-col-tag">{c.ours ? "What we build" : "The alternative"}</span>
                <h3>{c.name}</h3>
                <p>{c.sub}</p>
              </header>
              <ul>
                {c.rows.map((r) => (
                  <li key={r.k} data-good={r.good ? "" : undefined}>
                    <span className="rcd-how-mark" aria-hidden="true">{r.good ? "✓" : "—"}</span>
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
