"use client";

import Image from "next/image";
import { ArrowDown, ArrowRight, Check, Code2, Globe2, Search, Sparkles, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { LINDA_PROJECT as LINDA } from "./linda-project";
import styles from "./ChicagoStorySections.module.css";


/** The sketch is an illustration; the finished image is the existing client asset. */
function DesignReveal() {
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = preview.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || reducedMotion.matches || !("IntersectionObserver" in window)) return;

    element.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        element.dataset.reveal = "complete";
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    const showFinished = () => {
      if (reducedMotion.matches) {
        element.dataset.reveal = "complete";
        observer.disconnect();
      }
    };
    observer.observe(element);
    reducedMotion.addEventListener("change", showFinished);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", showFinished);
    };
  }, []);

  return <div className={styles.designReveal} ref={preview}>
    <div className={styles.browserBar} aria-hidden="true"><span className={styles.browserDots}><i /><i /><i /></span><span>{LINDA.domain}</span><span>Website preview</span></div>
    <div className={styles.revealCanvas}>
      <div className={styles.wireframe} aria-hidden="true"><div className={styles.wireNav}><i /><span /><span /><span /></div><div className={styles.wireHero}><div><i /><b /><b /><span /><span /><em /></div><div className={styles.wirePhoto}><span /></div></div><div className={styles.wireFooter}><i /><i /><i /></div></div>
      <Image className={styles.finishedDesign} src={LINDA.image} alt={LINDA.alt} width={LINDA.width} height={LINDA.height} sizes="(max-width: 700px) 86vw, (max-width: 1100px) 43vw, 420px" />
    </div>
    <div className={styles.designCaption}><span>From an idea</span><ArrowRight size={14} aria-hidden="true" /><strong>A design you can see</strong></div>
  </div>;
}

export type MockupJourneyProps = {
  /** Use only a verified, actual mobile capture. The default is an existing client asset. */
  mobileImage?: { src: string; alt: string; width: number; height: number; caption: string };
};

export function MockupJourney({ mobileImage = { src: "/assets/benefits/mend-mobile.png", alt: "Mend Health’s actual website shown at phone size, with treatment information and an appointment link", width: 375, height: 812, caption: "Mend Health · Actual mobile website" } }: MockupJourneyProps) {
  return <section className={styles.section} id="mockup-preview" aria-labelledby="chicago-journey-heading"><div className={styles.container}>
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>See it before you build it</p><h2 id="chicago-journey-heading">Your idea.<br />Your next website.</h2></div><p>Start with a free mockup. Make the decision to build when you know what you’re getting.</p></div>
    <ol className={styles.journey} id="process">
      <li className={styles.journeyStep}>
        <div className={styles.intakeStage}>
          <div className={styles.intakeSheet} role="group" aria-label="Illustrative project notes, not an interactive form"><div className={styles.sheetHeading}><span>Project notes</span><span>Illustration</span></div><p className={styles.sheetTitle}>A little about<br />your business.</p><dl><div><dt>Your business</dt><dd>A neighborhood bakery</dd></div><div><dt>What you have in mind</dt><dd>A place to show our flavors<br />and take cake requests.</dd></div></dl><div className={styles.noteLine}><span>Your ideas are the starting point.</span><ArrowDown size={16} aria-hidden="true" /></div></div>
          <span className={styles.pencilNote} aria-hidden="true">A good place to start.</span>
        </div>
        <div className={styles.stepCopy}><span className={styles.stepNumber}>01</span><div><h3>Tell us what you do.</h3><p>Share your business, your ideas, and what you want your website to help people do.</p></div></div>
      </li>
      <li className={`${styles.journeyStep} ${styles.designStep}`}>
        <div className={styles.designStage}><DesignReveal /><p className={styles.projectCredit}>{LINDA.name} · Actual client website</p></div>
        <div className={styles.stepCopy}><span className={styles.stepNumber}>02</span><div><h3>See your free mockup.</h3><p>Review a design direction. Get a written scope and price before you decide to build.</p></div></div>
      </li>
      <li className={styles.journeyStep}>
        <div className={styles.phoneStage}><div className={styles.phone}><div className={styles.phoneSpeaker} aria-hidden="true" /><Image src={mobileImage.src} alt={mobileImage.alt} width={mobileImage.width} height={mobileImage.height} sizes="(max-width: 700px) 160px, 145px" /></div><div className={styles.ownershipNote}><Code2 size={18} aria-hidden="true" /><span>Your website.<br /><strong>Yours to keep.</strong></span></div><p className={styles.mobileCredit}>{mobileImage.caption}</p></div>
        <div className={styles.stepCopy}><span className={styles.stepNumber}>03</span><div><h3>Launch a site you own.</h3><p>We build, check, and launch your approved site. Your code, domain, and access belong to you.</p></div></div>
      </li>
    </ol>
  </div></section>;
}

