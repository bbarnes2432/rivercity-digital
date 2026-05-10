# River City Digital — World-Class Implementation Plan

Synthesized from three expert audits (UX, UI, Creative Direction). The single guiding idea:

> **Studio, not agency.** A small, well-run St. Louis design studio that happens to do digital marketing. Letterhead-meets-civic visual identity. Real-place photography. Voice that sounds like a person who has driven I-270 at 5pm.

## North-star principles (from the creative-direction synthesis)

1. **Show, don't tell.** Replace cliché agency moves ("vs. them" tables, badge rows) with proof — real before/after screenshots, real ad mockups marked in red pen, real founder portraits.
2. **Three visual modes, alternating section by section** — never two of the same back-to-back:
   - **Letterhead** — cream + navy, editorial pages and lede moments
   - **Civic** — deep navy hero/CTA bands, data moments
   - **Working** — pure white + hairline rules, process tables and FAQ
3. **One accent color, used like a highlighter, not a wash.** Teal `#4CA5AD` only.
4. **Voice = first-person plural + direct address.** No third-person agency-speak. Cut em-dashes by half. Numerals over words for ≥4.
5. **Service Areas page = the signature moment.** Make it the most distinctive page on the site (living Missouri-silhouette map).
6. **About page = non-negotiable.** Brand promise rests on "real people doing the work." Real photo, real letter.

---

## Phase 1 — Design System Foundation (THE rewrite that everything else depends on)

### 1.1 Token system in `globals.css`

Replace all per-page `:root` palette declarations with one canonical token system. Source: UI agent's spec, Part 1.

**Color tokens** (semantic, not raw hex):
- `--surface-page` (cream), `--surface-default` (white), `--surface-sunken`, `--surface-inverse` (navy), `--surface-inverse-deep`
- `--ink-primary` (navy ink), `--ink-secondary`, `--ink-tertiary`, `--ink-on-dark`, etc.
- `--line-default`, `--line-strong`
- `--accent`, `--accent-hover`, `--accent-soft`, `--accent-glow`
- `--focus-ring` for all focus states

**Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160 (named `--s-1` through `--s-11`)

**Radius:** `--r-xs` 6, `--r-sm` 10, `--r-md` 14, `--r-lg` 20, `--r-xl` 28, `--r-pill` 999

**Shadows:** five tiers, all navy-tinted (not pure black)

**Motion:** `--ease-out`, `--ease-in-out`, `--ease-spring` + `--dur-1` through `--dur-6`

**Theme switch:** `[data-theme="dark"]` overrides surface and ink semantics so the same components work on light and dark sections.

### 1.2 Typography system

Drop Rajdhani and Montserrat (which only the digital-marketing page used). Standardize on:
- **Display:** Barlow Condensed 600/700 (existing on home — pairs with Inter, "civic" feel)
- **Body:** Inter 400/500/600/700 (variable)
- **Mono:** JetBrains Mono 500/700 (data accents, eyebrows, mono captions)

Optional editorial face for "Letterhead mode" moments: **GT Sectra** or **Source Serif 4** italic — used only on About, Field Notes, Privacy/Terms. (Lower priority; can ship without it.)

Defined as utility classes: `.t-display-1`, `.t-display-2`, `.t-h1` through `.t-h4`, `.t-lede`, `.t-body`, `.t-body-sm`, `.t-caption`, `.t-label`, `.t-eyebrow`, `.t-mono`.

### 1.3 Motion + accessibility

Single `motion.css` with:
- `.fx-hover`, `.fx-reveal`, `.fx-card-lift`, `.fx-stagger`
- `prefers-reduced-motion` override that disables animations
- `interpolate-size: allow-keywords` for `<details>` height animation

Replace the existing inline `.reveal` pattern site-wide.

### 1.4 Container + section primitives

- `<Container>` — max-width 1200px, responsive padding
- `<Section>` — handles theme attribute, vertical padding tokens, optional decoration slot

### 1.5 Migrate from per-page CSS to globals + page-specific layout-only CSS

After the design system absorbs the tokens, each page's `~30KB` CSS file collapses to ~4–8KB of layout-only rules. Components own their own styles.

**Deliverables Phase 1:**
- `src/app/globals.css` — replace
- `src/app/_styles/tokens.css` — new
- `src/app/_styles/typography.css` — new
- `src/app/_styles/motion.css` — new
- `src/app/_styles/reset.css` — new

