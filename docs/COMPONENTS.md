# COMPONENTS.md — Component inventory

Recommended hierarchy (global = used across the page; page-specific = only on Home):

```
App
├── GrainOverlay              (global, decorative)
├── CustomCursor              (global, desktop pointer only)
├── SiteHeader                (global)
│   ├── Wordmark
│   ├── NavLinks
│   ├── CtaPill (variant: nav)
│   └── MenuButton
├── MobileMenu                (global, ≤700px)
├── MobileCtaBar              (global, ≤700px)
├── WorkCounter               (global fixed, tied to Work)
├── WelcomeOverlay            (global, plays once)
│   ├── WelcomeStack
│   │   └── WelcomeFrame ×5
│   └── WelcomeWordmark
├── HeroSection
│   ├── HeroBackdrop (scrims + glow + CoordinateLabel)
│   └── HeroType (MaskedRiseLine ×2, MetaRow with ScrollRail)
├── WorkSection
│   └── WorkCover ×4          (image + scrim + MetaRow + MaskedRiseTitle + LineTagRow)
├── ApproachSection           (ScrollLitSentence)
├── CapabilitiesSection
│   └── CapabilityRow ×5
├── StudioSection
└── FinalCtaSection
    ├── CtaPill (variant: large, magnetic)
    └── SiteFooter
```

Shared primitives worth extracting: `CtaPill`, `MicroLabel`, `SectionEyebrow`,
`MaskedRiseLine`, `MetaRow`, `Hairline`.

---

## SiteHeader
- **Purpose:** persistent floating glass navigation.
- **Props:** `links[] {label, href}`, `ctaLabel`, `ctaHref`.
- **Structure:** fixed wrapper (`z-52`, padding `16px clamp(14px,3vw,34px)`; mobile `12px 14px`)
  → pill (`max-width: 1220px; margin: 0 auto; border-radius: 999px; padding: 9px 9px 9px 22px`,
  mobile `7px 14px`; border `rgba(237,233,226,.09)`; background `rgba(11,11,12,.22)`;
  `backdrop-filter: blur(20px) saturate(150%)`).
- **States:** `top` (default glass) → `past` (scrollY > 60vh): background `rgba(11,11,12,.62)`,
  border `rgba(237,233,226,.14)`, shadow `0 18px 50px -30px rgba(0,0,0,.9)`; transition 0.6s ease.
  Never translates out of view.
- **Typography:** wordmark Bodoni 16px + monospace 8.5px `.design` at ink 0.5; links Archivo 10px
  uppercase 0.22em at ink 0.72 (hover → accent, via the global `a:hover`).
- **Responsive:** ≤700px links + CTA hidden (`display: none`), MenuButton shown.
- **Accessibility:** nav landmark; 10px links get `padding: 10px 0` for hit area; ensure a visible
  focus ring (`ESTIMATED — visually inferred`: 1px accent outline, offset 3px — none in prototype).

## CtaPill
- **Variants:** `nav` (padding `12px 20px`, bg `rgba(237,233,226,.06)`, border `.14`) and
  `hero/final` (padding `18px 30px`, transparent, border `rgba(237,233,226,.28)`).
- **States:** hover/focus → background + border accent, text `#0B0B0C` (0.45–0.5s ease);
  `final` variant is also **magnetic** (see ANIMATIONS.md) and hides the custom cursor.
- **Mobile (final variant):** full width, `padding: 21px 26px`, 11px, arrow pushed right.
- **Content:** label + `→` glyph (12–14px). Always an `<a href="mailto:…">`.

## MenuButton
- **Structure:** `<button>` 46×46, `all: unset`, centered column of two accent bars:
  26×2px and 17×2px, `gap: 7px`.
- **States:** closed = staggered bars; open = both 26px, rotated ±9° and translated ±4.5px
  (an X), 0.4s `cubic-bezier(.16,1,.3,1)`.
- **A11y:** `aria-label` toggles "Open menu"/"Close menu", `aria-expanded` toggles.
  No text label by design.

## MobileMenu
- **Structure:** fixed overlay `z-51`, `background: rgba(9,9,10,.97)`, `backdrop-filter: blur(22px)`,
  padding `96px 22px 34px`, flex column centered, gap 6px.
- **Links:** Bodoni `13vw`, line-height 1.16, tracking −0.03em; Contact is italic accent.
- **Footer row:** `margin-top: auto`, monospace 9px, `Nairobi · GMT+3` /
  `thecompany.designhq@gmail.com`.
- **Behavior:** fades 0→1 (0.5s) after `display: flex`; locks `body { overflow: hidden }`;
  closes on any link click; hides the MobileCtaBar while open.

## MobileCtaBar
- Fixed bottom, `z-48`, padding `17px 22px`, `background: rgba(11,11,12,.82)`,
  `backdrop-filter: blur(16px)`, top hairline `.12`; label `Start a project` + accent `→`.
