import { NextResponse } from "next/server";
import { FUNNEL_EVENTS, parseFunnelContext, safeUuid } from "@/lib/funnel-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  // The hosting proxy may expose an internal req.url origin. Trust the exact
  // public site origins as well, never an arbitrary forwarded host header.
  const allowedOrigins = [new URL(req.url).origin, "https://rivercitydigitalco.com", "https://www.rivercitydigitalco.com"];
  if ((origin && !allowedOrigins.includes(origin)) || req.headers.get("sec-fetch-site") === "cross-site") return new Response(null, { status: 403 });
  if (Number(req.headers.get("content-length") || 0) > 2048) return new Response(null, { status: 413 });
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 2048) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch { return new Response(null, { status: 400 }); }
  const context = parseFunnelContext(body);
  const eventId = safeUuid(body?.eventId);
  if (!context || !eventId || !FUNNEL_EVENTS.includes(body.event as typeof FUNNEL_EVENTS[number])) return new Response(null, { status: 400 });
  const receipt = safeUuid(body.receipt);
  // Host runtime logs are the independent record; client events are not leads.
  console.info(JSON.stringify({ kind: "rcd_funnel", source: "browser", at: new Date().toISOString(), page: "/website-design", ...context, eventId, event: body.event, ...(receipt ? { receipt } : {}) }));
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
