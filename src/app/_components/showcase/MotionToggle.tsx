"use client";

import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { setMotionPaused, useMotionPaused } from "./motion-pause";
import styles from "./MotionToggle.module.css";

/** Visible pause/play for every moving part of the page, remembered site-wide. */
export default function MotionToggle({ className = "" }: { className?: string }) {
  const paused = useMotionPaused();
  const reduced = useReducedMotion();
  // With reduced motion nothing moves, so there is nothing to pause.
  if (reduced) return null;
  return (
    <button
      type="button"
      className={`${styles.toggle} ${className}`}
      aria-pressed={paused}
      onClick={() => setMotionPaused(!paused)}
    >
      {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}
