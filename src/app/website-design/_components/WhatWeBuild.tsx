"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Rocket, ShoppingBag, RefreshCw, Database, LayoutDashboard, type LucideIcon } from "lucide-react";
import Container from "@/app/_components/Container";
import SectionHeader from "@/app/_components/SectionHeader";

/* What we build — six kinds of work as dark glass cards, two by two,
 * each tilting toward the cursor in three dimensions, the icon and the
 * words lifted off the card at different depths, and three things you get
 * with each. Hover, and a liquid rises from the bottom of the card until it
 * is solid. Plain CSS
 * transforms driven by custom properties; no canvas. Under reduced motion,
 * or on touch, the cards are flat and just as readable. */

const WHAT: { n: string; t: string; d: string; gets: [string, string, string]; Icon: LucideIcon }[] = [
  { n: "01", t: "Business websites", d: "Help people understand your services, see your work, and contact you. For restaurants, contractors, professional services, salons, and shops.", gets: ["Clear service pages", "Customer reviews and project examples", "Calls, bookings, and quote requests"], Icon: Globe },
  { n: "02", t: "Landing pages", d: "Give visitors from an ad or campaign a focused page with the offer they clicked for and a clear next step.", gets: ["Copy matched to your campaign", "One main call to action", "Conversion tracking setup"], Icon: Rocket },
  { n: "03", t: "Online stores", d: "Make products easy to browse and buy with a custom Shopify or headless storefront suited to your catalog.", gets: ["Product and collection pages", "Shopping cart and checkout", "Layouts for mobile shoppers"], Icon: ShoppingBag },
  { n: "04", t: "Website redesigns", d: "Update a site that's hard to use, out of date, or no longer reflects your business. Start with what's working and address what's getting in the way.", gets: ["Content and navigation review", "Mobile and performance improvements", "Redirect planning for changed URLs"], Icon: RefreshCw },
  { n: "05", t: "Custom backends & CRMs", d: "Replace disconnected tools and repetitive admin work with a system built around your team. Manage the customer information and workflows your business actually uses.", gets: ["Customer records and sales pipelines", "Order and product management", "Automations and software integrations"], Icon: Database },
  { n: "06", t: "Complete business platforms", d: "Connect your public website, customer portal, and internal operations in one custom platform. Start with the core workflows and expand as your business grows.", gets: ["Customer and staff dashboards", "Booking and payment integrations", "Features built around your operations"], Icon: LayoutDashboard },
];

function Card({ n, t, d, gets, Icon }: (typeof WHAT)[number]) {
  const el = useRef<HTMLElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const card = el.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let nx = 0, ny = 0;
    const apply = () => {
      raf = 0;
      card.style.setProperty("--ry", `${(nx * 8).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-ny * 8).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${((nx + 1) * 50).toFixed(1)}%`);
      card.style.setProperty("--my", `${((ny + 1) * 50).toFixed(1)}%`);
    };
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const enter = (e: PointerEvent) => { setHover(true); move(e); };
    const leave = () => {
      setHover(false);
      nx = 0; ny = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    card.addEventListener("pointermove", move, { passive: true });
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article ref={el} className="rcd-tilt" data-hover={hover ? "" : undefined}>
      {/* The liquid: rises from the bottom while the pointer stays, and the
          glass card goes solid behind the words. */}
      <div className="rcd-tilt-fill" aria-hidden="true"><i /></div>
      <div className="rcd-tilt-top">
        <span className="rcd-tilt-n">{n}</span>
        <div className="rcd-tilt-icon" aria-hidden="true">
          <Icon size={26} strokeWidth={1.6} />
        </div>
      </div>
      <h3>{t}</h3>
      <p>{d}</p>
      <ul className="rcd-tilt-gets">
        {gets.map((g) => <li key={g}>{g}</li>)}
      </ul>
    </article>
  );
}

export default function WhatWeBuild() {
  return (
    <section className="section section--civic-deep rcd-what" data-theme="dark">
      <Container>
        <SectionHeader
          className="fx-reveal"
          eyebrow="What we build"
          title="From a landing page to a full platform."
          lede="No project is too small. We build single pages, business websites, online stores, and complete custom systems. Tell us what you need today and where you want to take it."
        />
        <div className="rcd-tilt-grid fx-stagger">
          {WHAT.map((w) => (
            <Card key={w.t} {...w} />
          ))}
        </div>
      </Container>
    </section>
  );
}
