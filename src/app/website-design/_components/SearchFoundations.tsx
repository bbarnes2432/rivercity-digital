import { ArrowDown, ArrowUpRight, Check, FileSearch, MapPin, MessageSquareText, Search } from "lucide-react";

const FOUNDATIONS = [
  { Icon: MapPin, title: "Help customers find you.", text: "Pages built around your services and the areas you serve." },
  { Icon: FileSearch, title: "Give them a reason to choose you.", text: "Clear explanations, real examples, and customer reviews." },
  { Icon: MessageSquareText, title: "Make contacting you easy.", text: "Simple forms and phone options that work on every device." },
];

export default function SearchFoundations() {
  return <section className="wd-section wd-seo rcd-light" id="seo" aria-labelledby="seo-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">SEO & AI search optimization</p><h2 id="seo-heading">A great-looking website.<br />Built to attract customers.</h2></div><p>We combine custom design, SEO, and clear writing to help people discover your business on Google and in tools like ChatGPT. Once they arrive, your website shows why they should choose you—and makes it easy to call or request a quote.</p></div>
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
