"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { View } from "@react-three/drei/web/View";
import { invalidate } from "@react-three/fiber";
import Layers from "./showcase/Layers";
import Ripple from "./showcase/Ripple";
import Words from "./showcase/Words";
import type { ShowcaseKind } from "./stage-context";

type Props = {
  track: RefObject<HTMLDivElement | null>;
  kind: ShowcaseKind;
  src?: string;
  getProgress: () => number;
};

/* The boundary between a showcase tile and its demonstration on the shared
 * canvas. Same shape as the other views: pointer input from the DOM box,
 * hover, a beat of "hover" for a tap, and a scroll listener that asks for a
 * frame so the scroll-driven pieces can move toward their target. The energy
 * field is pointer speed, for the ripple. */
export default function ShowcaseView({ track, kind, src, getProgress }: Props) {
  const pointer = useRef({ x: 0, y: 0, t: 0, energy: 0, lx: -1, ly: -1 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let touchTimer = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const p = pointer.current;
      p.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      p.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      if (p.lx >= 0) p.energy += Math.min(1, Math.hypot(e.clientX - p.lx, e.clientY - p.ly) / 60) * 0.35;
      p.lx = e.clientX; p.ly = e.clientY;
      p.t = performance.now();
      invalidate();
    };
    const enter = () => { setHovered(true); invalidate(); };
    const leave = () => { setHovered(false); pointer.current.lx = -1; invalidate(); };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      move(e);
      setHovered(true); invalidate();
      window.clearTimeout(touchTimer);
      touchTimer = window.setTimeout(leave, 1200);
    };
    const onScroll = () => invalidate();
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave);
    el.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(touchTimer);
    };
  }, [track]);

  return (
    <View className="rcd-show-view">
      <Suspense fallback={null}>
        {kind === "layers" && src && <Layers src={src} getProgress={getProgress} hovered={hovered} pointer={pointer} />}
        {kind === "ripple" && src && <Ripple src={src} pointer={pointer} />}
        {kind === "words" && <Words getProgress={getProgress} hovered={hovered} pointer={pointer} />}
      </Suspense>
    </View>
  );
}