---

## Phase 2 — Component Library

All in `src/app/_components/`. Server components by default; `"use client"` only where state is needed.

### Core layout
- `Container.tsx` — max-width wrapper
- `Section.tsx` — themed section wrapper (`mode="letterhead|civic|working"`)
- `SectionHeader.tsx` — eyebrow + h2 + lede pattern
- `SectionDivider.tsx` — typesetter rule with optional ornament

### Navigation
- `Nav.tsx` — server-rendered shell + client island for mobile drawer & dropdown state
- `MobileDrawer.tsx` — full-height right-side drawer with focus trap
- `Footer.tsx` — three-column footer with prelude tagline row + trust strip slot

### Buttons
- `Button.tsx` — variants: `primary`, `secondary`, `ghost`, `link`. Sizes: `sm`, `md`, `lg`. Built-in `arrow` prop. Theme-aware (light/dark surface).
- Replace all 4 existing button classes.

### Content blocks
- `CtaBand.tsx` — full-width CTA section with optional decoration
- `Breadcrumbs.tsx` — currently missing site-wide
- `TrustStrip.tsx` — replaces the chip-row trust bar; can render as logos or text bullets
- `MarqueeStrip.tsx` — premium logo marquee
- `Stats.tsx` + `StatCard.tsx` — animated count-up on intersect
- `Faq.tsx` — true accordion (replaces card-list pattern)

### Cards
- `ServiceCard.tsx`
- `ProcessCard.tsx`
- `TestimonialCard.tsx` (with avatar slot — currently missing)
- `BlogCard.tsx`
- `TeamCard.tsx`
- `WorkCard.tsx` (case-study cards)
- All inherit `card` base + `card-interactive` variant

### Forms
- `Field.tsx` (with floating-label variant)
- `Select.tsx`
- `Textarea.tsx`
- `SubmitButton.tsx` (loading + success states)
- `ContactForm.tsx` — wires to a real backend (Resend + Neon DB) instead of `alert()`

### Decorative
- `MissouriMark.tsx` — a recurring SVG component for the brand mark; size + variant props
- `Marginalia.tsx` — for editorial pages

### Interactive (client-only)
- `LivingMap.tsx` — the Service Areas signature: animated SVG map of Missouri with neighborhood pins, scroll-revealed
- `CountUp.tsx` — number animation on intersect
- `ScrollReveal.tsx` — IntersectionObserver-based stagger reveal
- `TestimonialSlider.tsx` — embla-carousel-react peek slider

---

## Phase 3 — SEO + Structured Data + Performance

### 3.1 Per-page metadata (Next.js Metadata API)

For every route:
- `title` (with `template` for site-wide suffix)
- `description`
- `openGraph` (image, title, description, type, url)
- `twitter` card
- `alternates.canonical`
- `robots` (noindex on legal pages? — keep them indexable for now)

### 3.2 Structured data (JSON-LD)

- **Site-wide** (in root layout): `Organization` schema (name, logo, sameAs, url, address)
- **Site-wide**: `LocalBusiness` schema (with geo, hours, priceRange, areaServed)
- **Service pages**: `Service` schema, each linked to the parent Organization
- **Homepage**: keep existing `FAQPage`
- **Service Areas page**: `LocalBusiness` with multiple `areaServed` entries
- **About page**: `Person` for founder(s)
- **Case studies (when added)**: `CreativeWork` + `Review` schema where applicable
- **Field Notes (when added)**: `Article` per post, `Blog` for the index
- **Every inner page**: `BreadcrumbList`

### 3.3 Sitemap, robots, OG image generation

- `src/app/sitemap.ts` — generated from route registry
- `src/app/robots.ts` — allow all, sitemap reference
- `src/app/opengraph-image.tsx` — default OG image generated via `next/og` (uses brand mark + page title)
- Per-route `opengraph-image.tsx` for service pages

### 3.4 Performance

- Replace all `<img>` with `next/image`. Hero images use `priority`.
- Self-host fonts via `next/font/google` (currently loaded via `<link>` in layout)
- Drop unused Rajdhani + Montserrat (the swap to Barlow Condensed everywhere kills these)
- Hero images converted to WebP/AVIF (next/image handles)
- Add `<link rel="preload">` for hero LCP candidates
- Inline critical CSS (Next/Tailwind handles baseline)
- Audit Core Web Vitals before launch

