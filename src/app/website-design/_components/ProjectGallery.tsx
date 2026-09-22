"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, ExternalLink, Maximize2, Pause, Play, X } from "lucide-react";
import LiveProjectPreview from "./LiveProjectPreview";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { SELECTED_PROJECTS } from "./selected-projects";

export default function ProjectGallery() {
  const [manualPause, setManualPause] = useState(false);
  const reduced = useReducedMotion();
  const paused = reduced || manualPause;
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const project = selected === null ? null : SELECTED_PROJECTS[selected];

  useEffect(() => {
    if (selected === null) return;
    const modal = dialog.current;
    if (!modal) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (modal.open) modal.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [selected]);

  const close = () => dialog.current?.close();

  return <section className="wd-section wd-work wd-work-showcase rcd-light" id="work" aria-labelledby="work-heading">
    <div className="wd-container">
      <div className="wd-section-heading" data-entrance="rise">
        <div><p className="wd-eyebrow">Selected client work</p><h2 id="work-heading">Different businesses.<br />Distinctive websites.</h2></div>
        <p>See websites we’ve built, with their original hero animations playing here. You can also open the full sites.</p>
      </div>
      <div className="wd-preview-controls"><span>Move over a preview to explore the effect.</span><button type="button" onClick={() => setManualPause(value => !value)} disabled={reduced} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}{reduced ? "Reduced motion" : paused ? "Play previews" : "Pause previews"}</button></div>
      <div className="wd-showcase-grid">{SELECTED_PROJECTS.map((item, index) => <article className={`wd-showcase-card wd-showcase-${item.id}`} key={item.id} data-entrance="card">
        <div className="wd-showcase-stage">
          <div className="wd-showcase-screen">
            <span className="wd-browser-bar" aria-hidden="true"><span className="wd-browser-dots"><i /><i /><i /></span><span>{item.domain}</span><Maximize2 size={13} /></span>
            <LiveProjectPreview project={item} paused={paused || selected !== null} sizes="(max-width: 760px) 90vw, 700px" />
            <button type="button" className="wd-screen-hint" onClick={() => setSelected(index)} aria-label={`Enlarge ${item.name} website preview`} aria-haspopup="dialog"><Maximize2 size={14} /> Enlarge preview</button>
          </div>
          <div className="wd-showcase-stage-caption"><span>0{index + 1} / Selected work</span><span>Custom design & development</span></div>
        </div>
        <div className="wd-showcase-copy">
          <p className="wd-eyebrow">{item.category}</p>
          <h3>{item.name}</h3>
          <p className="wd-showcase-headline">{item.headline}</p>
          <p className="wd-showcase-description">{item.description}</p>
          <ul className="wd-showcase-details">{item.details.map(detail => <li key={detail}><Check size={14} />{detail}</li>)}</ul>
          <div className="wd-showcase-actions">
            <button type="button" className="wd-button wd-button-dark" onClick={() => setSelected(index)} aria-haspopup="dialog" aria-label={`Explore ${item.name} preview`}><Maximize2 size={15} /> Explore preview</button>
            <a href={item.website} target="_blank" rel="noopener noreferrer" className="wd-showcase-external" aria-label={`Visit ${item.name} live website (opens in a new tab)`}>Visit live website <ExternalLink size={14} /></a>
          </div>
          {item.caseStudy && <Link href={item.caseStudy} className="wd-showcase-case" prefetch={false} aria-label={`Read ${item.name} case study`}>Explore the project <ArrowUpRight size={14} /></Link>}
        </div>
      </article>)}</div>
    </div>
    <dialog ref={dialog} className="wd-project-dialog wd-showcase-dialog rcd-light" aria-labelledby="wd-preview-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {project && <div className="wd-preview-content">
        <div className="wd-preview-heading"><div><p className="wd-eyebrow">Explore our work</p><h2 id="wd-preview-title">{project.name}</h2></div><button type="button" className="wd-preview-close" onClick={close} aria-label="Close website preview" autoFocus><X size={24} /></button></div>
        <div className="wd-preview-toolbar"><p>Live hero preview. Open the full site to explore its pages.</p><a href={project.website} target="_blank" rel="noopener noreferrer">Visit live website <ExternalLink size={14} /><span className="sr-only"> in a new tab</span></a></div>
        <div className="wd-preview-image"><LiveProjectPreview project={project} paused={paused} sizes="(max-width: 760px) 92vw, 1050px" /></div>
        <div className="wd-preview-actions"><button type="button" className="wd-button wd-button-dark" disabled={reduced} onClick={() => setManualPause(value => !value)} aria-pressed={paused}>{reduced ? "Reduced motion" : paused ? "Play previews" : "Pause previews"}</button></div>
      </div>}
    </dialog>
  </section>;
}
