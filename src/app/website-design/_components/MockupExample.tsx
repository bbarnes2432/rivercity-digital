import Image from "next/image";
import { FileText } from "lucide-react";

export default function MockupExample() {
  return <div className="wd-mockup-example" id="mockup-preview" tabIndex={-1} role="group" aria-labelledby="mockup-preview-heading">
    <div className="wd-mockup-example-copy" data-entrance="rise">
      <p className="wd-eyebrow">Your free mockup</p>
      <h2 id="mockup-preview-heading">See your ideas<br />take shape.</h2>
      <p className="wd-mockup-example-intro">See what your website could look like before you decide to build.</p>
      <ol className="wd-mockup-next-steps">
        <li><span aria-hidden="true">01</span><div><h3>Tell us about your business.</h3><p>We’ll get in touch to learn what you do and the style you have in mind.</p></div></li>
        <li><span aria-hidden="true">02</span><div><h3>See your free mockup.</h3><p>See a design based on your ideas and logo.</p></div></li>
        <li><span aria-hidden="true">03</span><div><h3>Decide on the next step.</h3><p>Like the direction? We agree on a price and plan before building. There’s no obligation.</p></div></li>
      </ol>
    </div>
    <figure className="wd-mockup-document" data-entrance="image">
      <div className="wd-mockup-document-bar"><FileText size={18} /><span>Website design preview</span><span>Illustration</span></div>
      <div className="wd-mockup-paper">
        <div className="wd-mockup-paper-heading"><span>Design direction</span><strong>The Wellness Collective</strong></div>
        <Image src="/assets/portfolio-wellness-collective.webp" alt="Design illustration based on The Wellness Collective’s completed website" width={1440} height={798} sizes="(max-width: 760px) 88vw, 43vw" loading="lazy" />
        <div className="wd-mockup-paper-notes"><span>A look at the visual direction</span><span>Logo · Layout · Style</span></div>
      </div>
      <figcaption>Design illustration based on our Wellness Collective project. Your mockup will be made for your business.</figcaption>
    </figure>
  </div>;
}
