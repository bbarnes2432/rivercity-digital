"use client";

import { useWebsitePhoneNumber } from "./website-call-tracking";

export default function ForwardingPhoneNumber() {
  return <>{useWebsitePhoneNumber().display}</>;
}
