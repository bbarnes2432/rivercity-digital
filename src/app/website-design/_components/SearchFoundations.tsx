import { ArrowDown, ArrowUpRight, Check, FileSearch, MapPin, Search, Waypoints } from "lucide-react";

const FOUNDATIONS = [
  { Icon: FileSearch, title: "Pages for the services people search for.", text: "We organize your services into useful pages with clear titles, headings, and answers to customer questions. Visitors can find the information they need before making an inquiry." },
  { Icon: MapPin, title: "A clear connection to the areas you serve.", text: "Your location, service area, and contact details belong in the plan. Relevant local content helps customers understand whether you serve them." },
  { Icon: Waypoints, title: "The technical work behind discovery.", text: "Crawlable links, metadata, a sitemap, and relevant structured data help search engines understand your pages. For a redesign, we also plan redirects from important old URLs." },
];

export default function SearchFoundations() {
  return <section className="wd-section wd-seo rcd-light" id="seo" aria-labelledby="seo-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Search engine optimization</p><h2 id="seo-heading">Built for the searches<br />that matter to you.</h2></div><p>Help potential customers find the services you offer. We plan useful service pages, local content, and technical SEO alongside the design.</p></div>
    <div className="wd-seo-grid">
      <figure className="wd-seo-visual" data-entrance="screen">
        <div className="wd-search-preview"><div className="wd-search-query"><Search size={18} /><span>Your service + your city</span></div><div className="wd-search-result"><span className="wd-search-domain">yourbusiness.com / your-service</span><strong>Your service. Your area. Your business.</strong><p>A useful description of what you offer, who it’s for, and how to get in touch.</p><div><span>Services</span><span>About the team</span><span>Contact</span></div></div></div>
        <div className="wd-search-path" aria-hidden="true"><ArrowDown size={24} /><div><span>Relevant search</span><ArrowUpRight size={16} /><span>Helpful page</span><ArrowUpRight size={16} /><span>Clear next step</span></div></div>
        <div className="wd-seo-page"><div><span className="wd-eyebrow">Your service page</span><strong>Answer the questions<br />before the first call.</strong></div><ul><li><Check size={15} />What you do and who you help</li><li><Check size={15} />Experience, examples, and useful details</li><li><Check size={15} />An easy way to request a quote</li></ul></div>
        <figcaption>Illustrative search result and page structure. Actual search appearances and rankings vary.</figcaption>
      </figure>
      <div className="wd-seo-benefits">{FOUNDATIONS.map(({ Icon, title, text }, index) => <article key={title} data-entrance="unfold" data-entrance-delay={index % 2}><Icon size={24} /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </div>
    <div className="wd-seo-scope" data-entrance="rise"><div><span className="wd-eyebrow">Included in the website build</span><p>Page structure, on-page SEO, technical setup, and a plan for existing URLs.</p></div><div><span className="wd-eyebrow">Available as ongoing SEO</span><p>Content development, Google Business Profile work, local visibility, and performance reviews. Scoped separately; rankings aren’t guaranteed.</p></div><a href="#start" className="wd-text-link wd-link-dark">Discuss my website and SEO <ArrowUpRight size={17} /></a></div>
  </div></section>;
}
