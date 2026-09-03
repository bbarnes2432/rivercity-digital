import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";

/* Right here in St. Louis.
 *
 * A light chapter about being local: a studio in the city, serving the
 * city and everything around it, where a client is a person we know rather
 * than an account number. The neighbourhoods and towns are the ones the
 * Service Areas page already claims. */

const AREAS = [
  "Soulard", "The Hill", "Tower Grove", "Lafayette Square", "Clayton", "Kirkwood", "Webster Groves",
  "Maplewood", "Chesterfield", "Ballwin & Ellisville", "Creve Coeur", "O'Fallon", "St. Charles",
  "Wentzville", "Florissant", "Belleville, IL", "Edwardsville, IL",
];

const POINTS = [
  { t: "You talk to the people who build it.", d: "No account manager, no ticket queue, no offshore hand-off. The person you met is the person writing your site, and the one who answers when you call." },
  { t: "We know the streets you're selling on.", d: "Which neighbourhoods search for what, what a Kirkwood customer expects that a Soulard one doesn't, where the competition is thin. That is local knowledge, and it goes into the build." },
  { t: "We're around after launch.", d: "A site is not a project that ends. We are twenty minutes away, we keep the phone on, and we would rather fix a small thing today than hear about it in a quarterly review." },
];

export default function LocalSection() {
  return (
    <Section mode="working" className="rcd-local rcd-light">
      <Container>
        <div className="rcd-local-grid">
          <div className="rcd-local-copy">
            <SectionHeader
              className="fx-reveal"
              align="left"
              eyebrow="Right here in St. Louis"
              title="Local. Not a number."
              lede="We are a St. Louis studio, and we serve St. Louis: the city, the county, St. Charles, the Metro East. When you work with us you are not one of a thousand accounts at a corporation in another time zone. You are a business we can drive to, run by people we know by name, and we care whether it works."
            />
            <ul className="rcd-local-points fx-stagger">
              {POINTS.map((p) => (
                <li key={p.t}>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </li>
              ))}
            </ul>
          </div>
          <aside className="rcd-local-areas fx-reveal" aria-label="Areas we serve">
            <p className="rcd-local-areas-h">Where we work</p>
            <ul>
              {AREAS.map((a) => <li key={a}>{a}</li>)}
            </ul>
            <p className="rcd-local-areas-note">And anywhere else in the metro. If you can meet us for coffee, we can build your site.</p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
