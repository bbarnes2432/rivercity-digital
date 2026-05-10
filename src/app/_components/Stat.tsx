import { ReactNode } from "react";
import CountUp from "./CountUp";

type Props = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: ReactNode;
  caption?: ReactNode;
  decimals?: number;
};

export default function Stat({ value, suffix = "", prefix = "", label, caption, decimals = 0 }: Props) {
  return (
    <div className="rcd-stat fx-reveal">
      <div className="rcd-stat-bar" />
      <div className="rcd-stat-num">
        <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      <div className="rcd-stat-label">{label}</div>
      {caption && <div className="rcd-stat-caption">{caption}</div>}
    </div>
  );
}
