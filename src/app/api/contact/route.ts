import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { parseFunnelContext } from "@/lib/funnel-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  business?: string;
  service?: string;
  message?: string;
  source?: string;
  "bot-field"?: string;
  funnel?: unknown;
} & Partial<Record<AttributionKey, string>>;

// Campaign attribution carried by the site's lead forms. The click IDs
// matter most: they're what lets a closed deal be imported back into Google and
// Meta as an offline conversion later, so the platforms optimize toward leads
// that sign rather than leads that fill out forms.
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;
type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (trim(body["bot-field"])) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const name = trim(body.name);
  const email = trim(body.email);
  const message = trim(body.message);
  const phone = trim(body.phone);
  const website = trim(body.website);
  const business = trim(body.business);
  const service = trim(body.service);
  const source = trim(body.source).slice(0, 80);
  const receiptId = randomUUID();
  const funnel = parseFunnelContext(body.funnel);
  const receipt = (event: string, detail: Record<string, string | number> = {}) => {
    // No names, email, telephone, message, URLs or advertising click IDs.
    try { console.info(JSON.stringify({ kind: "rcd_delivery", source: "server", at: new Date().toISOString(), receiptId, event, ...(funnel || {}), ...detail })); } catch { /* Logging must never interrupt delivery. */ }
  };

  const attribution = ATTRIBUTION_KEYS.map((key) => [key, trim(body[key]).slice(0, 300)] as const)
    .filter(([, value]) => value.length > 0);

  if (!name || !email || !service) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and service are required." },
      { status: 400 },
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }
  if (name.length > 120 || email.length > 254 || phone.length > 40 || website.length > 500 || business.length > 200 || service.length > 120) {
    return NextResponse.json({ ok: false, error: "One of the fields is too long. Please shorten it and try again." }, { status: 400 });
  }
  if (/[\r\n]/.test(name + email + business + service + source)) {
    return NextResponse.json({ ok: false, error: "Please use a single line for your contact details." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_TO_EMAIL || "hello@rivercitydigitalco.com";
  const fromAddress = process.env.CONTACT_FROM_EMAIL || "River City Digital <noreply@rivercitydigitalco.com>";

  const subject = `New inquiry — ${service} (${business || name})${source ? ` [${source}]` : ""}`;
  const text = [
    `New inquiry from ${name} <${email}>`,
    business && `Business: ${business}`,
    phone && `Phone: ${phone}`,
    website && `Site:  ${website}`,
    `Service: ${service}`,
    source && `Source:  ${source}`,
    "",
    message || "(no message)",
    ...(attribution.length
      ? ["", "— Attribution —", ...attribution.map(([key, value]) => `${key}: ${value}`)]
      : []),
    "",
    "—",
    "Submitted via rivercitydigitalco.com",
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    // In production a missing key is an outage, not a no-op. Returning a fake
    // success here silently swallows real inquiries — surface it instead so the
    // visitor gets the "email us directly" fallback and we can see it's broken.
    if (process.env.NODE_ENV === "production") {
      receipt("configuration_error");
      console.error("[contact] RESEND_API_KEY missing in production — inquiry not sent");
      return NextResponse.json(
        { ok: false, error: "We couldn't send the message. Please email us directly." },
        { status: 500 },
      );
    }
    console.log("[contact] Local preview — email delivery disabled");
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    receipt("provider_request");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      receipt("provider_rejected", { status: res.status });
      console.error("[contact] Email provider rejected request", res.status);
      return NextResponse.json(
        { ok: false, error: "We couldn't send the message. Try again or email us directly." },
        { status: 502 },
      );
    }
    // Provider acceptance is not inbox delivery. Keep its ID in private runtime
    // logs so delivered/bounced events can be reconciled in Resend later.
    let providerId: string | undefined;
    try {
      const result = await res.json() as { id?: unknown };
      if (typeof result.id === "string" && /^[a-zA-Z0-9_-]{1,100}$/.test(result.id)) providerId = result.id;
    } catch { /* A successful send must not become an error due to receipt parsing. */ }
    receipt("provider_accepted", providerId ? { providerId } : { receiptDetail: "provider_id_unavailable" });
  } catch (err) {
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    receipt("provider_unconfirmed", { reason: timedOut ? "timeout" : "network" });
    console.error("[contact] Email delivery could not be confirmed", timedOut ? "timeout" : "network error");
    return NextResponse.json(
      { ok: false, error: "We couldn't confirm delivery. Please call or email us directly before sending another request." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, receiptId });
}
