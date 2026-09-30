# Chicago hero playlist and selected work

Later local update: the Chicago-specific restyle is documented in `CHICAGO-RESTYLE-REVIEW-2026-09-29.md`. It retains this playlist and portfolio work, changes the page-version marker to `chicago-studio-2026-09-29`, and suppresses the competing audit popup on Chicago. Both batches remain unpublished.

Local preview: http://127.0.0.1:3032/chicago-web-design

The user requested all four supplied Chicago clips in the hero, beginning in daylight, and replacement of Sauce Fix with High Life Journeys and Linda's Cheesecakes. Base: main e77cef3f32fda8d01576ac834b9ca83ebe59ae4c. This is a local review build; no commit, push or publication has been performed for this change.

## Hero

Daytime skyline → lifting bridge → sunset skyline → Bean at night → repeat. The sequence lasts approximately 45 seconds. The three new clips use silent H.264 fast-start encodes at 24 fps, with 1440×810 desktop and 576×1024 mobile versions. The existing Bean encodes are reused. All original source videos remain untouched outside the repository.

Only the first clip loads initially; the next clip buffers in the last three seconds and keeps the same video element when activated. No more than two hero players are mounted. Pause/play, offscreen and hidden-tab pausing, reduced-motion still image, failure skipping and all-failed daytime-poster fallback are retained. Mobile control spacing has a more specific CSS selector so its intended spacing wins over the shared hero form rule.

Initial video transfer is approximately 2.24 MB desktop / 0.93 MB mobile. Playback through the entire sequence fetches the remaining clips as needed; a larger total transfer is the tradeoff for showing all four. Media metadata and source mapping are recorded outside the repository in the management project's local `chicago-playlist-20260929` report folder.

## Portfolio

The shared selected-work gallery on Chicago, St. Louis paid and the regular website-design page now has five projects: Wellness Collective, Mend Health, St. Joseph Boat Rentals, High Life Journeys and Linda's Specialty Cheesecakes. Sauce Fix was replaced in this gallery only. Existing unrelated case-study pages and assets remain available.

High Life uses the already-prepared local live-video hero demonstration, including pause/reduced-motion/static fallback. Linda's uses its existing homepage screenshot and enlargement dialog. Descriptions were checked against their public websites on September 29. Paid routes retain in-page previews; the normal service page retains external website links.

## Scope and validation

All twelve sections, brand colors, navigation policy per route, mockup form, calls, VSLs and tracking behavior remain. The shared page-version label is `chicago-playlist-portfolio-2026-09-29`.

Lint and the production TypeScript/build checks pass (41 generated routes). Isolated browser checks cover 1280/390/320 widths, the complete sequence and repeat on desktop/mobile, initial responsive downloads, reuse of the buffered player, keyboard/manual pause, offscreen pause/resume, motion preference changes, a failed first clip, all failed clips, both replacement preview dialogs and both St. Louis routes. External analytics and all API delivery are intercepted during testing; no real lead or call is generated.

The user's separate popup-tracking question was investigated without changing the popup or Google Ads configuration. Its successful audit handler sends the same primary Lead form submission action as the mockup form; Chicago is missing from the existing popup suppression list. Detailed read-only findings live in the management client audit `2026-09-29-chicago-audit-popup-tracking.md`.
