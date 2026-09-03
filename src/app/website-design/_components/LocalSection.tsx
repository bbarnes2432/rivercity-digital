import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";

/* Right here in St. Louis.
 *
 * A light chapter about being local. On the left, the claim and three
 * reasons it matters, set large. On the right, the reach: three rings out
 * from the studio — the city, the county, the wider metro — with the
 * neighbourhoods and towns the Service Areas page already claims placed
 * around them, and the studio's own dot pulsing in the middle. */

const POINTS = [
  { n: "01", t: "Work directly with your web team.", d: "Talk with the people designing and building your website. Ask questions, share feedback, and know who to contact throughout the project." },
  { n: "02", t: "Reach the areas you serve.", d: "We plan your content around your services and service area, so customers can quickly see whether you can help them and where you work." },
  { n: "03", t: "Get support after launch.", d: "When your services, team, or business hours change, your website needs to keep up. We can help with updates and discuss ongoing support for your site." },
];

/* Placed by angle (degrees, clockwise from the top) and ring (0 = city,
 * 1 = county, 2 = metro). */
const PLACES: { name: string; a: number; r: number }[] = [
  { name: "Lafayette Square", a: 45, r: 0 },
  { name: "Soulard", a: 135, r: 0 },
  { name: "Tower Grove", a: 218, r: 0 },
  { name: "The Hill", a: 315, r: 0 },
  { name: "Florissant", a: 15, r: 1 },
  { name: "Creve Coeur", a: 335, r: 1 },
  { name: "Clayton", a: 295, r: 1 },
  { name: "Maplewood", a: 254, r: 1 },
  { name: "Kirkwood", a: 205, r: 1 },
  { name: "Webster Groves", a: 165, r: 1 },
  { name: "Edwardsville, IL", a: 60, r: 2 },
  { name: "Belleville, IL", a: 118, r: 2 },
  { name: "Ballwin & Ellisville", a: 232, r: 2 },
  { name: "Chesterfield", a: 272, r: 2 },
  { name: "Wentzville", a: 305, r: 2 },
  { name: "St. Charles", a: 330, r: 2 },
  { name: "O'Fallon", a: 352, r: 2 },
];
const RINGS = [
  { r: 96, label: "The city" },
  { r: 160, label: "St. Louis County" },
  { r: 212, label: "St. Charles & the Metro East" },
];
const C = 250; // centre of a 500×500 drawing

function pos(a: number, r: number) {
  const rad = ((a - 90) * Math.PI) / 180;
  const R = RINGS[r].r;
  return { x: C + Math.cos(rad) * R, y: C + Math.sin(rad) * R };
}

export default function LocalSection() {
  return (
    <Section mode="working" className="rcd-local rcd-light">
      <Container>
        <div className="rcd-local-grid">
          <div className="rcd-local-copy">
            <p className="t-eyebrow fx-reveal">Right here in St. Louis</p>
            <h2 className="rcd-local-title fx-reveal">A local team. <span>Direct contact.</span></h2>
            <p className="rcd-local-lede fx-reveal">
              We work with businesses across St. Louis, St. Charles, and the Metro East.
              You work directly with the team building your website, from the first
              conversation through launch and future updates.
            </p>
            <ol className="rcd-local-points fx-stagger">
              {POINTS.map((p) => (
                <li key={p.n}>
                  <span className="rcd-local-n">{p.n}</span>
                  <div>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <figure className="rcd-local-map fx-reveal" aria-label="Areas we serve, from the city out to the metro">
            <svg viewBox="0 0 500 500" role="img" aria-hidden="true">
              <defs>
                <radialGradient id="rcd-local-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#4CA5AD" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#4CA5AD" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={C} cy={C} r="230" fill="url(#rcd-local-glow)" />
              {RINGS.map((ring, i) => (
                <circle key={ring.r} className="rcd-local-ring" cx={C} cy={C} r={ring.r} style={{ transitionDelay: `${0.15 + i * 0.18}s` }} />
              ))}
              {RINGS.map((ring) => (
                <text key={ring.label} className="rcd-local-ring-label" x={C} y={C - ring.r - 8} textAnchor="middle">{ring.label}</text>
              ))}
              {/* Spokes, faint, for the sense of a map. */}
              {[0, 45, 90, 135].map((a) => {
                const rad = (a * Math.PI) / 180;
                return <line key={a} className="rcd-local-spoke" x1={C - Math.cos(rad) * 228} y1={C - Math.sin(rad) * 228} x2={C + Math.cos(rad) * 228} y2={C + Math.sin(rad) * 228} />;
              })}
              <circle className="rcd-local-pulse" cx={C} cy={C} r="10" />
              <circle className="rcd-local-dot" cx={C} cy={C} r="6" />
              <text className="rcd-local-home" x={C} y={C + 28} textAnchor="middle">River City Digital</text>
            </svg>
            <ul className="rcd-local-places">
              {PLACES.map((p, i) => {
                const { x, y } = pos(p.a, p.r);
                return (
                  <li key={p.name} style={{ left: `${(x / 500) * 100}%`, top: `${(y / 500) * 100}%`, transitionDelay: `${0.5 + i * 0.06}s` }}>{p.name}</li>
                );
              })}
            </ul>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
