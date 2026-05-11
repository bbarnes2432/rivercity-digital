"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePopupTrigger } from "./usePopupTrigger";
import "./PopupForm.css";

type Step = "qualify" | "lead" | "curious" | "success-lead" | "success-curious";

const SOURCE_QUALIFIED = "popup-qualifier";
const SOURCE_CURIOUS = "popup-curious";

export default function PopupForm() {
  const { shouldOpen, dismiss, recordSubmit } = usePopupTrigger();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [step, setStep] = useState<Step>("qualify");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const autoCloseRef = useRef<number | null>(null);

  // Open the dialog when the trigger flips true.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (shouldOpen && !dlg.open) {
      try {
        dlg.showModal();
      } catch {
        // showModal throws if dialog already open; ignore.
      }
    }
  }, [shouldOpen]);

  // Wire native cancel (ESC) and close events to our dismiss handler.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;

    const onCancel = (e: Event) => {
      // Prevent default so we control the close path uniformly.
      e.preventDefault();
      handleClose("dismiss");
    };
    const onClick = (e: MouseEvent) => {
      // Click on the backdrop (target === dialog itself) closes.
      if (e.target === dlg) handleClose("dismiss");
    };

    dlg.addEventListener("cancel", onCancel);
    dlg.addEventListener("click", onClick);
    return () => {
      dlg.removeEventListener("cancel", onCancel);
      dlg.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (autoCloseRef.current) window.clearTimeout(autoCloseRef.current);
    };
  }, []);

  function handleClose(kind: "dismiss" | "submitted") {
    const dlg = dialogRef.current;
    if (dlg?.open) dlg.close();
    if (kind === "dismiss") dismiss();
    if (autoCloseRef.current) {
      window.clearTimeout(autoCloseRef.current);
      autoCloseRef.current = null;
    }
  }

  async function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);

    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      service: "Site audit",
      source: SOURCE_QUALIFIED,
      "bot-field": String(fd.get("bot-field") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Something didn't go through.");
        setSubmitting(false);
        return;
      }
      recordSubmit();
      setStep("success-lead");
      setSubmitting(false);
      autoCloseRef.current = window.setTimeout(() => handleClose("submitted"), 4000);
    } catch {
      setErrorMsg("Network hiccup — try again or email us directly.");
      setSubmitting(false);
    }
  }

  async function submitCurious(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);

    const fd = new FormData(form);
    const payload = {
      email: String(fd.get("email") ?? ""),
      source: SOURCE_CURIOUS,
      "bot-field": String(fd.get("bot-field") ?? ""),
    };

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Couldn't subscribe right now.");
        setSubmitting(false);
        return;
      }
      recordSubmit();
      setStep("success-curious");
      setSubmitting(false);
      autoCloseRef.current = window.setTimeout(() => handleClose("submitted"), 4000);
    } catch {
      setErrorMsg("Network hiccup — try again or email us directly.");
      setSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="rcd-popup"
      aria-labelledby="rcd-popup-title"
      aria-describedby="rcd-popup-body"
    >
      <div className="rcd-popup-card tex-dots">
        {/* Editorial brand signature — appears on every step for continuity */}
        <div className="rcd-popup-signature" aria-hidden="true">
          <span className="rcd-popup-monogram">RC</span>
          <span className="rcd-popup-sig-rule" />
          <span className="rcd-popup-sig-meta">St. Louis · MO</span>
        </div>

        <button
          type="button"
          className="rcd-popup-close"
          aria-label="Close"
          onClick={() => handleClose("dismiss")}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {step === "qualify" && (
          <div className="rcd-popup-step">
            <p className="t-eyebrow rcd-popup-eyebrow">Free site audit · No. 01</p>
            <h2 id="rcd-popup-title" className="rcd-popup-title">
              A quick read on what&apos;s helping &mdash; or hurting &mdash; your site.
            </h2>
            <p id="rcd-popup-body" className="rcd-popup-lede">
              A real St. Louis studio looks at your site by hand. No drip campaigns,
              no sales call &mdash; just a short report you can act on.
            </p>

            <ul className="list-check rcd-popup-list">
              <li>Speed &amp; Core Web Vitals scorecard</li>
              <li>SEO + AI-search visibility check</li>
              <li>Two or three concrete fixes, ranked</li>
            </ul>

            <div className="rcd-popup-choices">
              <button
                type="button"
                className="btn btn-primary btn-lg rcd-popup-cta"
                onClick={() => {
                  setErrorMsg(null);
                  setStep("lead");
                }}
              >
                Yes, send the audit
                <svg className="btn-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
              <button
                type="button"
                className="rcd-popup-decline"
                onClick={() => {
                  setErrorMsg(null);
                  setStep("curious");
                }}
              >
                Not yet &mdash; just send the monthly note
              </button>
            </div>
          </div>
        )}

        {step === "lead" && (
          <div className="rcd-popup-step">
            <p className="t-eyebrow rcd-popup-eyebrow">Send my audit · No. 02</p>
            <h2 id="rcd-popup-title" className="rcd-popup-title">
              Where should we send it?
            </h2>
            <p id="rcd-popup-body" className="rcd-popup-lede">
              We&apos;ll come back within a day with your audit, plus a few ideas to act on.
            </p>
            <form className="rcd-popup-form" onSubmit={submitLead} noValidate>
              <input
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div className="field">
                <label htmlFor="rcd-popup-name">Your name</label>
                <input id="rcd-popup-name" name="name" type="text" required placeholder="Your full name" autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="rcd-popup-email">Email</label>
                <input id="rcd-popup-email" name="email" type="email" required placeholder="you@company.com" autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="rcd-popup-message">Your site (or what you&apos;re working on)</label>
                <input id="rcd-popup-message" name="message" type="text" placeholder="yoursite.com &mdash; or a few words" />
              </div>
              <div className="rcd-popup-actions">
                <button
                  type="button"
                  className="rcd-popup-back"
                  onClick={() => {
                    setErrorMsg(null);
                    setStep("qualify");
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m19 12-14 0" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button type="submit" className="btn btn-primary btn-md rcd-popup-submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send the audit"}
                  {!submitting && (
                    <svg className="btn-arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
              {errorMsg && (
                <p className="rcd-popup-status rcd-popup-status--err" role="alert">
                  {errorMsg} You can also email{" "}
                  <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a>.
                </p>
              )}
            </form>
          </div>
        )}

        {step === "curious" && (
          <div className="rcd-popup-step">
            <p className="t-eyebrow rcd-popup-eyebrow">The studio note</p>
            <h2 id="rcd-popup-title" className="rcd-popup-title">
              One email a month. No pitches.
            </h2>
            <p id="rcd-popup-body" className="rcd-popup-lede">
              Field notes from a St. Louis web studio &mdash; what&apos;s changing
              in Google, AI search, and small-business marketing.
            </p>
            <form className="rcd-popup-form" onSubmit={submitCurious} noValidate>
              <input
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div className="field">
                <label htmlFor="rcd-popup-news-email">Email</label>
                <input id="rcd-popup-news-email" name="email" type="email" required placeholder="you@business.com" autoComplete="email" />
              </div>
              <div className="rcd-popup-actions">
                <button
                  type="button"
                  className="rcd-popup-back"
                  onClick={() => {
                    setErrorMsg(null);
                    setStep("qualify");
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m19 12-14 0" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button type="submit" className="btn btn-primary btn-md rcd-popup-submit" disabled={submitting}>
                  {submitting ? "Filing…" : "Sign me up"}
                </button>
              </div>
              {errorMsg && (
                <p className="rcd-popup-status rcd-popup-status--err" role="alert">
                  {errorMsg}
                </p>
              )}
            </form>
          </div>
        )}

        {step === "success-lead" && (
          <div className="rcd-popup-step rcd-popup-success" role="status" aria-live="polite">
            <div className="rcd-popup-success-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="t-eyebrow rcd-popup-eyebrow no-rule">Got it</p>
            <h2 id="rcd-popup-title" className="rcd-popup-title">
              Your audit&apos;s in the queue.
            </h2>
            <p id="rcd-popup-body" className="rcd-popup-lede">
              We&apos;ll send it within a day. &mdash; Jon and the team
            </p>
          </div>
        )}

        {step === "success-curious" && (
          <div className="rcd-popup-step rcd-popup-success" role="status" aria-live="polite">
            <div className="rcd-popup-success-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="t-eyebrow rcd-popup-eyebrow no-rule">Filed</p>
            <h2 id="rcd-popup-title" className="rcd-popup-title">
              You&apos;re on the list.
            </h2>
            <p id="rcd-popup-body" className="rcd-popup-lede">
              First note hits your inbox the first of the month.
            </p>
          </div>
        )}
      </div>
    </dialog>
  );
}
