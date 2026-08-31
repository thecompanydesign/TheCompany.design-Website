# ANIMATIONS.md — Complete motion specification

Global easing vocabulary (only these are used):

| Token | Value | Used for |
|---|---|---|
| `ease-out-expo` | `cubic-bezier(.16,1,.3,1)` | almost all entrances, transforms, glass changes |
| `ease-in-out` | `cubic-bezier(.4,0,.6,1)` | welcome stack opacity fade |
| `ease-rail` | `cubic-bezier(.7,0,.3,1)` | the looping scroll rail |
| `ease` | browser `ease` | opacity-only fades, color/filter changes |

No animation library. Everything is a CSS transition/keyframe; scroll-linked values are written
as inline styles by one scroll handler, coalesced to one run per animation frame.

---

## A. Welcome / preloader sequence (plays once per page load)

Order: **welcome finishes → the hero entrance is allowed to start.** The hero entrance itself is
unchanged by the welcome layer; it is only gated.

| Step | Element | Trigger | Initial | Final | Property | Duration | Delay / at | Easing |
|---|---|---|---|---|---|---|---|---|
| 1 | Overlay | load | opacity 1, `#0A0A0B` | — | — | — | 0ms | — |
| 2 | Frame 1 (Studio.png) | timer | `translate(-3%,-2%) rotate(-1.5deg) scale(.80)`, opacity 0 | `translate(-19%,-9%) rotate(-9deg) scale(.95)`, opacity 1 | transform, opacity | .85s / .5s | 60ms | ease-out-expo |
| 3 | Frame 2 (Capabilities.png) | timer | `translate(3%,1%) rotate(1.5deg) scale(.81)`, opacity 0 | `translate(16%,6%) rotate(7.5deg) scale(.97)` | transform, opacity | .85s / .5s | 390ms | ease-out-expo |
| 4 | Frame 3 (Final CTA.png) | timer | `translate(-2%,2%) rotate(-1deg) scale(.82)`, opacity 0 | `translate(-12%,10%) rotate(-4.5deg) scale(.99)` | transform, opacity | .85s / .5s | 720ms | ease-out-expo |
| 5 | Frame 4 (Transformation.png) | timer | `translate(2%,-2%) rotate(1deg) scale(.83)`, opacity 0 | `translate(13%,-8%) rotate(5deg) scale(1)` | transform, opacity | .85s / .5s | 1050ms | ease-out-expo |
| 6 | Frame 5 (Work.png, top) | timer | `translate(0,0) rotate(0) scale(.84)`, opacity 0 | `translate(-2%,1%) rotate(-1.5deg) scale(1.02)` | transform, opacity | .85s / .5s | 1380ms | ease-out-expo |
| 7 | Wordmark | timer | opacity 0, `translate(0, calc(-50% + 22px))` | opacity 1, `translate(0,-50%)` | opacity, transform | .7s / .85s | 2000ms | ease-out-expo |
| 8 | Stack (recede) | timer | `scale(1)`, opacity 1 | `scale(0.4) translateY(12px)`, opacity 0 | transform, opacity | .95s / .85s | 2260ms | ease-out-expo / ease-in-out |
| 8b | Each frame (recede) | timer | rest | rest + `scale(.86)` | transform | .85s | 2260ms + `i*30ms` stagger | ease-out-expo |
| 9 | Overlay exit | timer | opacity 1 | opacity 0, `pointer-events: none` | opacity | 1.1s | 2960ms | ease-out-expo |
| 10 | Hero entrance gate opens | timer | — | — | — | — | 3160ms | — |
| 11 | Overlay removed | timer | — | `display: none` | — | — | 4110ms | — |

Key geometry rules:
- **Origin:** every frame starts near the centre at 0.80–0.84 scale with ≤3% offset — the pile
  *roots from the centre* and fans outward. Offsets are `translate()` **before** `rotate()`, so
  x/y are screen-axis.
- **Deterministic:** these five rests are fixed values. Never randomise.
- **Centred mass:** the mean of the five offsets is ≈ (−0.8%, 0%), so the pile stays optically
  centred while individual edges protrude in four directions.
- **Layering:** DOM order only — frame 5 is the top layer.
- **Repeat:** once per page load (`window.__tcdWelcomeDone` guard in the prototype).

**Reduced motion (or motion tweak off):** step gap 50ms, wordmark at ~330ms, recede at ~430ms,
exit at ~690ms — total ≈0.9s, same order, same end state.

**Mobile:** identical timeline; the stack scales via `clamp(132px, 14vw, 196px)` and the wordmark
via `clamp(1.9rem, 7vw, 5.6rem)`, so no positional overrides are needed.

---

## B. Hero entrance (starts only after the welcome gate opens)

| Element | Initial | Final | Property | Duration | Delay | Easing |
|---|---|---|---|---|---|---|
| `[data-hero-img]` backdrop | `clip-path: inset(100% 0 0 0)` | `inset(0% 0 0 0)` | clip-path | 1.6s | 0.15s | ease-out-expo |
| Headline line 1 | `translateY(105%)` | `translateY(0)` | transform | 1.5s | 0.25s | ease-out-expo |
| Headline line 2 | `translateY(105%)` | `translateY(0)` | transform | 1.5s | 0.38s | ease-out-expo |
| Hero meta row | opacity 0 | opacity 1 | opacity | 1.4s | 1.1s | ease |

Reduced motion: apply the end state immediately (no wipe, no rise).

## C. Scroll-linked motion

