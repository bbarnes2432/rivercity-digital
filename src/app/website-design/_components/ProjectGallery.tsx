"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Maximize2, X } from "lucide-react";
import { SELECTED_PROJECTS } from "./selected-projects";

export default function ProjectGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const project = selected === null ? null : SELECTED_PROJECTS[selected];

  useEffect(() => {
    if (selected === null) return;
    const modal = dialog.current;
    if (!modal) return;
    const overflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      if (modal.open) modal.close();
    };
  }, [selected]);

  const close = () => dialog.current?.close();

  return <section className="wd-section wd-work rcd-light" id="work" aria-labelledby="work-heading">
    <div className="wd-container">
      <div className="wd-section-heading" data-entrance="rise"><div><p className="wd-eyebrow">Selected client work</p><h2 id="work-heading">Different businesses.<br />Distinctive websites.</h2></div><p>See how the design and functionality fit each business. Open a larger preview here, or read the full case study.</p></div>
      <div className="wd-project-grid">{SELECTED_PROJECTS.map((item, index) => <article className={`wd-project-card wd-project-${item.id}`} key={item.id} data-entrance="card" data-entrance-delay={index}>
        <button type="button" className="wd-project-image wd-project-preview" onClick={() => setSelected(index)} aria-label={`Enlarge ${item.name} website preview`} aria-haspopup="dialog">
          <span className="wd-project-index">0{index + 1}</span><Image src={item.image} alt={item.alt} width={1440} height={798} sizes="(max-width: 760px) 90vw, 31vw" /><span className="wd-project-open" aria-hidden="true"><Maximize2 size={18} /></span>
        </button>
        <div className="wd-project-caption"><div><p className="wd-eyebrow">{item.category}</p><h3>{item.name}</h3></div></div>
        <p className="wd-project-description">{item.description}</p>
        <ul className="wd-project-scope">{item.details.map(detail => <li key={detail}><Check size={14} />{detail}</li>)}</ul>
        <Link href={item.caseStudy} className="wd-case-link" prefetch={false} aria-label={`Read ${item.name} case study`}>Read the case study <ArrowUpRight size={14} /></Link>
      </article>)}</div>
    </div>
    <dialog ref={dialog} className="wd-project-dialog" aria-labelledby="wd-preview-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {project && <div className="wd-preview-content">
        <div className="wd-preview-heading"><div><p className="wd-eyebrow">Website preview</p><h2 id="wd-preview-title">{project.name}</h2></div><button type="button" className="wd-preview-close" onClick={close} aria-label="Close website preview" autoFocus><X size={24} /></button></div>
        <div className={`wd-preview-image wd-project-${project.id}`}><Image src={project.image} alt={project.alt} width={1440} height={798} sizes="(max-width: 760px) 92vw, 1050px" /></div>
        <div className="wd-preview-actions"><p>{project.description}</p><a href="#start" className="wd-button wd-button-dark" onClick={close}>Get a free mockup <ArrowUpRight size={18} /></a></div>
      </div>}
    </dialog>
  </section>;
}
