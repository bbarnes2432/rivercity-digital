export const PAGE_VERSION = "clear-mockup-live-work-2026-09-22";
export const FUNNEL_EVENTS = ["landing_view", "mockup_view", "mockup_start", "mockup_validation_error", "mockup_submit", "mockup_error", "mockup_accepted", "cta_mockup", "cta_call"] as const;
export type FunnelEvent = typeof FUNNEL_EVENTS[number];
export type FunnelContext = { session: string; version: typeof PAGE_VERSION; paid: boolean; device: "mobile" | "desktop" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function safeUuid(value: unknown): string | undefined {
  return typeof value === "string" && UUID.test(value) ? value : undefined;
}
export function parseFunnelContext(value: unknown): FunnelContext | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const session = safeUuid(v.session);
  if (!session || v.version !== PAGE_VERSION || typeof v.paid !== "boolean" || !["mobile", "desktop"].includes(String(v.device))) return null;
  // Only allowlisted values survive; never copy arbitrary form/contact data.
  return { session, version: PAGE_VERSION, paid: v.paid, device: v.device as FunnelContext["device"] };
}
