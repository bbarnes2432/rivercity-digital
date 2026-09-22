import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import CallLink from "@/app/_components/CallLink";
import { EMAIL } from "@/app/_components/contact-info";

const WEBSITE_LINKS = [
  ["Home", "/"], ["About", "/about"], ["Our work", "/work"], ["Field notes", "/notes"],
  ["AI search visibility", "/ai-search-visibility"], ["Local SEO", "/local-seo-optimization"],
  ["Website design", "/website-design"], ["Digital marketing", "/digital-marketing"],
  ["Service areas", "/service-areas"], ["Contact", "/contact"],
] as const;

export default function StudioFooter() {
  return <footer className="wd-footer"><div className="wd-container"><div className="wd-footer-top"><Link href="/" className="wd-wordmark" aria-label="River City Digital home"><Image src="/assets/logo-white.webp" alt="River City Digital Co." width={248} height={40} sizes="248px" /></Link><p>Custom website design.<br />Built in St. Louis, for your business.</p><div><CallLink context="website-design-footer" /><a href={`mailto:${EMAIL}`}>{EMAIL} <ArrowUpRight size={14} /></a></div></div><nav className="wd-footer-navigation" aria-label="Explore the website">{WEBSITE_LINKS.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="wd-footer-bottom"><span>© {new Date().getFullYear()} River City Digital Co.</span><span>Based in St. Louis, Missouri.</span><div><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-use">Terms</Link></div></div></div></footer>;
}
