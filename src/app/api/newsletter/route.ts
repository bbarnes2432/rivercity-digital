import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  email?: string;
  source?: string;
  "bot-field"?: string;
};

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
    return NextResponse.json({ ok: true });
  }

  const email = trim(body.email);
  const source = trim(body.source) || "unknown";

  if (!email) {
    return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }
  if (email.length > 254 || source.length > 200) {
    return NextResponse.json({ ok: false, error: "One of the fields is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_TO_EMAIL || "hello@rivercitydigitalco.com";
  const fromAddress =
    process.env.CONTACT_FROM_EMAIL || "River City Digital <noreply@rivercitydigitalco.com>";

  const subject = `Newsletter signup — ${email}`;
  const text = [
    `New newsletter signup`,
    `Email: ${email}`,
    `Source: ${source}`,
    "",
    "—",
    "Submitted via rivercitydigitalco.com",
  ].join("\n");

  if (!apiKey) {
    // See contact route — never fake a success in production.
    if (process.env.NODE_ENV === "production") {
      console.error("[newsletter] RESEND_API_KEY missing in production — signup not sent");
      return NextResponse.json(
        { ok: false, error: "Couldn't subscribe right now. Please email us directly." },
        { status: 500 },
      );
    }
    console.log("[newsletter] Local preview — email delivery disabled");
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
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
      console.error("[newsletter] Email provider rejected request", res.status);
      return NextResponse.json(
        { ok: false, error: "Couldn't subscribe right now. Try again or email us directly." },
        { status: 502 },
      );
    }
  } catch {
    console.error("[newsletter] Email delivery could not be confirmed");
    return NextResponse.json(
      { ok: false, error: "Couldn't subscribe right now. Try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