| # | Element | Formula | Notes |
|---|---|---|---|
| C1 | Hero type layer | `t = clamp(scrollY / vh, 0, 1)`; `translateY(-14t vh) scale(1 - .05t)`; `opacity = 1 - 1.05t` | Desktop + mobile; off under reduced motion |
| C2 | Work cover images | factor `k = 0.08`; `offset = (rect.top + h/2 - vh/2) * -k`; `translate3d(0, offset, 0)` | **Desktop pointer only.** On touch or ≤700px the transform is cleared to `none` once and never written again (deliberate anti-jitter fix) |
| C3 | Approach words | `prog = clamp((vh*.85 - rect.top) / (rect.height*.55), 0, 1)`; word *i* of *n*: `prog > i/n + .04 → 1`, `> i/n → .5`, else `.12`; transition `opacity .5s` | Both breakpoints; section is 130svh / 108svh to give the ramp room |
| C4 | Nav pill | `past = scrollY > vh*0.6` → background/border/shadow swap, 0.6s ease | Never translates; always pinned |
| C5 | Work counter | visible only while a cover straddles `vh*0.5`; index text = that cover's number; `opacity .6s` | Fixed bottom-left |
| C6 | Mobile CTA bar | show when `scrollY > vh*0.9` and the final CTA's top ≥ `vh*0.75`; `opacity .6s`, `transform .7s` ease-out-expo | ≤700px only |
| C7 | Capability rows (mobile) | active = row whose centre is nearest `vh*0.46`, if within `vh*0.3` | ≤700px only; replaces hover |

All scroll work runs once per frame (rAF-coalesced with a 60ms timer fallback).

## D. One-shot scroll reveals (fire once, never reverse)

| Element | Trigger | Initial | Final | Duration | Delay | Easing |
|---|---|---|---|---|---|---|
| Work cover `h2` | cover top < 88vh | `translateY(102%)` inside an `overflow: hidden` mask | `translateY(0)` | 1.35s | — | ease-out-expo |
| Work cover italic line | top < 90vh | opacity 0, `translateY(18px)` | opacity 1, `none` | 1.1s | 0.25s | ease / ease-out-expo |
| Work cover tag | top < 90vh | opacity 0 | opacity 1 | 1.1s | 0.4s | ease |
| Capability rows | top < 90vh | opacity 0, `translateY(20px)` | opacity 1, `none` | .9s | — | ease / ease-out-expo |
| Studio block | top < 90vh | opacity 0, `translateY(24px)` | opacity 1, `none` | 1.1s | — | ease / ease-out-expo |
| Final CTA `h2` | top < 88vh | `translateY(30%)`, opacity 0.001 | `translateY(0)`, opacity 1 | 1.4s / 1.2s | — | ease-out-expo / ease |

Self-healing rule (important): the gate is `rect.top < vh * 0.88` (or `0.9`) **without** a
`rect.bottom > 0` condition, so anything already scrolled past (deep link, tab switch, restored
scroll position) still resolves to its final state instead of staying invisible.

Reduced motion: mark all of these shown immediately with transitions disabled.

## E. Hover / pointer motion (desktop pointer only)

| Element | Trigger | Behavior | Duration | Easing |
|---|---|---|---|---|
| Work cover image | mouseenter / mouseleave | filter `grayscale(.3) contrast(1.05) brightness(.84)` ⇄ `grayscale(.1) contrast(1.06) brightness(1.06)` | 1s | ease-out-expo |
| Capability row | mouseenter / focus / click | activate (accent + italic + `translateX(clamp(10px,2vw,30px))`, line in from `translateX(-14px)`, others → opacity .26) | color .55s, transform .7s, opacity .55–.6s | ease-out-expo |
| Capability row | mouseleave (row area) | deactivate all | same | same |
| Nav CTA / final CTA pill | hover | fill accent, text `#0B0B0C`, border accent | .45–.5s | ease |
| Final CTA pill | pointermove inside | **magnetic**: `translate(dx*0.18, dy*0.26)` from element centre; `pointerleave` → `none` | .5s | ease-out-expo |
| Any link | hover | `color: var(--accent)` (global `a:hover`) | instant | — |
| Custom cursor dot | pointermove | transform follows pointer | .17s | ease-out-expo |
| Custom cursor dot | over `[data-cursor="view"]` | 9px → 82px, label "View" fades in | .45s / .3s | ease-out-expo / ease |
| Custom cursor dot | over `[data-cursor="hide"]` | opacity → 0 | .4s | ease |

Touch equivalents: cover hover = none (static crop); capability hover = scroll activation (C7);
magnetic = none; cursor = not rendered.

## F. Looping / ambient

| Element | Animation | Duration | Repeat |
|---|---|---|---|
| Hero scroll rail bar | `@keyframes hair` — `translateY(-100%) → translateY(100%)` | 2.8s | infinite, ease-rail |
| Grain layer | none (static texture, `mix-blend-mode: overlay`, opacity .055) | — | — |

`ESTIMATED — visually inferred`: under reduced motion the rail should be paused
(`animation: none`) — the prototype leaves it running.

## G. Menu transitions

| Step | Behavior | Duration |
|---|---|---|
| Open | `display: none → flex`, then on the next frame `opacity 0 → 1`; body scroll locked; hamburger bars morph to an X (both 26px, ±9°, ±4.5px); mobile CTA bar forced to opacity 0 | .5s ease / .4s ease-out-expo |
| Close | reverse; body scroll released; bars return to 26/17px | same |
| Link click | closes the menu, then the native smooth scroll runs | — |

## H. Not present (do not add)

No marquee, no carousel, no modal, no accordion, no tooltip, no page transition, no sticky
section other than the fixed layers listed, no counter/odometer, no text scramble, no 3D.
