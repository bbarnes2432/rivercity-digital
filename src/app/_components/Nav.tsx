"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "./Button";

const SERVICES = [
  { href: "/ai-search-visibility", label: "AI Search Visibility", desc: "Be the answer ChatGPT, Gemini and Perplexity give." },
  { href: "/local-seo-optimization", label: "Local SEO", desc: "Page 1 and the Map Pack in your zip code." },
  { href: "/website-design", label: "Website Design", desc: "Custom-built. No themes. No swap-the-logo." },
  { href: "/digital-marketing", label: "Digital Marketing", desc: "Google Ads, Meta, social and email — managed personally." },
];

type Props = {
  /** Use light text/colors over dark hero overlap. Defaults to dark text on cream. */
  overlayMode?: "light-on-dark" | "dark-on-light";
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Nav({ overlayMode = "light-on-dark" }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);
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
      if (menuTriggerRef.current) menuTriggerRef.current.focus();
      else if (previouslyFocused?.focus) previouslyFocused.focus();
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
    setDdOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDdOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isCurrent = (href: string) => pathname === href;
  const isOnService = SERVICES.some((s) => s.href === pathname);

  return (
    <>
      <nav
        className="rcd-nav"
        data-elevated={scrolled}
        data-overlay={overlayMode}
        aria-label="Primary"
      >
        <div className="rcd-nav-inner container">
          <Link href="/" className="rcd-nav-brand" aria-label="River City Digital home">
            <Image
              src="/assets/logo-white.webp"
              alt="River City Digital Co."
              width={248}
              height={40}
              priority
              sizes="248px"
            />
          </Link>

          <ul className="rcd-nav-links">
            <li>
              <Link href="/about" aria-current={isCurrent("/about") ? "page" : undefined}>
                About
              </Link>
            </li>
            <li
              className={`rcd-nav-dd${ddOpen ? " open" : ""}`}
              onMouseEnter={() => {
                if (ddCloseTimer.current) clearTimeout(ddCloseTimer.current);
                setDdOpen(true);
              }}
              onMouseLeave={() => {
                if (ddCloseTimer.current) clearTimeout(ddCloseTimer.current);
                ddCloseTimer.current = setTimeout(() => setDdOpen(false), 180);
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={ddOpen}
                data-active={isOnService || undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  setDdOpen((o) => !o);
                }}
              >
                Services <span className="chev" aria-hidden="true" />
              </button>
              <div className="rcd-nav-dd-menu" role="menu">
                {SERVICES.map((s) => (
                  <Link key={s.href} href={s.href} role="menuitem" className="rcd-nav-dd-item">
                    <span className="rcd-nav-dd-label">{s.label}</span>
                    <span className="rcd-nav-dd-desc">{s.desc}</span>
                  </Link>
                ))}
              </div>
            </li>
            <li>
              <Link href="/service-areas" aria-current={isCurrent("/service-areas") ? "page" : undefined}>
                Service Areas
              </Link>
            </li>
            <li>
              <Link href="/contact" aria-current={isCurrent("/contact") ? "page" : undefined}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="rcd-nav-cta">
            <Button href="/contact" size="sm" arrow>Free Audit</Button>
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
            <Link href="/" className="rcd-drawer-brand" onClick={() => setDrawerOpen(false)}>
              <Image
                src="/assets/logo-white.webp"
                alt="River City Digital"
                width={222}
                height={36}
                sizes="222px"
              />
            </Link>
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
            <Link href="/about" onClick={() => setDrawerOpen(false)}>About</Link>
            <p className="rcd-drawer-section-label">Services</p>
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} onClick={() => setDrawerOpen(false)}>
                {s.label}
              </Link>
            ))}
            <Link href="/service-areas" onClick={() => setDrawerOpen(false)}>Service Areas</Link>
            <Link href="/contact" onClick={() => setDrawerOpen(false)}>Contact</Link>
          </nav>

          <div className="rcd-drawer-foot">
            <Button href="/contact" size="lg" arrow className="rcd-drawer-cta">Free Audit</Button>
            <a href="mailto:hello@rivercitydigitalco.com" className="rcd-drawer-mail">
              hello@rivercitydigitalco.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
