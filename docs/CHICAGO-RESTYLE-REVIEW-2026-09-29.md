# Chicago landing page — local design review

Preview: http://127.0.0.1:3032/chicago-web-design

Status: local working-tree changes only. Not committed, pushed, or published. Built on main `e77cef3f32fda8d01576ac834b9ca83ebe59ae4c`, including the previously requested four-video playlist and portfolio replacements.

## User direction

“The landing page is kinda ugly and AI slop. Can we keep the colors but restyle it by doing things differently than your default template? I want this to really look nice, the copy to be straightforward and for it to be designed to convert traffic.”

The Chicago route now has its own composition. The St. Louis paid page and regular website-design page keep their existing presentation. Shared components receive optional Chicago variants, with their existing defaults retained.

## Design and copy

- A wide Chicago film hero leads with “Custom websites. Built for business.” The four supplied clips still cycle from daytime skyline to bridge, sunset, and the Bean at night. Pause controls, mobile encodes and reduced-motion poster remain.
- A compact cream inquiry strip presents the same free-mockup form directly under the film. On desktop its fields sit in one row; on mobile they stack. The offer explains the next step plainly, with no public price or budget requirement.
- Subsequent hero correction: the desktop film now has a full-width 16:9 area, at least the available viewport height, with the full video frame preserved. The form follows below the hero. Prominent “Request my free mockup” and outlined “Call our team” buttons sit over the video beneath the supporting copy, stacked on mobile. They replace the small “See our work” link and duplicate hero footnote call link. The mockup button reaches the existing form; the call button retains the tracked `chicago-hero` context.
- Five actual projects appear in one keyboard-accessible gallery, with High Life Journeys and Linda’s first. Visitors can switch projects, pause animated previews and enlarge them without leaving the paid page. Linda’s remains an honest static homepage preview.
- The custom-build section uses the actual Mend Health desktop/mobile screens. The mockup illustration, VSL, family-owned introduction, SEO section, five comparison topics, six illustrated benefits and process remain.
- Chicago’s comparison and FAQ copy is shorter. At the user's subsequent request, St. Louis references were removed from the hero, studio introduction, FAQ, footer and page/social metadata. The FAQ describes remote collaboration without claiming a Chicago office. The page distinguishes the free preview from the paid website build and avoids promised search rankings or revenue.
- One verified Angelita quote appears in the studio section. It is not repeated in the compact form.
- Existing brand navy, cream, blue and navigation accent `#4CA5AD` remain. Strong condensed typography, flatter surfaces and varied section layouts replace repetitive cards. At the user's subsequent request, the cursor effect is removed from Chicago only. Video, portfolio and section animations remain; other pages keep their cursor behavior.
- The separate free-audit popup is suppressed on the Chicago page and its confirmation route. Mockup and call options remain at the top, bottom and mobile sticky contact strip. Navigation stays within the paid page; policies open in dialogs.

## Form and measurement

Name and email remain required. Phone, business/website and design ideas remain optional. Contact delivery, attribution fields, accepted-receipt handling, thank-you destination, Google Ads conversion action and phone tracking are unchanged. No Google Ads account setting or destination was changed.

The shared page-version marker is now `chicago-studio-2026-09-29`; this marker alone does not mean the design is published. The Chicago-only `data-design` attribute identifies the new composition.

## Validation

- ESLint and production build/TypeScript pass; 41 generated routes. `git diff --check` passes.
- Twelve isolated browser scenarios pass: five widths (1440, 1024, 768, 390, 320), reduced motion, four form outcomes and both St. Louis routes.
- Checked the daytime-first playlist and full desktop cycle, video pause, all five gallery choices, keyboard controls, enlargement/close, FAQ, policy dialog, anchors, phone destinations, image loading and no horizontal overflow.
- Mocked successful contact delivery queues exactly one conversion with its receipt ID. Reload does not queue another. Failure, development and ignored responses queue none. Required-field validation and failed-submission input retention pass.
- No production lead, email, phone call or Google conversion was sent. All test API requests and external analytics were intercepted. Actual inbox delivery and Google Ads ingestion were not retested.
- Final light-section mask adjustment received another production build, lint and desktop/mobile visual check. Browser evidence is stored in the management runtime report folder `chicago-restyle-20260929`.

This design has not been tested against paid traffic. Improved conversion rate is an objective, not an established result. Review locally before publication.

Follow-up copy validation: production build and scoped ESLint pass. Local browser returns HTTP 200, plays the hero video, contains no St. Louis reference in the landing-page body or page/social metadata, and has no cursor layer. Chicago's confirmation footer also uses neutral wording; the St. Louis route retains its own footer. Existing legal policy documents and organization identity schema were not rewritten. The preview was restarted on port 3032 after rebuilding.

Follow-up hero validation: production build, scoped ESLint and diff check pass. Browser views at 1910×946, 1440×900, 390×844 and 320×740 confirm both hero actions are visible on the first screen, no horizontal overflow, working mockup anchors and a valid tracked phone destination. Hero video playback and pause pass. Screenshots are in the management runtime report folder `chicago-hero-cta-20260929`. No form submission or call was made. The preview now uses the development server bound explicitly to `127.0.0.1:3032` so local edits update without repeated production-preview restarts. No site configuration change was needed.
