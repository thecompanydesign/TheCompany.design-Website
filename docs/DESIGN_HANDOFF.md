# DESIGN_HANDOFF.md — Design system & visual direction

Reverse-engineered from `TheCompany.design v2.dc.html`. Values are exact unless marked
`ESTIMATED` or `UNKNOWN`.

---

## 1. Design overview

**Concept.** A dark-first editorial experience for a Nairobi design studio. The site behaves
like a sequence of full-viewport spreads rather than a scrolling brochure: each screen holds one
idea, set in large Bodoni display type over a near-black field, with a single oxide accent.

**Brand personality.** Intelligent, rare, precise, confident, quietly luxurious. Kenyan context
is embedded through content (Nairobi coordinates, Kilimani studio line, East Africa reach,
Swahili-rooted concept-project names) — never through decorative cultural motifs.

**Design philosophy.**
- Say less, show more: ~70% visual / 30% text.
- One statement per screen; no section explains itself twice.
- Motion carries hierarchy (what arrives first, what is lit, what recedes), never decoration.
- Asymmetry is authored: indents, rotations and offsets are fixed values, never random.

**Intended experience.** Welcome pile → studio signature → hero statement → work as four
immersive covers → a single belief → capabilities as a typographic system → a two-line studio
statement → a closing invitation.

**Visual hierarchy.** Display serif (Bodoni Moda) carries all statements; uppercase monospace
micro-labels carry metadata; Archivo Light carries the little remaining prose. Scale jumps are
extreme by design (10px labels next to 15vw headlines).

**Layout philosophy.** Full-bleed sections with fluid gutters (`clamp(18px, 4vw, 56px)`), a single
1220px max-width used only by the nav pill and the studio block, and absolutely-positioned
content layers over image layers.

**What makes it distinctive.** The welcome "pile of prints"; the four full-viewport covers with
per-project title indents; the scroll-lit approach sentence; the hover/scroll-dual capabilities
list; the grain layer; the accent cursor that becomes a "View" disc.

---

## 2. Technology assumptions

Determinable from the prototype:

- **No animation library.** All motion = CSS transitions + `@keyframes hair` + a small
  scroll handler writing inline styles. Do not add GSAP/Framer/Lenis.
- **No icon library.** The only "icons" are text arrows (`→`) and two hamburger `<span>` bars.
- **No CSS framework.** All styling is authored per element; a token layer + component CSS is
  the natural port. Tailwind is acceptable only if the exact values below are preserved.
- **Fonts** load from Google Fonts with `preconnect` (see § Typography).
- **Images** are local files in `uploads/`, `loading="lazy"` on work covers, and
  `<link rel="preload" as="image">` for the five welcome frames.
- **Smooth scrolling** is native: `html { scroll-behavior: smooth }` + in-page `#anchor` links.
- **Single page, hash navigation.** No router required.
- **Reduced motion** is queried via `matchMedia('(prefers-reduced-motion: reduce)')`.
- **Touch detection** via `matchMedia('(hover: none)')` — used to disable hover-only motion.

`UNKNOWN — verify during implementation`: framework choice (React/Next vs static), CMS (none is
implied), analytics, form handling (there is no form — the CTA is a `mailto:` link), hosting.

---

## 3. Design tokens

### 3.1 Colors

| Name | Value | Usage |
|---|---|---|
| `--bg` page black | `#0B0B0C` | `body` background, pill/bar tints (with alpha) |
| Deep black | `#0A0A0B` | Hero backdrop, welcome layer background |
| Deepest black | `#09090A` | Bottom of hero scrim, mobile menu background at 0.97 |
| `--ink` ivory | `#EDE9E2` | All primary text, hairlines (with alpha) |
| `--accent` oxide | `#C0552C` | Italic accents, active states, cursor dot, hamburger, pulses |
| Accent alternates (tweaks) | `#C8A97E`, `#8FA6B2`, `#A8A29A` | Alternate art-direction options only |
| Work cover tones | `#121215`, `#14100E`, `#0F1214`, `#131313` | Per-project base tint behind image |
| Capability tones (unused in DOM) | `#141013`, `#101314`, `#131311`, `#101012`, `#141212` | Data only; no visible use |

