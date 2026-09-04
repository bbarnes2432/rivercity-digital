"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { captureAttribution, readAttribution } from "@/app/_components/attribution";
import {
  markContactConversionPending,
  markConversionIdentity,
  trackLeadEvent,
} from "@/app/_components/gtag";

/* The mockup request, in the hero.
 *
 * This page converted 87 ad clicks into 3 leads. The ask was never the
 * problem — a free mockup is a good offer — the distance to it was. The only
 * form lived at the very bottom, and on a phone that is seven screen heights
 * of hallway away. The hero's button scrolled there, which asks someone to
 * commit to a journey before they have committed to anything.
 *
 * So the ask moved to where the promise is made. Two required fields and one
 * optional: enough to reply, and nothing that makes a stranger stop and think.
 * What business they run and what they want is a better conversation than a
 * form field, and it happens on the callback.
 *
 * The long form at #start is still there for people who scroll and want to
 * explain themselves; the sticky bar and closing band still point at it. This
 * is the short path, not a replacement. */

type Status = "idle" | "submitting" | "error";

export default function HeroMockupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // The click ID is only on the landing URL, so grab it before any navigation
  // can strip it. Every lead from this visit then carries it.
  useEffect(() => {
    captureAttribution();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    const payload = { ...Object.fromEntries(fd.entries()), ...readAttribution() };

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
        page: "/website-design",
        form: "hero-mockup",
        service: String(fd.get("service") ?? ""),
      });
      // Identifiers for enhanced conversions, read before reset clears them.
      markConversionIdentity({
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        name: String(fd.get("name") ?? ""),
      });
      form.reset();
      markContactConversionPending();
      router.push("/thank-you");
    } catch {
      setErrorMsg("Network hiccup — try again, or just call us.");
      setStatus("error");
    }
  };

  return (
    <form className="rcd-hero-form" onSubmit={handleSubmit} noValidate={false}>
      {/* The API requires a service and uses source to tell the forms apart in
          the inbox; neither is worth a field here. */}
      <input type="hidden" name="service" value="New website" />
      <input type="hidden" name="source" value="Website design — hero mockup request" />
      {/* Honeypot: a bot fills it, a person never sees it. */}
      <p className="rcd-hero-form-hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="rcd-hero-form-row">
        <label className="rcd-hero-form-field">
          <span>Name</span>
          <input type="text" name="name" required placeholder="Your name" autoComplete="name" />
        </label>
        <label className="rcd-hero-form-field">
          <span>Email</span>
          <input type="email" name="email" required placeholder="you@business.com" autoComplete="email" />
        </label>
        <label className="rcd-hero-form-field">
          <span>Phone <em>optional</em></span>
          <input type="tel" name="phone" placeholder="(314) 555-0100" autoComplete="tel" />
        </label>
        <button type="submit" className="rcd-hero-form-btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Get my free mockup"}
        </button>
      </div>

      <p className="rcd-hero-form-note" role={status === "error" ? "alert" : undefined}>
        {status === "error"
          ? `${errorMsg || "Something didn't go through."} Try again, or call us.`
          : "Free, no obligation. We reply the same day most days."}
      </p>
    </form>
  );
}
