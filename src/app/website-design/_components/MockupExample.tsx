import Image from "next/image";
import { ArrowUpRight, FileText } from "lucide-react";

export default function MockupExample() {
  return <div className="wd-mockup-example" id="mockup-preview" tabIndex={-1} role="group" aria-labelledby="mockup-preview-heading">
    <div className="wd-mockup-example-copy" data-entrance="rise">
      <p className="wd-eyebrow">What your free mockup means</p>
      <h2 id="mockup-preview-heading">Your ideas. Your logo.<br />A first look.</h2>
      <p className="wd-mockup-example-intro">A PDF mockup gives you a visual idea of what your website could look like, before you decide on a build.</p>
      <ol className="wd-mockup-next-steps">
        <li><span aria-hidden="true">01</span><div><h3>Tell us what you imagine.</h3><p>Send your request. We’ll follow up to learn about your business, your ideas, and your logo.</p></div></li>
        <li><span aria-hidden="true">02</span><div><h3>See your PDF design preview.</h3><p>We use that direction to create a mockup with your logo, so you can picture a possible design for your website.</p></div></li>
        <li><span aria-hidden="true">03</span><div><h3>Decide on the next step.</h3><p>If you’d like to build, we agree on scope and price in a written proposal before development. The mockup carries no obligation.</p></div></li>
      </ol>
      <a className="wd-button wd-button-dark" href="#start">Request my free mockup <ArrowUpRight size={18} /></a>
    </div>
    <figure className="wd-mockup-document" data-entrance="image">
      <div className="wd-mockup-document-bar"><FileText size={18} /><span>PDF design preview</span><span>Illustration</span></div>
      <div className="wd-mockup-paper">
        <div className="wd-mockup-paper-heading"><span>Design direction</span><strong>The Wellness Collective</strong></div>
        <Image src="/assets/portfolio-wellness-collective.webp" alt="Portfolio-based illustration of a PDF design preview, using The Wellness Collective’s completed website" width={1440} height={798} sizes="(max-width: 760px) 88vw, 43vw" loading="lazy" />
        <div className="wd-mockup-paper-notes"><span>A look at the visual direction</span><span>Logo · Layout · Style</span></div>
      </div>
      <figcaption>Illustration based on The Wellness Collective’s completed website. This is an example of a design direction, not an actual PDF mockup sent to a client. Your preview is shaped around your business.</figcaption>
    </figure>
  </div>;
}
