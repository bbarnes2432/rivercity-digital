import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

type Props = ButtonProps | AnchorProps;

const Arrow = () => (
  <svg
    className="btn-arr"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

function classes(variant: Variant, size: Size, className?: string) {
  const v = variant === "link" ? "btn-link" : `btn-${variant}`;
  return `btn ${v} btn-${size}${className ? " " + className : ""}`;
}

export default function Button(props: Props) {
  const { variant = "primary", size = "md", arrow, children, className, ...rest } = props;
  const cls = classes(variant, size, className);

  if ("href" in rest && typeof rest.href === "string") {
    const isExternal = rest.href.startsWith("http") || rest.href.startsWith("mailto:") || rest.href.startsWith("tel:");
    if (isExternal) {
      return (
        <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
          {arrow && <Arrow />}
        </a>
      );
    }
    return (
      <Link className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })}>
        {children}
        {arrow && <Arrow />}
      </Link>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={cls} {...buttonProps}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
