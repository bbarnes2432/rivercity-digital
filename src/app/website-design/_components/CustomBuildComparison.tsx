import Image from "next/image";
import { ArrowUpRight, Code2, Layers3, PanelsTopLeft } from "lucide-react";

const TOPICS = [
  { name: "Design", heading: "Start with your business, not a preset layout.", ours: "We design the page structure, layouts, and interactions around your services, content, and customers. You review the design before we build.", wordpress: "A purchased theme gives you a starting layout. Changes beyond its settings may need a child theme or custom development.", wix: "Templates and visual editing make setup accessible. Specific layouts and interactions depend on the editor and developer tools you use." },
  { name: "Performance", heading: "Control what your customers have to load.", ours: "We choose the code, image sizes, rendering, and hosting for your site, then check how it performs. Unused theme features don’t need to come along.", wordpress: "Performance depends on the theme, hosting, plugins, and how the site is built. A lean setup can work well; a heavy one needs optimization.", wix: "Wix manages the hosting and platform. You can optimize your content and settings, while infrastructure decisions stay with Wix." },
  { name: "Custom features", heading: "Build the workflow your business actually uses.", ours: "We can develop customer portals, CRMs, order tools, and integrations in the same project. The data and workflow are designed around your operation.", wordpress: "Plugins cover many needs. More specific workflows can require custom plugins, integrations, and compatibility testing.", wix: "Built-in apps and developer tools cover many use cases. Custom functions still operate within the Wix platform and its supported services." },
  { name: "Search & content", heading: "Make the structure as considered as the design.", ours: "We plan service pages, headings, internal links, metadata, and relevant structured data as part of the build. Search setup has a place in the project from the start.", wordpress: "Themes and SEO plugins provide search controls. Results depend on configuration, content, and the quality of the implementation.", wix: "Wix includes SEO tools and settings. Content and configuration still matter, and deeper changes depend on platform support." },
  { name: "Ownership", heading: "Keep control of the website you paid to build.", ours: "You own your website’s code and domain. You can use compatible hosting and work with another developer. Hosting and maintenance are scoped separately.", wordpress: "A self-hosted WordPress site can move between compatible hosts. Themes, plugins, licenses, and updates remain part of its upkeep.", wix: "Your Wix site relies on Wix hosting and services. Moving to another hosting platform generally means rebuilding the site; your domain can be moved separately." },
] as const;

export default function CustomBuildComparison() {
  return <section className="wd-section wd-comparison rcd-light" id="custom-build" aria-labelledby="comparison-heading">
    <div className="wd-container">
      <div className="wd-comparison-intro">
        <div><p className="wd-eyebrow">Custom development / The difference</p><h2 id="comparison-heading">What are you getting<br />beyond a template?</h2><p className="wd-section-intro">A different logo and color palette aren’t the same as a custom website. We design the pages and write the code, so we can change how the site works as well as how it looks.</p><a href="#custom-systems" className="wd-text-link wd-link-dark">See the features we can build <ArrowUpRight size={17} /></a></div>
        <figure className="wd-code-photo"><Image src="/assets/bg-build-launch.webp" alt="Website code and page-layout sketches on a desk" width={2752} height={1536} sizes="(max-width: 760px) 90vw, 48vw" /><figcaption><span><Code2 size={17} /> Custom design + development</span><span>Your code. Your domain.</span></figcaption></figure>
      </div>
      <div className="wd-comparison-board">
        <div className="wd-comparison-columns" aria-hidden="true">
          <span>The details</span>
          <div className="wd-comparison-column-ours"><Code2 size={22} /><span>River City Digital<strong>Custom Next.js website</strong></span></div>
          <div><Layers3 size={22} /><span>Theme-based approach<strong>WordPress template</strong></span></div>
          <div><PanelsTopLeft size={22} /><span>Hosted website builder<strong>Wix website</strong></span></div>
        </div>
        {TOPICS.map((topic, index) => (
          <article className="wd-comparison-row" key={topic.name} aria-labelledby={"comparison-topic-" + index}>
            <div className="wd-comparison-topic"><span>0{index + 1}</span><h3 id={"comparison-topic-" + index}>{topic.name}</h3><p>{topic.heading}</p></div>
            <div className="wd-comparison-cell wd-comparison-cell-ours"><h4>River City Digital · Custom website</h4><p>{topic.ours}</p></div>
            <div className="wd-comparison-cell"><h4>WordPress template</h4><p>{topic.wordpress}</p></div>
            <div className="wd-comparison-cell"><h4>Wix website</h4><p>{topic.wix}</p></div>
          </article>
        ))}
      </div>
      <div className="wd-comparison-note"><p>WordPress and Wix can produce good websites. Our advantage is the scope of what we can design and develop for you, with the code under your control.</p><p>Comparing common template-based implementations; custom work is also possible on other platforms. <a href="https://support.wix.com/en/article/exporting-or-embedding-your-wix-site-elsewhere" target="_blank" rel="noopener noreferrer">Wix hosting and export details</a> · <a href="https://developer.wordpress.org/themes/getting-started/what-is-a-theme/" target="_blank" rel="noopener noreferrer">WordPress themes</a>.</p></div>
    </div>
  </section>;
}
