"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2, Pause, Play, X } from "lucide-react";
import { SELECTED_PROJECTS, type SelectedProject } from "../website-design/_components/selected-projects";
import LiveProjectPreview from "../website-design/_components/LiveProjectPreview";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { LINDA_PROJECT } from "./linda-project";

type ChicagoProject = SelectedProject & { scrollPreview?: boolean };
const original = (id: string) => SELECTED_PROJECTS.find(project => project.id === id)!;
const PROJECTS: ChicagoProject[] = [
  {...LINDA_PROJECT, image:"/assets/chicago/portfolio/lindas-desktop.webp", width:1424, height:2160, scrollPreview:true},
  original("wellness"),
  {...original("stjoseph"),image:"/assets/chicago/portfolio/stjoseph-desktop.webp",width:1250,height:1780,scrollPreview:true},
  {id:"saucefix",effect:"static",scrollPreview:true,name:"The Sauce Fix",category:"Food & drink · Custom website",image:"/assets/chicago/portfolio/saucefix-desktop.webp",width:1250,height:1424,alt:"The Sauce Fix website with bold typography and its small-batch hot sauces",website:"https://thesaucefix.com/",domain:"thesaucefix.com",headline:"A small-batch brand with a big personality.",description:"A distinctive home for Iowa-made sauces, with the product range, recipes and the story behind the brand.",details:["Product collection","Recipes & brand story","Batch-list signup"]},
  {id:"alwaysclean",effect:"static",scrollPreview:true,name:"Always Clean",category:"Cleaning services · Custom website",image:"/assets/chicago/portfolio/always-clean-desktop.webp",width:1424,height:2160,alt:"Always Clean website with clear interior and exterior cleaning services",website:"https://www.alwaysclean.biz/",domain:"alwaysclean.biz",headline:"One local crew. A clear path to a quote.",description:"Commercial and residential services, local coverage and a straightforward way to request a quote.",details:["Service-specific pages","Local service areas","Quote requests"]},
  {id:"robinsons",effect:"static",scrollPreview:true,name:"Robinson’s Contracting",category:"Roofing & exteriors · Custom website",image:"/assets/chicago/portfolio/robinsons-desktop.webp",width:1424,height:2160,alt:"Robinson’s Contracting roofing and exteriors website with photographs of its work",website:"",domain:"Robinson’s Contracting",headline:"Real work. A name you can put to it.",description:"Roofing, repairs and exterior transformations, with real project photography and direct contact with the owner.",details:["Service pages","Before & after project work","Direct owner contact"]},
];

function ProjectPreview({ project, paused, sizes }: {project:ChicagoProject;paused:boolean;sizes:string}) {
  const frame = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!frame.current || !project.scrollPreview) return;
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), {threshold:.25});
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, [project.scrollPreview]);
  if (!project.scrollPreview) return <LiveProjectPreview project={project} paused={paused} sizes={sizes} />;
  return <div ref={frame} className="ch-scroll-preview" data-scrolling={visible && !paused}><Image src={project.image} alt={project.alt} width={project.width} height={project.height} sizes={sizes} loading="lazy" /></div>;
}

export default function ChicagoProjectGallery() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const project = PROJECTS[selected];
  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    if (!element) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; if (element.open) element.close(); trigger?.focus({ preventScroll: true }); };
  }, [expanded]);
  const keydown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % PROJECTS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + PROJECTS.length - 1) % PROJECTS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = PROJECTS.length - 1;
    else return;
    event.preventDefault(); setSelected(next);
    const nextTab = tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    nextTab?.focus({ preventScroll: true });
    nextTab?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  };
  const animated = project.effect !== "static" || project.scrollPreview;
  const motionButton = <button className="ch-preview-control" type="button" disabled={reduced || !animated} onClick={() => setPaused(value => !value)} aria-pressed={paused || reduced}>
    {paused || reduced ? <Play size={14} /> : <Pause size={14} />}{reduced ? "Reduced motion" : !animated ? "Homepage preview" : paused ? "Play preview" : "Pause preview"}
  </button>;
  return <section className="wd-section ch-work rcd-light" id="work" aria-labelledby="work-heading">
    <div className="wd-container">
      <div className="ch-section-heading" data-entrance="rise"><h2 id="work-heading">Different businesses.<br />Distinctly their own.</h2><p>A few of the websites we’ve helped bring to life. Choose one to take a closer look.</p></div>
      <div className="ch-project-tabs" role="tablist" aria-label="Explore our website projects" ref={tabs}>
        {PROJECTS.map((item, index) => <button key={item.id} type="button" role="tab" id={`project-tab-${item.id}`} aria-controls={`project-panel-${item.id}`} aria-selected={index === selected} tabIndex={index === selected ? 0 : -1} onKeyDown={event => keydown(event, index)} onClick={() => setSelected(index)}><span>{item.name}</span><ArrowUpRight size={17} /></button>)}
      </div>
      {PROJECTS.map((item, index) => <div key={item.id} id={`project-panel-${item.id}`} role="tabpanel" aria-labelledby={`project-tab-${item.id}`} hidden={index !== selected} tabIndex={0} className="ch-project-panel">
        {index === selected && <>
          <div className={`ch-project-stage ch-project-${item.id}`}>
            <div className="ch-project-browser"><div className="ch-project-browserbar"><span>{item.domain}</span><span>Website preview</span></div>
              <ProjectPreview key={item.id} project={item} paused={paused || reduced || expanded} sizes="(max-width: 900px) 90vw, 760px" />
              <button className="ch-enlarge" type="button" onClick={() => setExpanded(true)} aria-haspopup="dialog" aria-label={`Enlarge ${item.name} website preview`}><Maximize2 size={16} /> Enlarge</button>
            </div>
          </div>
          <div className="ch-project-copy"><p className="ch-kicker">{item.category}</p><h3>{item.headline}</h3><p>{item.description}</p><ul>{item.details.map(detail => <li key={detail}>{detail}</li>)}</ul><div className="ch-project-controls">{motionButton}<span>{String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span></div>{item.website && <a className="ch-visit-project" href={item.website} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}</div>
        </>}
      </div>)}
    </div>
    <dialog ref={dialog} className="wd-project-dialog ch-project-dialog" aria-labelledby="ch-expanded-title" onClose={() => setExpanded(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {expanded && <><div className="wd-preview-heading"><h2 id="ch-expanded-title">{project.name}</h2><button type="button" className="wd-preview-close" aria-label="Close website preview" onClick={() => dialog.current?.close()} autoFocus><X size={22} /></button></div><div className="wd-preview-image"><ProjectPreview key={project.id} project={project} paused={paused || reduced} sizes="(max-width: 900px) 90vw, 1000px" /></div><div className="ch-dialog-controls">{motionButton}</div></>}
    </dialog>
  </section>;
}
