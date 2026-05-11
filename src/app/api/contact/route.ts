import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  service?: string;
  message?: string;
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

  if (trim(body["bot-field"])) {
    return NextResponse.json({ ok: true });
  }

  const name = trim(body.name);
  const email = trim(body.email);
  const message = trim(body.message);
  const phone = trim(body.phone);
  const website = trim(body.website);
  const service = trim(body.service);
  const source = trim(body.source).slice(0, 80);

  if (!name || !email || !service) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and service are required." },
      { status: 400 },
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_TO_EMAIL || "hello@rivercitydigitalco.com";
  const fromAddress = process.env.CONTACT_FROM_EMAIL || "River City Digital <noreply@rivercitydigitalco.com>";

  const subject = `New inquiry — ${service} (${name})${source ? ` [${source}]` : ""}`;
  const text = [
    `New inquiry from ${name} <${email}>`,
    phone && `Phone: ${phone}`,
    website && `Site:  ${website}`,
    `Service: ${service}`,
    source && `Source:  ${source}`,
    "",
    message || "(no message)",
    "",
    "—",
    "Submitted via rivercitydigitalco.com",
  ]
    .filter(Boolean)
    .join("\n");

  if (!apiKey) {
    console.log("[contact] RESEND_API_KEY not set — would have sent:\n" + text);
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
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
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend failed", res.status, detail);
      return NextResponse.json(
        { ok: false, error: "We couldn't send the message. Try again or email us directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[contact] send threw", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send the message. Try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
