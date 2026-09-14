# Landing-page follow-up — September 14, 2026

The website-design form links now land on the form heading and first field. The shared attribution capture and contact API accept `gbraid` and `wbraid`. Hero rendering, visual settings, entrance animations, copy, and conversion event handlers are unchanged in this follow-up.

## Form navigation

Moved the existing `#start` target from the outer contact section to the form's heading. Native fragment navigation focuses a non-input target, so a keyboard user can press Tab to enter the name field without automatically opening a phone's keyboard. The form retains `wd-mockup-form`, which its sticky-contact observer uses, and now has an accessible name.

The heading uses a 98px desktop / 88px mobile scroll offset to clear the fixed navigation. Browser viewport checks after scrolling settled:

| Viewport | Link tested | Heading top | Name field top–bottom |
| --- | --- | ---: | ---: |
| 390 × 844 | Hero mockup link | 88px | 264–316px |
| 320 × 568 | Sticky Free mockup | 88px | 279–331px |
| 1440 × 900 | Desktop navigation Free mockup | 98px | 248–300px |
| 390 × 844 | Direct navigation from another page to `/website-design#start` | 88px | 264–316px |

The sticky bar hides when the form is in view. No horizontal overflow was found. Keyboard focus moves to the heading, and the next Tab reaches the name field. Screenshots were inspected. These are desktop-browser viewport tests, not physical iPhone/Android tests or an on-device keyboard check.

## Attribution and conversion scope

Added the two identifiers to the existing shared capture whitelist and contact API whitelist. They follow the existing session-only, first-touch-wins policy and travel with the lead form to the lead-delivery email. Values are decoded, trimmed, and capped at 300 characters. Unknown parameters and non-string API values are ignored. Existing GCLID, UTM, and Meta attribution remain supported.

This adds identifier retention for the website-design/shared capture path; it does not configure offline conversion imports, establish support for any particular import method, or change the separate Quad Cities capture module. Google Ads tag IDs, conversion labels, consent behavior, success handling, phone events, and booking events were not edited. No live leads, phone calls, or booking conversions were submitted during testing.

Validation: 11 attribution checks and 42 mocked lead-route checks pass; `pnpm lint`, `pnpm build`, and `git diff --check` pass. The tests cover navigation retention, first-touch behavior, old sessions, blocked storage, invalid stored JSON, bounds, malformed identifiers, and lead delivery/error paths.

## Live performance verification

These measurements target `https://rivercitydigitalco.com/website-design` before the form/attribution follow-up was deployed. Its served hero chunk includes the previously shipped `KHR_parallel_shader_compile` optimization. These are measurements of the deployed hero optimization, not a performance before/after test of the form change.

### Google-hosted PageSpeed

The first request at 1:38 PM EDT timed out. The retry at 1:42 PM EDT completed with this [Google-hosted mobile report](https://pagespeed.web.dev/analysis/https-rivercitydigitalco-com-website-design/f2aoqunxjt?form_factor=mobile):

| Metric | Result |
| --- | ---: |
| Performance | **33** |
| First contentful paint | 3.1s |
| Largest contentful paint | 6.1s |
| Total blocking time | 27,200ms |
| Speed index | 13.9s |
| Cumulative layout shift | 0 |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 |

The report uses Lighthouse 13.4.1, emulated Moto G Power, slow 4G, and HeadlessChromium 151.0.7922.173. It has **no real-user field data**. Automated category scores do not replace manual accessibility testing.

Its main-thread breakdown assigns 38,006ms to “Other,” 2,104ms to script evaluation, and 181ms to style/layout. Many long tasks point to the hero's first-party chunk. The report does not by itself identify a specific WebGL call as the cause.

### Lighthouse CLI against the live URL

Three sequential runs used Lighthouse 13.4.1, HeadlessChrome 153 on the available Windows machine, the same mobile preset, simulated slow 4G, and 4× CPU slowdown:

| Run | Score | FCP | LCP | TBT | Speed index | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 67 | 3.04s | 6.53s | 116ms | 5.16s | 0 |
| 2 | 93 | 1.23s | 2.78s | 139.5ms | 3.48s | 0 |
| 3 | 93 | 1.26s | 2.81s | 144ms | 3.46s | 0 |
| Median | **93** | **1.26s** | **2.81s** | **139.5ms** | **3.48s** | **0** |

All three JSON reports have no Lighthouse runtime error or run warnings. The CLI reported a Windows temporary-profile cleanup error after saving them. The first run's slower paint metrics remain included; no cause for that variation is asserted.

A separate diagnostic run requesting ANGLE/SwiftShader software graphics scored 71 with 994ms TBT. It did **not** reproduce Google's 27.2-second TBT or its dominant “Other” time. Graphics/browser environment differences are a hypothesis, not a confirmed explanation. This run is excluded from the three-run median because its settings differ.

### Remaining performance decision

The earlier local production median of 84 and this live CLI median of 93 are **not** Google's hosted score. The public mobile performance issue remains open. Do not present the higher lab score as proof that mobile performance is solved or that conversions improved.

The next useful evidence is a physical low-end Android/iPhone check and a trace that reproduces the hosted rendering slowdown. Preserve the hero composition and effects while identifying the costly rendering calls. Any proposal to change resolution, motion, reveal timing, or visual detail needs a visual comparison before adoption; this follow-up makes none of those changes.

## Evidence

Local evidence directory: `D:/River City Ads/conversion-followup-2026-09-14/`.

- `form-390x844.png`, `form-320x568.png`, `form-desktop.png`, `form-direct-mobile.png`
- `google-pagespeed-mobile.txt`
- `live-mobile-1.json`, `live-mobile-2.json`, `live-mobile-3.json`
- `live-mobile-2-0.trace.json` and its DevTools log
- `live-software-gpu.json`, its trace and DevTools log
- `live-hero-chunk.js`, downloaded to verify the optimized deployed implementation

The [preceding hero optimization report](hero-performance-2026-09-14.md) contains the controlled local before/after experiment and visual-equivalence checks.
