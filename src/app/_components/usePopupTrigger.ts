"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SUPPRESS_PATHS = new Set<string>([
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
]);

const KEY_DISMISSED = "rcd-popup-dismissed";
const KEY_SUBMITTED = "rcd-popup-submitted";
const KEY_SHOWN = "rcd-popup-shown";

// Suppression windows match industry defaults for B2B service-business popups:
//   - 30 days after a dismiss (OptinMonster / Klaviyo standard)
//   - 365 days after a successful submit — long enough that the lead's project
//     is likely complete and they may genuinely want to re-engage, short enough
//     that storage cruft from years ago doesn't suppress them forever.
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const SUBMIT_TTL_MS = 365 * 24 * 60 * 60 * 1000;
const MOBILE_MQ = "(max-width: 720px)";

type State = {
  shouldOpen: boolean;
  dismiss: () => void;
  recordSubmit: () => void;
};

function safeStorage(area: "local" | "session"): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const s = area === "local" ? window.localStorage : window.sessionStorage;
    const probe = "__rcd_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function usePopupTrigger(): State {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [shouldOpen, setShouldOpen] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const local = safeStorage("local");
    const session = safeStorage("session");

    if (pathname && SUPPRESS_PATHS.has(pathname)) return;
    if (searchParams?.get("utm_source") === "email") return;

    const submittedAt = Number(local?.getItem(KEY_SUBMITTED) ?? 0);
    if (submittedAt && Date.now() - submittedAt < SUBMIT_TTL_MS) return;

    const dismissedAt = Number(local?.getItem(KEY_DISMISSED) ?? 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_MS) return;

    if (session?.getItem(KEY_SHOWN)) return;

    // Time + scroll thresholds tuned to Popupsmart 2025 benchmark (6–10s
    // sweet spot for B2B) and Drip's ≥35% scroll rule. AND logic preserved
    // so we only fire on engaged sessions, not casual scroll-throughs.
    const isMobile = window.matchMedia(MOBILE_MQ).matches;
    const timeThresholdMs = isMobile ? 12_000 : 8_000;
    const scrollThreshold = isMobile ? 0.3 : 0.35;

    let timeReached = false;
    let scrollReached = false;

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      session?.setItem(KEY_SHOWN, "1");
      setShouldOpen(true);
    };

    const tryFire = () => {
      if (timeReached && scrollReached) fire();
    };

    const timer = window.setTimeout(() => {
      timeReached = true;
      tryFire();
    }, timeThresholdMs);

    let scrollRAF = 0;
    const onScroll = () => {
      if (scrollRAF) return;
      scrollRAF = window.requestAnimationFrame(() => {
        scrollRAF = 0;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const ratio = window.scrollY / scrollable;
        if (ratio >= scrollThreshold) {
          scrollReached = true;
          tryFire();
          window.removeEventListener("scroll", onScroll);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let onMouseLeave: ((e: MouseEvent) => void) | null = null;
    if (!isMobile) {
      onMouseLeave = (e: MouseEvent) => {
        if (firedRef.current) return;
        if (e.clientY <= 0) fire();
      };
      document.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      if (scrollRAF) window.cancelAnimationFrame(scrollRAF);
      if (onMouseLeave) document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [pathname, searchParams]);

  const dismiss = () => {
    const local = safeStorage("local");
    local?.setItem(KEY_DISMISSED, String(Date.now()));
    setShouldOpen(false);
  };

  const recordSubmit = () => {
    const local = safeStorage("local");
    local?.setItem(KEY_SUBMITTED, String(Date.now()));
  };

  return { shouldOpen, dismiss, recordSubmit };
}
