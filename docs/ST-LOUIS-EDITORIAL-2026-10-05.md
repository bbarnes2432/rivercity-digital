# St. Louis ad page: Chicago composition

Status: publication approved October 5, 2026 with the user instruction "Okay push to production". Deployment evidence is recorded in the management project under clients/river-city-digital/changes/2026-10-05-st-louis-publication.json. The owner's supplied revision was adopted by the user's request to edit the St. Louis page. This authorizes the named paid-page rebuild; it does not change the ordinary `/website-design` service page or Google Ads.

## Buyer and offer

St. Louis businesses looking for a custom website. The next step is a free design mockup followed by a conversation and written scope for a paid build. No public price or required budget field was added. Headline: "Custom websites for St. Louis businesses." Main action: "Get my free mockup"; phone is the alternative.

The hypothesis is that the shorter, familiar Chicago sequence makes the work, local team and next step easier to understand. No conversion improvement is claimed from these implementation checks.

## Composition

1. Existing Arch/riverfront photo as the full hero background, matching Chicago typography, brand colors and CTAs. All 14 requested communities in the ticker.
2. Existing St. Louis VSL and attributed client excerpt, then the existing mockup form. Side-by-side on desktop, video/review before form on mobile; hero CTA skips directly to the form.
3. "Local enough to meet in person." Family-owned, based in St. Louis, direct collaboration.
4. Shared three-step fictional Juniper Bakehouse illustration.
5. Chicago's visible card grid and enlarged previews. Mend Health, Linda's, Robinson's, Always Clean, Wellness are verified and present. **Main Street Bar & Grill remains pending its URL or an authentic supplied screenshot.** Insert it fourth once identified. Do not substitute an unrelated business or create a fake project screenshot. The draft currently accurately labels five projects.
6. Review section, then the shared short Google/ChatGPT section with St. Louis examples.
7. Six project-inclusion cards and three-row Design / Ownership / Speed comparison.
8. Shared short FAQs; St. Louis's last answer confirms an in-person meeting can be arranged.
9. Navy final mockup/call CTA with an Arch silhouette.

The long SEO block, old five-row comparison, project-types section, photographic process and Designed for your business block no longer appear on the STL paid page. The organic page's components were not removed or edited by this task.

## Reviews handoff for Jon

Both ad pages now consume the existing server-only Places review renderer. It reads the River City Google listing through the existing `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` variables. This is Places API access to the business listing, not an authenticated Google Business Profile OAuth integration.

Set `GOOGLE_LANDING_REVIEWS_ENABLED=true` in the approved deployment environment to enable both paid routes once Jon's source, credentials and API configuration are ready. Existing `GOOGLE_CHICAGO_REVIEWS_ENABLED=true` remains Chicago-only for backward compatibility. The Amplify build's environment allowlist now carries both flags into the SSR runtime, alongside the existing secret variables. **No environment variable, credential or cloud setting was set in this task. No live Places request was made to verify Jon's integration.** Local credentials were not present, and the remote main branch had no newer integration commit at the initial fetch.

The renderer retains Google's returned relevance order, original review text, author/source links and Google attribution. It uses the existing no-store request behavior and server-side flag; do not introduce a daily persistent review-content cache without checking the permitted storage terms/source. With an enabled feed it requests reviews per page render, subject to Google pricing/quota. No browser-side key or new polling is introduced.

When the feed is unavailable, the section retains a real client-review link rather than invented stars or review counts. The existing verified Angelita excerpt remains beside the VSL; it is not repeated in the fallback section. This is not proof that live reviews are connected in production.

## Popup and unfamiliar domain

Chicago's shared audit popup wording and signature use "A real family-owned studio" / "Family-owned studio." Other routes keep their existing St. Louis copy. The existing suppression of the popup on paid landing routes remains; it was not enabled as part of this change.

`ob.sornavellon.com` is the domain-specific ClickCease tag installed September 17, documented in `docs/clickcease-2026-09-17.md`. Root layout contains its async head script and hidden no-script fallback. The internal browser found one script and no visible domain text or navigation links on the live Chicago page or local STL page. No removal or tracking change was performed. This does not reverify Google Ads IP blocking or the vendor dashboard.

## Preservation and checks

- `/st-louis-web-design` remains canonical to itself and `noindex, nofollow`; anchor navigation, privacy dialog and real phone destinations retained. This is intentional for the separate paid destination.
- Reused the existing form with STL `landingPath`, source label, confirmation route and success-only conversion handling. No backend, recipient, attribution helper, conversion helper or call-routing code was edited.
- Build passed with 41 generated routes; lint passed. Conversion handoff 61, forwarding 8 and lead-route 42 isolated checks passed. All delivery and analytics were mocked; no real test lead/call was sent. The handoff harness needed its `usePathname` mock updated after route-aware popup copy was added; the initial harness-only failures were resolved.
- Internal-browser checks at actual 1440px, 390px and 320px widths: no horizontal overflow, readable hero/form, VSL before form on mobile, CTA anchor lands below header, real telephone links, three comparison rows, in-person FAQ, privacy dialog and portfolio modal/keyboard Escape/focus return.
- Chicago regression: same headline, all original six cards in order, review slot present, new popup wording and no overflow. Shared defaults preserve Chicago's ticker and content. Hero playlist files are unchanged; poster-first behavior is retained.
- Google review fallback checked; live review cards remain unverified until configuration is provided. Existing reduced-motion behavior was preserved in source; no new OS preference emulation was performed.

Unrelated pre-existing edits were preserved byte-for-byte:

- `src/app/website-design/_components/CustomBuildComparison.tsx`: SHA256 `E40E18EEE9BB02F206BC209B35E55BFD7CAEA2744CB7193087AAF1801C57144D`
- `src/app/website-design/_components/selected-projects.ts`: SHA256 `1584BE90E7CB86DFD257DADC0F8CFAF38801FA7F100FB63548E25849E52816E8`

Preview: `http://127.0.0.1:3036/st-louis-web-design`. Main Street asset completion and Jon's live reviews connection remain pending; the user approved publication of the reviewed version with these limitations. No Google Ads changes or new automation.
