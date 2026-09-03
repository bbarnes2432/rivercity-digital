"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei/web/View";
import { invalidate } from "@react-three/fiber";
import Glyph, { type GlyphKind } from "./Glyph";

type Props = {
  /** The box the glyph draws into (the icon slot). */
  track: RefObject<HTMLDivElement | null>;
  /** The element whose hover triggers the reaction — the whole card, so the
   *  target is the card and not a 96px square. */
  hoverTrack: RefObject<HTMLElement | null>;
  kind: GlyphKind;
};

export default function GlyphView({ track, hoverTrack, kind }: Props) {
  const pointer = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = hoverTrack.current;
    if (!el) return;
    let touchTimer = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      invalidate();
    };
    const enter = () => { setHovered(true); invalidate(); };
    const leave = () => { setHovered(false); invalidate(); };
    // A tap has no hover: react for a beat, then rest.
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      setHovered(true); invalidate();
      window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(leave, 900);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      window.clearTimeout(touchTimer);
    };
  }, [hoverTrack]);

  // The tracked element is drei's own (see WorkSlabView); `track` is kept in
  // the props so the section can size the box, and for parity with the others.
  void track;

  return (
    <View className="rcd-glyph-view">
      <Glyph kind={kind} hovered={hovered} pointer={pointer} />
    </View>
  );
}
