import Image from "next/image";
import { ArrowUpRight, Code2, Layers3, PanelsTopLeft } from "lucide-react";

const TOPICS = [
  {
    "name": "Design",
    "heading": "Made for your business.",
    "ours": "We design around your services, brand, and customers. You approve the design before we build.",
    "wordpress": "A ready-made theme starts with layouts used by other businesses. Changing them may need extra design and coding.",
    "wix": "You start with a template and editor. Making it feel like your business still takes design work."
  },
  {
    "name": "Performance",
    "heading": "Build only what you need.",
    "ours": "We control the code and test how your pages load. We can fix problems without working around an unused theme feature.",
    "wordpress": "Heavy themes and extra plugins can slow pages down. They need careful setup, testing, and updates.",
    "wix": "Wix manages the platform and hosting. You can improve content and settings, but hosting choices stay with Wix."
  },
  {
    "name": "Custom features",
    "heading": "The right tools for your site.",
    "ours": "Forms, bookings, and other features are planned around your needs. You know what is included before work starts.",
    "wordpress": "Plugins can add features. Extra licenses and compatibility checks may be needed.",
    "wix": "Features must fit Wix’s apps and tools. Some requests need a workaround or separate service."
  },
  {
    "name": "Search & content",
    "heading": "More than an SEO checkbox.",
    "ours": "We plan pages around your services and area, with clear writing and search setup built in.",
    "wordpress": "SEO plugins provide settings. Someone still needs to plan and write useful pages.",
    "wix": "Built-in SEO tools help with setup. They do not write your offer or answer your customers’ questions."
  },
  {
    "name": "Ownership",
    "heading": "Keep control after launch.",
    "ours": "You own the code and domain. You can change developers or move to compatible hosting.",
    "wordpress": "Self-hosted WordPress can move hosts too. Themes, plugins, licenses, and updates still need managing.",
    "wix": "You own your content, but the site runs on Wix. Moving it to another host generally means rebuilding."
  }
] as const;

export function CustomBuildIntroduction() {
  return <section className="wd-section wd-comparison wd-build-intro rcd-light" id="why-custom" aria-labelledby="build-intro-heading">
    <div className="wd-container">
      <div className="wd-comparison-intro">
        <div data-entrance="rise"><p className="wd-eyebrow">Designed for your business</p><h2 id="build-intro-heading">Show what you do.<br />Make it easy to call.</h2><p className="wd-section-intro">We build a website that explains your services, shows your work, and helps customers get in touch.</p><ul className="wd-build-benefits"><li>Custom layouts you review before development</li><li>Service pages and SEO planned together</li><li>Your website’s code and domain belong to you</li></ul><a href="#custom-build" className="wd-text-link wd-link-dark">Compare custom, WordPress, and Wix <ArrowUpRight size={17} /></a></div>
        <figure className="wd-code-photo" data-entrance="image" data-entrance-delay="1"><Image src="/assets/bg-build-launch.webp" alt="Website code and page-layout sketches on a desk" width={2752} height={1536} sizes="(max-width: 760px) 90vw, 48vw" /><figcaption><span><Code2 size={17} /> Custom design + development</span><span>Your code. Your domain.</span></figcaption></figure>
      </div>
    </div>
  </section>;
}

export default function CustomBuildComparison() {
  return <section className="wd-section wd-comparison rcd-light" id="custom-build" aria-labelledby="comparison-heading">
    <div className="wd-container">
      <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Why choose a custom build?</p><h2 id="comparison-heading">Your business deserves<br />more than a template.</h2></div><p>A template gives you a starting point. We handle the design, writing, and build around your business.</p></div>
      <div className="wd-comparison-board">
        <div className="wd-comparison-columns" aria-hidden="true">
          <span>The details</span>
          <div className="wd-comparison-column-ours"><Code2 size={22} /><span>River City Digital<strong>Custom business website</strong></span></div>
          <div><Layers3 size={22} /><span>Theme-based approach<strong>WordPress template</strong></span></div>
          <div><PanelsTopLeft size={22} /><span>Hosted website builder<strong>Wix website</strong></span></div>
        </div>
        {TOPICS.map((topic, index) => (
          <article className="wd-comparison-row" key={topic.name} aria-labelledby={"comparison-topic-" + index}>
            <div className="wd-comparison-topic" data-entrance="unfold"><span>0{index + 1}</span><h3 id={"comparison-topic-" + index}>{topic.name}</h3><p>{topic.heading}</p></div>
            <div className="wd-comparison-cell wd-comparison-cell-ours"><h4>River City Digital · Custom website</h4><p data-entrance="slide">{topic.ours}</p></div>
            <div className="wd-comparison-cell"><h4>WordPress template</h4><p data-entrance="slide" data-entrance-delay="1">{topic.wordpress}</p></div>
            <div className="wd-comparison-cell"><h4>Wix website</h4><p data-entrance="slide" data-entrance-delay="2">{topic.wix}</p></div>
          </article>
        ))}
      </div>
      <div className="wd-comparison-note" data-entrance="rise"><p>With River City, you get a design made for you, clear steps before launch, and ownership after the build.</p><p>Comparing template-led builds with our custom service. WordPress and Wix also support custom work; results depend on the implementation. Every website needs upkeep, including ours. <a href="https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere" target="_blank" rel="noopener noreferrer">Wix hosting details</a> · <a href="https://wordpress.org/documentation/article/manage-plugins/" target="_blank" rel="noopener noreferrer">WordPress plugin management</a>.</p></div>
    </div>
  </section>;
}