Ink alpha ladder (used constantly — keep these exact values):
`0.9`-ish body ivory (full `#EDE9E2`), `0.82` project line, `0.72` nav links, `0.7` capability
line, `0.5` meta labels, `0.42` hero meta, `0.4` studio/footer micro, `0.38` year, `0.36` section
eyebrow, `0.34` footer, `0.32` approach label, `0.28`/`0.14`/`0.12`/`0.1`/`0.09` borders.

Selection: `::selection { background: var(--accent); color: #0B0B0C; }`

### 3.2 Typography

Families (Google Fonts, one `<link>`):
```
Bodoni Moda — ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400   → display serif
Archivo     — wght@300;400;500                                     → UI / body sans
ui-monospace, Menlo, monospace                                     → micro-labels (system)
```
`font-display: swap` via the Google URL. `-webkit-font-smoothing: antialiased` on `html`.
Body default: `Archivo, Helvetica, sans-serif`, weight **300**.

Display (Bodoni Moda 400, italic used as emphasis):

| Role | Size | Line height | Letter spacing | Mobile override |
|---|---|---|---|---|
| Hero `h1` | `clamp(3.4rem, 13.5vw, 15rem)` | 0.86 | −0.035em | `16.5vw` / lh 0.9 |
| Work cover `h2` | `clamp(2.9rem, 11vw, 12rem)` | 0.88 | −0.035em | `15vw` / lh 0.94 |
| Final CTA `h2` | `clamp(3rem, 15vw, 16rem)` | 0.84 | −0.04em | `19vw` / lh 0.9 |
| Approach `p` | `clamp(2.3rem, 7.4vw, 7.6rem)` | 1.0 | −0.03em | `12vw`, max-width 14ch |
| Studio `p` | `clamp(1.9rem, 6vw, 5.4rem)` | 1.02 | −0.028em | `10.5vw`, max-width 13ch |
| Capability `h3` | `clamp(1.9rem, 6.6vw, 6rem)` | 0.98 | −0.03em | `11.5vw` |
| Capability line (italic) | `clamp(.9rem, 1.5vw, 1.35rem)` | — | — | `1.05rem`, wraps |
| Work cover line (italic) | `clamp(1rem, 1.8vw, 1.5rem)` | — | — | `1.15rem`, max 22ch |
| Welcome wordmark | `clamp(1.9rem, 7vw, 5.6rem)` | 1 | −0.03em | same (fluid) |
| Mobile menu links | `13vw` | 1.16 | −0.03em | mobile only |
| Nav wordmark | `16px` | — | +0.01em | unchanged |

Micro-labels (uppercase):

| Role | Family | Size | Letter spacing |
|---|---|---|---|
| Nav links / CTA pill | Archivo | 10px | 0.22em |
| Hero meta row | Archivo | 10px (mobile 11px) | 0.24em |
| Work meta row / counter | monospace | 10px | 0.2em / 0.18em |
| Section eyebrow (`03 — Approach` etc.) | monospace | 10px | 0.2em |
| Studio + footer micro | monospace | 9px | 0.2em |
| Nav `.design` suffix | monospace | 8.5px | 0.18em |
| Cursor label "View" | Archivo | 9px | 0.2em |
| Work tag (accent) | Archivo | 10px (mobile 11px) | 0.24em |

### 3.3 Spacing

- **Page gutter (all sections):** `clamp(18px, 4vw, 56px)`; mobile sections override to `22px`.
- **Header padding:** `16px clamp(14px, 3vw, 34px)`; mobile `12px 14px`.
- **Nav pill padding:** `9px 9px 9px 22px`; mobile `7px 14px`.
- **Nav item gap:** `clamp(14px, 2.2vw, 30px)`; nav link hit padding `10px 0`.
- **Section vertical padding:**
  - Approach: `clamp(90px, 18vh, 220px)`; mobile `100px 22px`.
  - Capabilities inner: `clamp(80px, 12vh, 140px)` top → `clamp(40px, 8vh, 90px)` bottom.
  - Studio: `clamp(90px, 18vh, 210px)`.
  - Final CTA: `clamp(90px, 14vh, 170px)` top, `0` bottom (footer carries the rest).
  - Work cover content: `clamp(84px, 12vh, 130px) / gutter / clamp(56px, 8vh, 90px)`;
    mobile `96px 22px 40px`.
  - Hero content: bottom padding `clamp(34px, 7vh, 74px)`.
