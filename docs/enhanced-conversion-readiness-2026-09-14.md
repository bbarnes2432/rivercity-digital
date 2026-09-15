# Enhanced-conversion readiness fix — September 14, 2026

If the Google tag was unavailable when the thank-you handler ran, the site consumed the captured matching data and skipped its `user_data` instruction. The later retry still emitted the form conversion. Matching data and the event now execute together when the tag is ready, in that order.

The existing form submission flow, lead delivery, successful-submission gate, click identifiers, conversion labels, secondary click events, call forwarding and site design remain intact. No additional form fields or consent changes were introduced.

The tracking payload uses the existing email and optional US phone number. It omits incomplete address data: Google's address matching requires first/last name, country and postal code, which this form does not collect. Without a usable email, the base conversion still fires; a phone/name-only enhanced payload is omitted. Non-string saved identity fields do not prevent the base conversion.

## Verification

- Reproduced the original issue in an isolated VM: ready tag sent matching data then one conversion; delayed tag sent only the conversion.
- 14 enhanced-conversion checks now pass: ready and delayed tags, duplicate thank-you effects, direct visits, bounded timeout, blocked storage, full-page redirects, absent/malformed identity, incomplete address omission, separate pending submissions, secondary click labels and SSR.
- 8 forwarding-number checks, 11 attribution checks and 42 mocked lead-route checks pass; **75 total**.
- `pnpm lint` and `pnpm build` pass. Testing used synthetic identity and mock Google calls/storage/timers; no real form, email, call or paid click was generated.

The user already tested the mockup form successfully. This release does not ask for that delivery test again. Google Ads' prior seven-day **No recent data** warning is not proven to have been caused by this edge case. A passing code test or deployment does not establish live matching coverage or a conversion-rate improvement; review subsequent eligible data separately.

The existing tag retry remains bounded at approximately ten seconds. A tab closed before the Google tag is ready cannot be guaranteed to report a browser conversion. This release does not add persistent lead storage or an offline upload integration.

Reference: [Google tag enhanced-conversion setup](https://support.google.com/google-ads/answer/13258081), including set-before-conversion ordering, email/phone fields and required address fields. Existing account terms are already accepted and enhanced conversions is enabled; no Ads setting change was needed.

Rollback: revert this release commit and deploy via the existing main-branch pipeline. This returns the prior tag-readiness behavior; it cannot retroactively repair or undo Google attribution.
