import Image from "next/image";
import { ArrowUpRight, Code2, Layers3 } from "lucide-react";

// Custom vs. template rows and footnote from Brandon's Nov 8, 2026 copy
// (page 9). Compared against template site builders in general: no brand
// names and no links to other platforms.
const TOPICS = [
  { name: "Design", ours: "Built around your business.", template: "The same layouts thousands of sites use." },
  { name: "Speed", ours: "Lean code, built to load fast.", template: "Extra plugins and code you don’t need." },
  { name: "Features", ours: "Built for how you work, like booking, ordering, or a 3D viewer.", template: "Limited to what the theme or app store offers." },
  { name: "Search", ours: "Set up for search from day one.", template: "Often added later, if at all." },
  { name: "Ownership", ours: "You own the code and can move it anywhere.", template: "Tied to the platform." },
] as const;

export function CustomBuildIntroduction() {
  return <section className="wd-section wd-comparison wd-build-intro rcd-light" id="why-custom" aria-labelledby="build-intro-heading">
    <div className="wd-container">
      <div className="wd-comparison-intro">
        <div data-entrance="rise"><p className="wd-eyebrow">Designed for your business</p><h2 id="build-intro-heading">Show what you do.<br />Make it easy to call.</h2><p className="wd-section-intro">We build a website that explains your services, shows your work, and helps customers get in touch.</p><ul className="wd-build-benefits"><li>Custom layouts you review before development</li><li>Service pages and SEO planned together</li><li>Your website’s code and domain belong to you</li></ul><a href="#custom-build" className="wd-text-link wd-link-dark">Compare custom and template sites <ArrowUpRight size={17} /></a></div>
        <figure className="wd-code-photo" data-entrance="image" data-entrance-delay="1"><Image src="/assets/bg-build-launch.webp" alt="Website code and page-layout sketches on a desk" width={2752} height={1536} sizes="(max-width: 760px) 90vw, 48vw" /><figcaption><span><Code2 size={17} /> Custom design + development</span><span>Your code. Your domain.</span></figcaption></figure>
      </div>
    </div>
  </section>;
}

export default function CustomBuildComparison() {
  return <section className="wd-section wd-comparison rcd-light" id="custom-build" aria-labelledby="comparison-heading">
    <div className="wd-container">
      <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Why choose a custom build?</p><h2 id="comparison-heading">Your business deserves<br />more than a template.</h2></div><p>A template gives you a starting point. We handle the design, writing, and build around your business.</p></div>
      <div className="wd-comparison-board wd-comparison-two">
        <div className="wd-comparison-columns" aria-hidden="true">
          <span>The details</span>
          <div className="wd-comparison-column-ours"><Code2 size={22} /><span>River City Digital<strong>Custom business website</strong></span></div>
          <div><Layers3 size={22} /><span>Ready-made themes<strong>Template site builders</strong></span></div>
        </div>
        {TOPICS.map((topic, index) => (
          <article className="wd-comparison-row" key={topic.name} aria-labelledby={"comparison-topic-" + index}>
            <div className="wd-comparison-topic" data-entrance="unfold"><span>0{index + 1}</span><h3 id={"comparison-topic-" + index}>{topic.name}</h3></div>
            <div className="wd-comparison-cell wd-comparison-cell-ours"><h4>Custom</h4><p data-entrance="slide">{topic.ours}</p></div>
            <div className="wd-comparison-cell"><h4>Template</h4><p data-entrance="slide" data-entrance-delay="1">{topic.template}</p></div>
          </article>
        ))}
      </div>
      <div className="wd-comparison-note" data-entrance="rise"><p>Template site builders can work well for some businesses, and every site needs upkeep. We’ll tell you honestly what fits yours.</p></div>
    </div>
  </section>;
}
