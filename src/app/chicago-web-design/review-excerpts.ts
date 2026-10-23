// Manually verified on River City Digital Co.'s Google Maps listing, 2026-10-23.
// Short verbatim excerpts, not a live feed. Keep names and wording unchanged.
// All nine published reviews were five stars when checked; no rating filter.
export const REVIEW_PROFILE_URL = "https://www.google.com/maps/place/River+City+Digital+Co./@38.7228711,-91.21713,9z/data=!4m8!3m7!1s0x66954ae612f3c381:0x8ab470f6e86696bc!8m2!3d38.724723!4d-90.557713!9m1!1b1!16s%2Fg%2F11nhyy4z1b";
export const REVIEW_EXCERPTS = {
  rating: 5,
  count: 9,
  checked: "October 23, 2026",
  profileUrl: REVIEW_PROFILE_URL,
  reviews: [
    { author: "Daniel Barnes", text: "Phone is ringing more and Im getting jobs from people finding me on Google." },
    { author: "Angelita Pritchett", text: "The process has been incredibly collaborative and stress-free." },
    { author: "Payton Q", text: "Great work and got it done super quick! Was exactly how I wanted it! Definitely recommend!!" },
    { author: "Crystal B.", text: "Brandon got it up and going super quick and he’s always ready and willing to help make changes as needed to it." },
    { author: "Elliot Whitman", text: "The site looks amazing and extremely fast when you look the site up  they do great work." },
    { author: "Amanda Cruz", text: "They reach out and let me know about leads that have come through, they go above and beyond!" },
    { author: "Jay F", text: "These guys took the reins from the start!  Talked to me about everything. Not AT me but, TO me." },
    { author: "Samantha Hoggard", text: "They went above and beyond creating a beautiful website for us, and have been so responsive when we are needing updates and what not." },
    { author: "Jennifer Morrow", text: "From the beginning, my experience with River City Digital has been nothing but genuine, professional, and expedient." },
  ].map(review => ({ ...review, rating: 5, url: REVIEW_PROFILE_URL })),
};
