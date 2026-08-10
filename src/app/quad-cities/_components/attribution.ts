"use client";

import { useSyncExternalStore } from "react";

/* Ad attribution capture for /quad-cities.
 *
 * Two jobs:
 *
 *   1. UTM parameters, so a lead can be traced back to the campaign, ad group
 *      and creative that produced it.
 *   2. `gclid` and `fbclid` — the click IDs. These are what let a closed deal
 *      be imported back into Google and Meta later as an offline conversion.
 *      Without them both platforms optimize toward whoever fills out forms
 *      rather than whoever signs, which is a materially different and much
 *      more expensive audience.
 *
 * Both are captured on arrival and persisted for the session, so someone who
 * lands from an ad, reads the page, wanders off to the video and converts ten
 * minutes later still carries their attribution into the form.
 *
 * Read from window.location rather than useSearchParams() on purpose:
 * useSearchParams() opts the route out of static rendering, and this is a
 * paid landing page where LCP feeds Quality Score directly. The cost of doing
 * it this way is that the values only exist after hydration, which is fine —
 * nothing reads them until submit.
 */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "rcd-qc-attribution";
/** Long enough for any real value, short enough that a junk query string
 *  can't be used to stuff the notification email. */
const MAX_VALUE_LENGTH = 300;

function session(): Storage | null {
  try {
    const s = window.sessionStorage;
    s.setItem("__rcd_probe__", "1");
    s.removeItem("__rcd_probe__");
    return s;
  } catch {
    // Private mode or storage blocked — fall back to URL-only capture.
    return null;
  }
}

function fromUrl(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key)?.trim();
    if (value) found[key] = value.slice(0, MAX_VALUE_LENGTH);
  }
  return found;
}

function stored(): Attribution {
  const raw = session()?.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const clean: Attribution = {};
    for (const key of ATTRIBUTION_KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === "string" && value) {
        clean[key] = value.slice(0, MAX_VALUE_LENGTH);
      }
    }
    return clean;
  } catch {
    return {};
  }
}

/** Capture on arrival and return everything known for this session.
 *
 *  A fresh ad click replaces the stored set wholesale rather than merging into
 *  it. Merging would let a stale `gclid` from an earlier click ride along on a
 *  later Meta-sourced lead and get credited for it. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const url = fromUrl();
  if (Object.keys(url).length > 0) {
    try {
      session()?.setItem(STORAGE_KEY, JSON.stringify(url));
    } catch {
      // Nothing to do — the values still reach the form this page view.
    }
    return url;
  }
  return stored();
}

/* Read as an external store rather than captured into state from an effect.
 * The values live in the URL and in sessionStorage — both outside React — and
 * useSyncExternalStore is how you read that without a cascading render or a
 * hydration mismatch. It also means both form instances on the page share one
 * capture instead of racing to write the same key twice. */
const EMPTY: Attribution = Object.freeze({});

let snapshot: Attribution | null = null;

function getSnapshot(): Attribution {
  // Cached so the reference stays stable across renders; nothing can change
  // the query string without a navigation, which remounts this anyway.
  if (snapshot === null) snapshot = captureAttribution();
  return snapshot;
}

function getServerSnapshot(): Attribution {
  return EMPTY;
}

function subscribe(): () => void {
  // Never changes within a page view — nothing to subscribe to.
  return () => {};
}

/** Attribution for this session. Empty during server render and hydration,
 *  populated from that point on. Nothing reads it until submit. */
export function useAttribution(): Attribution {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
