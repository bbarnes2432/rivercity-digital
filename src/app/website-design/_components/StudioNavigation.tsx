import Nav from "@/app/_components/Nav";

/* The normal service page uses the site-wide header button ("Book a free
 * call"). Focused paid pages (St. Louis, Chicago) keep an on-page anchor to
 * their own form and the label they pass in. */
export default function StudioNavigation({ confirmation = false, focused = false, landingPath = "/website-design", primaryLabel = "Free mockup" }: { confirmation?: boolean; focused?: boolean; landingPath?: string; primaryLabel?: string }) {
  const base = confirmation ? landingPath : "";
  return <div className="wd-global-navigation"><Nav
    overlayMode="light-on-dark"
    primaryHref={focused ? `${base}#start` : undefined}
    brandHref={focused ? `${base}#top` : "/"}
    sectionLinks={focused ? [{ href: `${base}#work`, label: "Our work" }, { href: `${base}#included`, label: "What you get" }, { href: `${base}#faq`, label: "Questions" }] : undefined}
    primaryLabel={focused ? primaryLabel : undefined}
  /></div>;
}
