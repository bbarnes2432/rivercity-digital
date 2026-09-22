import Image from "next/image";
import { ArrowDown, Check, FileText, Globe, KeyRound, Mail, Phone, Search } from "lucide-react";

export type BenefitKind = "design" | "mobile" | "writing" | "search" | "contact" | "ownership";

// Decorative illustrations explain the adjacent copy; they are not live interfaces or results.
export default function BenefitIllustration({ kind }: { kind: BenefitKind }) {
  return <div className={`wd-benefit-art wd-benefit-art-${kind}`} aria-hidden="true">
    {kind === "design" && <>
      <div className="wd-benefit-browser"><div className="wd-benefit-browser-bar"><i /><i /><i /><span>Made for your business</span></div><Image src="/assets/portfolio-wellness-collective.webp" alt="" width={1440} height={798} sizes="(max-width: 600px) 85vw, (max-width: 1000px) 42vw, 350px" /></div>
      <div className="wd-benefit-palette"><span /><span /><span /><b>Your style.</b></div>
    </>}
    {kind === "mobile" && <>
      <div className="wd-benefit-desktop"><div className="wd-benefit-browser-bar"><i /><i /><i /></div><Image src="/assets/portfolio-mend-health.webp" alt="" width={1440} height={798} sizes="(max-width: 600px) 65vw, 280px" /></div>
      <div className="wd-benefit-phone"><Image src="/assets/benefits/mend-mobile.png" alt="" width={375} height={812} sizes="110px" /></div>
    </>}
    {kind === "writing" && <div className="wd-benefit-document">
      <div className="wd-benefit-document-top"><FileText size={20} /><span>Your page copy</span></div>
      <strong>What you do.</strong><strong>Why it matters.</strong>
      <span className="wd-benefit-line" /><span className="wd-benefit-line short" />
      <div className="wd-benefit-copy-tag"><Check size={13} /> Clear. Helpful. Yours.</div>
    </div>}
    {kind === "search" && <div className="wd-benefit-search-window">
      <div className="wd-benefit-search-box"><Search size={15} /><span>Your service + your city</span></div>
      <div className="wd-benefit-search-result"><span>yourbusiness.com / services</span><strong>Your services. Your area.</strong><i /><i /><div><b>Clear titles</b><b>Useful pages</b></div></div>
      <span className="wd-benefit-art-note">Illustrative search listing</span>
    </div>}
    {kind === "contact" && <div className="wd-benefit-contact-window">
      <div className="wd-benefit-browser-bar"><i /><i /><i /><span>Your contact page</span></div>
      <strong>Let’s talk about your project.</strong>
      <div className="wd-benefit-contact-options"><div className="wd-benefit-call-example"><Phone size={18} /><span>Call us</span></div><span>or</span><div className="wd-benefit-form-example"><Mail size={16} /><i /><i /><b>Send an inquiry</b></div></div>
    </div>}
    {kind === "ownership" && <div className="wd-benefit-ownership">
      <div className="wd-benefit-key"><KeyRound size={32} /></div><strong>Your website. Your keys.</strong><ArrowDown size={17} />
      <div className="wd-benefit-own-items"><span><Globe size={14} />Domain</span><span><FileText size={14} />Code</span><span><Check size={14} />Access</span></div>
    </div>}
  </div>;
}
