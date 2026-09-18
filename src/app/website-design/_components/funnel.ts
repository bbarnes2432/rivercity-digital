import { readAttribution } from "@/app/_components/attribution";
import { PAGE_VERSION, type FunnelContext, type FunnelEvent, safeUuid } from "@/lib/funnel-schema";

const SESSION_KEY = "rcd-funnel-session";
let sent = 0;
const once = new Set<string>();

export function funnelContext(): FunnelContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return null;
    let session = safeUuid(sessionStorage.getItem(SESSION_KEY));
    if (!session) { session = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, session); }
    const attribution = readAttribution();
    return { session, version: PAGE_VERSION, paid: Boolean(attribution.gclid || attribution.gbraid || attribution.wbraid || /^(cpc|ppc|paidsearch)$/i.test(attribution.utm_medium || "")), device: matchMedia("(max-width: 760px)").matches ? "mobile" : "desktop" };
  } catch { return null; }
}

export function trackFunnel(event: FunnelEvent, single = false, receipt?: string): void {
  // Diagnostic failure must never block typing, submitting or navigating.
  try {
    const context = funnelContext();
    if (!context || sent >= 48) return;
    const key = `${context.session}:${event}`;
    if (single && once.has(key)) return;
    if (single) once.add(key);
    sent++;
    void fetch("/api/funnel", {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ ...context, event, eventId: crypto.randomUUID(), ...(safeUuid(receipt) ? { receipt } : {}) }),
    }).catch(() => {});
  } catch { /* optional diagnostics */ }
}
