const QUOTES: Array<{ q: string; name: string; role: string }> = [
  {
    q: "River City rebuilt our site and our search presence in three weeks. Calls picked up the first month. They actually answer the phone, which by itself was a change.",
    name: "Sarah M.",
    role: "Restaurant Owner · Webster Groves",
  },
  {
    q: "Our site was embarrassing to send to clients. They started over. The new site is fast, looks nothing like a template, and it's bringing in real leads.",
    name: "Jason T.",
    role: "HVAC Contractor · O'Fallon",
  },
  {
    q: "From the first call I knew this was different. They listened, came back with a plan, and shipped on time. Felt like working with a partner, not a vendor.",
    name: "Michelle R.",
    role: "Boutique Owner · Kirkwood",
  },
  {
    q: "I'd worked with web designers before and felt like just another client. River City actually felt like a partner. Site looks great and our Google ranking moved up noticeably.",
    name: "Derek W.",
    role: "General Contractor · St. Charles",
  },
  {
    q: "The ongoing support alone is worth it. Any time I need a change, they handle it that day. Best money we've spent on the business this year.",
    name: "Lisa K.",
    role: "Salon Owner · Clayton",
  },
  {
    q: "Straightforward, no fluff, results. Our new site launched on time and brought in customers who said they found us through search. Easiest agency decision I've made.",
    name: "Tom B.",
    role: "Landscaping · Chesterfield",
  },
];

export default function Testimonials({ count = 3 }: { count?: number }) {
  return (
    <div className="rcd-quote-grid fx-stagger">
      {QUOTES.slice(0, count).map((it) => (
        <figure key={it.name} className="rcd-quote">
          <div className="rcd-quote-glyph" aria-hidden="true">&ldquo;</div>
          <blockquote className="rcd-quote-body">{it.q}</blockquote>
          <figcaption className="rcd-quote-meta">
            <strong>{it.name}</strong>
            <span>{it.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
