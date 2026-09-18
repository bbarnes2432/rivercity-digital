import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CLIENT_REVIEW } from "./client-review";
import MockupExample from "./MockupExample";

export default function ClientProof() {
  return <section className="wd-client-proof rcd-light" aria-label="A client’s experience and your free mockup">
    <div className="wd-container">
      <figure className="wd-proof-grid">
        <div>
          <p className="wd-eyebrow">A client’s experience</p>
          <blockquote>They aren&apos;t just building me a website—they&apos;re helping me build a brand.</blockquote>
        </div>
        <figcaption>
          <div className="wd-proof-person">
            <span className="wd-review-avatar" aria-hidden="true">AP</span>
            <div><strong>Angelita Pritchett</strong><span>The Wellness Collective · Google review</span></div>
          </div>
          <Link href="/work/the-wellness-collective" className="wd-case-link" prefetch={false}>View the Wellness Collective project <ArrowUpRight size={15} /></Link>
          <a href={CLIENT_REVIEW.url} className="wd-review-source" target="_blank" rel="noopener noreferrer">Read the original Google review <ArrowUpRight size={13} /><span className="sr-only"> (opens in a new tab)</span></a>
        </figcaption>
      </figure>
      <MockupExample />
    </div>
  </section>;
}
