# INTERACTIONS.md — Interactive behavior

Motion values referenced here are specified fully in ANIMATIONS.md.

---

## 1. Header navigation (always visible)

| | |
|---|---|
| Trigger | page scroll |
| Target | fixed header + glass pill |
| Behavior | the pill is **pinned at all times** — it never hides or translates. Past `scrollY > 60vh` it firms: background `rgba(11,11,12,.22) → .62`, border `.09 → .14`, shadow `none → 0 18px 50px -30px rgba(0,0,0,.9)` |
| Visual feedback | 0.6s ease transition on all three properties |
| Mobile | same pinning; only the wordmark + hamburger are inside the pill |
| A11y | `<nav>` landmark; links have `padding: 10px 0` for a 44px-tall hit row; add a visible focus ring (`ESTIMATED — visually inferred`: 1px accent outline, 3px offset) |

**Nav links** (`Work`, `Services`, `Studio`, `Contact`) are in-page anchors to `#work`,
`#capabilities`, `#studio`, `#contact`; scrolling is native smooth
(`html { scroll-behavior: smooth }`). Hover → accent (global `a:hover`). No dropdowns anywhere.

**Nav CTA pill** (`Start a project →`, `mailto:`): hover/focus fills accent with `#0B0B0C` text
(0.45s ease). Hidden ≤700px.

## 2. Mobile menu (≤700px)

| | |
|---|---|
| Trigger | tap the 46×46 hamburger button |
| Behavior | overlay `display: none → flex`, then `opacity 0 → 1` (0.5s); `body { overflow: hidden }` locks scroll; bars morph into an X (both 26px, ±9°, ±4.5px, 0.4s); the bottom CTA bar is forced to opacity 0 |
| Close | tap the button again, or tap any menu link (the link then scrolls to its section) |
| State changes | `aria-expanded` true/false, `aria-label` "Open menu"/"Close menu" |
| A11y | real `<button>`; 46×46 target; scroll lock released on close. `ESTIMATED — visually inferred`: also close on `Escape` and return focus to the button — not in the prototype |
| Desktop | hidden entirely |

## 3. Work covers

| | |
|---|---|
| Trigger (desktop) | `mouseenter` / `mouseleave` on the cover |
| Behavior | image filter brightens and de-greys over 1s; the custom cursor grows to an 82px disc labelled "View" |
| Trigger (both) | click — currently `href="#work"` (self-anchor). `CONTENT REQUIRED`: real case-study destinations |
| Scroll behavior | title mask-rise once at 88vh; line + tag fade in at 90vh; desktop-only image parallax |
| Mobile | no hover state, no parallax — a static crop; the whole cover remains tappable |
| A11y | one link per cover containing the `h2`; give it an `aria-label` (client + sector); ensure focus shows the same brightened state as hover |

**Work counter** (fixed, bottom-left): opacity 1 only while a cover crosses the viewport
midpoint; the accent number updates to that cover's index (`01`–`04`). Decorative —
mark `aria-hidden="true"`.

## 4. Capabilities list

| | |
|---|---|
| Trigger (desktop) | `mouseenter` or `focus` on a row; `mouseleave` deactivates |
| Trigger (mobile) | scroll position — the row whose centre is nearest `46%` of the viewport height (within `30vh`) becomes active |
| Trigger (both) | `click` / tap activates a row |
| Behavior | active: number + name → accent, name → italic and shifted `translateX(clamp(10px,2vw,30px))` (desktop only), italic line fades in from `translateX(-14px)`; all other rows dim to opacity 0.26 |
| Duration | color 0.55s, transform 0.7s, line opacity 0.6s |
| Idle state | no row active: names ivory at full opacity, no lines visible |
| A11y | make rows keyboard-focusable (`<button>` or `tabindex="0"`) so the line can be revealed without a pointer; rows are not navigation |

## 5. Approach statement

Scroll-driven only: eight words light from `.12` → `.5` → `1` as the section passes (formula in
ANIMATIONS.md C3). No pointer interaction. Not hover-dependent on any device.

## 6. Final CTA

| | |
|---|---|
| Pill (`Start a project →`) | `mailto:thecompany.designhq@gmail.com`; hover fills accent; **magnetic** on desktop — follows the pointer `translate(dx*0.18, dy*0.26)` from centre, releases to `none` on `pointerleave` (0.5s ease-out-expo); the custom cursor hides while over it |
| Mobile | full-width pill, `padding: 21px 26px`, no magnetism |
| Email text | plain uppercase micro-label, not a link in the prototype (`ESTIMATED — visually inferred`: making it a `mailto:` link is a safe improvement) |
| Headline | rises once on scroll (see ANIMATIONS.md D) |

## 7. Mobile bottom CTA bar (≤700px)

Appears after the hero (`scrollY > 0.9vh`), retires when the final CTA reaches `0.75vh`, and is
suppressed while the menu is open. `pointer-events` track visibility so it is never a hidden tap
target. Links to `mailto:`.

## 8. Custom cursor (desktop pointer only)

Follows the pointer with a 0.17s eased transform; 9px accent dot by default; 82px "View" disc
over work covers; hidden over the final CTA pill; hidden when the pointer leaves the window.
Disabled on touch (`hover: none`), under reduced motion, or when the cursor tweak is off. The
native cursor is never hidden.

## 9. Welcome overlay

Blocks all interaction with the page while playing (full-viewport layer, z 90), then sets
`pointer-events: none`, fades out and is removed (`display: none`). Plays once per page load.
It also gates the hero entrance — the site's own opening animation starts as the overlay exits.
Should be `aria-hidden="true"` and must not trap focus.

## 10. States not present

No forms, inputs, sliders, tabs, accordions, modals, tooltips, pagination, filters, search,
loading spinners, progress bars, error or success states. The only "loading" moment is the
welcome overlay, and it is an art-directed intro rather than a loader.

## 11. Global interaction rules

- Every hover behavior has a documented touch equivalent (or is simply absent on touch).
- `::selection` is accent on `#0B0B0C`.
- All links inherit color and turn accent on hover; no underlines anywhere.
- Focus states are currently browser defaults — implement a visible custom ring and treat it as
  an explicit improvement (label it in code).
- Touch targets: nav links `10px 0` padding, hamburger 46×46, mobile CTA bar `17px 22px`,
  final CTA pill `21px 26px` — all ≥44px in the tap dimension.
