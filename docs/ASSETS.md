# ASSETS.md — Asset inventory

All images live in `uploads/`. They are **AI-generated placeholder photography** standing in for
real studio/project imagery: every one is
`PLACEHOLDER — replace with final asset`.

Do not invent additional filenames. Do not add icons, logos or illustrations that are not listed.

---

## Images in use

| File | Type | Purpose / where used | Aspect used | Desktop treatment | Mobile treatment |
|---|---|---|---|---|---|
| `uploads/Transformation.png` | raster photo | Work cover **01 Mkopo** (full-bleed) + welcome frame 4 | fills `100svh` cover / 5:6 frame | `object-fit: cover; object-position: 50% 44%`; layer `inset: -8% 0`; filter `grayscale(.3) contrast(1.05) brightness(.84)`; parallax k=0.08; hover → `grayscale(.1) contrast(1.06) brightness(1.06)` | `object-position: 62% 45%`; parallax off (static crop); no hover state |
| `uploads/Work.png` | raster photo | Work cover **02 Sokoni** + welcome frame 5 (top of pile) | as above / 5:6 | as above (tone `#14100E` behind) | as above |
| `uploads/Studio.png` | raster photo | Work cover **03 Afya** + welcome frame 1 (bottom of pile) | as above / 5:6 | as above (tone `#0F1214`) | as above |
| `uploads/Capabilities.png` | raster photo | Work cover **04 Msingi** + welcome frame 2 | as above / 5:6 | as above (tone `#131313`) | as above |
| `uploads/Final CTA.png` | raster photo | Welcome frame 3 only (no longer used in a section) | 5:6 | welcome treatment below | same |
| `uploads/hero.png`, `uploads/hero-4b53c757.png` | raster photo | **Unused.** Former hero plate, removed when the hero became pure typography | — | — | — |
| `uploads/WhatsApp Image 2026-08-31 at 09.38.14- stacks.jpeg` | reference image | User-supplied reference for the welcome pile geometry only — **never rendered** | — | — | — |

### Welcome-frame treatment (per frame)

| Frame | File | `object-position` | `filter` | Radius | Shadow |
|---|---|---|---|---|---|
| 1 | `Studio.png` | `50% 40%` | `grayscale(.28) brightness(.80)` | `clamp(10px,1.1vw,16px)` | `0 26px 60px rgba(0,0,0,.55)` |
| 2 | `Capabilities.png` | `50% 45%` | `grayscale(.28) brightness(.82)` | same | same |
| 3 | `Final CTA.png` | `50% 50%` | `grayscale(.28) brightness(.84)` | same | same |
| 4 | `Transformation.png` | `50% 45%` | `grayscale(.28) brightness(.86)` | same | same |
| 5 | `Work.png` | `50% 45%` | `grayscale(.28) brightness(.72)` | same | same |

Frame 5 is darkest on purpose: the wordmark reads over it.

### Loading strategy

- Welcome frames: `<link rel="preload" as="image" href="uploads/…">` for all five, in `<head>`.
- Work cover images: served as WebP (converted from the source PNGs, `object-fit`/
  `object-position`/`filter` unchanged). Cover 01 (Mkopo) loads eagerly with `decoding="async"`
  since it sits immediately below the hero and was a source of scroll-in jank when it was lazy;
  covers 02–04 keep `loading="lazy" decoding="async"`.
- All decorative images carry `alt=""`.
- Still outstanding: AVIF and responsive `srcset` at ~800 / 1200 / 1800 / 2400px widths (currently
  single-size WebP only).

### Nav logo / favicon

| File | Purpose |
|---|---|
| `uploads/thecompany-design-logo.png` | Nav-bar mark (icon only, 344×281, white on transparent). Rendered via CSS `mask-image` over `background-color` so the click color-flash can animate a real color transition. |
| `uploads/favicon.ico` (16/32/48), `uploads/favicon-16x16.png`, `uploads/favicon-32x32.png`, `uploads/favicon-48x48.png`, `uploads/apple-touch-icon.png` (180×180) | Favicon set generated from the same mark, composited onto a `#0B0B0C` (`--bg`) square plaque — the transparent original disappears in light browser chrome, so it needed an opaque backing to stay legible at tab-icon size. |

---

## Non-image assets

| Asset | Type | Detail |
|---|---|---|
| Grain texture | inline SVG data URI | 240×240 `feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"`, fixed layer at `inset: -50%`, `opacity .055`, `mix-blend-mode: overlay`, z 60 |
| Hero glow | CSS gradient | `radial-gradient(58% 52% at 56% 40%, rgba(237,233,226,.055), transparent 72%)` |
| Hero scrims | CSS gradients | 178° vertical multi-stop + 120%×74% bottom-left radial (see DESIGN_HANDOFF § 3.7) |
| Work scrim | CSS gradient | `linear-gradient(200deg, rgba(11,11,12,.2), rgba(11,11,12,.62) 52%, rgba(11,11,12,.93))` |
| Final CTA glow | CSS gradient | `radial-gradient(58% 58% at 68% 38%, rgba(192,85,44,.13), transparent 70%)` |
| Scroll rail | CSS | 1px × 40px track `rgba(237,233,226,.18)` + accent bar, `@keyframes hair` |
| Arrows | text glyph | `→` (U+2192) at 12–14px — not an icon font |
| Hamburger | two `<span>`s | 26×2px and 17×2px, accent |
| Cursor dot | CSS | 9px accent circle, expands to 82px with the label "View" |

## Fonts

| Family | Weights / styles | Source | Usage |
|---|---|---|---|
| **Bodoni Moda** | 400 upright, 400 italic (`opsz 6..96`; 500 loaded but unused) | Google Fonts | all display type, wordmarks, menu links, italic accents |
| **Archivo** | 300 (body/UI), 400/500 loaded | Google Fonts | body text, nav links, uppercase micro-labels, buttons |
| System monospace | `ui-monospace, Menlo, monospace` | system | metadata, section eyebrows, footer, counter |

`<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com` is present;
the stylesheet URL uses `display=swap`. Self-hosting the two families is an acceptable
production improvement (same weights/styles only).

## No logo file

The wordmark is **live text** (`TheCompany` in Bodoni + `.design` in monospace uppercase, and
`thecompany.design` in the welcome layer). There is no SVG or raster logo.
`CONTENT REQUIRED` if a real logotype exists.

## Favicon / social

None in the prototype. `UNKNOWN — verify during implementation`: favicon set, OG image,
`og:*`/`twitter:*` tags. The only metadata present is
`<title>TheCompany.design</title>` and the meta description in CONTENT.md.
