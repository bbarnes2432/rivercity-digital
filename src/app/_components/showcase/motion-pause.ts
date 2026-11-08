"use client";

import { useEffect, useSyncExternalStore } from "react";

/* One site-wide "pause motion" switch for the portfolio and review sections
 * (Brandon's Nov 2026 brief). Stored per visitor so it carries across pages,
 * and mirrored onto <html data-motion-paused> so pure-CSS animations (the hero
 * scroll wall, review rows, tile pans) can stop without any JavaScript loop.
 * Storage can be unavailable (private windows, blocked site data), so every
 * access is guarded and the default is simply "playing". */
const KEY = "rcd-motion-paused";
const EVENT = "rcd-motion-pause-change";

let current: boolean | null = null;

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  const update = () => { current = read(); onChange(); };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", update);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", update);
  };
}

const getSnapshot = () => (current ??= read());
const getServerSnapshot = () => false;

export function useMotionPaused(): boolean {
  const paused = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    document.documentElement.dataset.motionPaused = paused ? "true" : "false";
  }, [paused]);
  return paused;
}

export function setMotionPaused(paused: boolean) {
  current = paused;
  try {
    window.localStorage.setItem(KEY, paused ? "1" : "0");
  } catch {
    // Not persisted; the switch still works for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}
