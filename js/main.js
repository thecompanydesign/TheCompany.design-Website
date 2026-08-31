(function () {
  'use strict';

  // As early as physically possible (before any other script logic, layout
  // read, or timer): stop the browser from restoring a prior scroll
  // position on reload/back-forward navigation, and force it to 0 in case
  // one was already applied before this script ran (the page is always
  // meant to restart from the welcome screen at the top, never resume
  // mid-scroll). history.scrollRestoration alone only prevents *future*
  // auto-restoration in this session — it doesn't undo one that already
  // happened, hence the explicit scrollTo as well.
  // behavior:'instant' is required, not optional: html{scroll-behavior:
  // smooth} is set globally, so a plain scrollTo(0,0) would otherwise
  // animate — invisible here since the opaque welcome overlay hasn't even
  // painted yet, but see the matching call at the gate below, where the
  // same omission caused a real, visible bug.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var mobileMQ = window.matchMedia('(max-width: 700px)');

  var vh = function () { return window.innerHeight; };

  /* ========================================================================
     A. Welcome / preloader sequence — plays once per load, gates the hero
     ======================================================================== */

  function runWelcome() {
    if (window.__tcdWelcomeDone) return;
    window.__tcdWelcomeDone = true;

    // .welcome is position:fixed and visually covers the viewport, but that
    // alone does not stop the real document underneath from scrolling — on
    // mobile, a touch/swipe during the ~5.5s intro (an easy accidental or
    // impatient gesture, since a screen tap is the primary input there)
    // scrolls the actual page invisibly behind the opaque overlay, so the
    // page lands mid-scroll (hero partly offscreen, nav included, since it
    // renders relative to a viewport a stale scroll position can leave
    // mis-measured on some mobile browsers) once the overlay clears. Lock
    // scroll for the duration (same pattern as the mobile menu, below) and
    // hard-reset to the top once the overlay stops blocking interaction.
    // (scrollRestoration + the initial scrollTo(0,0) are handled at the very
    // top of this file, before anything else runs.)
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    var welcome = document.getElementById('welcome');
    var wordmark = document.getElementById('welcomeWordmark');
    var frames = [
      document.getElementById('wf1'),
      document.getElementById('wf2'),
      document.getElementById('wf3'),
      document.getElementById('wf4'),
      document.getElementById('wf5')
    ];

    // Per-letter reveal stagger in RANDOM order (adapted from the reference's
    // stagger:{each:.08, from:'random'} — see css/style.css comment above
    // .welcome-wordmark — tightened to .035 for a snappier reveal). Re-shuffled
    // on every load, same as the reference.
    var letters = Array.prototype.slice.call(document.querySelectorAll('.wordmark-letter'));
    var shuffledLetters = letters.slice();
    for (var si = shuffledLetters.length - 1; si > 0; si--) {
      var sj = Math.floor(Math.random() * (si + 1));
      var tmp = shuffledLetters[si];
      shuffledLetters[si] = shuffledLetters[sj];
      shuffledLetters[sj] = tmp;
    }
    var letterStagger = reduceMotion ? 0.007 : 0.035;
    shuffledLetters.forEach(function (letter, position) {
      letter.style.transitionDelay = (position * letterStagger).toFixed(3) + 's';
    });

    // Card entrance/exit timing+stagger is adapted from the reference GSAP
    // timeline (see css/style.css comment above .welcome-frame for the
    // source values), sped up ~13% (1.5s->1.3s entrance, 1.1s->.95s exit,
    // stagger and start tightened to match) per a request to make the card
    // motion feel slightly faster once the earlier stutter (clip-path, see
    // the same CSS comment) was fixed.
    // wordmark/exitStart/exit/remove are this project's own schedule, tuned
    // so phases overlap on the way in (wordmark starts before the last card
    // even finishes entering — continuous motion, not a stop-then-start)
    // but never on the way out. All downstream numbers below were
    // recomputed from the new card durations to preserve that guarantee:
    //   last card entrance finishes: 180 + 4*130 + 1300 = 2000
    //   wordmark trigger: 1300 (leaves the same ~35%-of-entrance overlap
    //     with the card tail as before)
    //   wordmark fully risen: 1300 + 16*.035s stagger + 1.2s duration = 3060
    //   cardExitStart: 3300 (3060 + ~240ms hold, so the completed wordmark
    //     gets a beat before anything collapses)
    //   cards finish exiting: 3300 + 4*70 + 950 = 4530
    //   wordmarkExit: 3400 (100ms after cardExitStart, matching the
    //     reference's card-exit/letter-exit gap)
    //   letters finish exiting: 3400 + 16*.04s stagger + .9s duration = 4940
    //   exit/gate: 5000 (max(4530, 4940) + a small buffer — firing any
    //     earlier bleeds still-animating fragments into the hero, per an
    //     earlier fix; letters also fade to opacity:0 as a second guarantee)
    //   remove: 5550 (exit + the overlay's own .5s fade + buffer)
    // Reduced-motion values are the same schedule at a uniform 0.2x.
    var timeline = reduceMotion
      ? { entranceStart: 36, entranceStagger: 26, wordmark: 260, exitStart: 660, wordmarkExit: 680, exitStagger: 14, exit: 1000, remove: 1110, gate: 1000 }
      : { entranceStart: 180, entranceStagger: 130, wordmark: 1300, exitStart: 3300, wordmarkExit: 3400, exitStagger: 70, exit: 5000, remove: 5550, gate: 5000 };

    frames.forEach(function (frame, i) {
      setTimeout(function () { frame.classList.add('is-in'); }, timeline.entranceStart + i * timeline.entranceStagger);
    });

    setTimeout(function () { wordmark.classList.add('is-in'); }, timeline.wordmark);

    // Exit stagger runs from the end (last/topmost card collapses first).
    frames.forEach(function (frame, i) {
      var offsetFromEnd = (frames.length - 1 - i) * timeline.exitStagger;
      setTimeout(function () { frame.classList.add('is-receding'); }, timeline.exitStart + offsetFromEnd);
    });

    // Letters exit in DOM order (not the entrance's shuffled order), from
    // the end — same "last exits first" pattern as the cards.
    var exitLetterStagger = reduceMotion ? 0.008 : 0.04;
    setTimeout(function () {
      letters.forEach(function (letter, i) {
        var offsetFromEnd = (letters.length - 1 - i) * exitLetterStagger;
        letter.style.transitionDelay = offsetFromEnd.toFixed(3) + 's';
      });
      wordmark.classList.add('is-out');
    }, timeline.wordmarkExit);

    setTimeout(function () { welcome.classList.add('is-exiting'); }, timeline.exit);

    // gate fires the same moment is-exiting sets pointer-events:none on the
    // overlay — i.e. the first moment the real page becomes interactive —
    // so this is where the scroll lock releases and the page is forced back
    // to the top, guaranteeing the hero (and nav) land fully in view
    // regardless of any scroll drift that happened while it was locked out.
    // Order matters here: overflow:hidden makes the document unscrollable,
    // so scrollTo(0,0) while still locked is a no-op — worse, browsers
    // typically remember the pre-lock offset and snap back to it once
    // overflow is restored, which would silently undo the reset if it ran
    // first. Unlock, *then* scrollTo, so the reset actually takes hold.
    // behavior:'instant' matters here specifically: html{scroll-behavior:
    // smooth} is global, so a plain scrollTo(0,0) animates — and this fires
    // at the exact moment the overlay stops blocking the view, so any
    // residual sub-pixel drift (mobile's dynamic toolbar/visual-viewport
    // resizing as it loads is a known source) would show up as a visible
    // "the hero scrolls itself upward" animation right as the page becomes
    // visible, rather than the page simply appearing already settled.
    setTimeout(function () {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.classList.add('is-hero-ready');
    }, timeline.gate);

    setTimeout(function () { welcome.classList.add('is-done'); }, timeline.remove);
  }

  // Navigation-type note: a fresh link click ('navigate'), a normal or hard
  // reload ('reload'), and a back/forward navigation that *isn't* served
  // from bfcache ('back_forward') all re-run this entire script from
  // scratch — window.__tcdWelcomeDone is undefined again, so the block
  // above already replays the welcome sequence correctly with no extra
  // handling needed. The one case that does NOT re-run any script is a
  // back/forward navigation restored FROM bfcache: the browser resumes the
  // exact in-memory page state (DOM, __tcdWelcomeDone, scroll position)
  // from when the user left, so without the code below the welcome screen
  // would silently never replay and the page could resume mid-scroll.
  // pageshow's persisted flag is the standard way to detect this.
  function resetWelcomeState() {
    var welcome = document.getElementById('welcome');
    var wordmark = document.getElementById('welcomeWordmark');
    var frameIds = ['wf1', 'wf2', 'wf3', 'wf4', 'wf5'];

    window.__tcdWelcomeDone = false;

    welcome.classList.remove('is-exiting', 'is-done');
    wordmark.classList.remove('is-in', 'is-out');
    frameIds.forEach(function (id) {
      document.getElementById(id).classList.remove('is-in', 'is-receding');
    });
    document.body.classList.remove('is-hero-ready');

    // Defensive: the scroll lock is always released well before a sequence
    // finishes in practice, but reset it explicitly rather than assume.
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Also defensive: if the mobile menu was left open when the user
    // navigated away, bfcache would resume it open (and its own scroll
    // lock) too — closeMenu/mobileMenu are declared later in this file but
    // fully hoisted (var + function declaration), so both are safe to
    // reference here; by the time pageshow can actually fire, the whole
    // script has already run once and mobileMenu holds its real value.
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  }

  // pageshow fires once per navigation, but notably LATER in the load
  // lifecycle than the synchronous scrollRestoration/scrollTo calls at the
  // very top of this file (which run before body content even parses) —
  // it fires right after the 'load' event, i.e. once every resource
  // (images included) has finished. That makes it a useful *additional*
  // checkpoint: some mobile browsers apply their own native "restore
  // scroll position" behavior on a plain reload (distinct from bfcache,
  // and not fully suppressed by scrollRestoration='manual' in practice on
  // some engines) late enough to land after our earlier corrections. So
  // the scroll-to-top reset below runs on every pageshow unconditionally,
  // not just persisted ones.
  // event.persisted specifically flags a bfcache restore (back/forward
  // navigation resumed from an in-memory snapshot with no script
  // re-execution — reload does not use bfcache, so persisted is normally
  // false there) — only that case also needs the *full* welcome-sequence
  // reset+replay; a plain reload/fresh nav is already correctly running
  // the sequence via the normal script flow, so re-triggering it here too
  // would restart/interrupt an in-progress sequence rather than fix it.
  window.addEventListener('pageshow', function (event) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (event.persisted) {
      resetWelcomeState();
      runWelcome();
    }
  });

  /* ========================================================================
     Scroll-driven work (C1–C7, D) — coalesced to one run per animation frame
     ======================================================================== */

  var covers = Array.prototype.slice.call(document.querySelectorAll('[data-cover]'));
  var parallaxImgs = covers.map(function (c) { return c.querySelector('[data-parallax-img]'); });
  var parallaxCleared = false;

  var approachSection = document.querySelector('.approach');
  var approachWords = Array.prototype.slice.call(document.querySelectorAll('.aw'));

  var navHeader = document.getElementById('siteHeader');
  var workCounter = document.getElementById('workCounter');
  var workCounterIndex = document.getElementById('workCounterIndex');
  var mobileCtaBar = document.getElementById('mobileCtaBar');
  var finalCta = document.querySelector('.final-cta');
  var mobileMenu = document.getElementById('mobileMenu');

  var heroType = document.querySelector('[data-hero-type]');

  var studioInner = document.querySelector('[data-reveal-studio]');
  var finalH2 = document.querySelector('[data-reveal-final]');
  var revealRows = Array.prototype.slice.call(document.querySelectorAll('[data-reveal-row]'));

  var capabilityList = document.getElementById('capabilityList');
  var capabilityRows = Array.prototype.slice.call(document.querySelectorAll('[data-capability-row]'));

  function onScroll() {
    var vhNow = vh();
    var scrollY = window.scrollY || window.pageYOffset;

    // C1 — hero type parallax / fade
    if (heroType && !reduceMotion) {
      var t = Math.min(Math.max(scrollY / vhNow, 0), 1);
      heroType.style.transform = 'translateY(' + (-14 * t) + 'vh) scale(' + (1 - 0.05 * t) + ')';
      heroType.style.opacity = String(Math.max(1 - 1.05 * t, 0));
    }

    // C4 — nav pill firm state
    if (navHeader) {
      navHeader.classList.toggle('is-past', scrollY > vhNow * 0.6);
    }

    // C6 — mobile CTA bar
    if (mobileCtaBar && finalCta) {
      var finalTop = finalCta.getBoundingClientRect().top;
      var show = scrollY > vhNow * 0.9 && finalTop >= vhNow * 0.75;
      var menuOpen = mobileMenu && mobileMenu.classList.contains('is-open');
      mobileCtaBar.classList.toggle('is-visible', !!show && !menuOpen);
    }

    // Work covers: C2 parallax, C5 counter, D reveals
    var counterVisible = false;
    covers.forEach(function (cover, i) {
      var rect = cover.getBoundingClientRect();
      var mid = rect.top + rect.height / 2;

      var noParallax = isTouch || mobileMQ.matches || reduceMotion;
      if (!noParallax) {
        var offset = (mid - vhNow / 2) * -0.08;
        var img = parallaxImgs[i];
        if (img) img.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
      } else if (!parallaxCleared) {
        var im = parallaxImgs[i];
        if (im) im.style.transform = 'none';
      }

      // C5 — counter visible only while a cover straddles the viewport midpoint
      if (rect.top < vhNow * 0.5 && rect.bottom > vhNow * 0.5) {
        counterVisible = true;
        if (workCounterIndex) workCounterIndex.textContent = String(cover.dataset.index).padStart(2, '0');
      }

      if (rect.top < vhNow * 0.88) cover.classList.add('title-in');
      if (rect.top < vhNow * 0.90) cover.classList.add('content-in');
    });
    parallaxCleared = isTouch || mobileMQ.matches || reduceMotion;
    if (workCounter) workCounter.classList.toggle('is-visible', counterVisible);

    // C3 — approach words
    if (approachSection && approachWords.length) {
      var arect = approachSection.getBoundingClientRect();
      var prog = (vhNow * 0.85 - arect.top) / (arect.height * 0.55);
      prog = Math.min(Math.max(prog, 0), 1);
      var n = approachWords.length;
      approachWords.forEach(function (word, i) {
        var threshold = i / n;
        var op = prog > threshold + 0.04 ? 1 : (prog > threshold ? 0.5 : 0.12);
        word.style.opacity = String(op);
      });
    }

    // D — studio block, final CTA headline, capability row entrances
    if (studioInner) {
      var srect = studioInner.getBoundingClientRect();
      if (srect.top < vhNow * 0.9) studioInner.classList.add('is-revealed');
    }
    if (finalH2) {
      var frect = finalH2.getBoundingClientRect();
      if (frect.top < vhNow * 0.88) finalH2.classList.add('is-revealed');
    }
    revealRows.forEach(function (row) {
      var rrect = row.getBoundingClientRect();
      if (rrect.top < vhNow * 0.9) row.classList.add('is-revealed');
    });

    // C7 — mobile capability activation by scroll proximity (≤700px only)
    if (mobileMQ.matches && capabilityRows.length) {
      var nearest = null;
      var nearestDist = Infinity;
      capabilityRows.forEach(function (row) {
        var crect = row.getBoundingClientRect();
        var center = crect.top + crect.height / 2;
        var dist = Math.abs(center - vhNow * 0.46);
        if (dist < nearestDist) { nearestDist = dist; nearest = row; }
      });
      if (nearest && nearestDist < vhNow * 0.3) {
        setActiveCapabilityRow(nearest);
      } else {
        setActiveCapabilityRow(null);
      }
    }

    ticking = false;
  }

  var ticking = false;
  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);

  /* ========================================================================
     Capability row activation (hover/focus on desktop, scroll on mobile)
     ======================================================================== */

  function setActiveCapabilityRow(row) {
    capabilityRows.forEach(function (r) { r.classList.remove('is-active'); });
    if (capabilityList) capabilityList.classList.toggle('has-active', !!row);
    if (row) row.classList.add('is-active');
  }

  // Hover/focus activation (desktop + tablet — CSS hover events are inert on
  // touch anyway); click/tap activates on every breakpoint per INTERACTIONS.md #4.
  capabilityRows.forEach(function (row) {
    row.addEventListener('mouseenter', function () {
      if (!mobileMQ.matches) setActiveCapabilityRow(row);
    });
    row.addEventListener('focus', function () {
      if (!mobileMQ.matches) setActiveCapabilityRow(row);
    });
    row.addEventListener('blur', function () {
      if (!mobileMQ.matches && (!capabilityList || !capabilityList.matches(':hover'))) {
        setActiveCapabilityRow(null);
      }
    });
    row.addEventListener('click', function () {
      var isActive = row.classList.contains('is-active');
      setActiveCapabilityRow(isActive ? null : row);
    });
  });
  if (capabilityList) {
    capabilityList.addEventListener('mouseleave', function () {
      if (!mobileMQ.matches) setActiveCapabilityRow(null);
    });
  }

  /* ========================================================================
     Mobile menu
     ======================================================================== */

  var menuButton = document.getElementById('menuButton');
  var mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function openMenu() {
    mobileMenu.classList.add('is-open');
    requestAnimationFrame(function () {
      mobileMenu.classList.add('is-visible');
    });
    document.body.style.overflow = 'hidden';
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    if (mobileCtaBar) mobileCtaBar.classList.remove('is-visible');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-visible');
    document.body.style.overflow = '';
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    setTimeout(function () {
      if (!mobileMenu.classList.contains('is-visible')) {
        mobileMenu.classList.remove('is-open');
      }
    }, 500);
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu(); else openMenu();
    });
    mobileMenuLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  /* ========================================================================
     Custom cursor (desktop pointer only)
     ======================================================================== */

  var cursorDot = document.getElementById('cursorDot');
  if (cursorDot && !isTouch) {
    document.addEventListener('pointermove', function (e) {
      cursorDot.classList.add('is-active');
      cursorDot.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
    });
    document.addEventListener('mouseleave', function () {
      cursorDot.classList.remove('is-active');
    });
    document.addEventListener('mouseover', function (e) {
      var target = e.target.closest('[data-cursor]');
      var cursorState = target ? target.getAttribute('data-cursor') : null;
      cursorDot.classList.toggle('is-view', cursorState === 'view');
      cursorDot.classList.toggle('is-hidden', cursorState === 'hide');
    });
  }

  /* ========================================================================
     Nav logo click color-flash
     ======================================================================== */

  var wordmarkLink = document.getElementById('wordmarkLink');
  var logoMark = wordmarkLink ? wordmarkLink.querySelector('.logo-mark') : null;
  if (wordmarkLink && logoMark) {
    var logoFlashTimer = null;
    wordmarkLink.addEventListener('click', function () {
      if (logoFlashTimer) clearTimeout(logoFlashTimer);
      logoMark.classList.add('is-flash');
      logoFlashTimer = setTimeout(function () {
        logoMark.classList.remove('is-flash');
        logoFlashTimer = null;
      }, 350);
    });
  }

  /* ========================================================================
     Magnetic final CTA pill (desktop only)
     ======================================================================== */

  var magneticEl = document.querySelector('[data-magnetic]');
  if (magneticEl && !isTouch && !reduceMotion) {
    magneticEl.addEventListener('pointermove', function (e) {
      var rect = magneticEl.getBoundingClientRect();
      var dx = e.clientX - (rect.left + rect.width / 2);
      var dy = e.clientY - (rect.top + rect.height / 2);
      magneticEl.style.transition = 'none';
      magneticEl.style.transform = 'translate(' + (dx * 0.18) + 'px, ' + (dy * 0.26) + 'px)';
    });
    magneticEl.addEventListener('pointerleave', function () {
      magneticEl.style.transition = 'transform .5s ' + 'cubic-bezier(.16,1,.3,1)';
      magneticEl.style.transform = 'none';
    });
  }

  /* ========================================================================
     Init
     ======================================================================== */

  if (reduceMotion) document.documentElement.classList.add('reduced-motion');

  runWelcome();
  onScroll();
})();
