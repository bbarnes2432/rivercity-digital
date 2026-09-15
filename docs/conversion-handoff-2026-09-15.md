# Delivered-lead conversion handoff repair

User requested investigation and repair of missing River City Google Ads conversion signals. Base revision: `bb132b81dd2e1f30a621708576876e46b2fbf7be` on main. Scope is the website's existing lead tracking, with unchanged Google Ads action IDs, business phone, account settings and delivery recipients.

## Evidence and limits

Google Ads reported the primary form's last event ping on August 30, 2026, plus no enhanced data in seven days. The user already confirmed form delivery. On September 15, Google Tag Assistant connected to the live website and identified `AW-18272669855` / `GT-TBNDHZBM`, with Page View and Remarketing hits sent to destination `AW-18272669855` and Console (0). The base tag is present and communicating in that inspected session.

The source had a reproducible post-delivery failure path: each lead form called analytics destinations without exception isolation before arming the Google conversion and redirecting. A thrown analytics exception therefore resulted in a form error and no queued primary Google event even though the mocked delivery response was successful. The existing primary conversion also depended on the thank-you component mounting; it had not yet been sent at the point of confirmed delivery.

The reproduction forces analytics failures; it does not prove that those exceptions occurred in a particular production visitor's session or explain the August 30 cutoff. No real lead history or browser-blocking history was available to establish that causal link. Absence of recent genuine submissions remains a possible explanation for the diagnostic status.

## Change

- Production-success handlers call one shared `trackSuccessfulLead` helper before navigation, resetting fields or popup cleanup.
- The helper supplies normalized enhanced data and the existing form conversion target `AW-18272669855/Xo1xCOeAm-UcEJ-hi4lE` before optional analytics events.
- Google, Meta and OpenAI optional analytics errors are isolated. A matching-data exception cannot suppress the base conversion; a throwing/unavailable Google function uses the existing bounded retry rather than failing the form.
- A per-submission pending token prevents duplicate effects in the same document. Pending state/identity survive a full-page navigation until queued or the approximately ten-second retry expires; completion of an earlier event cannot erase a later pending submission.
- The thank-you component is a compatibility/full-navigation fallback. A queued event leaves no pending token, so later thank-you visits, refreshes and duplicate effects cannot produce another event.
- Existing mockup/contact/popup and Quad Cities forms share the fix. The existing Quad Cities form now also supplies its available matching identity. This does not launch a Quad Cities ad campaign or change geography.
- Local preview responses are excluded consistently, including older form variants. Failed/invalid submissions do not count.

No new storage medium, analytics recipient, conversion action, form field, automatic offline upload, campaign setting or consent override is introduced. Existing browser-side tracking can still be blocked; queueing an event is not proof that Google received or attributed it. Session storage is used only for the existing same-tab pending handoff. No submitted contact data is logged by this repair.

## Validation

All delivery and analytics in the checks are mocked, with synthetic `example.invalid` identities and no external calls:

- 50 actual form-handler handoff checks across five form components.
- 16 enhanced conversion/readiness, storage, duplicate and timeout checks.
- 42 delivery-route checks.
- 8 website forwarding-number checks.
- 7 sitewide entry-attribution checks.
- 11 attribution-preservation checks.

Total **134** passing checks. ESLint and Next.js production build passed, including TypeScript and 35 generated pages. The baseline handoff suite had 20 passing / 25 failing checks; it distinguishes deliberately strengthened pre-navigation requirements from forced-error reproductions. The full-navigation regression discovered during development was corrected and its checks now pass; it was never deployed.

No production form was submitted and no business call was placed. Google diagnostics clearance and genuine conversion attribution must be checked after subsequent eligible activity; this release does not claim those outcomes. Public deployment verification and the commit receipt are recorded in the agency project's dated River City change log.

Sources: [Google tag troubleshooting](https://support.google.com/google-ads/answer/9148089?hl=en), [Tag Assistant](https://support.google.com/google-ads/answer/10989978?hl=en-GB), and the installed Next.js 16.2.6 Script/router documentation. A queue callback should not be described as an attribution receipt.
