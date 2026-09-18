# Restore the River City landing design

The user rejected the broad visual simplification in fc32956 and explicitly requested restoring the hero, animations, colors, custom-design/SEO sections and earlier page presentation from GitHub history.

## Scope

Restore `/website-design` presentation from 28315430b7ebcc4ae1cbdc95c95fe9bc8acaa6e0, the commit immediately before that simplification. The user then clarified that they like the free-mockup offer and form at the top and want those retained. This restores the portal entrance, shader and kinetic background, animated cursor, section entrance animations, full section order/content and original color scheme while keeping one mockup form in the hero and the mockup-first sticky contact actions. The custom-design introduction, SEO/search section, platform comparison, build capabilities, business-system examples and build process are fully visible again without the technical-details disclosure wrapper. The lower contact section retains its original copy and call/booking/email choices, with a shortcut to the hero form replacing its relocated form. New CSS is limited to fitting that form into the animated hero and its related contact shortcuts; original section styles stay intact.

Retain the working contact endpoint, receipt/diagnostic handling, success-only conversion handoff, enhanced matching, call forwarding, privacy disclosure and ClickCease tag. The form's heading and submission safeguards remain unchanged from the preceding release. The invisible diagnostic component binds to the restored page without imposing the removed layout styles. Its final version is `design-restored-brand-2026-09-18` so the presentations are distinguishable.

The hero form explicitly retains pointer interaction and uses the existing `rcd-light` animation mask. This keeps the restored ribbons from washing out form text or controls while preserving the effects around it.

The user's subsequent color correction replaces the landing page's separate mint-green colors with the existing navigation/brand palette. The observed navigation button is #4CA5AD (`--accent`), while the old landing action was #C4E6D4. Primary landing actions now use that exact navigation accent, with dark navy text for contrast. Supporting section surfaces use the existing navy, blue and cream tokens. The global navigation palette, portfolio imagery and animation colors are unchanged. This palette-only follow-up supersedes restoring the old green section colors; it preserves the restored section layout and content.

No Ads or ClickCease settings change is part of this restoration. No production test lead or call is authorized by this change. Future conversion recommendations must preserve the user's design unless a specific visual change is approved.

This document supersedes the visual-layout portions of RECOVERY-2026-09-18.md. That document's technical measurement and delivery notes remain applicable.

## Verification

- Lint, TypeScript and production build pass.
- 185 existing isolated checks cover motion/rendering fallbacks, diagnostic boundaries, form delivery, conversion handoff, enhanced matching, forwarding and attribution. Delivery and analytics are mocked; no production lead or call is sent.
- Browser review at 1280, 390 and 320 CSS pixels confirms one form inside the hero, full twelve-section composition, original section colors, three animation canvases, no horizontal overflow, working mockup/SEO anchors, usable input focus and native required-field validation.
- Mobile inspection caught the ribbon effect crossing the newly relocated form. Reusing the existing light-content mask corrected it; the rendered clip excludes the form rectangle and text stays readable.
- Original section components and base style sheets remain byte-identical in Git to 2831543; the specifically requested brand correction is in a scoped override stylesheet. Contact/delivery routes, call-forwarding and ClickCease code remain unchanged from the working release. No JavaScript warnings/errors were captured during the local review.
