"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import BookCallLink from "./BookCallLink";
import CallLink from "./CallLink";

const SERVICES = [
  { href: "/ai-search-visibility", label: "AI Search Visibility", desc: "Help AI tools find and recommend you." },
  { href: "/local-seo-optimization", label: "Local SEO", desc: "Page 1 and the Map Pack in your zip code." },
  { href: "/website-design", label: "Website Design", desc: "Custom websites that make contacting you easy." },
  { href: "/digital-marketing", label: "Digital Marketing", desc: "Google Ads, Meta, social and email — managed personally." },
];

const ABOUT = [
  { href: "/about", label: "About us", desc: "A family-owned marketing agency in St. Louis." },
  { href: "/service-areas", label: "Service Areas", desc: "Where we work across Missouri and the Midwest." },
];

type Menu = "services" | "about";

/* The header button on every page is "Book a free call" (Brandon's Nov 2026
 * site kit). It opens Calendly through BookCallLink so the click is tracked.
 * Focused paid pages can still pass their own label and on-page anchor. */
const BOOK_LABEL = "Book a free call";

const ButtonArrow = () => (
  <svg className="btn-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

type Props = {
  /** Use light text/colors over dark hero overlap. Defaults to dark text on cream. */
  overlayMode?: "light-on-dark" | "dark-on-light";
  primaryHref?: string;
  primaryLabel?: string;
  sectionLinks?: { href: string; label: string }[];
  brandHref?: string;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Nav({ overlayMode = "light-on-dark", primaryHref, primaryLabel, sectionLinks, brandHref = "/" }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState<Menu | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);
  const ddCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drawerPanelRef = useRef<HTMLDivElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  /* Focus trap for the mobile drawer. When opened, move focus inside the panel
   * and cycle Tab within it. When closed, restore focus to the hamburger. */
  useEffect(() => {
    if (!drawerOpen) return;
    const panel = drawerPanelRef.current;
    if (!panel) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Captured now so the cleanup doesn't read a ref that may have changed.
    // The hamburger is unconditionally rendered, so this is the same node.
    const trigger = menuTriggerRef.current;
    drawerCloseRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Restore focus to whatever opened the drawer (the hamburger button).
      if (trigger) trigger.focus();
      else if (previouslyFocused?.focus) previouslyFocused.focus();
    };
  }, [drawerOpen]);

  /* Close both menus on navigation. Adjusted during render rather than from an
   * effect so the new route never paints with the drawer still open. */
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
    setDdOpen(null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDdOpen(null);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isCurrent = (href: string) => pathname === href;
  const isOnService = SERVICES.some((s) => s.href === pathname);
  const isOnAbout = ABOUT.some((s) => s.href === pathname);
  const ctaLabel = primaryHref ? (primaryLabel ?? BOOK_LABEL) : BOOK_LABEL;
  const cta = (size: "sm" | "lg", className?: string, onClick?: () => void) => primaryHref
    ? <Button href={primaryHref} size={size} arrow className={className} onClick={onClick}>{ctaLabel}</Button>
    : <BookCallLink context={size === "sm" ? "nav" : "nav-drawer"} onClick={onClick} className={`btn btn-primary btn-${size}${className ? " " + className : ""}`}>{BOOK_LABEL}<ButtonArrow /></BookCallLink>;
  const dropdown = (id: Menu, label: string, items: { href: string; label: string; desc: string }[], active: boolean) => (
    <li
      className={`rcd-nav-dd${ddOpen === id ? " open" : ""}`}
      onMouseEnter={() => {
        if (ddCloseTimer.current) clearTimeout(ddCloseTimer.current);
        setDdOpen(id);
      }}
      onMouseLeave={() => {
        if (ddCloseTimer.current) clearTimeout(ddCloseTimer.current);
        ddCloseTimer.current = setTimeout(() => setDdOpen(null), 180);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={ddOpen === id}
        data-active={active || undefined}
        onClick={(e) => {
          e.stopPropagation();
          setDdOpen((o) => (o === id ? null : id));
        }}
      >
        {label} <span className="chev" aria-hidden="true" />
      </button>
      <div className="rcd-nav-dd-menu" role="menu">
        {items.map((s) => (
          <Link key={s.href} href={s.href} role="menuitem" className="rcd-nav-dd-item" aria-current={isCurrent(s.href) ? "page" : undefined}>
            <span className="rcd-nav-dd-label">{s.label}</span>
            <span className="rcd-nav-dd-desc">{s.desc}</span>
          </Link>
        ))}
      </div>
    </li>
  );
  // Use native fragment navigation for paid-page logos, including repeated clicks.
  const BrandLink = brandHref.includes("#") ? "a" : Link;

  return (
    <>
      <nav
        className="rcd-nav"
        data-elevated={scrolled}
        data-overlay={overlayMode}
        aria-label="Primary"
      >
        <div className="rcd-nav-inner container">
          <BrandLink href={brandHref} className="rcd-nav-brand" aria-label={sectionLinks ? "River City Digital — back to top" : "River City Digital home"}>
            <Image
              src="/assets/logo-color.webp"
              alt="River City Digital Co."
              width={248}
              height={40}
              priority
              sizes="248px"
            />
          </BrandLink>

          <ul className="rcd-nav-links">
            {sectionLinks ? sectionLinks.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>) : <>
            {dropdown("services", "Services", SERVICES, isOnService)}
            <li>
              <Link href="/work" aria-current={pathname?.startsWith("/work") ? "page" : undefined}>
                Work
              </Link>
            </li>
            {dropdown("about", "About", ABOUT, isOnAbout)}
            <li>
              <Link href="/contact" aria-current={isCurrent("/contact") ? "page" : undefined}>
                Contact
              </Link>
            </li>
            </>}
          </ul>

          {/* The number sits left of the header button so the cheapest
              action to take is also the first one read. Desktop only — this
              whole block is display:none under 920px, where the call shortcut
              is the sticky bar instead. */}
          <div className="rcd-nav-cta">
            <CallLink context="nav" className="rcd-nav-call" />
            {cta("sm")}
          </div>

          <button
            type="button"
            ref={menuTriggerRef}
            className="rcd-nav-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={drawerOpen}
            aria-controls="rcd-mobile-drawer"
            onClick={() => setDrawerOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        id="rcd-mobile-drawer"
        className={`rcd-drawer${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
      >
        <div className="rcd-drawer-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        <div className="rcd-drawer-panel" ref={drawerPanelRef}>
          <div className="rcd-drawer-head">
            <BrandLink href={brandHref} className="rcd-drawer-brand" onClick={() => setDrawerOpen(false)}>
              <Image
                src="/assets/logo-color.webp"
                alt="River City Digital"
                width={222}
                height={36}
                sizes="222px"
              />
            </BrandLink>
            <button
              type="button"
              ref={drawerCloseRef}
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="rcd-drawer-close"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <nav className="rcd-drawer-nav" aria-label="Mobile">
            {sectionLinks ? sectionLinks.map(link => <a key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}>{link.label}</a>) : <>
            <p className="rcd-drawer-section-label">Services</p>
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setDrawerOpen(false)}>
                {s.label}
              </Link>
            ))}
            <Link href="/work" onClick={() => setDrawerOpen(false)}>Work</Link>
            <p className="rcd-drawer-section-label">About</p>
            {ABOUT.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setDrawerOpen(false)}>
                {s.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setDrawerOpen(false)}>Contact</Link>
            </>}
          </nav>

          <div className="rcd-drawer-foot">
            {cta("lg", "rcd-drawer-cta", () => setDrawerOpen(false))}
            <a href="mailto:hello@rivercitydigitalco.com" className="rcd-drawer-mail">
              hello@rivercitydigitalco.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
