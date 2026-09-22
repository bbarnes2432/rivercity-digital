import Image from "next/image";

const TOPICS = [
  ["Your business and customers", "What you offer, who you serve, and what you want the website to do."],
  ["Your website needs", "A new site or a redesign, the pages you need, and the features that matter."],
  ["Scope and next steps", "The pages, price, and next steps, agreed before we build."],
];

export default function ProjectConversation() {
  return <section className="wd-section wd-project-conversation rcd-light" id="studio" aria-labelledby="studio-heading">
    <div className="wd-container wd-conversation-grid">
      <div className="wd-conversation-copy" data-entrance="rise">
        <p className="wd-eyebrow">Your local team · St. Louis, Missouri</p>
        <h2 id="studio-heading">A local team.<br />A simple process.</h2>
        <p className="wd-conversation-intro">We’re a family-owned business in St. Louis. You don’t need to know website jargon. Tell us what you do and we’ll help with the rest.</p>
        <ol className="wd-call-topics">{TOPICS.map(([title, description], index) => <li key={title}>
          <span className="wd-call-topic-number" aria-hidden="true">0{index + 1}</span>
          <div><h3>{title}</h3><p>{description}</p></div>
        </li>)}</ol>

      </div>
      <figure className="wd-local-photo wd-conversation-photo" data-entrance="image">
        <Image src="/assets/bg-st-louis-street.webp" alt="A downtown street scene with the Gateway Arch in the distance" width={1280} height={720} sizes="(max-width: 760px) 90vw, 44vw" />
        <figcaption><span>Based right here in St. Louis.</span><p>Design, development, and a clear plan for your website.</p></figcaption>
      </figure>
    </div>
  </section>;
}
