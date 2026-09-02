"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei/web/View";
import { invalidate } from "@react-three/fiber";
import BuildSlab from "./BuildSlab";

type Props = {
  /** The DOM box this draws into — the parent that gets pointer events. */
  track: RefObject<HTMLDivElement | null>;
  src: string;
  getStage: () => number;
  table?: boolean;
  visible?: boolean;
};

/* The boundary between a DOM section and the build slab on the shared canvas.
 * Same shape as WorkSlabView: pointer input from the DOM box, and — because
 * the stage is scroll-driven — a scroll listener that asks for a frame so the
 * slab can move toward wherever getStage() now points. Everything that knows
 * three.js lives on this side of the dynamic import. */
export default function BuildSlabView({ track, src, getStage, table = false, visible = true }: Props) {
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
    const enter = () => { setHovered(true); invalidate(); };
    const leave = () => { setHovered(false); invalidate(); };
    // Scroll changes the stage; one frame per scroll event is enough because
    // the slab damps toward the target and keeps invalidating itself until it
    // arrives.
    const onScroll = () => invalidate();
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [track]);

  useEffect(() => {
    invalidate();
  }, [visible]);

  return (
    <View className="rcd-build-view" visible={visible}>
      <Suspense fallback={null}>
        <BuildSlab src={src} getStage={getStage} table={table} hovered={hovered} pointer={pointer} />
      </Suspense>
    </View>
  );
}
