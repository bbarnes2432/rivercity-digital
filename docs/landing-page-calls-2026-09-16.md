# Website-design page: clearer calls and earlier trust

September 16, 2026. Base commit: `e3c0042`.

The hero's call label did not explicitly say it placed a call, and the existing testimonial/local-studio section followed extensive technical content. The revised page states what the conversation covers and brings that evidence and invitation earlier in the visitor's path.

## Changes

- Hero action: **Call our St. Louis team**, followed by a brief explanation of the design/features/next-steps conversation. Existing phone display and free-mockup action remain.
- Move the existing attributed Angelita Pritchett / Wellness Collective testimonial directly below the hero, displayed once in a compact responsive section. Preserve its exact quote and case-study link.
- Move the local-studio section directly after the three website examples and turn it into **Let’s talk about your website**. State three discussion topics, offer the tracked call button and readable dynamic number, and retain the existing 30-minute scheduling destination as a secondary link.
- The new conversation section replaces the gallery's standalone mockup callout with a free-mockup shortcut and clear design-preview/no-obligation expectations. Existing preview dialogs and their mockup shortcuts remain.
- Clarify the existing form introduction and contact copy without changing form fields, delivery or conversion logic.

The user explicitly deferred the personal introduction and staff photo until speaking with the owner. Existing St. Louis imagery remains. No named speaker, new availability promise, price, guarantee or response-time claim was invented. The hero design/effects, three projects, SEO, five comparison topics, build details, software examples, process, FAQ, navigation and tracking configuration are preserved.

## Validation

- Production build and TypeScript passed; 35 pages generated. ESLint and `git diff --check` passed.
- 101 existing isolated checks passed: submission handoff 50, enhanced conversions 16, forwarding 8, sitewide attribution 7, motion 20. All test leads and analytics use mocks; no production submission or call was made.
- Production-preview browser inspection at 1440 × 1000, 390 × 844 and 320 × 740: no horizontal document overflow or clipped new text/actions. No broken loaded images or duplicate IDs in the narrow check.
- Existing portfolio preview opens; its mockup action closes the dialog and restores page scrolling. The new conversation-section shortcut focuses the existing `#start` anchor; after scrolling settles on the narrow view, the form heading is y123 and the name input y300. The sticky bar hides at the form.
- All inspected telephone links retain `tel:+16363381408` in a non-ad preview. Both new call actions use the existing forwarding-aware `CallLink` component, with distinct section context; no hardcoded Google forwarding number.
- Scheduling points to the existing `/hello-rivercitydigitalco/30min` Calendly destination. It was inspected, not booked. The preview error/warning log was empty in the checked journeys.

Public deployment verification is recorded separately in the agency project's client change receipt. These are usability/copy changes; no conversion uplift, diagnostic clearance, real forwarding substitution or qualified-call outcome is established by this release. No Google Ads budget, targeting, goal or bidding setting changed.
