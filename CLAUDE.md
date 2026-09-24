@AGENTS.md

# WorkUp — Project-Management SaaS Landing Page

Pixel-perfect implementation of the WorkUp landing page from Figma, shipped to GitHub + Vercel.
Act as a senior front-end engineer + UI/UX specialist: production-grade code, exact fidelity.

## Environment

- **Figma**: fileKey `1TfHkYxUyZvZm0GD6vugXK`, root frame `1:1580` "Home" (1440×7539, desktop only — no mobile frames).
- **GitHub**: https://github.com/nooruiux/Project-Management-SaaS-Website (default branch `main`).
- **Vercel**: project linked to this repo; production branch `main`, preview deploys for every other branch.
- **Visual QA**: compare localhost / preview URLs against Figma screenshots. Prefer the **Claude in Chrome** extension (real Chrome rendering); fall back to the in-app browser only if Chrome fails. Every QA report states which browser was used.

## Stack

- Next.js 16, App Router, TypeScript, **no `src/` dir**, import alias `@/*`.
  - Follow Next 16 conventions: `params` / `searchParams` are async (await them), Turbopack is the default bundler, and use `proxy.ts` (not `middleware.ts`) if request interception is ever needed. `next/image`: `priority` is deprecated → use `preload` for the hero/LCP image; `images.qualities` defaults to `[75]` (add values in `next.config.ts` if another quality is needed).
- Tailwind CSS v4 with `@theme` tokens in `app/globals.css`.
- `next/font`: **Manrope** 400/500/600/700 (marketing, `--font-manrope`) and **Inter** 400/500/600 (app-UI mockups only, `--font-inter`).
- `next/image` for all raster images.
- Framer Motion — only subtle motion, and only where the design implies it.
- `lucide-react` **only** if an icon matches the Figma icon exactly; otherwise export the SVG from Figma.
- `class-variance-authority` + `clsx` + `tailwind-merge` for component variants (`cn()` helper in `lib/utils.ts`).

## Section order (NON-NEGOTIABLE)

Figma layer order ≠ visual order. Build sections ONLY in this order:

| #  | Section                              | Node     | Notes |
|----|--------------------------------------|----------|-------|
| 1  | Navbar                               | `1:2303` | sticky, backdrop-blur on scroll, dropdown chevrons, mobile sheet menu |
| 2  | Hero + dashboard mockup              | `1:2336` | bg pattern `1:1649` behind |
| 3  | Logo cloud                           | `1:2588` | |
| 4  | Features grid "Ultimate solution"    | `1:1581` | |
| 5  | "Do your most important work"        | `1:2928` | bg vector `1:2598` behind |
| 6  | "Strategic planning" cyan card       | `1:2599` | |
| 7  | "Deliver more projects"              | `1:2754` | |
| 8  | Integrations (dark, radial layout)   | `1:2664` | absolute positioning OK here |
| 9  | Testimonials carousel                | `1:3708` | bg pattern `1:3054` |
| 10 | Footer + newsletter                  | `1:3762` | |

## Fidelity rules (NON-NEGOTIABLE)

1. **Per-section loop**: `get_design_context(nodeId)` + `get_screenshot(nodeId)` → implement → compare in the browser at 1440px → fix spacing, font-size, line-height, letter-spacing, radius, shadow, colors until it matches.
2. **Fonts**: all marketing text is **Manrope**. Figma variables wrongly say Inter/Montserrat — ignore them. Inter is used **only** inside app mockups.
3. **App mockups are scaled** (fractional sizes like 13.78px). **Do NOT rebuild them in HTML.** Export hero dashboard and dense card mockups @2x from Figma → optimize to AVIF/WebP → `next/image` with explicit `width`/`height` + meaningful `alt`. Hero image gets `preload` (Next 16 replacement for `priority`).
   - **Exception**: the toggle list + task table in section 7 ("Deliver more projects") are built in real code (Inter).
