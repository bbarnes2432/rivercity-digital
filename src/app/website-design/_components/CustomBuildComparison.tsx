import Container from "@/app/_components/Container";
import Section from "@/app/_components/Section";
import SectionHeader from "@/app/_components/SectionHeader";
import Button from "@/app/_components/Button";

// Compare our service with template-based implementations, rather than
// implying that WordPress or Wix cannot support custom work or good SEO.
const OPTIONS = [
  {
    name: "Custom Next.js",
    label: "The custom advantage",
    sub: "Control over the design, code, and future",
    featured: true,
    rows: [
      { k: "Design", v: "We build the layout around your services, brand, and sales process. Every page has a specific job." },
      { k: "Performance", v: "We control what loads and when, with optimized images and code tailored to the features your site needs." },
      { k: "Custom backends & features", v: "Custom backends, customer portals, dashboards, automations, and integrations. We can build around the way your business works and keep adding features as you grow. Your options aren't limited to a theme or app catalog." },
      { k: "Search", v: "Direct control over page structure, metadata, and structured data lets us build search foundations into the site." },
      { k: "Ownership", v: "You own your website's code. You can move it to compatible hosting or work with another developer." },
    ],
  },
  {
    name: "WordPress theme",
    label: "Template trade-offs",
    sub: "Theme constraints and ongoing upkeep",
    featured: false,
    rows: [
      { k: "Design", v: "You start with someone else's layout. Moving beyond the theme can mean paying for custom development anyway." },
      { k: "Performance", v: "Theme features, page builders, and plugins can add code your visitors don't need. Getting it lean takes extra work." },
      { k: "Features", v: "More features can mean more plugins, separate licenses, and compatibility checks. Each addition creates another dependency." },
      { k: "Search", v: "Search setup is often split across theme settings and SEO plugins, adding more configuration to manage and maintain." },
      { k: "Ownership", v: "You can move hosts, but still have WordPress, a theme, and plugins to keep updated and working together." },
    ],
  },
  {
    name: "Wix template",
    label: "Platform limitations",
    sub: "Less control and tied to Wix hosting",
    featured: false,
    rows: [
      { k: "Design", v: "Your design has to work within the editor and platform. Highly specific layouts or interactions can require workarounds." },
      { k: "Performance", v: "You can't change the underlying hosting or rendering system. Performance fixes are limited to the controls Wix provides." },
      { k: "Features", v: "When built-in tools and apps don't fit, custom features still have to work within Wix's platform limits." },
      { k: "Search", v: "SEO settings don't give you full control of the underlying application. Deeper technical changes depend on what Wix supports." },
      { k: "Ownership", v: "You can't move the complete site to another host. Leaving Wix means rebuilding your website." },
    ],
  },
];

export default function CustomBuildComparison() {
  return (
    <Section
      id="custom-build"
      mode="working"
      className="rcd-how rcd-light border-t border-[#101d311f]"
    >
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="Custom code. Built on Next.js."
          title="Why choose a custom build?"
          lede="Your website should support the way you do business. We use Next.js to build around your goals, with control over the design, performance, and features from the start."
        />

        <div className="rcd-how-cols fx-stagger">
          {OPTIONS.map((option) => (
            <article key={option.name} className="rcd-how-col" data-ours={option.featured ? "" : undefined}>
              <header className="rcd-how-col-h">
                <span className="rcd-how-col-tag">{option.label}</span>
                <h3>{option.name}</h3>
                <p>{option.sub}</p>
              </header>
              <ul>
                {option.rows.map((row) => (
                  <li key={row.k} data-good={option.featured ? "" : undefined}>
                    <span className="rcd-how-mark" style={option.featured ? undefined : { color: "#b0443c" }} aria-hidden="true">{option.featured ? "✓" : "✕"}</span>
                    <div>
                      <span className="rcd-how-k">{row.k}</span>
                      <span className="rcd-how-v">{row.v}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="fx-reveal" style={{ marginTop: 40, maxWidth: 760 }}>
          <h3 className="t-h3">Built for what comes next.</h3>
          <p className="t-lede" style={{ marginTop: 12, marginBottom: 24 }}>
            Your website can grow into a customer portal, a custom CRM, or the
            system your team uses to manage orders and products. We build the
            backend and connect the tools your business needs, with room to add
            new capabilities as your operations grow.
          </p>
          <Button href="/website-design#start" size="lg" arrow>Get my free website mockup</Button>
          <p style={{ marginTop: 12 }}>Start with a free mockup. No obligation to build.</p>
        </div>
      </Container>
    </Section>
  );
}
