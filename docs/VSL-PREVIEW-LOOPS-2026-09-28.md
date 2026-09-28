# New St. Louis and Chicago VSLs with silent preview loops

User request (2026-09-28): put the approved River City VSLs on the web design landing pages, then publish all local changes.

`/website-design` (St. Louis) and `/chicago-web-design` each show their own VSL in the existing video section below the hero, under the heading "See how we build your new website." Files in `public/assets/vsl/`: the St. Louis film (1:29, 31 MB) and the Chicago film (1:35, 26 MB), each 1080p H.264 with a poster and a silent 8½-second preview loop (0.3–0.4 MB) from the film's free-mockup section. The home page keeps its "Why River City Digital" video.

`HookVideo` takes an optional `previewSrc`: the muted loop plays under the CTA once the player is near the viewport, pauses offscreen, and never runs with reduced motion (the poster shows instead). The CTA moves to the bottom so the loop stays visible; pressing it plays the full film from the start with sound and native controls, as before. Pages without `previewSrc` (home, local SEO) are unchanged.

The Chicago film never names St. Louis; the page's own copy is unchanged from the September 24 draft.

Validation: ESLint, TypeScript and a production build (37 routes). Headless Chromium against the production build at 1440 and 390 px on both landing pages: the preview loop plays, the button starts the film with sound and controls, and the other main routes return 200. `/api/funnel` answers 403 to the local test origin only (it accepts the public site origins). No form was submitted.
