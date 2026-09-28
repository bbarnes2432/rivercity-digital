import Nav from "@/app/_components/Nav";

export default function StudioNavigation({ confirmation = false, focused = false, landingPath = "/website-design" }: { confirmation?: boolean; focused?: boolean; landingPath?: string }) {
  const base = confirmation ? landingPath : "";
  return <div className="wd-global-navigation"><Nav
    overlayMode="light-on-dark"
    primaryHref={`${base}#start`}
    brandHref={focused ? `${base}#top` : "/"}
    sectionLinks={focused ? [{ href: `${base}#work`, label: "Our work" }, { href: `${base}#included`, label: "What you get" }, { href: `${base}#faq`, label: "Questions" }] : undefined}
    primaryLabel="Free mockup"
  /></div>;
}
