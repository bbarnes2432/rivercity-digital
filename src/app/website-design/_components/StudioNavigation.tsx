import Nav from "@/app/_components/Nav";

export default function StudioNavigation({ confirmation = false }: { confirmation?: boolean }) {
  return <div className="wd-global-navigation"><Nav
    overlayMode="light-on-dark"
    primaryHref={confirmation ? "/website-design#start" : "#start"}
    primaryLabel="Free mockup"
  /></div>;
}
