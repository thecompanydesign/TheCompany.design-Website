# TheCompany.design — Website Build Instructions (Claude Code)

## Project Overview

Build the marketing website for **TheCompany.design**, a Nairobi-based digital design studio
(websites, digital products, digital systems). The design already exists as a working
prototype in this repository:

```
TheCompany.design v2.dc.html      ← the approved design (source of truth #1)
TheCompany.design.dc.html         ← superseded v1, DO NOT build from this
uploads/                          ← the real image assets used by the design
```

The prototype is a single-page, dark-first, editorial experience: a welcome/preloader
"pile of project prints" animation, a full-viewport hero, four full-viewport project
"covers", a scroll-lit approach statement, an interactive capabilities list, a two-line
studio statement, and a full-viewport closing CTA.

The design is **70% visual / 30% text by intent**. Copy is deliberately sparse. Do not add
sections, paragraphs, features, stats, icons or decorative elements.

---

## Source of Truth

Read these before making any implementation decision:

```
/docs/DESIGN_HANDOFF.md    design system, tokens, type, spacing, layout, tech assumptions
/docs/PAGES.md             page + section structure, exact per-section geometry
/docs/COMPONENTS.md        reusable component inventory and recommended hierarchy
/docs/ANIMATIONS.md        every animation, with trigger/duration/easing/breakpoint rules
/docs/RESPONSIVE.md        breakpoint-by-breakpoint behavior (this design is NOT stacked desktop)
/docs/ASSETS.md            image inventory, crops, filters, placeholders
/docs/INTERACTIONS.md      every interactive behavior and state
/docs/CONTENT.md           all copy, verbatim
```

Priority order when they disagree:

1. The existing design file (`TheCompany.design v2.dc.html`) — measured behavior wins.
2. The `/docs` package.
3. Existing project architecture/conventions.
4. Smallest reasonable implementation assumption (label it in code comments).

**Do not redesign the interface.** No "improvements", no re-theming, no substitutions of
custom motion for library defaults.

---

## Implementation Principles

- Recreate the design faithfully, including subtle motion and irregular geometry.
- Do not simplify visual details; do not convert overlapping/rotated compositions into grids.
- Do not replace animations with static elements, and do not add animations that aren't documented.
- Do not invent content, clients, metrics, testimonials or assets. Project work is labeled
  **Concept study** on purpose — keep that label.
- Preserve spacing, hierarchy and responsive behavior exactly as documented.
- Reuse components; avoid unnecessary dependencies (the prototype uses **no** animation library).
- Prefer semantic HTML: one `h1`, section `h2`s, real `<a href="mailto:…">`, real `<button>` for the menu.
- Maintain accessibility: visible focus states, `aria-expanded`/`aria-label` on the menu button,
  keyboard-reachable nav and CTAs, 44px+ touch targets.
- Respect `prefers-reduced-motion: reduce` (see ANIMATIONS.md for the exact fallbacks).
- Optimize images (the `uploads/*.png` files are large; convert to WebP/AVIF with responsive
  `srcset`, keep the documented `object-fit`/`object-position`/filters unchanged).
- Never block first paint on the welcome animation's assets beyond a `<link rel="preload">`.

---

## Visual Fidelity

Pay explicit attention to:

- **Type scale**: viewport-relative display type (`clamp()` and raw `vw` on mobile) — see tokens.
- Font weights (Bodoni Moda 400 only; Archivo 300 body), line heights (0.84–1.16), letter
  spacing (−0.04em display → +0.24em uppercase micro-labels).
- Border radius: `999px` pills; `clamp(10px, 1.1vw, 16px)` welcome frames; **0** everywhere else.
- Image cropping: `object-fit: cover` with per-image `object-position`, different on mobile.
- Layering: the fixed layers have hard z-index values (grain 60, cursor 70, welcome 90,
  header 52, mobile menu 51, mobile CTA bar 48, work counter 45) — keep them.
- Overlap/transform: welcome frames overlap with per-frame translate+rotate+scale.
- Gradients: multi-stop scrims over every image; a single radial accent glow in the final CTA.
- Grain: fixed full-viewport SVG turbulence layer at `opacity .055`, `mix-blend-mode: overlay`.
- Hover states exist on desktop only; every hover behavior has a documented touch equivalent.

---

## Important Design Rules (discovered in the prototype)

1. **Full-viewport sections.** Hero, each of the 4 work covers, capabilities and the final CTA
   are `100svh` (`svh`, not `vh` — mobile URL-bar safe). Approach is `130svh` desktop /
   `108svh` mobile because its text is lit progressively by scroll.
2. **The work section is 4 stacked full-bleed covers**, not cards, not a grid, not a carousel.
   Each cover: image layer (inset `-8% 0`, i.e. deliberately oversized vertically for parallax)
   → gradient scrim → content layer with meta row (top), client name (middle), line + tag (bottom).
