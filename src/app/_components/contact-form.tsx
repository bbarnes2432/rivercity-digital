"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { readAttribution } from "./attribution";
import { markContactConversionPending, markConversionIdentity, trackLeadEvent } from "./gtag";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  defaultService?: string;
  variant?: "contact" | "website-mockup";
};

export default function ContactForm({ defaultService = "", variant = "contact" }: Props) {
  const isMockup = variant === "website-mockup";
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;

    // The website field is a plain text input (not type="url") so the browser
    // never blocks a bare domain like "yoursite.com" with "please enter a valid
    // URL". We still normalize it to a real URL by prepending https:// before
    // it's sent, so people don't have to type the protocol themselves.
    const websiteEl = form.elements.namedItem("website") as HTMLInputElement | null;
    if (websiteEl) {
      const value = websiteEl.value.trim();
      if (value && !/^https?:\/\//i.test(value)) {
        websiteEl.value = `https://${value}`;
      }
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("submitting");
    setErrorMsg(null);

    const fd = new FormData(form);
    // Whatever campaign brought them, captured on arrival by the hero form and
    // carried through the visit. It is what makes importing a closed deal back
    // to Google as an offline conversion possible later.
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
        page: window.location.pathname,
        form: "contact",
        service: String(fd.get("service") ?? ""),
      });

      // Keep the button disabled and redirect to the thank-you page, where
      // the Google Ads conversion fires. Status stays "submitting" so the UI
      // doesn't flicker back to idle during the navigation.
      // Read the identifiers off the payload before reset() clears the form.
      // They enhance the conversion on /thank-you and are dropped immediately
      // after it fires.
      markConversionIdentity({
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        name: String(fd.get("name") ?? ""),
      });
      form.reset();
      markContactConversionPending();
      router.push("/thank-you");
    } catch {
      setErrorMsg("Network hiccup — try again or email us directly.");
      setStatus("error");
    }
  };

  return (
    <form name="contact" method="POST" className="rcd-contact-form" onSubmit={handleSubmit}>
      {isMockup && <input type="hidden" name="source" value="Website design — free mockup request" />}
      {/* Honeypot */}
      <input
        type="text"
        name="bot-field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" name="name" required placeholder="Your full name" autoComplete="name" />
      </div>

      <div className="field">
        <label htmlFor="email">{isMockup ? "Email address" : "Where can we reach you?"}</label>
        <input type="email" id="email" name="email" required placeholder="you@company.com" autoComplete="email" />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input type="tel" id="phone" name="phone" placeholder="(314) 555-0100" autoComplete="tel" />
      </div>

      <div className="field">
        <label htmlFor="website">{isMockup ? "Current website (optional)" : "Got a current site? Drop the URL"}</label>
        <input type="text" inputMode="url" id="website" name="website" placeholder="yoursite.com" autoComplete="url" />
      </div>

      <div className="field">
        <label htmlFor="service">{isMockup ? "What do you need?" : "What are we looking at?"}</label>
        <select id="service" name="service" required defaultValue={defaultService}>
          <option value="" disabled>Pick one…</option>
          <option>New website</option>
          <option>Website redesign</option>
          {isMockup && (
            <>
              <option>Landing page</option>
              <option>Custom backend or CRM</option>
              <option>Complete business platform</option>
            </>
          )}
          <option>Local SEO</option>
          <option>AI search visibility</option>
          <option>Google or Meta ads</option>
          <option>Ongoing support</option>
          <option>Something else</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">{isMockup ? "Tell us about your business" : "Tell us about it"}</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder={isMockup ? "Your business name, what you need built, and any tools or manual tasks you'd like to replace. A few sentences is enough." : "A few sentences is plenty. We'll come back with questions."}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg rcd-contact-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : status === "success" ? "Sent — we'll be in touch" : isMockup ? "Request my free mockup →" : "Send →"}
      </button>

      <p
        className="rcd-contact-status"
        data-state={status}
        aria-live="polite"
      >
        {status === "success" && (
          <>Got it. We&apos;ll be in touch within a day. Usually same day.<br />— Jon and the team</>
        )}
        {status === "error" && (
          <>{errorMsg || "Something didn't go through."} Try again, or email{" "}
            <a href="mailto:hello@rivercitydigitalco.com">hello@rivercitydigitalco.com</a> — that always works.
          </>
        )}
      </p>
    </form>
  );
}
