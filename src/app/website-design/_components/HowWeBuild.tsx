import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";

/* How we build — the stack, and why.
 *
 * A light chapter between the demonstrations and the build. The pitch is
 * plain: every site we ship is hand-coded on Next.js, the framework behind
 * some of the largest sites on the web, and that is a different thing from
 * a WordPress theme or a Wix template. The table says how, row by row, in
 * the terms a business owner actually cares about. */

const ROWS: { k: string; ours: string; wp: string; wix: string }[] = [
  {
    k: "What's underneath",
    ours: "Code written for you, from a blank file. Every page is its own decisions.",
    wp: "A theme someone else designed, bent to fit, plus the plugins it takes to do the rest.",
    wix: "A drag-and-drop template. The layout choices were made before you arrived.",
  },
  {
    k: "Speed",
    ours: "Pages are built ahead of time and served from servers near your visitor. Nothing to boot.",
    wp: "Every visit runs PHP and a database before a byte is sent; speed plugins stack on top.",
    wix: "A shared page builder loads first, then your page. You don't control the weight.",
  },
  {
    k: "Google & AI search",
    ours: "Real HTML on every page, schema markup, Core Web Vitals in the green — built in, not bolted on.",
    wp: "Depends on the theme, the SEO plugin, and how well they get along this month.",
    wix: "Limited control over structure, speed and the markup search engines read.",
  },
  {
    k: "Security",
    ours: "No admin login to attack, no plugins to patch. There is nothing to break into.",
    wp: "A login page on the open web and a plugin list to keep patched — forever.",
    wix: "Handled by the platform, on the platform's terms.",
  },
  {
    k: "Who owns it",
    ours: "You. It's your code, in your repository, and it can be hosted anywhere.",
    wp: "You — with a maintenance bill, and a theme licence that isn't yours.",
    wix: "Rented. Leave the platform and the site does not come with you.",
  },
];

export default function HowWeBuild() {
  return (
    <Section mode="working" className="rcd-how rcd-light">
      <Container>
        <SectionHeader
          eyebrow="How we build · The stack"
          title="Built on Next.js. Not WordPress. Not Wix."
          lede="Next.js is the framework behind some of the largest sites on the web. We hand-code every site on it — which is a different thing from a theme with your logo in it, and it shows in every number Google measures."
        />
        <div className="rcd-how-wrap fx-reveal">
          <table className="rcd-how-table">
            <thead>
              <tr>
                <th scope="col"><span className="visually-hidden">Comparison</span></th>
                <th scope="col" className="is-ours">Ours · Next.js</th>
                <th scope="col">WordPress</th>
                <th scope="col">Wix</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.k}>
                  <th scope="row">{r.k}</th>
                  <td className="is-ours">{r.ours}</td>
                  <td>{r.wp}</td>
                  <td>{r.wix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rcd-how-note">
          None of this is a knock on the people who use them. WordPress and Wix are fine for a first
          site. When the site has to earn its keep — rank, load fast on a phone, and turn a visit into a
          call — the way it is built starts to matter, and that is what we do.
        </p>
      </Container>
    </Section>
  );
}