### 3.5 Analytics + lead capture

- Vercel Analytics (or Plausible) — privacy-respecting
- Cookie banner if GA4 is added
- Server action for contact form → Resend email + DB write
- Honeypot field for spam protection
- Cal.com (or Calendly) booking link for "book a 15-min" alternate CTA

---

## Phase 4 — Page Rebuilds (every page, not just home)

Each page gets:
- Conversion path repair (no mailto, phone added, breadcrumbs, primary + secondary CTA pattern, mid-page CTA on long pages)
- Voice rewrite per creative direction (kill "personally handled" repetition; cut em-dashes; specific over generic)
- IA reorder per UX recommendations
- Mode rotation (letterhead/civic/working alternation)
- Editorial moment per creative direction
- Real photography slots (placeholder until images arrive)
- Structured data
- Mobile QA

### 4.1 Homepage (`/`)
- Hero: "Letter from the Owner" treatment (founder portrait + cream paper + mixed-face headline)
- Trust strip merged into the hero stats
- Reorder: Hero → Trust → Services → **Comparison KILLED**, replaced with **"The Receipt"** before/after proof → Process (horizontal scroll) → Testimonials (editorial "Notes from the Field") → Why Us (consolidated to one) → FAQ → CTA → Contact form
- Add "Where We Work" pill strip linking to Service Areas
- Add floating mobile CTA on scroll
- Phone in nav

### 4.2 AI Search Visibility
- New hero: "Search just changed. Most local businesses haven't noticed yet."
- Add: live "Run my business through AI" widget (single-input lead magnet) — primary lead-capture for this page
- Add: "Answer Layer" risograph diagram
- Add: Citation Field Reports format for testimonials
- Mid-page CTA after "How it works"
- Replace logo-soup of AI engines with typographic mention inside hero
- Cross-link to Local SEO at bottom
- Breadcrumbs

### 4.3 Local SEO
- New hero: "Own the block." with storefront photograph + floating teal pin
- Add: live "Map Pack lookup" lead-magnet widget (single input)
- Add: "Citation Trail" diagram
- Add: cross-link to Website Design
- Reorder so the cross-promo to AI Search becomes a closing editorial moment, not a sidebar
- Breadcrumbs

### 4.4 Website Design
- New hero: "No themes. No templates. No swap-the-logo." with corkboard wireframes photograph
- Selected Work elevated to magazine-spread feature: one project per scroll-screen, full-bleed device shots in real environments
- Add: "Anatomy of a fast site" annotated screenshot
- Add: 12-Day Timeline horizontal scroll
- Add: pricing band (range, not exact quote)
- Cross-link each portfolio item to a `/work/[slug]` case study (Phase 5 build-out)
- Reconcile process to canonical 4 steps (matches homepage)
- Breadcrumbs

### 4.5 Digital Marketing
- New hero: "The cheapest ad is the one that converts." with red-pen ad mockup
- Add: "$1,000 in St. Louis" calculator widget (lead magnet)
- Add: "Ad Library" pull (real ads with annotations)
- Add: Monthly Report mockup spread
- Pain points reformatted as scroll-revealed manifesto (one sentence per screen)
- Breadcrumbs

### 4.6 Service Areas — **THE SIGNATURE PAGE**
- New hero: full-bleed Living Map (Missouri silhouette + animated dot reveal of cities)
- Each city becomes an editorial card: photograph + 2-sentence editorial about the local business landscape + 2-3 named clients (where permission)
- Add city-jump anchor nav at top
- Each city has its own `id` for footer anchors and future `/service-areas/[city]` URL structure
- Add "I-270 Index" sidebar (top trending searches by neighborhood)
- Add city + service cross-link grid
- Breadcrumbs

### 4.7 Privacy Policy + Terms of Use
- Mode: Letterhead (cream + serif)
- Add: Last-updated timestamp in marginalia
- Add: Sticky TOC sidebar (desktop)
- Add: Editorial preface italic (creative direction)
- Add: Footer signature ("Filed in St. Louis, Missouri · By the same people who built this website.")
- Drop cap on first paragraph
- Body at 16.5px / 1.65 / 68ch max
- Breadcrumbs

