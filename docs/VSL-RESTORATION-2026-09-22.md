# Homepage video restored to website-design

User request: "For the river city landing page. There used to be the VSL and we removed it a while back. It’s the video that is on the homepage. Can we add that back to the landing page?"

Adds the existing homepage video and poster directly below the hero/form, before the mockup explanation. Reuses HookVideo with an optional preload prop; landing uses none and the homepage keeps its existing metadata default. Playback requires a click or keyboard activation, includes sound and native controls, and uses the existing brand palette. No new sales CTA, video asset, player dependency or conversion goal.

Keeps the form, phone links, portfolio, all existing sections and animations. Version identifier: clear-mockup-live-work-vsl-2026-09-22.

Validation: lint, TypeScript, production build (35 routes), 20 isolated funnel checks, 12 rendered HTML checks, and browser inspection at desktop/390/320 widths. Initial video readyState is 0; click and keyboard playback work with controls and no media error. No horizontal overflow. No production form submission or call.

Release verification and commit are recorded in the agency project receipt.