3. **Parallax is desktop-only.** On touch/narrow viewports the image transform is cleared to
   `none` and the image stays a static crop — this was a deliberate fix for scroll jitter.
   Do not re-enable parallax on mobile.
4. **The welcome pile is intentional geometry, deterministic, never random.** All five frames
   share one absolutely-positioned box (`aspect-ratio: 5/6`), start near the centre at
   ~0.80–0.84 scale, and travel outward to fixed per-frame rests (documented in ANIMATIONS.md).
   Later frames sit above earlier ones by DOM order only (no z-index).
5. **Capabilities reveal by hover on desktop and by scroll position on mobile** (the row nearest
   46% of viewport height becomes active). The inactive rows dim to 0.26; the active row turns
   accent + italic, shifts right, and reveals its italic line.
6. **The hero headline's second line is indented** (`padding-left: 12vw` desktop / `8vw` mobile)
   — the asymmetry is the composition.
7. **Work cover titles use per-project `text-indent`** (0 / 8vw / 4vw / 12vw) on desktop and
   `0` on mobile.
8. **Mobile overrides are per-property, not a stylesheet swap.** In the prototype a
   `data-m-style` attribute holds the mobile declarations applied below 700px; in production,
   implement these as real CSS media queries (`@media (max-width: 700px)`) — RESPONSIVE.md
   lists every override verbatim.
9. **Nav is always pinned** (never hides on scroll); it only firms its glass past 60% of the
   first viewport.
10. **The welcome layer gates the hero entrance.** The hero reveal (clip-path wipe + rising
    headline + meta fade) must not start until the welcome layer begins exiting.

---

## Development Workflow

1. Inspect the repository, including `TheCompany.design v2.dc.html` and `uploads/`.
2. Read this file, then the `/docs` file relevant to the piece you're building.
3. Establish the design system first: CSS custom properties, fonts, resets, type scale.
4. Build shared components (nav, mobile menu, welcome layer, work cover, capability row, footer).
5. Build the page in section order: hero → work → approach → capabilities → studio → final CTA.
6. Implement responsive behavior with the documented media-query overrides.
7. Implement animations last, in one small scroll/observer module.
8. Verify visual fidelity against the prototype at 320 / 375 / 390 / 430 / 768 / 1280 / 1600px.
9. Fix discrepancies rather than redesigning around them.
10. Introduce a new design decision only when unavoidable — and mark it.

Suggested stack (see DESIGN_HANDOFF.md § Technology assumptions for what is and isn't implied):
plain HTML/CSS/vanilla JS or Next.js + CSS Modules. No animation library is needed; every
motion in the design is a CSS transition or a small scroll-driven inline style write.

---

## When Information Is Missing

```
Do not silently invent missing design decisions.

If something is unclear:
1. Look for evidence elsewhere in the documentation.
2. Inspect the prototype file / assets directly.
3. Make the smallest reasonable implementation assumption.
4. Mark the assumption clearly (code comment + note in the PR description).
5. Do not redesign the experience.
```

Anything the docs mark `UNKNOWN — verify during implementation`, `ESTIMATED — visually inferred`
or `PLACEHOLDER — replace with final asset` must be surfaced, not quietly resolved.

---

## Verification Checklist

**Desktop (1280 / 1600)**
- [ ] Nav pill centered, max-width 1220px, glass firms past 60vh, never hides
- [ ] Hero: clip-path wipe, two headline lines rise, second line indented 12vw
- [ ] Hero type parallaxes up and fades out by one viewport of scroll
- [ ] 4 work covers, each 100svh, image parallax active, title rises once per cover
- [ ] Work counter (fixed, bottom-left) shows current index and hides outside the work section
- [ ] Approach sentence lights word-by-word as the section passes
- [ ] Capabilities: hover activates a row (accent, italic, shift right, line reveals; others dim)
- [ ] Final CTA: radial accent glow, "Let's / begin." rises, magnetic CTA pill
- [ ] Custom accent cursor dot; expands to 82px "View" over work covers; hides over the CTA

**Mobile (320 / 375 / 390 / 430)**
- [ ] No horizontal overflow at any width
- [ ] Hamburger only (26px/17px lines, 2px, centered in 46×46), no "Menu" label
- [ ] Full-screen menu at 13vw type, body scroll locked, X state on the icon
- [ ] Bottom CTA bar appears after the hero, hides at the final CTA and while the menu is open
- [ ] Work covers: static crops (no parallax, no jitter), title 15vw, metric row full-width ruled
- [ ] Capabilities activate by scroll position; no hover dependency anywhere
- [ ] Welcome pile scales down proportionally and stays centered

**Cross-cutting**
- [ ] Typography, spacing, alignment match the prototype
- [ ] Images cropped/positioned/filtered as documented
- [ ] Reduced-motion: welcome compressed, reveals instant, parallax off
- [ ] Keyboard: nav, menu, CTAs reachable with visible focus
- [ ] Lighthouse: images optimized, fonts preconnected, no layout shift from the welcome layer