### 4.8 New page: About — `/about`
- Hero: founder portrait + Letter
- The Studio photo essay (6–9 detail shots)
- "What we read / what we use" editorial list
- "The Standard" section
- Closing CTA
- Mode: predominantly Letterhead with one Civic moment
- Breadcrumbs + Person schema

### 4.9 New page: Selected Work — `/work` and `/work/[slug]`
- Index: grid of all projects, navy thumbnails + cream captions
- Per-project: long-form editorial case study (Brief / Approach / In-context shots / Results / Pull-quote / "What we'd do differently")
- Three case studies at minimum (Lucky Puppy, Shear Fantasy, Lovely Nails) — already named on the current site
- Breadcrumbs + CreativeWork schema

### 4.10 New page: Field Notes — `/notes` and `/notes/[slug]`
- Editorial article layout (single 640px column, serif body, mono marginalia)
- 4 starter articles minimum at launch
- Article schema per post, Blog schema for index
- Author signature ornament at end
- Breadcrumbs

### 4.11 New page: 404 — `/not-found.tsx`
- "This page wasn't found. Like an unclaimed Google Business Profile, just sort of out there."
- Missouri silhouette with red ✕ pin
- "Where you might've meant to go" links to four service pages

### 4.12 New page: Contact — `/contact` (dedicated)
- Phone, email, hours, service-area, Cal.com booking embed, full contact form
- LocalBusiness schema with geo

---

## Phase 5 — Premium UI Polish

After foundations + page rebuilds:

- **Hero parallax** on home + Service Areas
- **Number count-ups** on stat blocks (1.6s easeOut)
- **Scroll-reveal stagger** site-wide (replace existing `.reveal` impl)
- **Living Map** dot-reveal animation tuned (60ms stagger, ink-bleed-into-paper effect via SVG filter)
- **Section dividers** as thin animated rules drawing left-to-right on intersect
- **Custom scrollbar** styling
- **Page transitions** via View Transitions API (with graceful fallback)
- **Sticky CTA bar** on mobile after hero scroll
- **Smart nav** that hides on scroll-down, reveals on scroll-up
- **Form interaction** polish: focus states, loading spinner, success morph

---

## Phase 6 — Image Integration & Final Polish

When the user delivers the Higgsfield image zip:

1. Unzip into `public/assets/`
2. Create `next/image`-friendly variants (Next handles size, but we want correct `sizes` props)
3. Wire alt text per UX agent's recommendations (descriptive, not "image of")
4. Generate OG images via Next's `opengraph-image.tsx` route convention (using the cream/navy mark + per-page title)
5. Generate favicon set via the existing logo files
6. Run Lighthouse + Core Web Vitals — target 95+ on all four metrics

---

## Phase 7 — Pre-launch checklist

- [ ] Real form backend wired (Resend + Neon DB write)
- [ ] Phone number in place site-wide (or removed if not real)
- [ ] No more `mailto:` primary CTAs
- [ ] All 8 original routes + About + Work + Notes + Contact + 404 working
- [ ] Sitemap + robots.txt deployed
- [ ] OG images verified via debug.opengraph.xyz
- [ ] Schema markup verified via Google Rich Results Test
- [ ] Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO
- [ ] Mobile QA on iPhone 12, Pixel 6, iPad
- [ ] Keyboard navigation pass (no traps, focus visible)
- [ ] Reduced-motion mode tested
- [ ] All anchor links resolve
- [ ] Cross-page nav uses `<Link>` (no full-reload `<a>` for routes)
- [ ] All images via `next/image`, no raw `<img>`
- [ ] Cookie banner if analytics is added
- [ ] Analytics events for form submit, CTA click, scroll depth, video watch (if any)

---

## Build order (current session)

1. **Phase 1** — design tokens, typography, motion, reset
2. **Phase 2** — core component library (Nav, Footer, Button, Section, SectionHeader, Card family, Form fields, FAQ accordion, Breadcrumbs, MissouriMark)
3. **Phase 3 (partial)** — sitemap, robots, root metadata, structured data on existing pages
4. **Phase 4** — page rebuilds (homepage first, then service pages, then service areas, then legal, then new pages)
5. **Phase 5** — premium polish
6. **Phase 6** — wait for images, then integrate

We'll keep building until the site is at the world-class bar. When images arrive, we drop them in and ship.
