"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2, Pause, Play, X } from "lucide-react";
import { SELECTED_PROJECTS, type SelectedProject } from "../website-design/_components/selected-projects";
import LiveProjectPreview from "../website-design/_components/LiveProjectPreview";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { LINDA_PROJECT } from "./linda-project";

type ChicagoProject = SelectedProject & { scrollPreview?: boolean };
const original = (id: string) => SELECTED_PROJECTS.find(project => project.id === id)!;
const PROJECTS: ChicagoProject[] = [
  {...original("stjoseph"),image:"/assets/chicago/portfolio/stjoseph-desktop.webp",width:1250,height:1780,scrollPreview:true},
  {id:"robinsons",effect:"static",scrollPreview:true,name:"Robinson’s Contracting",category:"Roofing & exteriors · Custom website",image:"/assets/chicago/portfolio/robinsons-desktop.webp",width:1424,height:2160,alt:"Robinson’s Contracting roofing and exteriors website with photographs of its work",website:"",domain:"Robinson’s Contracting",headline:"Real work. A name you can put to it.",description:"Roofing, repairs and exterior transformations, with real project photography and direct contact with the owner.",details:["Service pages","Before & after project work","Direct owner contact"]},
  {...LINDA_PROJECT, image:"/assets/chicago/portfolio/lindas-desktop.webp", width:1424, height:2160, scrollPreview:true},
  original("wellness"),
  {id:"saucefix",effect:"static",scrollPreview:true,name:"The Sauce Fix",category:"Food & drink · Custom website",image:"/assets/chicago/portfolio/saucefix-desktop.webp",width:1250,height:1424,alt:"The Sauce Fix website with bold typography and its small-batch hot sauces",website:"https://thesaucefix.com/",domain:"thesaucefix.com",headline:"A small-batch brand with a big personality.",description:"A distinctive home for Iowa-made sauces, with the product range, recipes and the story behind the brand.",details:["Product collection","Recipes & brand story","Batch-list signup"]},
  {id:"alwaysclean",effect:"static",scrollPreview:true,name:"Always Clean",category:"Cleaning services · Custom website",image:"/assets/chicago/portfolio/always-clean-desktop.webp",width:1424,height:2160,alt:"Always Clean website with clear interior and exterior cleaning services",website:"https://www.alwaysclean.biz/",domain:"alwaysclean.biz",headline:"One local crew. A clear path to a quote.",description:"Commercial and residential services, local coverage and a straightforward way to request a quote.",details:["Service-specific pages","Local service areas","Quote requests"]},
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
  const [selected, setSelected] = useState<ChicagoProject | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected) return;
    const element = dialog.current;
    if (!element) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; if (element.open) element.close(); trigger?.focus({ preventScroll: true }); };
  }, [selected]);
  const motionButton = <button className="ch-preview-control" type="button" disabled={reduced} onClick={() => setPaused(value => !value)} aria-pressed={paused || reduced}>
    {paused || reduced ? <Play size={14} /> : <Pause size={14} />}{reduced ? "Reduced motion" : paused ? "Play previews" : "Pause previews"}
  </button>;
  const projectCard = (item: ChicagoProject) => <article className={`ch-featured-project ch-project-${item.id}`} key={item.id} aria-labelledby={`featured-${item.id}`}>
    <div className="ch-project-stage">
      <div className="ch-project-browser">
        <div className="ch-project-browserbar"><span aria-hidden="true">● ● ●</span><span>{item.name}</span></div>
        <ProjectPreview project={item} paused={paused || reduced || !!selected} sizes="(max-width: 700px) 90vw, 31vw" />
        <button className="ch-enlarge" type="button" onClick={() => setSelected(item)} aria-haspopup="dialog" aria-label={`View larger: ${item.name}`}><Maximize2 size={15} aria-hidden="true" /> View larger</button>
      </div>
    </div>
    <div className="ch-featured-copy">
      <p className="ch-kicker">{item.category}</p>
      <h3 id={`featured-${item.id}`}>{item.name}</h3>
      {item.id === "stjoseph" ? <dl className="ch-project-story">
        <div><dt>The job</dt><dd>Help guests find the right boat rental and book online.</dd></div>
        <div><dt>The build</dt><dd>A custom website with rental options, charter details and self-serve booking.</dd></div>
        <div><dt>What guests can do</dt><dd>Explore hourly and multi-day rentals, then book without picking up the phone.</dd></div>
      </dl> : <p>{item.description}</p>}
      {item.website ? <a className="ch-visit-project" href={item.website} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a> : <span className="ch-preview-only">Website preview</span>}
    </div>
  </article>;
  return <section className="wd-section ch-work rcd-light" id="work" aria-labelledby="work-heading">
    <div className="wd-container">
      <div className="ch-section-heading" data-entrance="rise"><h2 id="work-heading">Different businesses.<br />Distinctly their own.</h2><p>Six businesses. Six custom websites.<br />Take a closer look at any design.</p></div>
      <div className="ch-gallery-toolbar"><span>Six examples of our work</span>{motionButton}</div>
      <div className="ch-featured-projects">{PROJECTS.map(projectCard)}</div>
    </div>
    <dialog ref={dialog} className="wd-project-dialog ch-project-dialog" aria-labelledby="ch-expanded-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {selected && <><div className="wd-preview-heading"><h2 id="ch-expanded-title">{selected.name}</h2><button type="button" className="wd-preview-close" aria-label="Close website preview" onClick={() => dialog.current?.close()} autoFocus><X size={22} /></button></div><div className="wd-preview-image"><ProjectPreview key={selected.id} project={selected} paused={paused || reduced} sizes="(max-width: 900px) 90vw, 1000px" /></div><div className="ch-dialog-controls">{motionButton}</div></>}
    </dialog>
  </section>;
}
