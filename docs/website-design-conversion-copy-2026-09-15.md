# Website-design landing page: copy and conversion audit

Date: September 15, 2026  
Page: `/website-design`  
Baseline: `9be1950`

## Recommendation

Move the portfolio below a short explanation of the custom-build offer, while keeping it near the top. Let visitors understand the offer and then see the work. Do not put the entire comparison table or the custom-dashboard section ahead of the examples: those sections are long, especially on a phone.

The page should first answer the needs of someone looking for a website designer. Dashboard development is an additional capability, so it now follows the website examples, SEO, comparison, and build deliverables.

These changes address observable copy and navigation issues. They are conversion hypotheses, not evidence of an increase in leads or a Google Ads performance improvement. This review did not inspect the current campaign, search terms, bidding configuration, or qualified-lead results.

## Findings and implemented changes

| Area | Finding | Change |
| --- | --- | --- |
| Hero | The supporting copy described service categories. The mockup offer was a small text link beside a much stronger call button. | Explain the visitor benefit: clear services and easy contact. Give the mockup its own outlined button, 58px tall, full width on phones. Retain the call action, original headline, logo, and hero effects. |
| First section | Visitors saw portfolio work before an explanation of the offer. Moving all the comparison content above it would bury the visual proof. | Extract a concise introduction with the existing photo and three visible benefits: design review, planned service pages/SEO, and code/domain ownership. Keep a shortcut to the full comparison. |
| Portfolio | Clicking anywhere on a project immediately navigated to a case study. The short descriptions did not explain much of the actual project scope. | Image clicks open an accessible native dialog on this page. All three project summaries and scope bullets remain visible without interaction. Full case studies are explicit secondary links. Add a mockup CTA immediately after the work and inside each preview. |
| Case-study journey | Visitors who chose to explore a case study reached a different contact offer. | Make the shared case-study navigation and closing CTA return to `/website-design#start`. Add a closing link back to the website examples. |
| Project copy | The portfolio needed concrete evidence rather than broad claims. | Describe booking, treatment/pricing information, service-area pages, product availability, checkout, and email signup using the existing project records. Correct Mend's six-page detail to **service-area pages**. Do not invent sales or traffic results. |
| SEO | SEO existed in a small deliverable card and the comparison, but had no dedicated explanation. | Add a visual search-to-service-page section covering useful service content, local relevance, crawlable structure, metadata, sitemaps, relevant structured data, and redesign redirects. Distinguish build foundations from separately scoped ongoing SEO. |
| Build deliverables | A new SEO section would duplicate the small SEO card. | Use that card for ownership, account access, hosting flexibility, and handover. |
| Dashboards | Feature labels did not make the financial or day-to-day benefit clear. | Explain fewer repeated entries, less status chasing, fewer duplicate product records, and fewer file-request emails. Preserve all four interface examples and their visible explanations. |
| Long-term cost | The section mentioned ongoing costs without making the decision concrete. | Add a labeled illustrative calculation: $300/month in subscriptions is $10,800 over 36 months. Compare that spend with development, migration, hosting, support, and retained services. Explain that integrating an existing tool can be the better choice. |

The savings example is arithmetic, **not a customer result, custom-build quote, or net-savings claim**. Actual savings depend on which subscriptions can be retired, the project cost, ongoing costs, migration effort, and useful time recovered. Time recovered can add capacity without reducing payroll. No verified customer savings figures were supplied for this revision.

## Final section order

1. Hero: website design, call, and free mockup.
2. Concise custom-build introduction.
3. Client website examples and on-page previews.
4. Dedicated SEO section.
5. Full custom / WordPress template / Wix comparison.
6. Website deliverables and ownership.
7. Custom dashboards and long-term cost explanation.
8. Process.
9. Local studio and existing client testimonial.
10. Existing mockup form.
11. FAQs and footer.

The hero's “Explore the work” shortcut remains. All five comparison topics and all four dashboard examples remain visible in the page; the modal is only for enlarging a website image. It does not hide essential benefits behind tabs or buttons.

## Do case-study links hurt Google Ads?

