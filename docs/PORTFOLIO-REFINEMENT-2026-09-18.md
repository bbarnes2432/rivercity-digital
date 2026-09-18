# Landing-page portfolio refinement

User requested a stronger presentation of the example websites, replacement of Sauce Fix with High Life Journeys, and advice on live examples and landing-page navigation. This is a bounded portfolio update following the restoration at cc2726f. It preserves the entire restored page, hero/effects, navigation, top mockup form, phone options, branding, delivery, conversion and ClickCease implementation.

## Changes

- Featured Wellness Collective presentation and larger Mend Health / High Life Journeys cards, with browser-style framing, full-aspect screenshots, descriptive copy and actual implementation details. No numerical outcomes or new business promises.
- High Life replaces Sauce Fix in the landing-page selection. Legacy, unused components and the separate Sauce Fix case study are outside this change.
- Native enlarged-preview dialog; explicit external live-site links open a separate tab using noopener/noreferrer. A dialog CTA returns to the existing mockup form and transfers focus there; ordinary closing returns focus to the trigger.
- New screenshot is an existing user project asset from D:/inland-empire-digital/public/portfolio/highlife.png, converted to WebP: 1920x1080, 86,578 bytes. No generated or fabricated site image.
- Image loading is lazy, dimensions reserved, and motion respects the existing reduced-motion system. No new runtime dependency or third-party embed on initial load.
- Page version: portfolio-preview-2026-09-18.

## Inline live-preview investigation

High Life, Wellness and Mend returned HTTP 200, with no X-Frame-Options or CSP header in the inspected responses. That alone does not establish reliable embedding. A click-activated iframe implementation was tested locally; High Life and Mend rendered blank in the available in-app browser. A separate plain HTML control with both sandboxed and unsandboxed High Life frames also remained about:blank. The direct High Life website loaded normally. The failure's cause is not established.

The final implementation uses the verified screenshot dialog and actual-site links; it does not ship the unverified inline feature. A future embed should be opt-in, one-at-a-time, removable on close, with a clear live-site fallback, tested in regular desktop/mobile browsers and for keyboard navigation. Do not silently autoplay several complete client websites or claim their WebGL has been verified inside this page. No client security headers were altered.

## Validation

- ESLint, production build and build TypeScript check passed.
- 57 existing network-free checks passed: recovery observability (20), studio motion (20), hero performance/masks (17).
- Desktop 1280px and mobile 390px / 320px: all 12 sections, one form, no horizontal overflow, matched navigation/form brand colors and existing hero canvases.
- High Life screenshot loads; dialog dismissal restores focus and scrolling; mockup CTA reaches the existing form. External links use verified domains and a new tab.
- No live form submission or phone call, Ads mutation or claimed conversion improvement.

## Recommended next changes, not included

1. Compact authentic review beside the form after confirming the original review URL.
2. An owner-approved example of what the free mockup contains; no invented deadline or scope.
3. Owner-approved starting price/range and ongoing-cost explanation if appropriate for lead qualification.
4. Test a focused header with in-page Work, Process and FAQ links plus Call / Free mockup, retaining branding and business identity. Keep the current dedicated /website-design URL; no separate domain is needed. Navigation changes are advice, not part of this release.

Google's guidance supports relevant content, a clear next action and easy navigation, not a universal rule to remove every link. Competitors' own conversion rates are unavailable. Judge this iteration by received qualified inquiries and their acquisition cost rather than preview clicks.

Sources: https://support.google.com/google-ads/answer/6238826?hl=en ; https://blog.google/products/ads-commerce/search-ads-and-the-importance-of-landing-page-navigation/ ; https://web.dev/learn/performance/lazy-load-images-and-iframe-elements ; https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors . Reviewed September 18, 2026.
