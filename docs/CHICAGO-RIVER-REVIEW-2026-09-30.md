# Chicago river design — local review, September 30, 2026

Status: **Local preview only. Not committed, pushed, or published.**

Preview: http://127.0.0.1:3032/chicago-web-design

The user approved the researched structure and supplied Brandon's detailed Chicago design brief. Their follow-up clarified that this is River City Digital's Chicago landing page. This work implements that brief in the existing local Chicago draft, preserving the separate normal service and St. Louis paid routes. A St. Louis visual rollout is deferred until Chicago is reviewed.

## Implemented

- One brand cream canvas, navy hero/final band, teal accents, consistent condensed headings, and a continuous decorative river line. Removed the opening veil so the headline and CTAs do not wait for an entrance animation.
- Owner's hero headline, subhead, mockup and phone actions. Full-width four-clip video sequence remains daytime-first. Supplied footage has MP4 and WebM sources, immediate posters, lighter mobile assets, pause control, offscreen pause, and reduced-motion poster handling.
- All 20 requested communities in a slow ticker, with hover/focus/pause controls and a static reduced-motion layout. This is website service copy; no advertising geography changed.
- Existing Chicago VSL beside the mockup form on desktop; video then form on phones. Hero buttons jump directly to the form. VSL preload is none, playback is explicit, with native controls. No silent VSL preview is downloaded before play.
- Chicago river story using an actual frame from the supplied bridge footage. The owner's new St. Louis connection wording supersedes the earlier request to omit that reference from Chicago body copy.
- One visual three-step process: illustrative intake notes, wireframe-to-real-Linda design, and real Linda mobile screenshot. Written scope/price is explained before the build decision; no price or budget qualification was added.
- Six portfolio examples in the requested order: Linda, Wellness, St. Joseph, Sauce Fix, Always Clean, Robinson's Contracting. The last business was identified from its actual temporary website. Five real screenshot scroll previews plus Wellness's existing interactive preview; pause, keyboard tabs, enlarged modal and focus restoration. No temporary Amplify link is exposed.
- Illustrated search and AI cards, plainly identified as fictional examples; three short buyer benefits. A three-row Design/Ownership/Speed comparison with balanced platform details in FAQ.
- Final navy CTA band with decorative skyline. Chicago keywords and Twitter description; intentional noindex/nofollow retained for this dedicated paid route.

## Two incomplete content items

1. **Linda before/after:** The native keyboard/touch range component is ready but not mounted. Brandon's authentic Facebook-before and intended after screenshots have not arrived. No invented before image or comparison is shown. The available Linda website screenshot is used only for work/process proof.
2. **Live Google reviews:** Server component and official attribution styling are prepared, but hidden. Local Google Places credentials are absent. Existing production credentials alone will not enable it: GOOGLE_CHICAGO_REVIEWS_ENABLED must be explicitly true in the server runtime. No key, environment setting or API connection was changed, and zero live Places calls were made in this work. Confirm Jon's existing review source/approved integration before enabling it. Do not paste secrets into chat.

The requested daily cache conflicts with the standard Places content-storage restrictions. The prepared direct Places path uses no-store and would make a paid request per configured server render; it is not a near-zero-cost daily cache. The public site's required Google policy incorporation and the provider/cost approach must be resolved before activation. See [Places policies](https://developers.google.com/maps/documentation/places/web-service/policies), [Google Maps terms](https://cloud.google.com/maps-platform/terms), and [Places-specific terms](https://cloud.google.com/maps-platform/terms/maps-service-terms).

## Validation and preservation

- ESLint, production build (41 generated routes), TypeScript and git diff whitespace check passed. Chicago is dynamically server rendered because the isolated reviews helper waits for request-time configuration.
- Browser checks at 1440, 1024, 768, 390 and 320 CSS px: no horizontal page overflow; hero constrained to viewport; readable mobile CTAs and form; form anchor visible below fixed nav; all six portfolio selections; offscreen tab brought into view by keyboard; modal Escape/focus return; FAQ expansion; ticker/video pause; VSL click-play and pause. Browser console error list was empty.
- Rendered metadata checked: Chicago title/keywords/Twitter copy, noindex/nofollow. One actual form, name/email remain required, phone/business remain optional, one process, one river path, no temporary-domain links.
- Mobile media was observed selecting WebM mobile files; desktop WebM also loaded. Agent verified all eight WebM decodes, silent audio, 24 fps and correct dimensions. Every clip is under 3 MB; the complete sequential desktop WebM playlist is about 5.75 MB, mobile about 2.79 MB. Only the current/near-next clip is mounted. Licensing is based on footage supplied by the user for this project; no independent stock-license document was supplied or new AI Chicago imagery generated.
- Hero white text overlay has a minimum 65% navy shade, even over the brightest frame. Primary buttons use navy text on brand teal, including the navigation CTA. This is targeted contrast/interaction QA, not a full WCAG certification.
- Reduced-motion paths were reviewed in source/CSS; browser preference emulation was not available. Before/after live drag testing awaits real assets. No genuine form was submitted and no phone call was placed. Existing VSL playback worked, but spoken-content accuracy/caption coverage were not fully audited; no caption track is configured.
- Shared CallLink gained optional numberPrefix so Chicago numeric labels use the actual forwarding display number. Isolated mocked tests confirm href/display update together and existing children/default behavior remain unchanged. Event destinations/goals were not changed.
- Shared Nav uses native fragment anchors for paid-page logos (main and drawer), repairing repeated back-to-top clicks; normal route links keep Next Link. St. Louis's visual layout was not restyled.

## Files and evidence

Chicago page/components/CSS live under src/app/chicago-web-design. New media is under public/assets/chicago. The reviews helper is src/lib/chicago-reviews.ts. Shared edits this turn are CallLink.tsx, Nav.tsx and optional WebM support in ChicagoHeroBackground.tsx. Earlier uncommitted changes in other shared files remain present and must be reviewed separately before any release; do not stage the entire dirty tree blindly.

Local design marker: chicago-river-2026-09-30. Earlier funnel page-version marker remains unchanged until a release is selected.

QA evidence: C:/Users/daltr/AppData/Local/GoogleAdsManagement/reports/river-city-digital/chicago-river-20260930/

No Google Ads, budget, keyword, goal, campaign-state, tracking configuration, production backend, account access, automation, or external messaging changes. This design has not yet produced performance evidence. After publication, assess qualified inquiries and qualified-lead cost, not only raw form submissions or video plays.
