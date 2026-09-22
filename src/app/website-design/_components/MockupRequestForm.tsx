"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { captureAttribution, readAttribution } from "@/app/_components/attribution";
import { trackSuccessfulLead } from "@/app/_components/gtag";
import CallLink from "@/app/_components/CallLink";
import { EMAIL } from "@/app/_components/contact-info";
import { funnelContext, trackFunnel } from "./funnel";
import { CLIENT_REVIEW } from "./client-review";

export default function MockupRequestForm() {
  const router = useRouter();
  const submitting = useRef(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");
  useEffect(() => { captureAttribution(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    submitting.current = true;
    setStatus("submitting");
    setError("");
    trackFunnel("mockup_submit");
    const fields = new FormData(form);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(fields.entries()), ...readAttribution(), funnel: funnelContext() }),
        signal: controller.signal,
      });
      const data = await response.json() as { ok?: boolean; error?: string; dev?: boolean; ignored?: boolean; receiptId?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || "Your request couldn’t be sent. Please try again.");
      // Local previews never count as a real inquiry or store conversion identity.
      if (!data.dev && !data.ignored) {
        trackFunnel("mockup_accepted", false, data.receiptId);
        trackSuccessfulLead(
          { name: String(fields.get("name") || ""), email: String(fields.get("email") || ""), phone: String(fields.get("phone") || "") },
          { page: "/website-design", form: "website-design-mockup", service: "New website", ...(data.receiptId ? { transaction_id: data.receiptId } : {}) },
        );
      }
      router.push(`/website-design/thank-you${data.dev ? "?preview=1" : ""}`);
    } catch (cause) {
      trackFunnel("mockup_error");
      const timedOut = cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError");
      setError(timedOut ? "We couldn’t confirm delivery in time. Please call or email us before sending another request." : cause instanceof Error && cause.name !== "TypeError" && cause.name !== "SyntaxError" ? cause.message : "We couldn’t connect. Your details are still here—try again, or reach us directly.");
      setStatus("error");
      submitting.current = false;
    } finally {
      window.clearTimeout(timeout);
    }
  }
  return <form id="wd-mockup-form" className="wd-form rcd-light" onSubmit={submit} onInput={() => trackFunnel("mockup_start", true)} onInvalid={() => trackFunnel("mockup_validation_error", true)} aria-busy={status === "submitting"} aria-labelledby="mockup-form-heading">
    <div id="start" className="wd-form-heading" tabIndex={-1}><span className="wd-eyebrow">See your website’s potential</span><h2 id="mockup-form-heading">Request your free mockup.</h2><p>See what your website could look like. Tell us a little about your business to get started.</p><a className="wd-form-example-link" href="#mockup-preview">See what the mockup includes <ArrowUpRight size={13} /></a></div>
    <input type="hidden" name="service" value="New website" /><input type="hidden" name="source" value="Website design — free mockup" />
    <div className="wd-honeypot" aria-hidden="true"><label>Leave this empty<input type="text" name="bot-field" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="wd-field"><span>Your name <span aria-hidden="true">*</span></span><input name="name" required autoComplete="name" maxLength={120} placeholder="Alex Morgan" /></label>
    <label className="wd-field"><span>Email address <span aria-hidden="true">*</span></span><input type="email" name="email" required autoComplete="email" maxLength={254} placeholder="you@yourbusiness.com" /></label>
    <label className="wd-field"><span>Phone number <small>Optional</small></span><input type="tel" name="phone" autoComplete="tel" maxLength={40} placeholder="(314) 555-0123" /></label>
    <label className="wd-field"><span>Business name or current website <small>Optional</small></span><input type="text" name="business" maxLength={200} placeholder="Your business or yourbusiness.com" /></label>
    <details className="wd-form-details"><summary>Add your design ideas <span aria-hidden="true">+</span></summary><label className="wd-field"><span>What do you imagine for your website? <small>Optional</small></span><textarea name="message" maxLength={5000} rows={3} placeholder="A style you like, colors, websites that inspire you…" /></label><p className="wd-form-logo-note">You can share your logo when we follow up.</p></details>
    {status === "error" && <div className="wd-form-error" role="alert"><p>{error}</p><div><CallLink context="website-design-form-error" /> <a href={`mailto:${EMAIL}`}>Email us directly</a></div></div>}
    <button type="submit" className="wd-button wd-button-dark wd-form-submit" disabled={status === "submitting"}>{status === "submitting" ? <>Sending your request <LoaderCircle size={18} className="wd-spinner" /></> : <>Request my free mockup <ArrowUpRight size={19} /></>}</button>
    <p className="wd-form-assurance"><Check size={14} /> No payment details. No commitment.</p>
    <p className="wd-form-next"><strong>What happens next?</strong> We’ll get in touch about your ideas and logo, then prepare your free mockup.</p>
    <p className="wd-form-privacy">We’ll use your details to respond to your request. <Link href="/privacy-policy">Privacy policy</Link></p>
    <figure className="wd-form-proof"><blockquote>“{CLIENT_REVIEW.excerpt}”</blockquote><figcaption><strong>{CLIENT_REVIEW.author}</strong><span>{CLIENT_REVIEW.business}</span><a href={CLIENT_REVIEW.url} target="_blank" rel="noopener noreferrer">Read her Google review <ArrowUpRight size={12} /><span className="sr-only"> (opens in a new tab)</span></a></figcaption></figure>
  </form>;
}
