import { ArrowDown, ArrowUpRight, Check, FileSearch, MapPin, MessageSquareText, Search, Waypoints } from "lucide-react";

const FOUNDATIONS = [
  { Icon: FileSearch, title: "Explain your services.", text: "Clear pages answer what you do, who you help, and how to get in touch." },
  { Icon: MapPin, title: "Show where you work.", text: "Your service area and contact details help local customers know you serve them." },
  { Icon: Waypoints, title: "Help Google read your site.", text: "We set up page titles, links, and a sitemap. For redesigns, we plan redirects so old links still lead somewhere useful." },
  { Icon: MessageSquareText, title: "Make your business clear to AI search.", text: "Useful answers and accurate business details help search tools understand what you offer. Showing up in AI answers is not guaranteed." },
];

export default function SearchFoundations() {
  return <section className="wd-section wd-seo rcd-light" id="seo" aria-labelledby="seo-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">SEO & AI search optimization</p><h2 id="seo-heading">Help local customers<br />find your business.</h2></div><p>A good website should be easy to find and easy to understand. We plan your service pages and search setup with the design.</p></div>
    <div className="wd-seo-grid">
      <figure className="wd-seo-visual" data-entrance="screen">
        <div className="wd-search-preview"><div className="wd-search-query"><Search size={18} /><span>Your service + your city</span></div><div className="wd-search-result"><span className="wd-search-domain">yourbusiness.com / your-service</span><strong>Your service. Your area. Your business.</strong><p>A useful description of what you offer, who it’s for, and how to get in touch.</p><div><span>Services</span><span>About the team</span><span>Contact</span></div></div></div>
        <div className="wd-search-path" aria-hidden="true"><ArrowDown size={24} /><div><span>Relevant search</span><ArrowUpRight size={16} /><span>Helpful page</span><ArrowUpRight size={16} /><span>Clear next step</span></div></div>
        <div className="wd-seo-page"><div><span className="wd-eyebrow">Your service page</span><strong>Answer the questions<br />before the first call.</strong></div><ul><li><Check size={15} />What you do and who you help</li><li><Check size={15} />Experience, examples, and useful details</li><li><Check size={15} />An easy way to request a quote</li></ul></div>
        <figcaption>Illustrative search result and page structure. Actual search appearances and rankings vary.</figcaption>
      </figure>
      <div className="wd-seo-benefits">{FOUNDATIONS.map(({ Icon, title, text }, index) => <article key={title} data-entrance="unfold" data-entrance-delay={index % 2}><Icon size={24} /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
    </div>
    <div className="wd-seo-scope" data-entrance="rise"><div><span className="wd-eyebrow">Included in the website build</span><p>Clear page titles, service information, search setup, and a plan for your existing links.</p></div><div><span className="wd-eyebrow">Ongoing SEO & AI search</span><p>New content and ongoing search work are priced separately. Rankings and AI mentions are not guaranteed.</p></div></div>
  </div></section>;
}
