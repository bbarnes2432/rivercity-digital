# Separate the website service page from the paid landing page

The user clarified that the restricted landing page should have a new URL, rather than replacing the normal website-design service page. The focused release hard-coded that behavior into the shared component. This correction makes the mode explicit.

| URL | Intended behavior |
|---|---|
| `/website-design` | Regular service page; home logo, full desktop/mobile site navigation, footer links, portfolio site/case-study links and standard policy links. Existing indexable canonical URL and sitemap entry remain. |
| `/st-louis-web-design` | Separate paid landing page; same design, local copy, top mockup form, phone options, VSL, all 12 sections and current portfolio. Section-only navigation, logo to top, in-page previews and policy dialogs. Noindex/nofollow, excluded from sitemap. |
| `/chicago-web-design` | Existing focused Chicago page retained, including its background video and market-specific VSL. |

Each form keeps its corresponding thank-you URL and page attribution. The new St. Louis route uses the same successful-delivery conversion action and deduplication logic. Its hidden source identifies the paid landing page; field requirements and email handling are unchanged. No redirect or ad-click-parameter-dependent behavior hides the normal service page. The new paid route and confirmation suppress the existing popup.

Base: `d2be5fb` after fast-forwarding the clean checkout to the newest GitHub main, preserving the owner's latest logo, VSL, portfolio, homepage reviews and other work. No branding, animation, imagery, section, sales-copy, price or field-requirement redesign.

Validation: lint, TypeScript and production build passed (41 generated pages). Twenty-five diagnostic-boundary checks and 61 mocked conversion-handoff checks passed, including the three form routes, correct confirmation paths and no conversion in preview mode. Browser checks cover actual Home navigation, desktop/mobile menus, 390/320px overflow, paid-page privacy dialogs and the unchanged Chicago hero video. No real form, email, call or conversion was submitted.

Google Ads is a separate live change: the two current St. Louis website RSAs still point to `/website-design`; four sitelinks also need a concrete destination proposal. This website correction does not modify Ads. Read-only API inspection observed the current budget at $30/day; this work did not change it. Exact approval is required before the proposed Ads destination batch.
