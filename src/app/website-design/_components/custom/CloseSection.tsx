"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import CallLink from "@/app/_components/CallLink";
import { EMAIL } from "@/app/_components/contact-info";
import { readAttribution } from "@/app/_components/attribution";
import { trackFunnel } from "../funnel";
import { useLeadSubmit } from "../MockupRequestForm";
import type { FunnelPage } from "@/lib/funnel-schema";

/* The close, custom look (Brandon's Nov 9, 2026 brief, pages 8 and 10).
 * Entered through the river wave. Visitors tap what their site needs and a
 * "What we'd include" list builds in the form card; the picks travel with the
 * form as a hidden field, along with the visit's GCLID and UTMs. This is the
 * only form on the page. Delivery, events and the conversion are the shared
 * project-form setup (useLeadSubmit), unchanged. No prices: the include list
 * names features only. */
const PICKS = [
  ["Online booking", "Online booking with reminders"],
  ["Online store", "An online store for your products"],
  ["Quote requests", "Quote request form with photo upload"],
  ["Customer login", "A login area for your customers"],
  ["Menu or catalog", "A menu or catalog you can update"],
  ["Photo gallery", "Project gallery you can update"],
  ["Multiple locations", "A page for each of your locations"],
  ["Not sure yet", "We’ll talk through the options on the call"],
] as const;

const ATTRIBUTION_FIELDS = ["gclid", "gbraid", "wbraid", "fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export default function CloseSection({ landingPath }: { landingPath: FunnelPage }) {
  const [picked, setPicked] = useState<string[]>([]);
  const { submit, status, error } = useLeadSubmit(landingPath);
  const form = useRef<HTMLFormElement>(null);

  // Copy the visit's click IDs and UTMs into hidden fields, so the form
  // carries them the same way the request body always has.
  useEffect(() => {
    const attribution = readAttribution();
    const fields = form.current?.elements;
    if (!fields) return;
    for (const key of ATTRIBUTION_FIELDS) {
      const input = fields.namedItem(key);
      if (input instanceof HTMLInputElement) input.value = attribution[key] ?? "";
    }
  }, []);

  const toggle = (label: string) => setPicked(current => current.includes(label) ? current.filter(item => item !== label) : [...current, label]);
  const included = PICKS.filter(([label]) => picked.includes(label));

  return (
    <section className="cl-close" id="final-request" aria-labelledby="contact-heading">
      <svg className="cl-close-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path className="cl-close-wave-fill" d="M0 0 H1440 V38 C1260 78 1080 92 900 72 C720 52 600 18 420 26 C250 34 120 70 0 62 Z" />
        <path className="cl-close-wave-line" d="M0 62 C120 70 250 34 420 26 C600 18 720 52 900 72 C1080 92 1260 78 1440 38" vectorEffect="non-scaling-stroke" />
      </svg>
      <div id="start" tabIndex={-1} className="cl-anchor" />
      <div className="cl-container cl-close-layout">
        <div className="cl-close-copy">
          <p className="cl-eyebrow cl-eyebrow-light">Your new website</p>
          <h2 id="contact-heading" className="cl-heading">Ready for a site built around your business?<span className="cl-second">Start with a free call.</span></h2>
          <p className="cl-close-intro" id="picker-label">Tap what your site needs, and we’ll come to the call already knowing where to start.</p>
          <div className="cl-chips" role="group" aria-labelledby="picker-label">
            {PICKS.map(([label]) => (
              <button type="button" key={label} className="cl-chip" aria-pressed={picked.includes(label)} onClick={() => toggle(label)}>{label}</button>
            ))}
          </div>
          <p className="cl-close-call"><span>Rather talk now?</span><CallLink context="website-design-contact" className="cl-close-number" icon={false} /></p>
        </div>
        <form
          ref={form}
          id="wd-mockup-form"
          className="cl-form"
          onSubmit={submit}
          onInput={() => trackFunnel("mockup_start", true)}
          onInvalid={() => trackFunnel("mockup_validation_error", true)}
          aria-busy={status === "submitting"}
          aria-labelledby="form-heading"
        >
          <h3 id="form-heading">Tell us about your business.</h3>
          <p className="cl-form-note">A real person replies, usually the same business day.</p>
          <div className="cl-include" aria-live="polite">
            <p className="cl-include-label">What we’d include</p>
            <p className="cl-include-list">{included.length ? included.map(([, line]) => line).join(" · ") : "Tap what your site needs and it’ll show up here."}</p>
          </div>
          <input type="hidden" name="service" value="New website" />
          <input type="hidden" name="source" value="Website design — project form" />
          <input type="hidden" name="picks" value={picked.join(", ")} />
          {ATTRIBUTION_FIELDS.map(key => <input type="hidden" name={key} key={key} defaultValue="" />)}
          {/* Spam trap: bots fill it, people never see it. */}
          <div className="wd-honeypot" aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}><label>Leave this empty<input type="text" name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="cl-form-row">
            <label className="cl-field"><span className="sr-only">Name (required)</span><input name="name" required autoComplete="name" maxLength={120} placeholder="Your name*" /></label>
            <label className="cl-field"><span className="sr-only">Email (required)</span><input type="email" name="email" required autoComplete="email" maxLength={254} placeholder="Email*" /></label>
          </div>
          <label className="cl-field"><span className="sr-only">Business name or website</span><input type="text" name="business" maxLength={200} placeholder="Business name or website" /></label>
          <label className="cl-field"><span className="sr-only">Anything else?</span><textarea name="message" maxLength={5000} rows={3} placeholder="Anything else we should know?" /></label>
          {status === "error" && <div className="cl-form-error" role="alert"><p>{error}</p><p><CallLink context="website-design-form-error" /> <a href={`mailto:${EMAIL}`}>Email us directly</a></p></div>}
          <button type="submit" className="cl-button cl-form-submit" disabled={status === "submitting"}>
            {status === "submitting" ? <>Sending <LoaderCircle size={17} className="wd-spinner" aria-hidden="true" /></> : <>Book a free call <ArrowRight size={17} aria-hidden="true" /></>}
          </button>
          <p className="cl-form-privacy">We’ll use your details to respond to your request. <Link href="/privacy-policy">Privacy policy</Link></p>
        </form>
      </div>
    </section>
  );
}
