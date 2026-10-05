const SHARED_FAQS = [
  ["What do I get with the free mockup?", "A preview of what your website could look like, based on your business, ideas and logo. We talk with you first, then prepare your design direction. No payment details or obligation. The working website is a separate paid project."],
  ["What will my website include?", "We agree on your pages, features and content before building. Your custom design, mobile layout, clear contact options and technical search setup are part of that conversation. You receive a written scope and price before you decide."],
  ["Will my website show up on Google and AI search?", "We build clear service pages, structured content and technical search foundations so search engines can understand your business. Rankings and AI recommendations depend on many factors and cannot be guaranteed. Ongoing content and SEO work are scoped separately. The search graphics on this page are illustrations, not actual results."],
  ["How is a custom site different from a template?", "We design around your content and build the agreed experience instead of starting with a ready-made page layout. WordPress and other platforms can also be customised and perform well. Speed depends on the implementation, content and hosting; no platform alone guarantees it. Hosted builders can limit code portability. We hand over your site's code and domain."],
  ["Will I own the website, and does it need upkeep?", "You own your code and domain when the project is complete. Every website needs appropriate hosting, updates and occasional maintenance. We explain the ongoing services and costs separately, so you know what you are choosing."],
  ["Can you redesign my existing website?", "Yes. We review what you want to keep, what needs to improve, and which pages and links should carry over. Your design and written scope are agreed before development."],
];

export function landingFaqs(market: "chicago" | "st-louis") {
  return [...SHARED_FAQS, market === "chicago"
    ? ["How do we work together?", "You work directly with our family-owned team by phone, email and video call. We plan the project together, review your design, agree on a schedule and get your approval before launch. We serve Chicago and the surrounding communities remotely."]
    : ["Can we meet in person?", "Yes. We’re based in St. Louis and can arrange to meet in person. You work directly with our family-owned team from the first mockup through launch."]];
}
