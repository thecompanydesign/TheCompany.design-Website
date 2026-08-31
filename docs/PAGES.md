# PAGES.md — Page & section specification

The site is **one page** with in-page anchors. There are no other routes.

```
Page: Home  (route: "/")
├── Welcome layer            (fixed overlay, plays once per load, z 90)
├── Grain layer              (fixed, z 60)
├── Custom cursor            (fixed, z 70, desktop pointer only)
├── Header / nav pill        (fixed, z 52)
├── Mobile menu              (fixed overlay, z 51, ≤700px)
├── Mobile CTA bar           (fixed bottom, z 48, ≤700px)
├── Work counter             (fixed bottom-left, z 45)
├── 01 Hero                 #top
├── 02 Work                 #work        → 4 full-viewport covers
├── 03 Approach             #approach
├── 04 Capabilities         #capabilities
├── 05 Studio               #studio
└── 06 Final CTA + Footer   #contact
```

Page name: **Home**. Purpose: convince a founder/product lead that this studio operates at
international level, and get them to email. Target user: Kenyan/East African founders and
product leaders; secondarily international clients.

Primary CTA: **Start a project →** (`mailto:thecompany.designhq@gmail.com`) — appears in the nav
pill (desktop), the mobile bottom bar, and the final CTA section.
Secondary CTA: the in-page nav anchors (Work / Services / Studio / Contact).

Navigation behavior: always pinned, never hides; glass firms past 60% of the first viewport.
Footer behavior: sits inside the final CTA section, pushed down by `margin-top: auto`.

---

## 01 — Hero  (`#top`, label "01 Hero")

- **Box:** `position: relative; height: 100svh; overflow: hidden`.
- **Backdrop layer** (`[data-hero-img]`): absolutely fills the section; **clipped**
  `clip-path: inset(100% 0 0 0)` at load and wiped open to `inset(0%)` on entry
  (1.6s `cubic-bezier(.16,1,.3,1)`, 0.15s delay). Contains:
  - flat `#0A0A0B` field + ivory radial glow (tokens § 3.7),
  - two non-interactive scrims (vertical + bottom-left radial),
  - a monospace coordinate label `01°17′S 36°49′E — Nairobi`, absolutely placed
    `right: clamp(18px,4vw,56px); top: 27%`, shown **only** on desktop viewports ≥780px tall
    (`[data-tall-only]`).
  - No image and no canvas: the hero is deliberately pure typography on a graded field.
- **Type layer** (`[data-hero-type]`): absolutely anchored to the bottom
  (`inset: auto 0 0 0`), padding `0 gutter clamp(34px,7vh,74px)`, `will-change: transform, opacity`.
  - `h1` two lines, each line wrapped in an `overflow: hidden` mask with an inner span that
    rises from `translateY(105%)`:
    - line 1 `Impossible` (delay 0.25s)
    - line 2 `to *ignore*.` — `padding-left: 12vw` (mobile `8vw`), the word "ignore" italic accent
      (delay 0.38s)
  - Meta row: left `Websites, products, systems`; right a 1px × 40px vertical rail with an
    accent bar looping through it (`@keyframes hair`, 2.8s) + the word `Scroll`.
    Fades in (1.4s, 1.1s delay). Mobile: `flex-direction: column-reverse`, gap 22px, 11px type.
- **Scroll behavior:** the whole type layer translates up to `-14vh`, scales to `0.95`, and fades
  to 0 across one viewport of scroll (desktop and mobile; disabled under reduced motion).

## 02 — Work  (`#work`, label "02 Work")

Four sibling `<a href="#work">` covers, each:

- **Box:** `display: block; height: 100svh; overflow: hidden; border-top: 1px solid rgba(237,233,226,.09)`.
  (`href` is a placeholder anchor — `CONTENT REQUIRED` if real case-study pages are added.)
- **Layer 1 — image** (`[data-shot]`): `position: absolute; inset: -8% 0` (oversized vertically so
  desktop parallax never reveals an edge), per-project background tone, image
  `object-fit: cover; object-position: 50% 44%` (mobile `62% 45%`), `loading="lazy"`,
  base filter `grayscale(0.3) contrast(1.05) brightness(0.84)`.
- **Layer 2 — scrim:** 200° three-stop gradient (tokens § 3.7).
- **Layer 3 — content:** absolute, `display: flex; column; justify-content: space-between`,
  padding `clamp(84px,12vh,130px) gutter clamp(56px,8vh,90px)` (mobile `96px 22px 40px`):
  - **Meta row** (monospace 10px): left `{index} — {sector}`, right `{year}` at ink 0.38.
  - **Title block:** `overflow: hidden` mask; `h2` rises from `translateY(102%)` (1.35s) once the
    cover reaches 88% of the viewport. Per-project `text-indent`: 0 / 8vw / 4vw / 12vw
    (mobile: all `0`).
  - **Bottom row:** italic line (fades up, 0.25s delay) + accent tag `Concept study →`
    (fades, 0.4s delay). Mobile: column; the tag row becomes full width with a top hairline
    and `justify-content: space-between`.
- **Per-project data** (order fixed):

