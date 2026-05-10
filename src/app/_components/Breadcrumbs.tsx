import Link from "next/link";

type Crumb = { href?: string; label: string };

type Props = {
  items: Crumb[];
  className?: string;
};

export default function Breadcrumbs({ items, className }: Props) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: c.href.startsWith("http") ? c.href : `https://rivercitydigitalco.com${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={`rcd-breadcrumbs${className ? " " + className : ""}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ol>
        {items.map((c, i) => (
          <li key={i} aria-current={i === items.length - 1 ? "page" : undefined}>
            {c.href && i !== items.length - 1 ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