4. **Hero headline** "Streamline ⚡ work for team 👥 productivity": the gaps are inline elements (icon badge + avatar stack). Build as `inline-flex` spans aligned to the text baseline — **never spaces**.
5. **Tokens first**: never hardcode a value that exists as a token. Keep exact Figma values, even off-grid, when Figma uses them.
6. **No placeholders**: no placeholder images, no invented icons, no invented copy.
7. **Copy lives in `/content/*.ts`** as typed data (including nav + footer links).

8. **Figma write rule**: never create or modify nodes on the "Home" page. If helper nodes are needed (e.g. for true 2× exports), create a page named `_claude-export`, work only there, delete the page when done, and mention it in the PR.
   - 2× export recipe: `exportAsync({constraint:{type:"SCALE",value:2}})` → `figma.createImage(bytes)` → rectangle sized to `image.getSizeAsync()` on `_claude-export` → `get_screenshot` → crop any shadow bleed locally. (`clone().rescale(2)` breaks icon instances — don't use it.)
9. **Images & performance**: below-the-fold images stay lazy (the default) with no preload. Only the hero dashboard is preloaded. Decorative patterns are CSS, not images, so they never become the LCP element.

## QA "done" threshold (per section)

Stop iterating when all of these hold:
- element positions within **±2px** of Figma at 1440
- pixel diff vs Figma's 1× render **< 2.5%** (excluding copy changes and text anti-aliasing)
- no horizontal overflow at 375 / 768 / 1024 / 1280; keyboard + a11y checks pass

Don't chase sub-2px decorative diffs — list them in the PR instead.

## Design tokens → `app/globals.css`

```css
@import "tailwindcss";
@theme {
  --color-primary:#633bc0; --color-primary-hover:#5230a6; --color-primary-soft:#efeafb;
  --color-accent-cyan:#03bfff; --color-accent-cyan-soft:#d6f8ff; --color-accent-green:#25631f;
  --color-accent-red:#ae1d12; --color-accent-blue:#2345de; --color-accent-orange:#ff4405;
  --color-ink:#1a151a; --color-ink-muted:#484448; --color-ink-subtle:#666266; --color-ink-dark:#101828;
  --color-border:#e6e6e6; --color-surface:#ffffff; --color-surface-muted:#f6f7fb; --color-surface-tertiary:#f2f4f7;
  --font-sans: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
  --font-ui: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --text-display:clamp(2.5rem,1.8rem + 3vw,4rem); --text-display--line-height:1.1;
  --text-h2:clamp(2rem,1.6rem + 1.6vw,2.5rem); --text-h2--line-height:1.2;
  --text-h3:clamp(1.25rem,1.1rem + .6vw,1.5rem); --text-h3--line-height:1.33;
  --text-lead:clamp(1.0625rem,1rem + .3vw,1.25rem); --text-lead--line-height:1.5;
  --radius-xs:4px; --radius-sm:8px; --radius-md:12px; --radius-lg:16px; --radius-xl:20px; --radius-2xl:36px;
  --shadow-xl:0 8px 8px -4px #10182808,0 20px 24px -4px #10182814;
  --shadow-ring-primary:0 0 0 4px #633bc03d;
}
```

### Normalization

- All `#000` / `#1a151a` text at various opacities → `ink` / `ink-muted` / `ink-subtle`.
- Merge `#653dc2` and `#6941c6` → `primary`.
- **All H2 = `text-h2`** (40px desktop), even where Figma uses 48px — record each such case in the deviations log.

### Also in globals.css

- `container-site` utility: 1280px content column, horizontal padding 20px mobile / 32px ≥768px applied outside it (approved).
- Global `:focus-visible` ring (use `--shadow-ring-primary` / primary outline).
- `prefers-reduced-motion: reduce` reset (kill animations/transitions, pause marquee).

## Responsive rules (no mobile frames in Figma)

- **≥1280**: exact Figma desktop.
- **768–1279**: 3-col grids → 2 cols; side-by-side blocks stack when a column would be < 360px; mockups scale proportionally.
- **<768**: single column, 20px gutters, display 40px, H2 32px, primary CTAs full-width, hero dashboard **cropped with right-edge fade** (not shrunk to unreadable), logo cloud → auto-scrolling marquee (paused under reduced-motion), testimonials → swipeable.
- Tap targets ≥ 44px.
- Test at **375, 768, 1024, 1280, 1440**.

## Architecture

```
/app                  layout.tsx (metadata), page.tsx (composes sections), sitemap.ts, robots.ts, opengraph-image
/components/ui        Button (primary/secondary/ghost × sm/md/lg, icon slots), Badge, Avatar, AvatarStack,
                      Toggle, Input, Card, SectionHeading
/components/sections  Navbar, Hero, LogoCloud, Features, WorkFaster, StrategicPlanning, DeliverProjects,
                      Integrations, Testimonials, Footer
/content              all copy + nav/footer links as typed arrays
/public/figma         exported assets (kebab-case names)
/lib                  utils (cn)
```

- **Server Components by default.** `"use client"` only for interactive bits (navbar scroll/dropdowns/sheet, carousel, toggles, newsletter form, motion).

## Quality gates (must pass before EVERY push)

- `npm run build` clean — 0 TypeScript errors, 0 ESLint errors.
- Semantic landmarks: `header` / `nav` / `main` / `section[aria-labelledby]` / `footer`; exactly one `h1`; correct heading order.
- WCAG 2.2 AA: contrast; keyboard nav for dropdowns / mobile menu / carousel (Esc closes, focus trap in mobile sheet); `aria-expanded` / `aria-controls`; visible focus.
- SEO: title / description / OG / Twitter via Metadata API, canonical, JSON-LD (Organization + SoftwareApplication), sitemap, robots.
- Performance: Lighthouse mobile **Perf ≥ 95, A11y 100, BP 100, SEO 100**; CLS < 0.05; LCP image preloaded; no client JS in sections that don't need it.

## Git / deploy workflow

- `main` = production. Feature work on `feat/<section>` branches → push → PR → Vercel preview URL.
- Each PR description lists any remaining visual diffs vs Figma, plus any typos/grammar issues found in that section's Figma copy (obvious ones are fixed and logged in the deviations table).
- Preview deployments stay behind Vercel protection; QA uses the preview URLs in a Chrome session signed in to Vercel.
- Start each section branch from the latest `origin/main` (`git pull` first). If the previous section's PR isn't merged yet, branch from that section's branch and say so in the PR.
- Open PRs with `gh pr create`; fall back to the signed-in Chrome compare page only if `gh` fails. The client merges PRs.
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`).

## Execution plan — STOP at every ⏸ and wait for the user's "continue"

- **PHASE 0** — Write this CLAUDE.md. ⏸
- **PHASE 1** — Scaffold (`create-next-app@latest` into a temp folder, then copy into the repo root so CLAUDE.md never leaves it: `--ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"`), tokens, fonts, deps, UI primitives. Commit `chore: scaffold + design tokens + ui primitives`, push to `origin main`.
- **PHASE 2** — Vercel: create project linked to the repo (Next.js), production branch `main`, previews on other branches. Report production URL. ⏸
- **PHASE 3** — Navbar + Hero on `feat/hero` → visual QA at 1440 + 375 → commit, push, PR, share preview URL + remaining diffs. ⏸
- **PHASE 4** — Sections 3–10, one branch + PR each (`feat/<section>`), same QA loop. ⏸ after sections 5, 8 and 10.
- **PHASE 5** — Full-page QA: responsive sweep, a11y, Lighthouse (report scores), fix issues. Add `app/opengraph-image` (1200×630, brand-styled) — og:image is currently missing. ⏸
- **PHASE 6** — Merge to `main` → production deploy. Final report: production URL, Lighthouse scores, and every intentional deviation from Figma (with reason).

## Deviations log

Record every intentional deviation from Figma here as it happens (section, what, why).

| Section | Deviation | Reason |
|---------|-----------|--------|
| Tokens  | Added `primary-tint #f9f5ff`, `primary-border #e9d7fe`, `primary-ink #5931b6`, `primary-wash #f1f4ff`, `shadow-knob` | Used by the Figma "Update" chip, "New" badge and toggle knob; not covered by the base token set |
| Global  | `container-site` = 1280px content + gutters outside it (max-width 1344 at ≥768) | Figma content column is exactly 1280 wide (x=80 in 1440) |
| Button  | `sm` size (h44 px20 14px) has no Figma source | Variant set required by spec; 44px keeps tap-target rule |
| Navbar  | Copy: "Start free trail" → "Start free trial" | Typo fix approved by client |
| Hero    | Copy: "Start 14-days trial" → "Start 14-day trial" | Grammar fix approved by client |
| Hero / metadata | Copy: "organizing tasks, track progress" → "organizing tasks, tracking progress" | Grammar fix approved by client (also in meta description / OG / Twitter) |
| Hero    | Lead paragraph max-width 637 → 681px | Longer approved copy would wrap to 3 lines at 637px |
| Logo cloud | Caption colour #475467 → `ink-muted` (#484448) | Nearest text token; contrast 9.4:1 |
| Features | H2 48px → `text-h2` (40px) | Global H2 rule |
| Features | Grid columns aligned (3-col grid, 88px gaps) — Figma row 1 drifts ~13px from row 2 | Figma "hug" rows; aligned grid matches row 2 exactly |
| Features | Lead: "with Workup . … organizing tasks, track progress." → "with WorkUp. … organizing tasks and tracking progress." | Obvious typo/grammar fix |
| Features | "optimises" → "optimizes" | US spelling used elsewhere on the page |
| Features | Card title "Invoicing and Payment Tracking" #000@80% → `ink` | Normalization rule; other titles are ink |
| Tokens  | Added `accent-cyan-line #00c9f2` | Border of the cyan card in section 5; not in the base token set |
| Work faster | Background vector `1:2598` not rendered | It is hidden in Figma, so the Figma render shows the section on white |
| Work faster | Copy: "Collaboration with teams accountable by organizing projects…" → "Keep your team accountable by organizing projects and tasks in one place." | Approved copy change |
| Work faster | Card descriptions #1a151a@80% → `ink-muted` | Normalization rule |
| Strategic planning | Copy: "…with Wrike’s intuitive features" → "…with WorkUp’s intuitive features" | Obvious error — Wrike is another product |
| Strategic planning | Lead kept at `ink/80` (Figma value) instead of normalizing to opaque `ink-muted` | `ink-muted` on the cyan card is 4.4:1 (fails AA); ink@80% is 5.7:1 |
| Tokens  | Added `accent-blue-soft #cedaff`, `accent-green-soft #d9f6d6`, `accent-red-soft #fff0ea`, `primary-mist #f3eff9` | Section 7 card fills and priority-badge fills |
| Deliver projects | Copy: "WorkUp believe in the power of data" → "WorkUp believes…" | Obvious grammar fix |
| Deliver projects | Table copy: "Design fintech saas landing page" → "…fintech SaaS landing page" | Obvious casing fix (real text, not baked) |
| Deliver projects | Table chevrons, "…" / "+" icons and "Add project" are decorative (not buttons); checkboxes are real | No behaviour designed; fake controls would hurt a11y |
| Navbar  | Dropdown panels (Product/Solutions/Resources) list the matching footer-column links; panel styling is ours. **TODO: mega menu — awaiting Figma design** | Figma shows chevrons but no open state |
| Navbar  | Scrolled state: white/80 + blur + 1px divider; mobile (<1024) hamburger + right sheet using lucide `Menu`/`X` | No scrolled or mobile frames in Figma |
