# Chicago mobile hero loading

The September 30 request authorizes improving mobile loading while retaining the
hero videos. This release changes only the Chicago media loader and its poster
preloads. It does not change page copy, visuals, form handling, tags or Ads settings.

- Keep the first daylight poster mounted across hydration and all four cuts.
- Preload only the poster matching the viewport, at high priority.
- Decode and paint that poster before scheduling the video player.
- Select one supported format and one viewport size per player. WebM errors can
  fall back to MP4 once; an exhausted clip is skipped.
- Keep all four owner-supplied clips, daytime first, with one upcoming clip buffered
  near the end. Preserve pause/resume, offscreen/document-hidden pausing and the
  reduced-motion poster fallback. The separate VSL remains click-to-play.

## Verification

Lint, TypeScript and the 41-route production build passed. Existing isolated
checks passed: conversion handoff 61, website calls 8, lead routes 42. These use
mocks; they are not production conversion evidence.

Codex internal-browser QA at 1440, 390 and 320 viewport widths showed no horizontal
overflow. All four mobile clips played in sequence; pause/resume and the mockup
anchor worked. The local production preview was measured through a read-only
HTTP request logger (POSTs blocked), with browser cache disabled by response
headers. On the fresh phone navigation at 01:13:24 UTC October 1, the first poster
was 41,862 bytes; the first video was 694,969 bytes. Subsequent mobile WebM files
were fetched at roughly 8, 18 and 29 seconds. No desktop video or MP4 alternative
was requested during that mobile rotation. The video source, not only CSS size,
was verified in the rendered DOM. Desktop selected desktop WebM.

The earlier public PageSpeed run scored 63 mobile with 8.8-second LCP. That is a
lab baseline. Local request observations are not a comparable Lighthouse score,
field performance measurement or forecast of conversion improvement.

## Separate tracking and protection audit

One authorized, clearly labeled production form test reached the Chicago
thank-you page, and the user confirmed inbox receipt. Exclude this synthetic test
from genuine lead reporting. Do not resubmit it.

The configured form destination matches action 7728447591. Actual ad and website
calls retain 60-second thresholds; phone taps are secondary. Tag Assistant found
AW-18272669855, but its window connection did not retain the test's conversion
event. This audit therefore does not prove Google received that event or counted
an attributable conversion. No actual phone call was placed.

ClickCease shows rivercitydigitalco.com Tag Management and Paid Marketing both
Connected. Google account 6000154303 has IP Blocking and Full Protection selected,
which explicitly includes newly added campaigns. No setting was saved. The
separate Bot Mitigation product is not configured. Ads protection is not a
guarantee that every invalid click will be prevented.

Five earlier local design files were already modified when this work began.
Those edits are excluded from this performance release and must be preserved.