An internal case-study link is not inherently a Google Ads problem. Google's landing-page guidance emphasizes relevance to the ad, useful content, clear actions, straightforward navigation, and mobile usability. It does not establish a blanket rule that a landing page must have no internal links. Keeping optional proof available while making the inquiry path easier is the recommendation drawn from that guidance. [Google Ads: Optimize your ads and landing pages](https://support.google.com/google-ads/answer/6238826?hl=en)

Google's website conversion measurement uses first-party cookies to retain ad-click information for later conversion measurement. An ordinary same-domain page visit does not inherently erase that information; tracking still depends on the actual tag configuration, browser/consent behavior, and conversion window. [Google Ads: How Google Ads tracks website conversions](https://support.google.com/google-ads/answer/7521212?hl=en)

In this repository, the Google tag is sitewide and campaign attribution is captured for later form submissions. Case-study links remain in the same tab, preserving the existing session-storage attribution path. The attribution and enhanced-conversion regression checks pass. Opening a project preview does not call a conversion function. No tracking labels, success triggers, campaign settings, or lead endpoints were changed.

The practical question is whether people who view the work become qualified inquiries. Some visitors need that proof before they will call. Others will be distracted by an unnecessary navigation step. The new default preview removes that step while retaining a deliberate route to the full case study.

## Google Ads priorities after release

1. **Check the ad-to-page promise.** Website-design searches should reach a website-design offer, with the advertised service, location, and next step immediately understandable. If an ad promises a free mockup, its wording should match the actual follow-up and preview process. Avoid unsupported delivery times, ranking guarantees, and claims of guaranteed savings.
2. **Measure qualified outcomes.** Evaluate completed mockup requests, qualified calls, appointments, proposals, and won projects. Compare cost per qualified lead and lead-to-sale rate, alongside raw form volume. A free offer can produce more inquiries without producing more suitable projects.
3. **Keep browsing actions out of primary conversions.** Preview opens, portfolio clicks, scroll depth, and CTA clicks can help diagnose behavior, but are not completed leads. This change adds no such conversion events.
4. **Keep search intent focused.** Dashboard/software development can support the website offer here. If separately buying searches for CRM or custom-software development, use a matching ad group and purpose-specific page instead of forcing every search intent through the website-design story. No campaign changes were made in this task.
5. **Improve proof with verified results.** When available, add a short customer example with a documented starting point, scope, measurement period, and outcome. Real recurring costs retired or hours recovered would be stronger than the current illustrative calculation. Obtain permission for any customer details used publicly.
6. **Evaluate one coherent change at a time.** Record the release date and compare equivalent traffic by device and search intent after leads have had time to qualify. Where volume supports it, use a controlled experiment. Avoid declaring a winner from a few form submissions or a simple before/after comparison affected by campaign changes.
7. **Continue performance work based on repeatable evidence.** Preserve the premium hero. The new SEO and savings graphics use HTML/CSS and existing icons rather than video or additional image assets. The gallery uses existing optimized images; the larger preview is requested only after opening it. A fresh Lighthouse or field-performance result was not measured in this copy task.

## Verification

- Production build, including TypeScript and static generation: passed.
- ESLint: passed.
- 119 existing isolated regression checks passed: attribution (11), sitewide attribution (7), enhanced conversions (14), Google forwarding numbers (8), lead routes (42), motion (20), hero performance behavior (17).
- Responsive browser review at 1440 × 1000 and 390 × 844, plus narrow-width overflow checks at 320 × 740.
- All three project previews open with the correct image. Close control, Escape, backdrop dismissal, focus restoration, and body-scroll restoration checked. Native dialog provides modal semantics and background inertness.
- Preview-to-form CTA lands at the visible form heading. The case-study CTA returns to the same form on mobile, below the fixed navigation.
- New SEO and cost layouts fit the mobile viewport without horizontal page overflow. All comparison topics and dashboard examples remain in the rendered page.
- No captured browser warnings or errors during the checked journeys.
- Form and tracking checks use mocks. No production lead, email, phone call, or test conversion was submitted in this task.

Browser checks cover responsive layouts in the desktop browser, not a physical-phone lab. The automated motion checks separately cover the touch/coarse-pointer path and reduced-motion behavior. Actual conversion impact requires campaign and lead-quality data after release.
