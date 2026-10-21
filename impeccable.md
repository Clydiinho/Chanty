---
name: impeccable
description: "Use when the user wants to design, redesign, shape, critique, audit, polish, clarify, distill, harden, optimize, adapt, animate, colorize, extract, or otherwise improve a frontend interface. Covers websites, landing pages, dashboards, product UI, app shells, components, forms, settings, onboarding, and empty states. Handles UX review, visual hierarchy, information architecture, cognitive load, accessibility, performance, responsive behavior, theming, anti-patterns, typography, fonts, spacing, layout, alignment, color, motion, micro-interactions, UX copy, error states, edge cases, i18n, and reusable design systems or tokens. Also use for bland designs that need to become bolder or more delightful, loud designs that should become quieter, live browser iteration on UI elements, or ambitious visual effects that should feel technically extraordinary. Not for backend-only or non-UI tasks."
argument-hint: "[{{command_hint}}] [target]"
user-invocable: true
allowed-tools:
  - Bash(npx impeccable *)
  - Bash(node {{scripts_path}}/*)
license: Apache 2.0
---

Designs and iterates production-grade frontend interfaces. Real working code, committed design choices, exceptional craft.

## Setup

You MUST do these steps before proceeding:

1. Run `node {{scripts_path}}/context.mjs` once per session. If the request names or implies a file, route, or app inside a monorepo, infer the concrete path and run `node {{scripts_path}}/context.mjs --target <path>` instead. If you've already seen its output in this conversation, do not re-run it. The script either prints the project's PRODUCT.md (and DESIGN.md when present) as a markdown block, or tells you it's missing. Follow whatever it prints. **If it reports `NO_PRODUCT_MD`, stop and follow `reference/init.md` before doing anything else.** If the output ends with an `UPDATE_AVAILABLE` directive, follow it (ask the user once about updating, then continue). It never blocks the current task.
2. If the user invoked a sub-command (`craft`, `shape`, `audit`, `polish`, ...), you MUST read `reference/<command>.md` next. Non-optional. The reference defines the command's flow; without it you will skip steps the user expects.
3. Familiarize yourself with any existing design system, conventions, and components in the code. Read at least one project file (CSS / tokens / theme / a representative component or page). **Required even when you've loaded a sub-command reference in step 2.** Don't reinvent the wheel; use what's there when it works, branch out when the UX wins.
4. Read the matching register reference. **This is non-optional; skipping it produces generic output.** If the project is marketing, a landing page, a campaign, long-form content, or a portfolio (design IS the product), read `reference/brand.md`. If it is app UI, admin, a dashboard, or a tool (design SERVES the product), read `reference/product.md`. Pick by first match: (1) task cue ("landing page" vs "dashboard"); (2) surface in focus (the page, file, or route being worked on); (3) `register` field in PRODUCT.md.
5. **If the project is brand-new (no existing CSS tokens / theme / committed brand colors found in step 3)**, run `node {{scripts_path}}/palette.mjs` to receive a brand seed color and composition guidance. This is the anchor for your primary brand color. Compose the rest of the palette (bg, surface, ink, accent, muted) around it per the script's instructions. Use OKLCH throughout. **Skip this step only if step 3 found committed brand colors in existing tokens; in that case identity-preservation wins.**

## Design guidance

Produce ready-to-ship, production-grade code, not prototypes or starting points. Take no shortcuts unless the user asks for them (when in doubt, ask). Don't stop until arriving at a complete implementation (beautiful, responsive, fast, precise, bug-free, on brand). You take attention to detail seriously: every page, section or component crafted is battle tested using the tools available to you (browser screenshotting, computer use, etc). {{model}} is capable of extraordinary work. Don't hold back.

### General rules

#### Color

- **Verify contrast.** Body text must hit ≥4.5:1 against its background; large text (≥18px or bold ≥14px) needs ≥3:1. Placeholder text needs the same 4.5:1, not the muted-gray default. The most common failure: muted gray body text on a tinted near-white. If the contrast is even close, bump the body color toward the ink end of the ramp; light gray "for elegance" is the single biggest reason AI designs feel hard to read. <!-- rule:skill-color-verify-contrast -->
- Gray text on a colored background looks washed out. Use a darker shade of the background's own hue, or a transparency of the text color. <!-- rule:skill-color-gray-on-color -->

#### Typography

- Cap body line length at 65–75ch. <!-- rule:skill-typo-line-length -->
- Don't pair fonts that are similar but not identical (two geometric sans-serifs, two humanist sans-serifs). Pair on a contrast axis (serif + sans, geometric + humanist) or use one family in multiple weights. <!-- rule:skill-typo-font-pairing-contrast -->
- Hero / display heading ceiling: clamp() max ≤ 6rem (~96px). Above that the page is shouting, not designing. <!-- rule:skill-typo-hero-ceiling -->
- Display heading letter-spacing floor: ≥ -0.04em. Anything tighter and letters touch; cramped, not "designed". <!-- rule:skill-typo-tracking-floor -->
- Use `text-wrap: balance` on h1–h3 for even line lengths; `text-wrap: pretty` on long prose to reduce orphans. <!-- rule:skill-typo-text-wrap-balance -->

#### Layout

- Vary spacing for rhythm. <!-- rule:skill-layout-vary-spacing -->
- Cards are the lazy answer. Use them only when they're truly the best affordance. Nested cards are always wrong. <!-- rule:skill-layout-cards-lazy -->
- Flexbox for 1D, Grid for 2D. Don't default to Grid when `flex-wrap` would be simpler. <!-- rule:skill-layout-flex-vs-grid -->
- For responsive grids without breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`. <!-- rule:skill-layout-auto-fit-grid -->
- Build a semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never arbitrary values like 999 or 9999. <!-- rule:skill-layout-z-index-scale -->

#### Motion
- Motion should be intentional, and not be an afterthought. consider it as part of the build. <!-- rule:skill-motion-intentional -->
- Don't animate CSS layout properties unless truly needed. <!-- rule:skill-motion-no-layout-animate -->
- Ease out with exponential curves (ease-out-quart / quint / expo). No bounce, no elastic. <!-- rule:skill-motion-ease-out-exp -->
- Use libraries for more advanced motion needs (e.g. motion, gsap, anime.js, lenis etc) <!-- rule:skill-motion-use-libraries -->
- Reduced motion is not optional. Every animation needs a `@media (prefers-reduced-motion: reduce)` alternative: typically a crossfade or instant transition. <!-- rule:skill-motion-reduced-motion -->
- Staggering the items within one list is legitimate. The tell is the uniform reflex (one identical entrance applied to every section), not motion itself; each reveal should fit what it reveals. Suppressing the reflex is never a reason to ship a page with no motion at all. <!-- rule:skill-motion-no-section-fade -->
- Reveal animations must enhance an already-visible default. Don't gate content visibility on a class-triggered transition; transitions pause on hidden tabs and headless renderers, so the reveal never fires and the section ships blank. <!-- rule:skill-motion-reveal-safety -->
- Premium motion materials are not just transform/opacity. Blur, backdrop-filter, clip-path, mask, and shadow/glow are part of the palette when they materially improve the effect and stay smooth. <!-- rule:skill-motion-materials-palette -->

#### Interaction

- Dropdowns rendered with `position: absolute` inside an `overflow: hidden` or `overflow: auto` container will be clipped. Use the native `<dialog>` / popover API, `position: fixed`, or a portal to escape the stacking context. <!-- rule:skill-interaction-dropdown-clipping -->

**Gemini-specific defect: hard ban.** Never animate `<img>` elements on hover. This includes any `transform` on `:hover` of an image, AND `.group:hover .group-hover\:scale` / `.group:hover .group-hover\:rotate` / `.group:hover .group-hover\:translate` patterns from Tailwind that animate a child image via a parent hover. This is your single most common motion tell; it adds no information (the image isn't an action target) and reads as "AI animated this because it could". If a card needs hover feedback, animate the card's background, border, or shadow. Never the image, never via the image's parent.

### Absolute bans

- **Side-stripe borders.** `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Never intentional.
- **Gradient text.** `background-clip: text` combined with a gradient background. Decorative, never meaningful. Use a single solid color. Emphasis via weight or size.
- **Glassmorphism as default.** Blurs and glass cards used decoratively. Rare and purposeful, or nothing.
- **The hero-metric template.** Big number, small label, supporting stats, gradient accent. SaaS cliché.
- **Identical card grids.** Same-sized cards with icon + heading + text, repeated endlessly.
- **Tiny uppercase tracked eyebrow above every section.**
- **Numbered section markers as default scaffolding (01 / 02 / 03).**
- **Text that overflows its container.**
