import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  narrow?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export default function Container({ children, narrow, className, as: As = "div" }: Props) {
  /* Narrowed to the props this component actually passes. Casting to the bare
     React.ElementType union used to be fine; once @react-three/fiber augments
     JSX.IntrinsicElements with three's elements, the union's props intersect
     and `children` collapses to `never`. Filtering by {className, children}
     keeps only element types that accept them. */
  const Tag = As as React.ElementType<{ className?: string; children?: ReactNode }>;
  return (
    <Tag className={`${narrow ? "container-narrow" : "container"}${className ? " " + className : ""}`}>
      {children}
    </Tag>
  );
}
