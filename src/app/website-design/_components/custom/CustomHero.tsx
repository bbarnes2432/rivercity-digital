import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import BookCallLink from "@/app/_components/BookCallLink";
import CallLink from "@/app/_components/CallLink";
import MotionToggle from "@/app/_components/showcase/MotionToggle";

/* Hero, custom look (Brandon's Nov 9, 2026 brief, page 5).
 * Dark, with real client builds drifting in three tilted columns behind the
 * headline and one teal river line that starts the page's thread. No light
 * streaks. The bottom fades into the paper background with no edge.
 * The wall is pure CSS and stops for reduced motion and the site-wide pause. */
const GALLERY = (id: string, name: string) => ({ src: `/assets/builds/gallery/${id}.webp`, name });

const COLUMNS = [
  [GALLERY("robinsons", "Robinson’s Contracting"), GALLERY("alwaysclean", "Always Clean"), GALLERY("linda", "Linda’s Specialty Cheesecakes"), GALLERY("boat", "St. Joseph Boat Rentals")],
  [GALLERY("upright", "Upright Appraisal"), GALLERY("saucefix", "The Sauce Fix"), GALLERY("mend", "Mend Health"), GALLERY("wellness", "The Wellness Collective")],
  [GALLERY("tomjannace", "Tom Jannace Roofing"), GALLERY("seth", "Seth Anthony"), GALLERY("alwaysclean", "Always Clean"), GALLERY("robinsons", "Robinson’s Contracting")],
];

export default function CustomHero({ city }: { city: string }) {
  return (
    <section className="cl-hero" aria-labelledby="hero-heading">
      <div className="cl-hero-wall" aria-hidden="true">
        <div className="cl-hero-columns">
          {COLUMNS.map((shots, column) => (
            <div className="cl-hero-column" data-direction={column % 2 ? "down" : "up"} key={column}>
              <div className="cl-hero-track">
                {[...shots, ...shots].map((shot, index) => (
                  <Image
                    key={`${shot.src}-${index}`}
                    className="cl-hero-shot"
                    src={shot.src}
                    width={560}
                    height={420}
                    alt=""
                    unoptimized
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={column === 0 && index === 0 ? "high" : "low"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cl-hero-scrim" aria-hidden="true" />
      <svg className="cl-hero-river" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cl-river-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3A9FAB" stopOpacity="0" />
            <stop offset=".18" stopColor="#3A9FAB" stopOpacity=".75" />
            <stop offset=".62" stopColor="#5BB9C4" />
            <stop offset="1" stopColor="#7FD3DC" />
          </linearGradient>
        </defs>
        <path className="cl-hero-river-glow" d="M-20 770 C 200 810, 420 735, 640 772 S 900 760, 1040 650 S 1250 470, 1320 580 S 1330 820, 1260 940" pathLength={1} />
        <path className="cl-hero-river-line" d="M-20 770 C 200 810, 420 735, 640 772 S 900 760, 1040 650 S 1250 470, 1320 580 S 1330 820, 1260 940" pathLength={1} />
      </svg>
      <div className="cl-container cl-hero-content">
        <p className="cl-eyebrow cl-eyebrow-light">Website design · Custom built</p>
        <h1 id="hero-heading" className="cl-heading">
          Custom website design.<span className="cl-second">Built around your business.</span>
        </h1>
        <p className="cl-hero-description">No templates and no page builders. Our family-owned team designs and builds your site from scratch, and you approve the design before we build a thing.</p>
        <div className="cl-actions">
          <BookCallLink context="website-design-hero" className="cl-button">Book a free call <ArrowRight size={17} aria-hidden="true" /></BookCallLink>
          <CallLink context="website-design-hero" className="cl-button cl-button-ghost" numberPrefix="Call " icon={false} />
        </div>
      </div>
      <div className="cl-container cl-hero-bottom">
        <span>Rooted in {city} · Working across the Midwest · A website you own</span>
        <span className="cl-hero-bottom-actions"><MotionToggle /><a href="#work">Explore the work <ArrowDown size={15} aria-hidden="true" /></a></span>
      </div>
    </section>
  );
}
