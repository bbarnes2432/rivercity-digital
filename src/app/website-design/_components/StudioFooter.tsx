import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CallLink from "@/app/_components/CallLink";
import { EMAIL } from "@/app/_components/contact-info";

export default function StudioFooter() {
  return <footer className="wd-footer"><div className="wd-container"><div className="wd-footer-top"><Link href="/" className="wd-wordmark" aria-label="River City Digital home"><span>RIVER CITY<span className="wd-brand-dot">↗</span></span><small>DIGITAL CO.</small></Link><p>Custom website design.<br />Development and business systems.</p><div><CallLink context="website-design-footer" /><a href={`mailto:${EMAIL}`}>{EMAIL} <ArrowUpRight size={14} /></a></div></div><div className="wd-footer-bottom"><span>© {new Date().getFullYear()} River City Digital Co.</span><span>Based in St. Louis, Missouri.</span><div><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-use">Terms</Link></div></div></div></footer>;
}
