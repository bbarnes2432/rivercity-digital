"use client";

import { useSyncExternalStore } from "react";
import { PHONE } from "./contact-info";

// Google Ads WEBSITE_CALL action 7768088556. Retrieved from its API tag snippet.
// Google measures call duration; this configuration must never fire a browser
// conversion event for a phone-button click.
export const WEBSITE_CALL_SEND_TO = "AW-18272669855/KCsiCOy_jvgcEJ-hi4lE";

type PhoneNumber = { display: string; href: string };
let currentNumber: PhoneNumber = PHONE;
let configured = false;
const listeners = new Set<() => void>();

function normalizeUSNumber(value: unknown): string | null {
  if (typeof value !== "string" || !/^[+\d\s().-]{7,40}$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  if (/^[2-9]\d{9}$/.test(digits)) return `+1${digits}`;
  if (/^1[2-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

export function receiveForwardingNumber(formatted: unknown, mobile: unknown): void {
  const dialNumber = normalizeUSNumber(mobile);
  // Keep the readable number and the dial target consistent. Malformed or
  // absent responses leave the real business number usable.
  if (!dialNumber || normalizeUSNumber(formatted) !== dialNumber) return;
  const next = { display: (formatted as string).trim(), href: `tel:${dialNumber}` };
  if (next.display === currentNumber.display && next.href === currentNumber.href) return;
  currentNumber = next;
  listeners.forEach((listener) => listener());
}

export function configureWebsiteCallTracking(): void {
  if (typeof window === "undefined" || configured || typeof window.gtag !== "function") return;
  configured = true;
  try {
    window.gtag("config", WEBSITE_CALL_SEND_TO, {
      phone_conversion_number: PHONE.display,
      phone_conversion_callback: receiveForwardingNumber,
    });
  } catch {
    configured = false;
    // Tracking failure must not prevent a visitor from reaching the business.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

const getSnapshot = () => currentNumber;
const getServerSnapshot = () => PHONE;

export function useWebsitePhoneNumber(): PhoneNumber {
  // React controls both text and href, including links mounted after a client
  // navigation, mobile menu opening, or form error. SSR keeps the real number.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
