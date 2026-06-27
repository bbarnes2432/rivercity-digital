"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  defaultService?: string;
};

export default function ContactForm({ defaultService = "" }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;

    // The website field is type="url", whose HTML5 validation rejects a bare
    // domain like "yoursite.com". Prepend https:// so people don't have to type
    // the protocol themselves before validation runs.
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
      // Keep the button disabled and redirect to the thank-you page, where
      // the Google Ads conversion fires. Status stays "submitting" so the UI
      // doesn't flicker back to idle during the navigation.
      form.reset();
      router.push("/thank-you");
    } catch {
      setErrorMsg("Network hiccup — try again or email us directly.");
      setStatus("error");
    }
  };

  return (
    <form name="contact" method="POST" className="rcd-contact-form" onSubmit={handleSubmit}>
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
        <label htmlFor="email">Where can we reach you?</label>
        <input type="email" id="email" name="email" required placeholder="you@company.com" autoComplete="email" />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input type="tel" id="phone" name="phone" placeholder="(314) 555-0100" autoComplete="tel" />
      </div>

      <div className="field">
        <label htmlFor="website">Got a current site? Drop the URL</label>
        <input type="url" id="website" name="website" placeholder="https://yoursite.com" autoComplete="url" />
      </div>

      <div className="field">
        <label htmlFor="service">What are we looking at?</label>
        <select id="service" name="service" required defaultValue={defaultService}>
          <option value="" disabled>Pick one…</option>
          <option>New website</option>
          <option>Website redesign</option>
          <option>Local SEO</option>
          <option>AI search visibility</option>
          <option>Google or Meta ads</option>
          <option>Ongoing support</option>
          <option>Something else</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Tell us about it</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="A few sentences is plenty. We'll come back with questions."
        />
      </div>

      <button type="submit" className="btn btn-primary btn-lg rcd-contact-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : status === "success" ? "Sent — we'll be in touch" : "Send →"}
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
