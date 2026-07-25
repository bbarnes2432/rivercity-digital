export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "pullquote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; eyebrow: string; text: string };

export type Note = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  /* The deck — first paragraph in italic display, sets up the piece. */
  deck: string;
  body: Block[];
};

export const NOTES: Note[] = [
  {
    slug: "ai-search-st-louis-dentist-test",
    title:
      "We asked ChatGPT to recommend a St. Louis dentist 50 times. It named the same handful every time.",
    excerpt:
      "Hundreds of practices in the metro. A handful got named repeatedly — and the difference wasn&rsquo;t clinical.",
    date: "2026-05-21",
    readTime: "10 min read",
    category: "AI Search",
    deck:
      "Here&rsquo;s a thing that&rsquo;s true now and wasn&rsquo;t eighteen months ago: a meaningful share of people looking for a dentist in St. Louis never open Google. They open ChatGPT, or Gemini, or the AI answer sitting on top of their search — and they take the answer at face value.",
    body: [
      {
        type: "p",
        text:
          "So we ran a test. We asked ChatGPT to recommend a dentist in St. Louis fifty times — varying the neighborhood, the phrasing, the specialty (general, cosmetic, pediatric, emergency) — and logged every practice it named. We wanted to know two things. Which practices get recommended. And <em>why those and not the others.</em>",
      },
      {
        type: "p",
        text:
          "The &ldquo;why&rdquo; is the part that matters, because it&rsquo;s the part you can change.",
      },
      { type: "h2", text: "What we found" },
      {
        type: "p",
        text:
          "Two findings stood out before we even got to the analysis.",
      },
      {
        type: "p",
        text:
          "<strong>First: most practices were never mentioned. Not once.</strong> The St. Louis metro has hundreds of dental practices. Across fifty prompts, a small cluster came up again and again, a slightly larger group came up occasionally, and the vast majority — including some large, well-reviewed, decades-old practices — didn&rsquo;t surface a single time. Being established did not protect you. Being invisible to the model did.",
      },
      {
        type: "p",
        text:
          "<strong>Second: the practices that won weren&rsquo;t always the ones you&rsquo;d expect.</strong> A couple of the most-recommended weren&rsquo;t the biggest names in town. They were mid-sized practices that happened to have done a few specific things right — things that have nothing to do with the quality of their dentistry and everything to do with how machine-readable their business is.",
      },
      {
        type: "pullquote",
        text:
          "That gap — between being a good practice and being a findable one — is the whole story.",
      },
      { type: "h2", text: "The three traits the recommended practices shared" },
      {
        type: "p",
        text:
          "When we lined up the practices ChatGPT named repeatedly against the ones it ignored, three structural traits separated them. Not marketing budget. Not age. Not even review count, entirely. These three.",
      },
      {
        type: "h2",
        text: "1. Their business facts were identical everywhere the model could check",
      },
      {
        type: "p",
        text:
          "The practices that got recommended had the exact same name, address, and phone number on their website, their Google Business Profile, their Facebook page, and the big directories — down to the punctuation. &ldquo;St.&rdquo; vs &ldquo;Saint.&rdquo; Suite number or not. &ldquo;Dr. Jane Smith, DDS&rdquo; vs &ldquo;Jane Smith Dentistry.&rdquo;",
      },
      {
        type: "p",
        text:
          "This sounds trivial. It is not. AI models assemble their answer from many sources, and when those sources disagree about who you even are, the model gets less confident about you and reaches for a business it&rsquo;s <em>sure</em> about instead. Consistency isn&rsquo;t a nicety here — it&rsquo;s how the model decides you&rsquo;re real.",
      },
      {
        type: "p",
        text:
          "The ignored practices, almost without exception, had drift. A different phone number on an old directory listing. An address from a location they moved out of in 2019. Two slightly different business names floating around. Every inconsistency is a small reason for the model to trust you a little less.",
      },
      { type: "h2", text: "2. Their site told a machine exactly what they were" },
      {
        type: "p",
        text:
          "The recommended practices had structured data — the behind-the-scenes labels that tell a crawler <em>&ldquo;this is a dental practice, here&rsquo;s its name, here&rsquo;s where it is, here are its services, here&rsquo;s how to reach it&rdquo;</em> — in place and error-free. Dentist or LocalBusiness schema. Named services. A real address block a machine could read without guessing.",
      },
      {
        type: "p",
        text:
          "The ignored ones mostly had a website that <em>looked</em> fine to a human and said almost nothing to a machine. Pretty photos, a booking button, and underneath the hood, no structured signal about what the business actually is. A person can tell it&rsquo;s a dentist. A crawler assembling an AI answer often can&rsquo;t, quickly and confidently, and so it moves on.",
      },
      { type: "h2", text: "3. They had authority signals the model could find and trust" },
      {
        type: "p",
        text:
          "The practices that came up repeatedly had a footprint beyond their own website — mentions, citations, and references on sources the model already trusts. Local press. Legitimate directories. Community involvement that got written about somewhere other than their own &ldquo;About&rdquo; page.",
      },
      {
        type: "p",
        text:
          "This is the hardest of the three to fake and the most valuable to earn. Anyone can write &ldquo;the best dentist in St. Louis&rdquo; on their own homepage. The model doesn&rsquo;t care what you say about yourself. It cares what <em>other trusted sources</em> say about you. The recommended practices had built that, usually slowly, over time. The ignored ones were talking only to themselves.",
      },
      { type: "h2", text: "The uncomfortable part" },
      {
        type: "p",
        text: "None of these three traits is about being a better dentist.",
      },
      {
        type: "p",
        text:
          "You can be the finest clinician in the city, with the gentlest hygienists and the shortest wait times and a wall of genuinely thrilled patients — and if your name, address, and phone drift across the web, your site says nothing to a machine, and no trusted source has ever mentioned you, the AI recommending dentists to your future patients will not know you exist. It will confidently name three other practices, and the person asking will call one of them.",
      },
      {
        type: "p",
        text: "That&rsquo;s not a knock on the model. It&rsquo;s just how it works.",
      },
      {
        type: "pullquote",
        text:
          "It recommends what it can understand and trust. If it can&rsquo;t understand and trust you, your quality never enters the equation.",
      },
      { type: "h2", text: "What this means if you run a St. Louis business" },
      {
        type: "p",
        text:
          "We used dentists because it&rsquo;s a crowded, high-stakes local category and the query is one people genuinely type. But the pattern holds for every local service business we&rsquo;ve tested — HVAC, law, chiropractic, med spas, home services. The three traits are the same. The businesses AI recommends have consistent facts, machine-readable sites, and earned authority. The ones it ignores are usually missing at least two of the three.",
      },
      {
        type: "p",
        text:
          "The good news is that all three are fixable, and most of your competitors haven&rsquo;t fixed them yet. This is early. The businesses that get machine-readable <em>now</em> are the ones AI will still be recommending when the rest of your market finally notices the shift.",
      },
      {
        type: "callout",
        eyebrow: "Where do you stand?",
        text:
          "Whether AI is recommending you, your competitor, or nobody — that&rsquo;s exactly the kind of thing our free audit looks at. No pitch. We&rsquo;ll just tell you what we see.",
      },
    ],
  },
  {
    slug: "ai-search-st-louis-hvac-test",
    title:
      "We tested 47 St. Louis HVAC contractors on ChatGPT. Here&rsquo;s what we found.",
    excerpt:
      "Most weren&rsquo;t mentioned. The ones who were shared three structural traits.",
    date: "2026-04-18",
    readTime: "9 min read",
    category: "AI Search",
    deck:
      "Forty-seven companies, the same prompt run from the same fresh ChatGPT session, three weeks of comparison. The result was lopsided enough that we ran it twice to make sure we hadn&rsquo;t broken something.",
    body: [
      {
        type: "p",
        text:
          "We picked the HVAC category because it&rsquo;s saturated, the searches are intent-rich, and the average local site is built on a stack that hasn&rsquo;t changed since 2018. If AI search visibility is going to matter anywhere, it&rsquo;ll matter here first.",
      },
      {
        type: "p",
        text:
          "The prompt: &ldquo;What are the best HVAC contractors near St. Louis for a same-day repair?&rdquo; Run cold from a fresh session, no memory, no plugins. Captured the response, captured the cited sources, did it again from a different network the next day to control for personalization.",
      },
      { type: "h2", text: "What we measured" },
      {
        type: "list",
        items: [
          "Mentioned by name in the answer body",
          "Cited as a source (visible link)",
          "Appears in the &ldquo;sources&rdquo; expansion (clicked through)",
          "Not mentioned at all",
        ],
      },
      { type: "h2", text: "The headline number" },
      {
        type: "p",
        text:
          "Nine of forty-seven companies showed up at all. Three were named in the body. Six were in the sources expansion. The remaining 38 may as well have not had websites — they didn&rsquo;t exist to the model.",
      },
      {
        type: "pullquote",
        text:
          "Three companies got every meaningful AI mention in a 47-business category. The other 44 were invisible.",
      },
      { type: "h2", text: "What the named companies had in common" },
      {
        type: "p",
        text:
          "We pulled apart the three named companies&rsquo; sites — schema, content, citations, link profile, GBP — looking for the structural pattern that separated them from the 44 who didn&rsquo;t make it.",
      },
      {
        type: "list",
        items: [
          "FAQ schema on the home page that answered the exact phrasing customers use, not the keyword variant.",
          "Real third-party citations: a Riverfront Times feature, a podcast appearance, a chamber-of-commerce profile. AI engines weight third-party text heavily.",
          "A &lsquo;service area&rsquo; page that didn&rsquo;t list 200 zip codes — it listed neighborhoods, with a sentence per neighborhood. Specific beats stuffed.",
        ],
      },
      { type: "h2", text: "What didn&rsquo;t correlate" },
      {
        type: "p",
        text:
          "Domain age. PageSpeed score. Volume of reviews. Number of pages. None of those four predicted whether a contractor showed up. We&rsquo;ve seen this in other categories now too — AI ranking and Google ranking are different games even when they look the same from the outside.",
      },
      {
        type: "callout",
        eyebrow: "If you&rsquo;re running an HVAC business",
        text:
          "Don&rsquo;t panic. The work is the same as the work for being cited well anywhere — clear FAQ schema, real third-party mentions, specific service-area copy. Three things, none of them new. Most local sites just don&rsquo;t have any of them yet.",
      },
      { type: "h2", text: "Why this matters now" },
      {
        type: "p",
        text:
          "ChatGPT crossed 600 million weekly users this quarter. Perplexity grew 5x year over year. Google&rsquo;s AI Overview is now the default for half of US queries. The percentage of local-business decisions that start with an AI answer is going up every month, and the structural traits that make a site citable take 30 to 60 days to land. The cost of waiting is compounding.",
      },
      { type: "h2", text: "What we&rsquo;d do next" },
      {
        type: "p",
        text:
          "Run the same test on your category. Pick a prompt your customers would actually use. See if you&rsquo;re mentioned. If you&rsquo;re not, you&rsquo;ve already learned the most important thing about your AI visibility — and the work to fix it is well-scoped.",
      },
    ],
  },
  {
    slug: "google-business-profile-audit",
    title:
      "What we audit when we audit a Google Business Profile.",
    excerpt:
      "A 17-step checklist we run on every new client. Most owners are at 4 of 17.",
    date: "2026-03-22",
    readTime: "11 min read",
    category: "Local SEO",
    deck:
      "Most Google Business Profile audits are seven items long, posted on LinkedIn by a marketer with the word &lsquo;guru&rsquo; in their bio. Ours is 17. We run it cold the first time we look at a new client&rsquo;s account.",
    body: [
      {
        type: "p",
        text:
          "GBP is the single highest-leverage local search asset, and it&rsquo;s the one most often half-finished. We&rsquo;ve walked into accounts with five-figure ad spends running parallel to a profile that hadn&rsquo;t been updated since 2021.",
      },
      { type: "h2", text: "The 17" },
      {
        type: "list",
        items: [
          "Primary category — does it match the highest-volume customer query, not the most accurate trade description?",
          "Secondary categories — three to five, all relevant; not stuffed.",
          "Business name — exact-match to legal entity, no city or keyword stuffing (Google penalizes this now).",
          "Service area — listed by neighborhood and city, not zip code list.",
          "Hours — accurate, including special hours; updated for holidays this quarter.",
          "Phone — local number, ringing the right person; matched on the website.",
          "Website link — pointing to the page that converts, not the homepage if that&rsquo;s a different page.",
          "Booking link — present if applicable; goes to the booking flow, not a contact page.",
          "Description — uses the customer&rsquo;s phrasing in the first 250 characters; mentions service area.",
          "Photos — at least 30, taken in the last 12 months, including team, exterior, interior, and at-work shots.",
          "Logo — high-res, square, navy background or transparent, not a screenshot of the storefront.",
          "Cover photo — landscape, taken at the building, recognizable from the street.",
          "Services — every service listed individually with its own description; pricing where comfortable.",
          "Products — listed if applicable; doesn&rsquo;t hurt if not.",
          "Posts — at least one in the last 30 days; ideally weekly.",
          "Q&A — owner-answered, with the questions seeded by the team if needed.",
          "Reviews — 4.6+ average; responded to (yes, the bad ones too); citing specifics in responses.",
        ],
      },
      {
        type: "pullquote",
        text:
          "Most owners are at four of seventeen. The fix is six weeks of work and 80% of it doesn&rsquo;t cost anything.",
      },
      { type: "h2", text: "What you&rsquo;ll find" },
      {
        type: "p",
        text:
          "Common patterns across the 200+ profiles we&rsquo;ve audited: wrong primary category, missing service area, stale description, fewer than 10 photos, no posts in 90 days, two-word review responses. None of these are technical problems. They&rsquo;re attention problems.",
      },
      { type: "h2", text: "How long a real fix takes" },
      {
        type: "p",
        text:
          "Six weeks, calendar time. Categories and description can change today. Photos take a Saturday. Service area is an hour. Posts are a per-week habit. Q&A is a 90-minute exercise. Reviews are an ongoing conversation with the team. The compounding effect on Map Pack rankings starts at week 3 and meaningfully compounds at week 8.",
      },
      {
        type: "callout",
        eyebrow: "Free version",
        text:
          "We&rsquo;ll run the 17 against your profile and email you a one-page report. No deck. No upsell. The form is below.",
      },
    ],
  },
  {
    slug: "five-tags-missing",
    title:
      "The five tags every St. Louis business website is missing.",
    excerpt:
      "Schema, OG, canonical, robots — the basics, and why most local sites don&rsquo;t have them.",
    date: "2026-02-14",
    readTime: "7 min read",
    category: "Web",
    deck:
      "We crawled the top 100 St. Louis local businesses by Google traffic and looked at their head tags. The results would surprise you only if you haven&rsquo;t looked at a small-business website lately.",
    body: [
      {
        type: "p",
        text:
          "These five tags are what tell search engines and AI engines what your page is, who you are, and how you should be linked to. They&rsquo;re cheap to add, take 20 minutes per page, and they materially change how a local site is interpreted by every modern crawler.",
      },
      { type: "h2", text: "1. LocalBusiness schema (or Service / Organization)" },
      {
        type: "p",
        text:
          "Of 100 sites: 12 had it. The other 88 are leaving structured-data-driven features on the table — knowledge panel, rich results, AI citation eligibility. It&rsquo;s a JSON block in the head; it has no rendering cost. There&rsquo;s no excuse.",
      },
      { type: "h2", text: "2. Canonical link" },
      {
        type: "p",
        text:
          "Of 100: 41 had it correctly set; 12 had it pointing to the homepage on every page (broken); 47 didn&rsquo;t have it. Without canonicals, your /services and /services/ are competing duplicates. Multiply that by every parameter and you have a long-tail SEO problem.",
      },
      { type: "h2", text: "3. Open Graph image + title" },
      {
        type: "p",
        text:
          "Of 100: 23 had a real OG image. The other 77 share to Slack and look like a stock placeholder. Social referrals from a real OG image convert at 2-3x the rate of a default — small lift on small volume, but free.",
      },
      { type: "h2", text: "4. Robots / x-robots-tag" },
      {
        type: "p",
        text:
          "Of 100: 9 had a noindex on a page that shouldn&rsquo;t be public (staging, internal, /thanks); 4 had a noindex on the home page (someone left it on after launch). The other 87 were fine. The 9 are losing rankings to nothing, by accident.",
      },
      { type: "h2", text: "5. hreflang or geo-targeting" },
      {
        type: "p",
        text:
          "Less common, but if you&rsquo;re a Missouri business with Illinois locations: a geo tag in the schema and explicit hreflang where you have multilingual content. Of the 23 with multi-state operations, 0 had it set correctly.",
      },
      {
        type: "pullquote",
        text:
          "Of 100 sites, 1 had all five correct. The other 99 had at least one missing or misconfigured.",
      },
      { type: "h2", text: "How long this takes to fix" },
      {
        type: "p",
        text:
          "An afternoon for a small site. A day for a 30-page site. Most CMS platforms have plugins; on a custom build it&rsquo;s a single edit to the head template and a JSON block per route. The result lands in the index within two crawl cycles, usually a week.",
      },
    ],
  },
  {
    slug: "how-ai-search-works",
    title:
      "How AI search actually works, in 800 words.",
    excerpt:
      "From web crawl to schema to citation to answer. The whole pipeline, no jargon.",
    date: "2026-01-30",
    readTime: "6 min read",
    category: "AI Search",
    deck:
      "Most explanations of AI search come in two flavors: too academic to act on, or too vague to be true. This is the 800-word middle.",
    body: [
      { type: "h2", text: "The pipeline, in five steps" },
      {
        type: "p",
        text:
          "When ChatGPT, Perplexity, or Gemini answers a query like &lsquo;best dentist near St. Louis,&rsquo; five things happen behind the scenes — and your site can be present at any one of them.",
      },
      {
        type: "list",
        items: [
          "Index — the engine has crawled and stored a representation of your page (and the web&rsquo;s pages, plus third-party text about you).",
          "Retrieve — when the query comes in, the engine pulls the small set of documents most likely to answer it. This is mostly vector similarity plus traditional ranking signals.",
          "Synthesize — the language model writes a paragraph using the retrieved documents as context.",
          "Cite — the synthesizer references one to three sources, picking those most likely to be authoritative for the specific claim.",
          "Render — the answer plus citations is shown to the user, sometimes with follow-up suggestions.",
        ],
      },
      { type: "h2", text: "Where you can win" },
      {
        type: "p",
        text:
          "You can&rsquo;t change the model. You can change what gets retrieved and what gets cited. That&rsquo;s the entire game. Three levers:",
      },
      {
        type: "list",
        items: [
          "Be in the index. Crawlable, indexable, present in the corpora the engines train and retrieve from. This is the SEO basics — sitemap, robots, internal links, schema.",
          "Be retrievable. Your content matches the embedding the engine generates from the query. Specific, well-structured answers beat keyword-stuffed paragraphs.",
          "Be citable. Third-party text refers to you in plausibly authoritative ways — local press, podcasts, a Wikipedia page, citations across .gov and .edu domains.",
        ],
      },
      {
        type: "pullquote",
        text:
          "AI search rewards specificity in ways traditional SEO never did. &lsquo;Best dentist&rsquo; is a keyword. &lsquo;Best dentist for kids in Webster Groves on a Saturday&rsquo; is a citation magnet.",
      },
      { type: "h2", text: "What changed for local businesses" },
      {
        type: "p",
        text:
          "The single biggest shift: the &lsquo;long tail&rsquo; got short. A user used to type &lsquo;dentist near me&rsquo; and click through ten options. Now they ask the AI a fully-formed question, get one paragraph, click one option. The number of impressions per query went down; the value of being the cited option went up by an order of magnitude.",
      },
      { type: "h2", text: "Where we focus the work" },
      {
        type: "p",
        text:
          "We focus 60% on FAQ schema and answer-pages tuned to retrieval, 30% on third-party citations and authority signals, 10% on the basics. The basics still matter — but most local sites have those covered already. The retrieval and citation work is the lever that&rsquo;s rarely pulled.",
      },
    ],
  },
];

export const NOTE_SLUGS = NOTES.map((n) => n.slug);

export function getNote(slug: string) {
  return NOTES.find((n) => n.slug === slug);
}
