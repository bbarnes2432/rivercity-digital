"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei/web/View";
import { invalidate } from "@react-three/fiber";
import WorkSlab from "./WorkSlab";

type Props = {
  /** The DOM box the slab draws into. Its aspect-ratio is fixed in CSS, so
   *  the space is reserved before three.js has even been requested. */
  track: RefObject<HTMLDivElement | null>;
  src: string;
  visible: boolean;
};

/* The boundary between the DOM card and the shared canvas.
 *
 * Everything that knows about three.js lives on this side of the dynamic
 * import, so the rail itself — the markup Google reads and the fallback
 * everyone without WebGL sees — never pulls three into the main chunk.
 *
 * Pointer input is taken from the DOM box directly rather than through R3F's
 * raycaster. The box is what the visitor actually hovers, the screenshot
 * inside it is pointer-events:none so the box is always the event target, and
 * it sidesteps the whole question of mapping canvas events back to views. */
export default function WorkSlabView({ track, src, visible }: Props) {
  const pointer = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      invalidate();
    };
    const enter = () => {
      setHovered(true);
      invalidate();
    };
    const leave = () => {
      setHovered(false);
      invalidate();
    };

    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
    };
  }, [track]);

  // Visibility flips (card turning over) need a frame to clear the rect.
  useEffect(() => {
    invalidate();
  }, [visible]);

  /* drei's <View> always renders an element of its own — with a `track` prop
   * it still goes through HtmlView, and the empty <div> that produces becomes
   * the tracked rect: 558px wide, 0px tall. The viewport drei set was
   * literally height 0 and nothing ever drew (measured, not guessed). So the
   * View's own element is the box: absolutely positioned to fill the shot,
   * sitting over the <img>. Pointer input still comes from the shot box (the
   * parent), which these events reach. */
  return (
    <View className="rcd-rail-view" visible={visible}>
      {/* While the texture loads nothing is drawn, so the DOM screenshot
          underneath is exactly what the visitor sees. No spinner needed. */}
      <Suspense fallback={null}>
        <WorkSlab src={src} hovered={hovered} pointer={pointer} />
      </Suspense>
    </View>
  );
}
