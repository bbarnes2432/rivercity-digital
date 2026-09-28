# Focused St. Louis and Chicago landing pages

**Published 2026-09-28 at the user's request** (with the new VSLs; see VSL-PREVIEW-LOOPS-2026-09-28.md). Originally a local draft: Based on main `88e516c97648a0bea8d787fe2ce74a0cf60bf786`. Page version `focused-landings-2026-09-24`.

Preview:

- St. Louis: http://127.0.0.1:3028/website-design
- Chicago: http://127.0.0.1:3028/chicago-web-design

## St. Louis

The existing route retains all 12 sections, the original animated hero, brand colors, top mockup form, phone calls, VSL, six illustrated benefits, SEO copy and three animated portfolio previews. Shared navigation now links to Our work, What you get and Questions on this page. The logo returns to the top. Portfolio previews still enlarge and animate, but the paid page no longer links out to client sites or case studies. The comparison's external reference links are omitted from this focused rendering.

Privacy and terms open in a keyboard-accessible in-page dialog. Their full section content is shared with, and exactly matches, the existing legal pages; no policy wording was rewritten. Phone and email links remain usable. The browser's own back/close controls are unaffected. Main-site navigation on other routes keeps its existing defaults.

## Chicago

The new route reuses the St. Louis design and explicitly says that the family-owned St. Louis team serves Chicago remotely. It makes no Chicago office claim. Its hero has a background-video slot with a static brand-colored fallback, separate from the original VSL below the hero.

**Video supplied and implemented locally.** Reviewed four user-supplied clips and selected the nighttime Bean footage (`M18-1013.mov`). A 14-second, silent H.264 loop is 2.36 MB at 1440×810 for desktop and 1.01 MB at 576×1024 for mobile. Each has an opening-frame WebP poster. `hero-media.ts` references only these optimized assets; originals remain outside the repository.

The component supports muted inline looping, keyboard pause/play, hidden-tab and offscreen suspension, and a still fallback for reduced motion or loading failure. Reduced-motion visits request no video; normal desktop/mobile visits each request only their selected video and poster. The navy overlay preserves text contrast. The Chicago video hero is masked from the ribbon overlay; ribbons remain elsewhere and the St. Louis hero is unchanged. The original VSL stays below the hero.

The Chicago form carries its own source and page context and goes to `/chicago-web-design/thank-you`. Existing successful-delivery conversion handling is retained. Both confirmation pages return only to their corresponding landing page. Chicago is noindex and has not been added to any live Ads campaign.

## Latest business constraint

The user wants larger custom projects with budgets of $5,000+, acquired through targeting and keyword intent. The user expressly rejected showing pricing or asking a budget question for now. Neither has been added. Existing fields and their required/optional status remain unchanged. Future advertising changes still need exact batch approval.

## Verification

- Lint, TypeScript, production build (37 routes), and `git diff --check` passed.
- Six browser scenarios: both routes at 1280, 390 and 320px. No horizontal overflow or off-page website links; all in-page anchors resolve. All 12 sections, one mockup form, VSL and three portfolio previews remain.
- Privacy dialog opening, Escape, focus return, mobile menu navigation, portfolio dialogs and matching confirmation routes passed.
- Form failure preserves entered details; simulated success uses the correct page/source and preview confirmation. Contact and funnel endpoints were mocked and external browser traffic was blocked. No production lead, email, call or conversion was sent.
- Earlier focused-page validation: 23 offline receipt/privacy/funnel checks and six portfolio lifecycle checks passed.
- Supplied-video follow-up: ten media/policy checks, 17 hero-performance checks and seven browser scenarios pass, including actual desktop/mobile playback, keyboard pause/resume, offscreen pause, reduced motion without video requests, media-failure fallback and unchanged St. Louis. No physical-iPhone or field-speed result is claimed.
- Screenshots and browser result JSON: `C:/Users/daltr/AppData/Local/GoogleAdsManagement/reports/river-city-digital/focused-landings-20260924/`.

## Before publication / launch

Review these local pages, now including the supplied Chicago background footage. No commit or publication request has been executed for this draft. Ads sitelinks historically also point to `/work`, `/about` and `/contact`; the landing-page edit does not change those Ads destinations. A separate exact sitelink batch should be reviewed after the page is published if all ad entry points must use the focused page. The exact paused Chicago creation batch remains awaiting approval; the video upload does not authorize campaign creation or activation.
