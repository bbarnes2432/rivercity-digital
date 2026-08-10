"use client";

import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { LOOKING_FOR, EMAIL } from "../_data";
import { ATTRIBUTION_KEYS, useAttribution } from "./attribution";
import { markContactConversionPending, trackLeadEvent } from "../../_components/gtag";

type Status = "idle" | "submitting" | "error";

/* Five fields. Every extra one costs conversions, so there isn't a sixth.
 *
 * On success this navigates to a real /quad-cities/thank-you URL rather than
 * swapping in an inline success message. That isn't a preference: an inline
 * confirmation means no URL change, which means the conversion event never
 * fires, which means both ad platforms optimize blind. */
export default function QcForm({ variant = "hero" }: { variant?: "hero" | "closing" }) {
  const router = useRouter();
  const attribution = useAttribution();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const uid = useId();

  const field = (name: string) => `${uid}-${name}`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Something didn't go through.");
        setStatus("error");
        return;
      }

      trackLeadEvent("form_submit", {
        page: "/quad-cities",
        form: variant,
        service: String(fd.get("service") ?? ""),
        ...attribution,
      });

      // Status stays "submitting" through the navigation so the button doesn't
      // flicker back to its idle label mid-redirect.
      form.reset();
      markContactConversionPending();
      router.push("/quad-cities/thank-you");
    } catch {
      setErrorMsg("Network hiccup — try again, or just call us.");
      setStatus("error");
    }
  }

  return (
    <form className="qc-form" onSubmit={handleSubmit} noValidate>
      {/* Honeypot. Invisible, never focusable, never announced — no visible
          friction, which rules out a captcha here. */}
      <input
        type="text"
        name="bot-field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <input type="hidden" name="source" value={`quad-cities-${variant}`} />

      {/* Campaign attribution and click IDs, populated after hydration from
          the landing URL or from earlier in the session. Rendered as real
          hidden inputs so anything reading the raw form body sees them too. */}
      {ATTRIBUTION_KEYS.map((key) => (
        <input key={key} type="hidden" name={key} value={attribution[key] ?? ""} readOnly />
      ))}

      <div className="qc-form-grid">
        <div className="field">
          <label htmlFor={field("name")}>Name</label>
          <input
            id={field("name")}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
          />
        </div>

        <div className="field">
          <label htmlFor={field("business")}>Business name</label>
          <input
            id={field("business")}
            name="business"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your business"
          />
        </div>

        <div className="field">
          <label htmlFor={field("email")}>Email</label>
          <input
            id={field("email")}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@business.com"
          />
        </div>

        <div className="field">
          <label htmlFor={field("phone")}>Phone</label>
          <input
            id={field("phone")}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(563) 555-0134"
          />
        </div>

        <div className="field qc-form-wide">
          <label htmlFor={field("service")}>What are you looking for?</label>
          <select id={field("service")} name="service" required defaultValue="">
            <option value="" disabled>
              Pick one…
            </option>
            {LOOKING_FOR.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="qc-form-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send it over"}
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>

      <p className="qc-form-status" data-state={status} role="status" aria-live="polite">
        {status === "error" && (
          <>
            {errorMsg} You can also email{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> — that always works.
          </>
        )}
      </p>
    </form>
  );
}
