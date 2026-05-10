"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
};

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export default function CountUp({
  value,
  duration = 1400,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
}: Props) {
  /* Render the final value on the server and on first hydration so search
   * engines and no-JS readers see real numbers. After mount, if the element
   * is below the fold and motion is allowed, drop to 0 and animate when
   * it scrolls into view. */
  const [display, setDisplay] = useState<number>(value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      started.current = true;
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight - 60 && rect.bottom > 0;
    if (alreadyVisible) {
      started.current = true;
      return;
    }

    setDisplay(0);

    const animate = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        setDisplay(value * easeOutQuart(t));
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            animate();
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, duration]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const out = formatted.replaceAll(",", separator);

  return (
    <span ref={ref}>
      {prefix}
      {out}
      {suffix}
    </span>
  );
}
