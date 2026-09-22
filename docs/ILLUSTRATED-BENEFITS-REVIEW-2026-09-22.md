# River City illustrated benefits — local preview

September 22, 2026. **Reviewed; user authorized release with “Commit and push.”**

User approval: “Let’s just do number 1”, referring to item 1 of `plans/2026-09-22-visual-landing-plan.md`. That plan specifies a local preview for review before publication. Items 2–4 remain unapproved and unimplemented.

Replaced only the main benefits area of `#included` with six illustrated cards: custom design, mobile layouts, page writing, search setup, contact options, and ownership. Three columns on desktop, two on tablet, one on phones. Reused the Wellness and Mend desktop project images and captured a real Mend mobile screenshot (375 × 812, 42,170 bytes). The four other graphics use HTML/CSS and existing icons. They are decorative, hidden from assistive technology, and contain no functional buttons, forms, or links. Search artwork is labeled illustrative.

Retained the compact launch checklist, design-review/revision scope and separate hosting/maintenance/services note. The project-types subsection and BuildProcess source are unchanged. No edits to hero/form, video, portfolio, other sections, branding tokens, existing motion, calls, CTA layout, form handling, tracking configuration, or Google Ads. The page-version label is `illustrated-benefits-2026-09-22` so this release can be identified in existing diagnostics. No new dependencies or motion loops. No production lead or call test.

Validation: lint passed; final production build and TypeScript passed (35 routes); git diff check passed. Browser review at 1280, 768, 390, and 320 pixels found no page or card horizontal overflow. Six cards rendered, all three screenshots loaded, one existing inquiry form remained, and video retained preload none. A narrow-screen illustration sizing issue found during review was corrected before final verification. Existing responsive layouts and entrance effects remain in use; no conversion-lift or speed-score claim.

Preview: http://127.0.0.1:3026/website-design#included (local server session 73538, running on 127.0.0.1).

Base: `e4ed45b0f5930308e5340e2f9ae7449d6edc4695`. Source allowlist and hashes are in the matching JSON receipt. Website review note: `docs/ILLUSTRATED-BENEFITS-REVIEW-2026-09-22.md`.

Release authorization: “Commit and push.” This covers the reviewed item 1, this documentation, and the release-version label. Items 2–4 remain outside the release. The Google Ads Management project stores the final commit and public verification receipt.