| # | Client | Sector | Year | Line | Tag | Tone | Indent | Image |
|---|---|---|---|---|---|---|---|---|
| 01 | Mkopo | Lending · Nairobi | Concept | Credit that explains itself before it asks. | Concept study | `#121215` | 0 | `uploads/Transformation.png` |
| 02 | Sokoni | Wholesale commerce | Concept | Stock, credit and delivery in one screen. | Concept study | `#14100E` | 8vw | `uploads/Work.png` |
| 03 | Afya | Health product | Concept | A clinic queue, rebuilt for a phone. | Concept study | `#0F1214` | 4vw | `uploads/Studio.png` |
| 04 | Msingi | Design systems | Concept | One vocabulary for a growing product team. | Concept study | `#131313` | 12vw | `uploads/Capabilities.png` |

- **Fixed counter** (`[data-workindex]`): `position: fixed; left: clamp(18px,4vw,56px); bottom: 30px`
  (mobile `left: 22px; bottom: 88px`), monospace 10px, accent index + `/ 04 — Work`.
  Opacity 1 only while a cover crosses the viewport midpoint.

## 03 — Approach  (`#approach`, label "03 Approach")

- **Box:** `min-height: 130svh` (mobile `108svh`), `display: flex; align-items: center`,
  padding `clamp(90px,18vh,220px) gutter` (mobile `100px 22px`), top hairline.
- **Statement:** one `p`, max-width 22ch (mobile 14ch), eight `<span>` words each starting at
  `opacity: .12`; scroll lights them sequentially to `.5` then `1`. "Inevitable" is italic accent.
- **Eyebrow:** `03 — Approach`, absolutely placed bottom-right
  (`right: gutter; bottom: clamp(40px,8vh,90px)`), monospace 10px, ink 0.32.

## 04 — Capabilities  (`#capabilities`, label "04 Capabilities")

- **Box:** `min-height: 100svh`, flex column centered, `overflow: hidden`, top hairline.
- **Inner:** padding `clamp(80px,12vh,140px) gutter clamp(40px,8vh,90px)`; eyebrow
  `04 — Capabilities` (monospace 10px, ink 0.36); list starts `margin-top: clamp(26px,5vh,54px)`.
- **Five rows**, each: `[num] [name]` (baseline-aligned pair) + italic line.
  - Row: flex, `align-items: center`, gap `clamp(14px,3vw,44px)`, padding `clamp(9px,1.6vh,18px) 0`,
    `cursor: default`; enters with fade-up (0.9s) on first scroll into view.
  - Active row: name → accent + italic + `translateX(clamp(10px,2vw,30px))`, num → accent,
    line → opacity 1 and `translateX(0)` (from `-14px`).
  - Inactive rows while another is active: opacity `0.26`.
  - Idle (nothing active): all names ivory, all lines hidden.
  - Mobile: row becomes column (`gap: 6px`, `padding: 15px 0`, `border-top` hairline), name
    `11.5vw` with no shift, line wraps at `1.05rem` with `padding-left: 30px`.
- **Data:** 01 Strategy — *What deserves to exist.* / 02 Experience — *Where attention goes.* /
  03 Interface — *Every state, every network.* / 04 Product — *Shipped, then sharpened.* /
  05 Systems — *Built to outlive us.*

## 05 — Studio  (`#studio`, label "05 Studio")

- **Box:** padding `clamp(90px,18vh,210px) gutter`, top hairline; inner block `max-width: 1220px;
  margin: 0 auto` (mobile `max-width: none`); the block fades up once (1.1s).
- **Eyebrow:** `05 — Studio`.
- **Statement:** `World-class digital design, *built from Nairobi.*` — `clamp(1.9rem,6vw,5.4rem)`,
  max-width 20ch, `margin-top: clamp(34px,6vh,64px)` (mobile `10.5vw`, 13ch, 26px).
- **Divider row:** top hairline + monospace 9px pair — left `Studio — Kilimani, Nairobi`,
  right `Working across East Africa`. Mobile: column, gap 10px.

## 06 — Final CTA + Footer  (`#contact`, label "06 Final")

- **Box:** `min-height: 100svh`, flex column centered, `overflow: hidden`,
  padding `clamp(90px,14vh,170px) gutter 0`, top hairline.
- **Glow:** absolute radial accent (tokens § 3.7), centred at 68% / 38%.
- **Headline:** `h2` `Let's` / `*begin.*` — the italic second line indented `14vw`
  (mobile `10vw`); rises from `translateY(30%)` + opacity 0.001 → 1 (1.4s / 1.2s).
- **CTA row** (`margin-top: clamp(36px,7vh,80px)`, gap 26px): pill
  `Start a project →` (magnetic on desktop, fills accent on hover) + the email address in
  uppercase micro type. Mobile: pill is full width, `padding: 21px 26px`, 11px type,
  `justify-content: space-between`.
- **Footer:** `margin-top: auto`, padding `clamp(50px,9vh,100px) 0 26px` (mobile `70px 0 96px`),
  monospace 9px, three items: `TheCompany.design` / `Nairobi, Kenya · GMT+3` / `© 2026`.
  Mobile: column, gap 12px.

---

## Tablet behavior (701–1024px)

The prototype has a **single breakpoint at 700px**; tablets therefore render the desktop
composition with fluid `clamp()` values (smaller gutters, smaller display type) and keep hover
interactions. `ESTIMATED — visually inferred`: if a tablet-specific pass is wanted, only the
capability row (long names + line on one line) needs checking at 720–820px.
