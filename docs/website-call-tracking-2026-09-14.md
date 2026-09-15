# Google website call tracking — September 14, 2026

River City Digital's website calls now have a dedicated Google Ads conversion action, separate from phone-button clicks. The Ads configuration was applied and read back through API v25. Website deployment is verified separately in the agency change record.

## Measurement settings

- Customer: River City Digital Co, `6000154303`; campaign: St. Louis Web Design, `23979555250`.
- Action: **Calls from website (60 seconds)**, `7768088556`, type `WEBSITE_CALL`, primary.
- Count one conversion per ad click; minimum call duration 60 seconds; 30-day click window; data-driven attribution. Duration is a proxy, not proof of a qualified lead.
- Fixed value 0 USD because no measured website-call value was supplied. Current bidding is Maximize Conversions, not value-based bidding.
- Campaign goal `PHONE_CALL_LEAD / WEBSITE` is biddable. Existing mockup submissions and calls from ads remain primary; phone-button clicks and booking-link clicks remain secondary.
- Destination: **(636) 338-1408**, `+16363381408`.
- Public conversion tag, obtained from the API: `AW-18272669855/KCsiCOy_jvgcEJ-hi4lE`.

## Website behavior

The existing Google tag configures website calls once it is ready. Its phone-number callback updates a shared React store, so both the readable number and each `tel:` link use the same forwarding number. Links mounted later, including mobile navigation and links on other pages, read the same store. The Quad Cities header's custom number label also subscribes.

Server rendering and unavailable, malformed, or inconsistent responses retain the real business number. Google controls eligibility and forwarding-number assignment. Never copy a session's forwarding number into contact details, structured data, ads, or the business's phone settings. No permanent forwarding number is assigned by this code.

The code sends a configuration instruction, **not** a conversion event for a connected call. Google measures the call through the forwarding number. Existing secondary phone-click events remain unchanged. The code does not change consent settings, attribution storage, form delivery, or the design.

## Verification

- 8 isolated forwarding-number checks: tag readiness, duplicate readiness, callback consistency, fallback, subscriptions, navigation consumers, SSR, and blocked tags. No Google traffic or calls in these tests.
- 11 existing attribution and 42 mocked lead-route checks passed.
- `pnpm lint`, `pnpm build`, and `git diff --check` passed.
- Local production browser checks: website-design page and client navigation to Contact; normal phone display and dial targets; no captured console errors. At 390 × 844, phone targets remain correct and no horizontal overflow appears. These are emulated viewport checks, not physical-phone validation.

Actual number replacement for an eligible ad visitor, call connection/duration and reporting in Google Ads still require production verification. Do not count an ordinary direct visit retaining the original number as a failure. Do not claim a test conversion or qualified lead based only on a phone-button click. Allow Google's new configuration to propagate; the setup guide notes that activation can take up to an hour.

## Operations

Keep the real destination in `src/app/_components/contact-info.ts`. Keep the generated label in `website-call-tracking.ts` aligned with the Ads action. Do not recreate the conversion action on subsequent deployments. The agency's bounded setup script has already applied it.

To reverse this website change, revert this commit and deploy through the existing workflow. Reconcile the Ads action/goal separately before changing measurement; do not delete historical conversion data. A rollback does not undo bidding learning or already spent money.

References: [Google website-call setup and callback](https://support.google.com/google-ads/answer/6095883?hl=en), [API call conversion types and required call asset](https://developers.google.com/google-ads/api/docs/conversions/categories), [Forwarding numbers](https://support.google.com/google-ads/answer/2382961?hl=en).
