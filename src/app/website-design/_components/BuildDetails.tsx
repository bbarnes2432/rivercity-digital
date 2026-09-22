import Image from "next/image";
import { ArrowDown, Check, FileText, Globe, KeyRound, LayoutTemplate, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";

const PROJECT_TYPES = [
  { Icon: Globe, title: "Business websites", text: "Service pages, reviews, project galleries, calls, and quote requests." },
  { Icon: LayoutTemplate, title: "Campaign landing pages", text: "An offer, focused content, and tracking matched to the ad people clicked." },
  { Icon: ShoppingBag, title: "Online stores", text: "Product collections, cart and checkout, and layouts for mobile shoppers." },
  { Icon: Smartphone, title: "Website redesigns", text: "Better navigation, updated content, mobile layouts, and redirect planning." },
];

export function BuildCapabilities() {
  return <section className="wd-section wd-deliverables rcd-light" id="included" aria-labelledby="included-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">What you get / Design through launch</p><h2 id="included-heading">Your website,<br />from design to launch.</h2></div><p>We handle the writing, design, code, and launch checks.</p></div>
    <div className="wd-deliverable-grid">
      <article className="wd-design-deliverable"><div className="wd-design-photo" data-entrance="image"><Image src="/assets/card-website-design.webp" alt="Desktop displays showing two different page layout compositions" width={1280} height={720} sizes="(max-width: 760px) 90vw, 48vw" /><span>01 / CONTENT & DESIGN</span></div><div className="wd-deliverable-copy" data-entrance="rise"><h3>Clear pages. Your style.</h3><p>Show your services, reviews, and work in a design made for you. You review it before we build, on phones and computers.</p><ul><li><Check size={15}/> Content and navigation planning</li><li><Check size={15}/> Brand-specific layouts and imagery</li><li><Check size={15}/> Design review and agreed revisions</li></ul></div></article>
      <div className="wd-technical-deliverables">
        <article className="wd-search-deliverable" data-entrance="card" data-entrance-delay="1"><div className="wd-deliverable-heading"><KeyRound size={23}/><span className="wd-eyebrow">02 / Ownership & access</span></div><div className="wd-page-map" aria-hidden="true"><span><Globe size={14}/> Your business</span><ArrowDown size={18}/><div><span>Your code</span><span>Your domain</span><span>Your access</span></div></div><h3>You keep control after launch.</h3><p>The code and domain are yours. You can change developers or move to compatible hosting. We hand over your access after launch.</p><span className="wd-deliverable-footnote">Hosting, maintenance, and third-party services are set out in the proposal.</span></article>
        <article className="wd-launch-deliverable" data-entrance="unfold"><div className="wd-deliverable-heading"><ShieldCheck size={23}/><span className="wd-eyebrow">03 / Launch checks & handover</span></div><h3>Check the details customers rely on.</h3><div className="wd-check-matrix">{["Mobile layouts", "Forms & phone links", "Keyboard & contrast", "Image performance", "Analytics setup", "Redirects & domain"].map(item=><span key={item}><Check size={14}/>{item}</span>)}</div><p>You receive site access and a handover. We explain hosting, updates, and support so you know what happens after launch.</p></article>
      </div>
    </div>
    <div className="wd-project-types" id="custom-systems"><div data-entrance="rise"><p className="wd-eyebrow">The projects we take on</p><h3>A new website or a fresh start.</h3></div><div className="wd-project-type-grid">{PROJECT_TYPES.map(({Icon,title,text},index)=><article key={title} data-entrance="card" data-entrance-delay={index % 3}><Icon size={22}/><h4>{title}</h4><p>{text}</p></article>)}</div></div>
  </div></section>;
}

const PROCESS = [
  { n: "01", title: "Plan your website", image: "/assets/process-discovery.webp", alt: "A project discussion with notes and a laptop", description: "We learn about your business and agree on the pages, features, price, and schedule.", points: ["Current-site and content review", "Page structure and customer journeys", "Written scope, price, and schedule"], deliverable: "A project plan you can review." },
  { n: "02", title: "Review your design", image: "/assets/process-strategy.webp", alt: "A notebook and visual planning materials on a desk", description: "See your page designs on phones and computers. Give feedback before we start building.", points: ["Page layouts before visual design", "Desktop and mobile designs", "Revisions agreed in your proposal"], deliverable: "Approved designs before development." },
  { n: "03", title: "Build and launch", image: "/assets/process-build-launch.webp", alt: "A laptop displaying a composed website layout", description: "We build the site, test the forms and links, and get your approval to launch. Then we hand over your access.", points: ["A working preview on your own devices", "Forms, performance, and search checks", "Domain, redirects, analytics, and handover"], deliverable: "Your live website and site access." },
];

export function BuildProcess() {
  return <section className="wd-section wd-photo-process" id="process" aria-labelledby="process-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">How the project works</p><h2 id="process-heading">Know what happens<br />at every step.</h2></div><p>We agree on the plan and price before building your website.</p></div>
    <div className="wd-process-cards">{PROCESS.map((step,index)=><article key={step.n}><div className="wd-process-photo" data-entrance="image" data-entrance-delay={index}><Image src={step.image} alt={step.alt} width={1024} height={1024} sizes="(max-width: 760px) 90vw, 31vw"/><span>{step.n}</span></div><div className="wd-process-card-copy" data-entrance="unfold" data-entrance-delay={index}><h3>{step.title}</h3><p>{step.description}</p><ul>{step.points.map(point=><li key={point}><Check size={14}/>{point}</li>)}</ul><div className="wd-process-deliverable"><FileText size={16}/><span>{step.deliverable}</span></div></div></article>)}</div>
    <div className="wd-process-scope" data-entrance="unfold"><span className="wd-eyebrow">Before you commit</span><p>Your proposal sets out the pages, features, revisions, timeline, and price. Hosting, third-party services, and ongoing support are explained separately.</p></div>
  </div></section>;
}
