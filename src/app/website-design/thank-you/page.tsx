import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import CallLink from "@/app/_components/CallLink";
import ThankYouConversion from "@/app/_components/ThankYouConversion";
import StudioNavigation from "../_components/StudioNavigation";
import StudioFooter from "../_components/StudioFooter";
import "../website-design.css";

export const metadata: Metadata = { title: "Thank You for Your Website Request", robots: { index: false, follow: false } };

export default async function WebsiteThankYou({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  const preview = (await searchParams).preview === "1";
  return <div className="wd-site">{!preview && <ThankYouConversion source="website-design-mockup" />}<StudioNavigation confirmation /><main className="wd-page wd-thank-you" id="main"><div className="wd-container"><span className="wd-receipt-check"><Check size={28} /></span><p className="wd-eyebrow">{preview ? "Local preview · No message sent" : "Your mockup request is in"}</p><h1>Thanks for your<br /><em>website request.</em></h1><p>{preview ? "The form completed successfully in this local preview. Email delivery is disabled because no email provider key is configured." : "We’ll get in touch about your business, ideas, and logo, then prepare your free mockup. You’ll see what your website could look like, with no obligation to build."}</p><div className="wd-actions"><CallLink context="website-design-thank-you" className="wd-button wd-button-mint">Talk with us now <ArrowUpRight size={18} /></CallLink></div><Link href="/website-design#work" className="wd-receipt-back">Explore more of our work <ArrowUpRight size={16} /></Link></div></main><StudioFooter /></div>;
}
