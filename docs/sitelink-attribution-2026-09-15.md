# Preserve attribution on sitelink entry pages

The River City campaign uses website-design, portfolio, contact and about pages as entry destinations. Before this change, the shared `captureAttribution()` helper was called only by website-design forms. A direct `/work`, `/about` or `/contact` arrival followed by client navigation could therefore lose the original URL's click/UTM parameters before a lead was submitted.

The existing root `GoogleTag` component now calls the same helper in a mount effect, independently of Google script loading. It captures each initial document-entry URL after hydration, before normal subsequent navigation. The helper's session-only, first-touch storage, whitelist and length bounds remain unchanged. Existing website-design calls are harmless no-ops once attribution exists. The separate Quad Cities helper/storage remains unchanged.

This is a local capture fix. It sends no conversion event, does not add a third-party request, and does not create an offline-upload pipeline. Customer data, consent behavior, phone forwarding, conversion labels, site appearance and form success handling are unchanged. Browser/storage restrictions and navigation before hydration can still prevent capture. Historical identifiers cannot be reconstructed by this change.

An isolated regression test runs the actual root component, capture helper and contact handler with a controlled URL/storage and a mocked email provider. It failed before the fix (`/work: missing utm_source`), then passed for direct `/work`, `/about`, `/contact` and `/website-design` entry followed by a query-free contact navigation. It confirms campaign, matched keyword, ad/group/match/device labels and a dummy click identifier reach the mocked lead email. It also covers existing first-touch state, blocked storage and effects not mounting during SSR. It is not a real paid-click or inbox-delivery test.

Validation: seven new regression checks, eleven existing attribution checks, forty-two mocked lead-route checks and fourteen enhanced-conversion checks passed; ESLint and the production build passed. No production inquiry or conversion was submitted. Website-call tests are recorded in the agency deployment receipt. The user already confirmed normal form delivery; no repeat submission test was requested.

The accompanying campaign final-URL suffix provides five existing supported fields:

```text
utm_source=google&utm_medium=cpc&utm_campaign=st_louis_web_design_{campaignid}&utm_term={keyword}&utm_content=ad_{creative}_ag_{adgroupid}_mt_{matchtype}_dev_{device}
```

Google substitutes its ValueTrack tokens when serving an eligible click. `{keyword}` is the matched account keyword, not the person's exact search query. Existing auto-tagging supplies available Google click identifiers separately. The suffix does not generate an identifier or map old sales, and first-touch session behavior means a later paid click does not replace an already captured visit.
