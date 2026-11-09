import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import CallLink from "@/app/_components/CallLink";
import BookCallLink from "@/app/_components/BookCallLink";
import { EMAIL } from "@/app/_components/contact-info";
import { PolicyButton } from "./LandingPolicyProvider";

// Matches the header menu (Brandon's Nov 9, 2026 brief): Services · Work ·
// About · Contact · Book a free call. No Field notes or Digital marketing.
const MENU_GROUPS = [
  ["Services", [["AI search visibility", "/ai-search-visibility"], ["Local SEO", "/local-seo-optimization"], ["Website design", "/website-design"]]],
  ["Work", [["Our work", "/work"]]],
  ["About", [["About us", "/about"], ["Service areas", "/service-areas"]]],
  ["Contact", [["Contact us", "/contact"]]],
] as const;

export default function StudioFooter({ focused = false, landingPath = "", market = "st-louis" }: { focused?: boolean; landingPath?: string; market?: "st-louis" | "chicago" }) {
  return <footer className="wd-footer"><div className="wd-container"><div className="wd-footer-top"><Link href={focused ? `${landingPath}#top` : "/"} className="wd-wordmark" aria-label={focused ? "River City Digital — back to top" : "River City Digital home"}><Image src="/assets/logo-color.webp" alt="River City Digital Co." width={248} height={40} sizes="248px" /></Link><p>Custom website design.<br />{market === "chicago" ? "Built around your business." : "Built in St. Louis, for your business."}</p><div><CallLink context="website-design-footer" /><a href={`mailto:${EMAIL}`}>{EMAIL} <ArrowUpRight size={14} /></a></div></div><nav className={`wd-footer-navigation${focused ? "" : " wd-footer-menu"}`} aria-label="Explore the website">{focused ? [["Our work", "#work"], ["What you get", "#included"], ["Questions", "#faq"]].map(([label, href]) => <a key={href} href={`${landingPath}${href}`}>{label}</a>) : <>{MENU_GROUPS.map(([group, links]) => <div className="wd-footer-group" key={group}><p>{group}</p>{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}<div className="wd-footer-group wd-footer-book"><BookCallLink context="website-design-footer" className="wd-footer-book-link">Book a free call <ArrowUpRight size={14} aria-hidden="true" /></BookCallLink></div></>}</nav><div className="wd-footer-bottom"><span>© {new Date().getFullYear()} River City Digital Co.</span><span>{market === "chicago" ? "Family-owned. Personally handled." : "Based in St. Louis, Missouri."}</span><div>{focused ? <><PolicyButton policy="privacy">Privacy</PolicyButton><PolicyButton policy="terms">Terms</PolicyButton></> : <><Link href="/privacy-policy">Privacy</Link><Link href="/terms-of-use">Terms</Link></>}</div></div></div></footer>;
}
