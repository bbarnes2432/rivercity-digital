import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Code2, FileText, Globe, KeyRound, LayoutTemplate, ShieldCheck, ShoppingBag, Smartphone, Workflow } from "lucide-react";
import BookCallLink from "@/app/_components/BookCallLink";

const PROJECT_TYPES = [
  { Icon: Globe, title: "Business websites", text: "Service pages, reviews, project galleries, calls, and quote requests." },
  { Icon: LayoutTemplate, title: "Campaign landing pages", text: "An offer, focused content, and tracking matched to the ad people clicked." },
  { Icon: ShoppingBag, title: "Online stores", text: "Product collections, cart and checkout, and layouts for mobile shoppers." },
  { Icon: Smartphone, title: "Website redesigns", text: "Better navigation, updated content, mobile layouts, and redirect planning." },
  { Icon: Code2, title: "Custom backends & CRMs", text: "Customer records, sales stages, orders, products, and integrations." },
  { Icon: Workflow, title: "Business platforms", text: "A connected public website, customer portal, and internal workspace." },
];

export function BuildCapabilities() {
  return <section className="wd-section wd-deliverables rcd-light" id="included" aria-labelledby="included-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">What you get / Design through launch</p><h2 id="included-heading">The design is custom.<br />The rest of the build is, too.</h2></div><p>We plan the content, design the pages, write the code, and prepare the site for everyday use.</p></div>
    <div className="wd-deliverable-grid">
      <article className="wd-design-deliverable"><div className="wd-design-photo" data-entrance="image"><Image src="/assets/card-website-design.webp" alt="Desktop displays showing two different page layout compositions" width={1280} height={720} sizes="(max-width: 760px) 90vw, 48vw" /><span>01 / CONTENT & DESIGN</span></div><div className="wd-deliverable-copy" data-entrance="rise"><h3>Pages built around what your customers need to know.</h3><p>Your services, experience, reviews, and project examples determine the layout. We plan desktop and mobile together, then show you the design before development.</p><ul><li><Check size={15}/> Content and navigation planning</li><li><Check size={15}/> Brand-specific layouts and imagery</li><li><Check size={15}/> Design review and agreed revisions</li></ul></div></article>
      <div className="wd-technical-deliverables">
        <article className="wd-search-deliverable" data-entrance="card" data-entrance-delay="1"><div className="wd-deliverable-heading"><KeyRound size={23}/><span className="wd-eyebrow">02 / Ownership & access</span></div><div className="wd-page-map" aria-hidden="true"><span><Globe size={14}/> Your business</span><ArrowDown size={18}/><div><span>Your code</span><span>Your domain</span><span>Your access</span></div></div><h3>You keep control after launch.</h3><p>You own the website’s code and domain, with the freedom to move to compatible hosting or work with another developer. We explain the accounts, access, and support arrangements in your handover.</p><span className="wd-deliverable-footnote">Hosting, maintenance, and third-party services are set out in the proposal.</span></article>
        <article className="wd-launch-deliverable" data-entrance="unfold"><div className="wd-deliverable-heading"><ShieldCheck size={23}/><span className="wd-eyebrow">03 / Launch checks & handover</span></div><h3>Check the details customers rely on.</h3><div className="wd-check-matrix">{["Mobile layouts", "Forms & phone links", "Keyboard & contrast", "Image performance", "Analytics setup", "Redirects & domain"].map(item=><span key={item}><Check size={14}/>{item}</span>)}</div><p>You receive site access and a handover. We explain hosting, updates, and support so you know what happens after launch.</p></article>
      </div>
    </div>
    <div className="wd-project-types"><div data-entrance="rise"><p className="wd-eyebrow">The projects we take on</p><h3>One landing page or a complete business platform.</h3></div><div className="wd-project-type-grid">{PROJECT_TYPES.map(({Icon,title,text},index)=><article key={title} data-entrance="card" data-entrance-delay={index % 3}><Icon size={22}/><h4>{title}</h4><p>{text}</p></article>)}</div></div>
  </div></section>;
}

const PROCESS = [
  { n: "01", title: "Scope & page planning", image: "/assets/process-discovery.webp", alt: "A project discussion with notes and a laptop", description: "We review your business, current website, customers, and priorities. Then we map the pages, content, and features the project needs.", points: ["Current-site and content review", "Page structure and customer journeys", "Written scope, price, and schedule"], deliverable: "A project plan you can review." },
  { n: "02", title: "Design & approval", image: "/assets/process-strategy.webp", alt: "A notebook and visual planning materials on a desk", description: "We develop the layouts, typography, colors, and imagery around your brand. You review the desktop and mobile designs and give feedback before the build.", points: ["Page layouts before visual design", "Desktop and mobile designs", "Revisions agreed in your proposal"], deliverable: "Approved designs before development." },
  { n: "03", title: "Development & launch", image: "/assets/process-build-launch.webp", alt: "A laptop displaying a composed website layout", description: "We build the approved site, connect its features, and test the key journeys. After your final review, we connect the domain and walk you through access.", points: ["A working preview on your own devices", "Forms, performance, and search checks", "Domain, redirects, analytics, and handover"], deliverable: "Your live website and site access." },
];

export function BuildProcess() {
  return <section className="wd-section wd-photo-process" id="process" aria-labelledby="process-heading"><div className="wd-container">
    <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">How the project works</p><h2 id="process-heading">You see and approve<br />the work as it develops.</h2></div><BookCallLink context="website-design-process" className="wd-text-link">Book a 30-minute project call <ArrowUpRight size={17}/></BookCallLink></div>
    <div className="wd-process-cards">{PROCESS.map((step,index)=><article key={step.n}><div className="wd-process-photo" data-entrance="image" data-entrance-delay={index}><Image src={step.image} alt={step.alt} width={1024} height={1024} sizes="(max-width: 760px) 90vw, 31vw"/><span>{step.n}</span></div><div className="wd-process-card-copy" data-entrance="unfold" data-entrance-delay={index}><h3>{step.title}</h3><p>{step.description}</p><ul>{step.points.map(point=><li key={point}><Check size={14}/>{point}</li>)}</ul><div className="wd-process-deliverable"><FileText size={16}/><span>{step.deliverable}</span></div></div></article>)}</div>
    <div className="wd-process-scope" data-entrance="unfold"><span className="wd-eyebrow">Before you commit</span><p>Your proposal sets out the pages, features, revisions, timeline, and price. Hosting, third-party services, and ongoing support are explained separately.</p><a href="#start">Discuss the scope <ArrowUpRight size={17}/></a></div>
  </div></section>;
}
