"use client";

import { useEffect, useRef, type RefObject } from "react";
import { View } from "@react-three/drei/web/View";
import { invalidate } from "@react-three/fiber";
import Constellation from "./Constellation";

type Props = {
  /** The section: pointer input and the drawing box are both this. */
  track: RefObject<HTMLElement | null>;
  getSpread: () => number;
  getMask: () => [number, number];
};

export default function ConstellationView({ track, getSpread, getMask }: Props) {
  const pointer = useRef({ x: 0, y: 0, present: 0 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pointer.current.present = 1;
      invalidate();
    };
    const leave = () => { pointer.current.present = 0; invalidate(); };
    const onScroll = () => invalidate();
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [track]);

  return (
    <View className="rcd-constellation-view">
      <Constellation pointer={pointer} getSpread={getSpread} getMask={getMask} />
    </View>
  );
}