- **Behavior:** appears (opacity 1, `translateY(0)`) once scrollY > 0.9vh; retires when the
  final CTA reaches 75% of the viewport; `pointer-events` follow visibility. ≤700px only.

## WelcomeOverlay / WelcomeStack / WelcomeFrame
- **Purpose:** one-time curtain raiser (see ANIMATIONS.md for the full timeline).
- **Overlay:** fixed, `z-90`, `background: #0A0A0B`, flex centered, `transition: opacity 1.1s`.
- **Stack:** `position: relative; width: clamp(132px,14vw,196px); aspect-ratio: 5/6;`
  `transform-origin: 50% 46%`, transitions `transform .95s / opacity .85s`.
- **Frame (×5):** absolutely `inset: 0`, `overflow: hidden`,
  `border-radius: clamp(10px,1.1vw,16px)`, `box-shadow: 0 26px 60px rgba(0,0,0,.55)`,
  image `object-fit: cover` with per-frame `object-position` and `brightness` (see ASSETS.md).
  Stacking order = DOM order (no z-index).
- **Wordmark:** absolutely centered (`top: 50%`, `translate(0,-50%)`), Bodoni
  `clamp(1.9rem,7vw,5.6rem)`, `.design` in accent, `white-space: nowrap`.
- **A11y:** decorative images have empty `alt`; overlay should be `aria-hidden="true"` and must
  not trap focus; it is removed (`display: none`) when finished.

## HeroSection / MaskedRiseLine / ScrollRail
- **MaskedRiseLine:** parent `display: block; overflow: hidden`; child rises
  `translateY(105%) → 0` over 1.5s `cubic-bezier(.16,1,.3,1)` with per-line delay.
  Reusable for the work titles (102% / 1.35s) and the final CTA (30% + opacity).
- **ScrollRail:** 1px × 40px ivory-0.18 track with an accent bar animated by
  `@keyframes hair` (translateY −100% → 100%, 2.8s `cubic-bezier(.7,0,.3,1)`, infinite).
- **CoordinateLabel:** monospace 10px, ink 0.34, desktop + `innerHeight ≥ 780` only.

## WorkCover
- **Props:** `index, client, sector, year, line, tag, tone, indent, img`.
- **Structure/geometry:** see PAGES.md § 02 (three absolute layers, `100svh`).
- **States:** desktop hover → image filter `grayscale(.1) contrast(1.06) brightness(1.06)`
  over 1s; leave → `grayscale(.3) contrast(1.05) brightness(.84)`. Cursor becomes the 82px
  "View" disc. No hover state on touch.
- **Animation:** title mask-rise + line/tag fade-up, once, on entering 88–90% of the viewport;
  desktop-only parallax `translate3d(0, y, 0)` with factor 0.08.
- **A11y:** the whole cover is one link; give it an accessible name (`aria-label` with client +
  sector) and keep the heading inside it. `CONTENT REQUIRED` for real destinations.

## CapabilityRow
- **Props:** `num, name, line, active, dimmed, onActivate`.
- Structure, states, mobile column layout: PAGES.md § 04.
- **Interaction:** desktop `mouseenter`/`focus`; mobile driven by scroll proximity; also
  `onClick` for keyboard/tap parity. Rows are not links.
- **A11y:** make each row focusable (`tabindex="0"` or a `<button>`) so the line can be revealed
  without a pointer; `aria-expanded` is not appropriate — the line is decorative emphasis.

## ScrollLitSentence (Approach)
- Words are individual spans at `opacity: .12`, transition `opacity .5s`, lit to `.5` then `1`
  by scroll progress through the section (see ANIMATIONS.md for the formula).

## SectionEyebrow / MicroLabel / MetaRow / Hairline
- **SectionEyebrow:** monospace 10px uppercase, tracking 0.2em, ink 0.32–0.36; content
  `NN — Name`. Placement varies per section (see PAGES.md).
- **MicroLabel:** Archivo or monospace, 9–11px, uppercase, tracking 0.18–0.24em.
- **MetaRow:** `display: flex; justify-content: space-between` micro-label pair.
- **Hairline:** `1px solid rgba(237,233,226,0.09–0.14)` divider; also used as section top border.

## GrainOverlay / CustomCursor
- **GrainOverlay:** decorative fixed layer (tokens § 3.7). Toggleable; no interaction.
- **CustomCursor:** fixed 9px accent dot, `border-radius: 999px`, follows the pointer with a
  0.17s eased transform; grows to 82px with the centered 9px uppercase label "View" over
  `[data-cursor="view"]` (work covers); hides over `[data-cursor="hide"]` (final CTA pill).
  Disabled entirely on touch, under reduced motion, or when the cursor tweak is off.
  Native cursor is never hidden — the dot is additive.
