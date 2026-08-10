import Image from "next/image";
import type { WorkSample } from "../_data";

/* A work sample in a browser frame.
 *
 * Screenshot, never a live outbound link — sending paid traffic off this page
 * to a third-party site is a leak we're paying for. The domain in the chrome
 * is the canonical live one from _data.ts; a *.amplifyapp.com staging URL
 * showing up here would read as unfinished work.
 *
 * Every shot is lazy: the whole section sits below the fold and none of it is
 * allowed to compete with the hero for LCP. */
export default function SampleFrame({ sample }: { sample: WorkSample }) {
  return (
    <figure className="qc-sample">
      <div className="qc-sample-frame">
        <div className="qc-sample-chrome" aria-hidden="true">
          <span className="qc-sample-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="qc-sample-url">{sample.domain}</span>
        </div>
        <div className="qc-sample-shot">
          <Image
            src={sample.img}
            alt={sample.alt}
            width={1440}
            height={798}
            loading="lazy"
            sizes="(min-width: 900px) 560px, 92vw"
          />
        </div>
      </div>

      <figcaption className="qc-sample-caption">
        <h3 className="qc-sample-name">{sample.name}</h3>
        <p className="qc-sample-what">{sample.what}</p>
        <p className="qc-sample-credit">{sample.attribution}</p>
      </figcaption>
    </figure>
  );
}
