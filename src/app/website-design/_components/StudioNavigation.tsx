"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import CallLink from "@/app/_components/CallLink";

export default function StudioNavigation({ confirmation = false }: { confirmation?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const prefix = confirmation ? "/website-design" : "";
  const links = [["Our work", "work"], ["Why custom", "custom-build"], ["Capabilities", "custom-systems"], ["Process", "process"]];
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 901px)");
    const onResize = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener("change", onResize);
    return () => { document.body.style.overflow = previous; media.removeEventListener("change", onResize); };
  }, [open]);
  function close() { dialog.current?.close(); }
  return <>
    <header className="wd-nav"><div className="wd-container wd-nav-inner">
      <Link href="/" className="wd-wordmark" aria-label="River City Digital home"><span>RIVER CITY<span className="wd-brand-dot">↗</span></span><small>DIGITAL CO.</small></Link>
      <nav aria-label="Website design navigation" className="wd-desktop-nav">{links.map(([label, id]) => <a href={`${prefix}#${id}`} key={id}>{label}</a>)}</nav>
      <div className="wd-nav-actions"><a className="wd-nav-mockup" href={`${prefix}#start`}>Free mockup <ArrowUpRight size={14} /></a><CallLink context="website-design-navigation" className="wd-nav-call" /><button type="button" className="wd-menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="wd-mobile-menu" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Menu size={23} /></button></div>
    </div></header>
    <dialog id="wd-mobile-menu" className="wd-mobile-menu" ref={dialog} aria-labelledby="wd-menu-title" onClose={() => setOpen(false)} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const focusable = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}>
      <div className="wd-menu-top"><span className="wd-eyebrow" id="wd-menu-title">River City Digital</span><button type="button" onClick={close} aria-label="Close menu"><X size={24} /></button></div>
      <nav aria-label="Mobile website design navigation">{links.map(([label, id], index) => <a href={`${prefix}#${id}`} key={id} onClick={close}><span>0{index + 1}</span>{label}<ArrowUpRight size={23} /></a>)}<a href={`${prefix}#start`} onClick={close}><span>05</span>Free mockup<ArrowUpRight size={23} /></a></nav>
      <div className="wd-menu-contact"><p>Talk through your website or custom development project.</p><CallLink context="website-design-mobile-menu" className="wd-button wd-button-mint" /></div>
    </dialog>
  </>;
}
