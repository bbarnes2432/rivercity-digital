# Hero performance pass — September 14, 2026

The website-design page keeps its original hero composition, portal reveal, glowing ribbons, spring grid, autonomous mobile light, and scroll entrances. The optimization changes how that work is scheduled and reused.

## Comparable mobile measurements

Three runs before and three after, using a local **production build**, Lighthouse 13.4.1, the same Chrome installation, simulated slow 4G, 4× CPU slowdown, and Moto G Power viewport (412 × 823, DPR 1.75). Medians are calculated independently for each metric.

| Metric | Before | After |
| --- | ---: | ---: |
| Performance score | 76 | 84 |
| Total blocking time | 396.5 ms | 170 ms |
| Largest contentful paint | 4.07 s | 3.97 s |
| First contentful paint | 1.51 s | 1.51 s |
| Speed index | 3.33 s | 3.17 s |
| Cumulative layout shift | 0 | 0 |

Individual scores: before **73, 76, 77**; after **84, 83, 84**. Blocking time improved about **57%**. This does not establish a conversion-rate increase or a public PageSpeed score of 84. The agency's earlier 34-point result used another page revision and test environment and is not this experiment's baseline. LCP remains above the 2.5-second target; the opening reveal was deliberately preserved.

## Implementation

- Compile and link the background shaders together. On browsers with `KHR_parallel_shader_compile`, poll completion without synchronously stalling the page. Browsers without the extension retain the complete shader through the normal compilation path. The existing gradient remains the failure fallback.
- Calculate identical color-center positions once per fragment and reuse them across all five blur taps. Remove shader helpers that this effect never called. Palette, detail, blur, grain, resolution, movement speed, and pointer response settings remain the same.
- Batch pointer-related geometry reads and resize the shader backing buffer only when its layout changes. Stop requesting scroll measurements while it is offscreen.
- Replace the studio's perpetual mask-measurement loop with cached elements, visibility/resize observers, and coalesced updates. Track moving masks throughout their entrance and hover animations. The homepage keeps its existing 3D occlusion path.
- Skip ribbon geometry updates and GPU drawing when a light section completely masks the canvas. Resume automatically when it can be seen again. The mobile path and the existing desktop/mobile geometry settings are unchanged.
- Cancel the matrix animation callback entirely offscreen and in hidden tabs, restarting it with a fresh frame timestamp when visible.

The nonblocking compilation path follows the [Khronos extension specification](https://registry.khronos.org/webgl/extensions/KHR_parallel_shader_compile/).

## Appearance and behavior verification

- Original versus optimized shader pixels compared at 320 × 568, 412 × 823, and 1440 × 790, each at four identical time/pointer states. Twelve cases completed without WebGL errors. Maximum channel difference was 1/255, affecting at most nine channels in any tested frame; most pixels were identical. This checks the sampled frames on the available GPU, not every device/driver.
- Desktop and mobile browser review: hero renders, light sections mask the effect, drawing is marked covered within a full-height mobile project section, and the glow resumes in the systems section. All five comparison topics and four systems examples remain available; no horizontal overflow or stranded visible entrance content was found.
- A touch-emulated Lighthouse capture shows the autonomous mobile ribbons. Physical iPhone/Android validation was not available.
- `pnpm lint` and `pnpm build` pass.
- 17 performance/lifecycle checks, 20 motion checks, and 40 mocked lead-route checks pass. They cover compilation readiness/fallback/unmount, coalesced layout reads, mask updates during transitions, offscreen suspension/resume, mobile autonomy, reduced motion, and lead handling. No real lead or phone/booking conversion was submitted.
- Forms, Google Ads tags/conversion handlers, attribution code, navigation, content, styles, hero reveal timing, and CTA hierarchy were not edited.

## Evidence and reproduction

Reference commit before optimization: `27560de`.

Raw Lighthouse reports/traces, fixed-time shader comparison fixture/results, screenshots, and metrics are saved locally in `D:/River City Ads/performance-2026-09-14/`. `before-*.json` and `after-*.json` are the comparable final sets; `intermediate-*` records the first candidate before nonblocking compilation. The final scrollbar-width mask correction affects the full-section pause check, not the hero load scenario measured above.

Lighthouse command (run three times against each production build):

```powershell
pnpm build
pnpm start --port 3002
npx --yes lighthouse http://127.0.0.1:3002/website-design --only-categories=performance --output=json --output-path=report.json --chrome-flags="--headless" --quiet
```

The CLI intermittently reported Windows EPERM while cleaning its temporary Chrome profile **after** saving complete reports. The reports have no Lighthouse runtime error; metrics and traces were checked rather than treating that cleanup exit as a failed page audit.

Remaining work for a separate performance decision: repeat public PageSpeed on the deployed revision and test physical phones. If further gains require changing the reveal or rendering quality, compare that proposal visually before adopting it.