export function SearchVisibility() {
  return <section className={`${styles.section} ${styles.visibility}`} id="seo" aria-labelledby="chicago-visibility-heading"><div className={`${styles.container} ${styles.visibilityLayout}`}>
    <div className={styles.visibilityCopy}><h2 id="chicago-visibility-heading">Easy to find.<br />Easy to choose.</h2><p className={styles.visibilityIntro}>Your website helps people understand your business, wherever their search begins.</p><ol className={styles.visibilityPoints}>
      <li><span>01</span><div><h3>Be found.</h3><p>Clear service pages and search setup give your business a strong foundation.</p></div></li>
      <li><span>02</span><div><h3>Be chosen.</h3><p>Show your work. Explain your services. Give people a reason to get in touch.</p></div></li>
      <li><span>03</span><div><h3>Be easy to contact.</h3><p>Make the next step simple, from a phone or a computer.</p></div></li>
    </ol></div>
    <div className={styles.searchExamples}>
      <article className={styles.searchExample} aria-label="Illustrative search result for a fictional Chicago business"><div className={styles.exampleLabel}><span><Search size={15} aria-hidden="true" /> Search</span><span>Illustrative example</span></div><div className={styles.searchQuery}><Search size={15} aria-hidden="true" /><span>Chicago custom bakery</span></div><div className={styles.searchResult}><p className={styles.resultDomain}><Globe2 size={19} aria-hidden="true" /><span>Juniper Bakehouse<small>juniper-bakehouse.example</small></span></p><h3>Custom cakes, made for your occasion.</h3><p>A fictional Chicago bakery. Explore flavors, see past cakes, and tell us what you have in mind.</p><div className={styles.resultLinks}><span>Our flavors</span><span>Custom cakes</span><span>Get in touch</span></div></div></article>
      <article className={`${styles.searchExample} ${styles.aiExample}`} aria-label="Illustrative AI answer about a fictional Chicago business"><div className={styles.exampleLabel}><span><Sparkles size={15} aria-hidden="true" /> AI answer</span><span>Illustrative example</span></div><p className={styles.aiQuestion}>What should I look for when choosing a custom bakery in Chicago?</p><div className={styles.aiAnswer}><Sparkles size={20} aria-hidden="true" /><div><p>Look for examples of past cakes, a clear flavor menu, and a simple way to discuss your order.</p><div className={styles.aiSource}><Globe2 size={15} aria-hidden="true" /><span>Juniper Bakehouse <small>Fictional business</small></span><ArrowRight size={15} aria-hidden="true" /></div></div></div></article>
    </div>
  </div></section>;
}

const COMPARISON = [
  { label: "Design", ours: "Designed around your business.", template: "Your content fits a preset layout." },
  { label: "Ownership", ours: "Your code and domain, handed over.", template: "Portability depends on the platform." },
  { label: "Speed", ours: "Built and tested for your pages.", template: "Needs tuning for your content." },
];

export function CompactComparison() {
  return <section className={`${styles.section} ${styles.comparison}`} id="included" aria-labelledby="chicago-comparison-heading"><div className={styles.container}>
    <h2 className={styles.comparisonHeading} id="chicago-comparison-heading">A website shaped around you.</h2>
    <table className={styles.comparisonTable}><caption className={styles.srOnly}>A custom website project compared with an off-the-shelf template</caption><thead><tr><th scope="col">The difference</th><th scope="col">Custom website project</th><th scope="col">Off-the-shelf template</th></tr></thead><tbody>{COMPARISON.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td data-label="Custom website project"><div><Check size={19} aria-hidden="true" /><p>{row.ours}</p></div></td><td data-label="Off-the-shelf template"><div><X size={18} aria-hidden="true" /><p>{row.template}</p></div></td></tr>)}</tbody></table>
  </div></section>;
}

export type BeforeAfterSliderProps = {
  beforeSrc?: string | null;
  beforeAlt: string;
  afterSrc?: string | null;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  /** Match the supplied images; both remain contained so neither is cropped. */
  aspectRatio?: string;
};

/** Only render with genuine supplied before/after assets. Never infer a before. */
export function BeforeAfterSlider({ beforeSrc, beforeAlt, afterSrc, afterAlt, beforeLabel = "Before", afterLabel = "After", caption, aspectRatio = "16 / 10" }: BeforeAfterSliderProps) {
  const sliderId = useId();
  const [position, setPosition] = useState(50);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!beforeSrc?.trim() || !afterSrc?.trim() || failedSource === beforeSrc || failedSource === afterSrc) return null;

  return <figure className={styles.beforeAfter}>
    <div className={styles.comparisonViewport} style={{ "--compare-position": `${position}%`, aspectRatio } as CSSProperties}>
      <Image src={afterSrc} alt={afterAlt} fill sizes="(max-width: 800px) 90vw, 900px" className={styles.compareImage} onError={() => setFailedSource(afterSrc)} />
      <div className={styles.beforeLayer}><Image src={beforeSrc} alt={beforeAlt} fill sizes="(max-width: 800px) 90vw, 900px" className={styles.compareImage} onError={() => setFailedSource(beforeSrc)} /></div>
      <span className={styles.beforeLabel}>{beforeLabel}</span><span className={styles.afterLabel}>{afterLabel}</span><span className={styles.comparisonDivider} aria-hidden="true"><span>↔</span></span>
      <input className={styles.comparisonRange} id={sliderId} type="range" dir="ltr" min={0} max={100} step={1} value={position} onChange={event => setPosition(Number(event.target.value))} aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`} aria-describedby={`${sliderId}-help`} aria-valuetext={`${position}% ${beforeLabel.toLowerCase()}, ${100 - position}% ${afterLabel.toLowerCase()}`} />
    </div>
    <div className={styles.sliderControls}><label htmlFor={sliderId}>Drag the handle to compare</label><output htmlFor={sliderId}>{position}% {beforeLabel.toLowerCase()}</output></div>
    <p className={styles.srOnly} id={`${sliderId}-help`}>Use the arrow keys to adjust the comparison. Home shows {afterLabel.toLowerCase()}; End shows {beforeLabel.toLowerCase()}.</p>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}
