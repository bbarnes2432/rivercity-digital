"use client";

import { useSyncExternalStore } from "react";

/* prefers-reduced-motion, read as the external store it is.
 *
 * useSyncExternalStore rather than useState + useEffect: setting state inside
 * an effect on mount causes a cascading re-render, and React 19's lint rejects
 * it. The server snapshot is `false` because the server cannot know the
 * preference — every consumer of this renders nothing (or renders inert) on the
 * server, so there is no hydration mismatch to see.
 *
 * Shared by the hero's animated pieces so the preference is read one way in one
 * place; ShaderBackground reads the media query directly inside its WebGL setup
 * effect, where it needs an imperative value rather than a hook. */
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
