# RESPONSIVE.md — Breakpoint behavior

The design has **one authored breakpoint: 700px**. Everything above it is one fluid desktop
composition driven by `clamp()`; everything at/below it is an art-directed mobile composition.
Mobile is **not** a stacked desktop layout.

```
≤ 700px      Mobile      (tested 320 / 375 / 390 / 430)
701–1024px   Tablet      desktop composition, fluid clamps, hover retained
≥ 1025px     Desktop     full composition (tested 1280 / 1600)
```

Additional conditional (not a width breakpoint): the hero coordinate label renders only when
`innerWidth > 700 && innerHeight ≥ 780`.

Feature queries used instead of widths: `(hover: none)` disables the custom cursor, magnetic CTA,
cover hover grading and work-image parallax; `(prefers-reduced-motion: reduce)` collapses motion.

---

## Desktop / tablet (> 700px)

| Property | Value |
|---|---|
| Container | full-bleed; `max-width: 1220px` only for the nav pill and the studio block |
| Gutter | `clamp(18px, 4vw, 56px)` |
| Header padding | `16px clamp(14px, 3vw, 34px)`; pill `9px 9px 9px 22px` |
| Nav | wordmark + 4 links + CTA pill; hamburger hidden |
| Section heights | hero/work covers/capabilities/final `100svh`; approach `130svh` |
| Work title indents | 0 / 8vw / 4vw / 12vw |
| Hero line 2 indent | `padding-left: 12vw` |
| Final CTA indent | `padding-left: 14vw` |
| Image crop | work covers `object-position: 50% 44%`, layer `inset: -8% 0`, parallax on |
| Capability rows | one line: `num · name · italic line`, `white-space: nowrap`, hover-activated |
| Studio divider | one row, space-between |
| Footer | one row, space-between |
| Fixed extras | work counter bottom-left `clamp(18px,4vw,56px)` / `30px`; custom cursor active |
| Mobile-only | none (mobile menu, hamburger and bottom CTA bar are hidden) |

---

## Mobile (≤ 700px) — every override, verbatim

Implement these as real `@media (max-width: 700px)` rules (in the prototype they live in
`data-m-style` attributes applied per property).

**Header / nav**
- Header padding → `12px 14px`; pill padding → `7px 14px`, `align-items: center`
  (symmetric left/right padding: the composition is mathematically balanced).
- Wordmark link → `padding: 0`, `align-items: center`.
- Desktop links **and** the CTA pill → `display: none`.
- Hamburger button → `display: flex`, 46×46, two accent bars 26×2px / 17×2px, gap 7px, centered.
  **No "Menu" text label.**

**Mobile menu** (mobile only, hidden above 700px)
- Fixed overlay, `padding: 96px 22px 34px`, links Bodoni `13vw` / lh 1.16, Contact italic accent,
  footer row monospace 9px.

**Mobile bottom CTA bar** (mobile only)
- Fixed bottom, `padding: 17px 22px`, appears after the hero, retires at the final CTA,
  hidden while the menu is open.

**Hero**
- `h1` → `font-size: 16.5vw`, `line-height: 0.9`; line 2 indent → `padding-left: 8vw`.
- Meta row → `flex-direction: column-reverse; align-items: flex-start; gap: 22px;
  margin-top: 34px; font-size: 11px`.
- Coordinate label → hidden.

**Work covers**
- Content padding → `96px 22px 40px`.
- `h2` → `font-size: 15vw`, `line-height: 0.94`, `text-indent: 0` (all four projects).
- Bottom row → `flex-direction: column; align-items: flex-start; gap: 18px`.
- Italic line → `font-size: 1.15rem; max-width: 22ch`.
- Tag row → `width: 100%; justify-content: space-between;
  border-top: 1px solid rgba(237,233,226,.14); padding-top: 16px; font-size: 11px`.
- Image → `object-position: 62% 45%`; **parallax cleared to `none`** (static crop; this removed
  the scroll jitter — do not re-enable).
- Work counter → `left: 22px; bottom: 74px` (clears the CTA bar).

**Approach**
- Section → `min-height: 108svh; padding: 100px 22px`.
- Sentence → `font-size: 12vw; max-width: 14ch`.

**Capabilities**
- Row → `flex-direction: column; align-items: flex-start; gap: 6px; padding: 15px 0;
  border-top: 1px solid rgba(237,233,226,.1)` (top hairlines, so no rule under "Systems").
- Name → `font-size: 11.5vw; transform: none` (no horizontal shift).
- Italic line → `white-space: normal; font-size: 1.05rem; padding-left: 30px; transform: none`.
- Activation → **scroll position**, not hover (row nearest 46% of viewport height).

**Studio**
- Inner block → `max-width: none`.
- Statement → `font-size: 10.5vw; max-width: 13ch; margin-top: 26px`.
- Divider row → `flex-direction: column; align-items: flex-start; gap: 10px;
  margin-top: 44px; padding-top: 20px`.

**Final CTA / footer**
- `h2` → `font-size: 19vw; line-height: 0.9`; italic line indent → `padding-left: 10vw`.
- CTA pill → `width: 100%; justify-content: space-between; padding: 21px 26px; font-size: 11px`.
- Footer → `flex-direction: column; gap: 12px; padding: 70px 0 96px`.

**Welcome layer**
- No overrides needed: stack width `clamp(132px, 14vw, 196px)` → 132px at ≤940px, frames use
  percentage offsets, wordmark `clamp(1.9rem, 7vw, 5.6rem)`. Composition stays centred and
  cannot overflow.

---

## Elements that change category across the breakpoint

| Behavior | Desktop | Mobile |
|---|---|---|
| Navigation | inline links + CTA pill | hamburger → full-screen menu |
| Primary CTA surface | nav pill + final CTA | bottom bar + final CTA (full-width) |
| Work image | parallax layer | static crop |
| Capability reveal | hover/focus | scroll proximity |
| Cursor | custom accent dot / "View" disc | none |
| Magnetic CTA | yes | no |
| Approach section height | 130svh | 108svh |
| Work title indents | staggered per project | all flush left |
| Studio/footer rows | horizontal | stacked |

## Overflow & sticky rules

- `body { overflow-x: hidden }`; every `100svh` section is `overflow: hidden`.
- No horizontal scrolling anywhere — verify `document.documentElement.scrollWidth ===
  clientWidth` at 320 / 375 / 390 / 430.
- Fixed layers (z-index): welcome 90, cursor 70, grain 60, header 52, menu 51, CTA bar 48,
  counter 45. Nothing else is sticky.
- Use `svh` (not `vh`) for full-height sections so the mobile URL bar cannot cause jumps.
