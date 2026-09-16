import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import CallLink from "../../_components/CallLink";
import BookCallLink from "../../_components/BookCallLink";

const TOPICS = [
  ["Your business and customers", "What you offer, who you serve, and what you want the website to do."],
  ["Your website needs", "A new site or a redesign, the pages you need, and the features that matter."],
  ["Scope and next steps", "What the project could involve and what we need to prepare a written proposal."],
];

export default function ProjectConversation() {
  return <section className="wd-section wd-project-conversation rcd-light" id="studio" aria-labelledby="studio-heading">
    <div className="wd-container wd-conversation-grid">
      <div className="wd-conversation-copy" data-entrance="rise">
        <p className="wd-eyebrow">Your local team · St. Louis, Missouri</p>
        <h2 id="studio-heading">Let’s talk about<br />your website.</h2>
        <p className="wd-conversation-intro">You don’t need a finished brief to start. Tell us where you are now and what you want to improve. We’ll talk through it together.</p>
        <ol className="wd-call-topics">{TOPICS.map(([title, description], index) => <li key={title}>
          <span className="wd-call-topic-number" aria-hidden="true">0{index + 1}</span>
          <div><h3>{title}</h3><p>{description}</p></div>
        </li>)}</ol>
        <div className="wd-conversation-actions">
          <CallLink context="website-design-after-portfolio" className="wd-button wd-button-dark">Call our St. Louis team <ArrowUpRight size={18} /></CallLink>
          <CallLink context="website-design-after-portfolio-number" className="wd-conversation-number" icon={false} />
        </div>
        <BookCallLink context="website-design-after-portfolio" className="wd-text-link wd-link-dark wd-conversation-booking">Choose a time for a 30-minute call <ArrowUpRight size={16} /></BookCallLink>
        <div className="wd-conversation-mockup">
          <a href="#start" className="wd-text-link wd-link-dark">Prefer a free mockup? Start here <ArrowUpRight size={16} /></a>
          <p>We’ll first discuss your business, then a possible design direction. Your mockup is a design preview, with no obligation to build.</p>
        </div>
      </div>
      <figure className="wd-local-photo wd-conversation-photo" data-entrance="image">
        <Image src="/assets/bg-st-louis-street.webp" alt="A downtown street scene with the Gateway Arch in the distance" width={1280} height={720} sizes="(max-width: 760px) 90vw, 44vw" />
        <figcaption><span>Based right here in St. Louis.</span><p>Design, development, and a clear plan for your website.</p></figcaption>
      </figure>
    </div>
  </section>;
}
