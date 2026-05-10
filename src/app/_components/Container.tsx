import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export default function Container({ children, narrow, className, as: As = "div" }: Props) {
  const Tag = As as React.ElementType;
  return (
    <Tag className={`${narrow ? "container-narrow" : "container"}${className ? " " + className : ""}`}>
      {children}
    </Tag>
  );
}
