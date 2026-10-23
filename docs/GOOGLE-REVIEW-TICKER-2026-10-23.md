# Google review ticker — October 23, 2026

User confirmed Google reviews, then explicitly requested manually copied reviews rather than a live feed. Local implementation only; no commit or publication yet.

The shared Chicago/St. Louis paid-page review section now renders nine short verbatim excerpts from River City Digital Co.'s public Google Maps listing. Names, five-star ratings and 5.0/9 aggregate verified in the internal browser on October 23. The source listing URL and verification date are in `src/app/chicago-web-design/review-excerpts.ts`. All nine available reviews are represented; no rating filter. These are excerpts, not complete reviews. Each card links to the listing's reviews; no claim of individual deep links. No Google API call, credential, persistent Places cache, automatic refresh or new integration.

Preserves cream/navy/teal styling and river. A horizontal row advances every seven seconds while visible, pauses on pointer hover, keyboard focus, hidden document, and user interaction. Explicit pause/resume and previous/next controls; touch scrolling and arrow keys; reduced motion disables automatic movement. No duplicated reviews in the accessibility tree. Ratings/count carry the checked date and need manual refresh when reviews change.

TypeScript and whitespace checks passed. Internal browser checks: nine cards, desktop 1280px and mobile 390px without horizontal page overflow, next/previous, pause and keyboard scrolling; source Google listing checked separately. Reduced-motion branch reviewed in source, not emulated in browser. Temporary sample fixture removed. Ordinary pages, offers, photo scope, tracking, and Ads unchanged. Existing unrelated organic comparison and selected-project drafts preserved.

Targeted ESLint stalled without diagnostics and was stopped; lint result remains unverified. TypeScript completed successfully. Shared STL route also verified to contain all nine cards. No production build or deployment performed.

Publication authorized October 23: user requested commit and push to production. Fresh targeted ESLint passed. Clean release build (only the five reviewed files over HEAD) passed compilation, TypeScript, and all 42 generated pages. The earlier lint delay is resolved. No synthetic test route included.