- **Component gaps:** hero meta `24px` (mobile column-reverse, `22px`); work bottom row `20px`
  (mobile column, `18px`); capability row gap `clamp(14px, 3vw, 44px)` (mobile column, `6px`);
  final CTA row `26px`; footer `18px` (mobile column, `12px`); mobile menu links `6px`.
- **Capability row padding:** `clamp(9px, 1.6vh, 18px) 0`; mobile `15px 0`.
- **Studio divider:** `margin-top: clamp(46px, 9vh, 100px)`, `padding-top: 22px`.
- **Footer padding:** `clamp(50px, 9vh, 100px) 0 26px`; mobile `70px 0 96px` (clears the CTA bar).

### 3.4 Borders, radius, dividers

- Section dividers / work cover tops: `1px solid rgba(237,233,226,0.09)`.
- Nav pill border: `1px solid rgba(237,233,226,0.09)` → `0.14` past 60vh.
- CTA pill (nav): `1px solid rgba(237,233,226,0.14)`, background `rgba(237,233,226,0.06)`.
- Final CTA pill: `1px solid rgba(237,233,226,0.28)`.
- Mobile CTA bar: `border-top: 1px solid rgba(237,233,226,0.12)`.
- Mobile capability rows: `border-top: 1px solid rgba(237,233,226,0.1)`.
- Mobile work metric row: `border-top: 1px solid rgba(237,233,226,0.14)`, `padding-top: 16px`.
- Studio divider: `border-top: 1px solid rgba(237,233,226,0.12)`.
- Radius: `999px` (nav pill, CTA pills, cursor dot); `clamp(10px, 1.1vw, 16px)` (welcome frames);
  everything else **0**.

### 3.5 Shadows & blur

- Nav pill past 60vh: `0 18px 50px -30px rgba(0,0,0,0.9)`; `none` before.
- Welcome frames 1–5: `0 26px 60px rgba(0,0,0,0.55)`.
- Backdrop filters: nav pill `blur(20px) saturate(150%)`; mobile menu `blur(22px)`;
  mobile CTA bar `blur(16px)` (all with `-webkit-` duplicates).
- Elevation order (z-index): welcome 90 → cursor 70 → grain 60 → header 52 → mobile menu 51 →
  mobile CTA bar 48 → work counter 45 → page content (auto).

### 3.6 Layout

- Max content width: **1220px**, used by the nav pill and the studio block only. All other
  sections are full-bleed with gutters.
- No column grid; compositions are flex + absolute layers.
- Vertical rhythm is viewport-based: sections are `100svh` except approach (`130svh` /
  `108svh` mobile) and studio/footer (content height).
- Alignment: hero and final CTA are bottom/centre-left anchored; work covers distribute
  meta/title/footer via `justify-content: space-between`; capabilities are left-aligned rows.
- Overflow: `body { overflow-x: hidden }`; every full-viewport section is `overflow: hidden`.

### 3.7 Global background layers

1. **Grain** — fixed, `inset: -50%`, z 60, `opacity .055`, `mix-blend-mode: overlay`,
   inline SVG `feTurbulence baseFrequency=0.85 numOctaves=3` at 240×240, `pointer-events: none`.
2. **Hero glow** — `radial-gradient(58% 52% at 56% 40%, rgba(237,233,226,0.055), transparent 72%)`.
3. **Hero scrims** — `linear-gradient(178deg, transparent 0%, rgba(11,11,12,.16) 44%,
   rgba(10,10,11,.72) 76%, rgba(9,9,10,.95) 100%)` plus
   `radial-gradient(120% 74% at 20% 100%, rgba(6,6,7,.9), rgba(9,9,10,.4) 46%, transparent 74%)`.
4. **Work cover scrim** — `linear-gradient(200deg, rgba(11,11,12,.2) 0%, rgba(11,11,12,.62) 52%,
   rgba(11,11,12,.93) 100%)`.
5. **Final CTA glow** — `radial-gradient(58% 58% at 68% 38%, rgba(192,85,44,0.13), transparent 70%)`.

### 3.8 Author-time tweak props (prototype only)

`accent` (color, default `#C0552C`), `grain` (bool, default true), `cursor` (bool, default true),
`motion` (bool, default true). In production these map to: a CSS custom property, a `.grain`
toggle class, and reduced-motion handling. They are not user-facing UI.
