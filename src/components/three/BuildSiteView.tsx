"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei/web/View";
import { invalidate } from "@react-three/fiber";
import BuildSite from "./BuildSite";

type Props = {
  /** The DOM box this draws into — the parent that gets pointer events. */
  track: RefObject<HTMLDivElement | null>;
  src?: string;
  getStage: () => number;
  table?: boolean;
  visible?: boolean;
};

/* The boundary between the build section and the site being built on the
 * shared canvas: pointer input from the DOM box (the site tilts toward the
 * cursor once launched), and a scroll listener that asks for a frame so the
 * stage can move toward wherever getStage() now points. */
export default function BuildSiteView({ track, getStage, visible = true }: Props) {
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

  useEffect(() => { invalidate(); }, [visible]);

  return (
    <View className="rcd-build-view" visible={visible}>
      <BuildSite getStage={getStage} hovered={hovered} pointer={pointer} />
    </View>
  );
}
