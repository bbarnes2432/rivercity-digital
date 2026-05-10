"use client";

import { useState } from "react";

type Props = {
  /** Where the form is mounted — passed to the API for tracking. */
  source: string;
  /** "compact" sits inline (footer); "full" stands alone (notes index). */
  layout?: "compact" | "full";
};

type Status = "idle" | "submitting" | "ok" | "error";

export default function NewsletterForm({ source, layout = "full" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      "bot-field": String(formData.get("bot-field") ?? ""),
      source,
    };

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data?.error ?? "Couldn't subscribe right now.");
        return;
      }
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Couldn't subscribe right now.");
    }
  }

  return (
    <form
      className={`rcd-newsletter rcd-newsletter--${layout}`}
      onSubmit={onSubmit}
      noValidate
    >
      <input
        type="text"
        name="bot-field"
        tabIndex={-1}
        autoComplete="off"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <label className="rcd-newsletter-row">
        <span className="rcd-newsletter-label">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting" || status === "ok"}
        />
      </label>
      <button
        type="submit"
        className="rcd-newsletter-btn"
        disabled={status === "submitting" || status === "ok"}
      >
        {status === "submitting" ? "Filing…" : status === "ok" ? "Filed ✓" : "Subscribe"}
      </button>
      {status === "ok" && (
        <p className="rcd-newsletter-msg rcd-newsletter-msg--ok" role="status">
          Filed. One email a month, no pitches.
        </p>
      )}
      {status === "error" && error && (
        <p className="rcd-newsletter-msg rcd-newsletter-msg--err" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
