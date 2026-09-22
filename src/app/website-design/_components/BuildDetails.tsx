import Image from "next/image";
import { Check, FileText, Globe, LayoutTemplate, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import BenefitIllustration, { type BenefitKind } from "./BenefitIllustration";
import "../website-benefits.css";

const PROJECT_TYPES = [
  { Icon: Globe, title: "Business websites", text: "Service pages, reviews, project galleries, calls, and quote requests." },
  { Icon: LayoutTemplate, title: "Campaign landing pages", text: "An offer, focused content, and tracking matched to the ad people clicked." },
  { Icon: ShoppingBag, title: "Online stores", text: "Product collections, cart and checkout, and layouts for mobile shoppers." },
  { Icon: Smartphone, title: "Website redesigns", text: "Better navigation, updated content, mobile layouts, and redirect planning." },
];

const BENEFITS: { kind: BenefitKind; title: string; text: string }[] = [
  { kind: "design", title: "A design made for you", text: "A design built around your business, services, and style." },
  { kind: "mobile", title: "Looks right on phones", text: "Easy-to-read pages and contact buttons on phones and computers." },
  { kind: "writing", title: "Clear page writing", text: "We help explain what you do and why customers should choose you." },
  { kind: "search", title: "Search setup included", text: "Page titles and service information planned for your business and area." },
  { kind: "contact", title: "Easy ways to contact you", text: "Make it easy for customers to call or send an inquiry." },
  { kind: "ownership", title: "A website you own", text: "Your code and domain belong to you, with access handed over after launch." },
];

export function BuildCapabilities() {
  return <section className="wd-section wd-deliverables rcd-light" id="included" aria-labelledby="included-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">What you get / Design through launch</p><h2 id="included-heading">Your website,<br />from design to launch.</h2></div><p>We handle the writing, design, code, and launch checks.</p></div>
    <div className="wd-benefit-grid">
      {BENEFITS.map(({ kind, title, text }, index) => <article className="wd-benefit-card" key={kind} data-entrance="card" data-entrance-delay={index % 3}>
        <BenefitIllustration kind={kind} />
        <div className="wd-benefit-copy"><h3>{title}</h3><p>{text}</p></div>
      </article>)}
    </div>
    <div className="wd-benefit-launch" data-entrance="unfold">
      <h3><ShieldCheck size={22} />Checked before launch</h3>
      <ul>{["Mobile layouts", "Forms & phone links", "Keyboard & contrast", "Image performance", "Analytics setup", "Redirects & domain"].map(item => <li key={item}><Check size={14} />{item}</li>)}</ul>
    </div>
    <p className="wd-benefit-scope">You review the design before we build, with revisions agreed in your proposal. We hand over your site access and explain hosting, updates, and support. Hosting, maintenance, and third-party services are set out separately in your proposal.</p>
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
