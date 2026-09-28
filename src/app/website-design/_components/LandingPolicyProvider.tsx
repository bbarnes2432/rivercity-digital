"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { PRIVACY_SECTIONS } from "@/app/_components/privacy-policy-content";
import { TERMS_SECTIONS } from "@/app/_components/terms-of-use-content";

type Policy = "privacy" | "terms";
const PolicyContext = createContext<((policy: Policy) => void) | null>(null);

export function PolicyButton({ policy, children }: { policy: Policy; children: ReactNode }) {
  const open = useContext(PolicyContext);
  return <button type="button" className="wd-policy-link" onClick={() => open?.(policy)} aria-haspopup="dialog">{children}</button>;
}

export default function LandingPolicyProvider({ children }: { children: ReactNode }) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!policy) return;
    const modal = dialog.current;
    if (!modal) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (modal.open) modal.close();
      document.body.style.overflow = overflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [policy]);
  const sections = policy === "terms" ? TERMS_SECTIONS : PRIVACY_SECTIONS;
  return <PolicyContext.Provider value={setPolicy}>
    {children}
    <dialog className="wd-policy-dialog rcd-light" ref={dialog} aria-labelledby="wd-policy-title" onClose={() => setPolicy(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {policy && <div className="wd-policy-document">
        <header><div><p className="wd-eyebrow">River City Digital Co.</p><h2 id="wd-policy-title">{policy === "privacy" ? "Privacy policy" : "Terms of use"}</h2><p>Updated {policy === "privacy" ? "September 18, 2026" : "May 9, 2026"}</p></div><button type="button" className="wd-preview-close" onClick={() => dialog.current?.close()} aria-label="Close policy" autoFocus><X size={24} /></button></header>
        <div className="wd-policy-body">{sections.map(section => <section id={section.id} key={section.id}><h3>{section.heading}</h3>{section.body}</section>)}</div>
        <button type="button" className="wd-button wd-button-dark" onClick={() => dialog.current?.close()}>Back to the page</button>
      </div>}
    </dialog>
  </PolicyContext.Provider>;
}
