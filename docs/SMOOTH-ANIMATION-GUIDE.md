# How Award-Winning Sites Stay Extremely Smooth

Sites that win Awwwards and feel "buttery" even with heavy animation share a few core principles. Here’s what they do and how it maps to your stack (GSAP, Lenis, Next.js).

---

## 1. **Stick to compositor-only properties**

**What they do:** Animate only **`transform`** and **`opacity`**. These skip layout and paint and only touch the compositor, so the browser can hit 60fps (or 120fps on high-refresh screens).

**Avoid:** `width`, `height`, `top`, `left`, `margin`, `padding`, `border-width` — they trigger layout/reflow and can cost 100ms+ per frame.

**Your stack:** GSAP’s `x`, `y`, `scale`, `opacity` already map to transform/opacity. Keep scroll-driven and reveal animations to these. If you add CSS animations, use `transform` and `opacity` there too.

---

## 2. **One scroll source, one update per frame**

**What they do:** One smooth-scroll engine (Lenis, Locomotive, etc.) drives everything. All scroll-based logic (parallax, reveals, scrub) runs in **one** update per frame (e.g. one `ScrollTrigger.update()` per `requestAnimationFrame`). No extra `window` scroll listeners that do heavy work.

**Your stack:** You already:
- Use Lenis as the single scroll source.
- Throttle `ScrollTrigger.update()` to once per frame.
- Drive TiltCard parallax via ScrollTrigger (no separate scroll listener).

Keep this pattern: any new scroll effect should plug into ScrollTrigger/Lenis, not add another scroll listener.

---

## 3. **Kill triggers when they’re “done”**

**What they do:** Scroll-triggered animations that only need to run once (e.g. “reveal on scroll”) are **killed** after they complete. That removes them from the scroll update loop and reduces work on every scroll.

**Your stack:** ScrollReveal with `once` now kills its ScrollTrigger when the reveal finishes. Home page sections use `once`. Use `once` + kill for any other “play once” scroll animations.

---

## 4. **Layer promotion without explosion**

**What they do:** Promote **only** elements that are actually animating to their own compositor layer (e.g. `will-change: transform` or `transform: translateZ(0)`). They avoid putting `will-change` on everything, which would create too many layers and hurt performance.

**Your stack:** You can add a small helper or class for “this element will be animated by GSAP” and set `will-change: transform` (or `transform, opacity`) only on those. Remove or override `will-change` after the animation so the browser can reclaim the layer.

---

## 5. **Smooth scroll feels responsive**

**What they do:** Smooth scroll duration is tuned so the page doesn’t feel sluggish (often ~0.8–1.2s). They sometimes shorten it on mobile for snappier feel.

**Your stack:** Lenis duration is already reduced (e.g. 0.9s). You can tune further per breakpoint if needed.

---

## 6. **Scrubbed animations are smooth, not jumpy**

**What they do:** Scroll-linked animations use a **numeric scrub** (e.g. `scrub: 1` or `scrub: 1.5`) so the animation “catches up” to scroll over a short time. That avoids instant jumps and keeps motion smooth.

**Your stack:** Parallax and scrub timelines already use `scrub: 1`. Keeping scrub numeric (not `scrub: true` only) helps consistency and can help with frame pacing.

---

## 7. **Heavy work off the main thread when possible**

**What they do:** For very heavy effects (3D, particles, complex canvas), they use **WebGL/WebGPU** or **Web Workers** so the main thread stays free for scroll, input, and DOM/GSAP updates.

**Your stack:** Right now you’re DOM + GSAP + Lenis. If you add Three.js, Pixi, or big canvas work, keep it in a worker or use an offscreen canvas where possible so scroll stays smooth.

---

## 8. **Images and fonts don’t block or shift layout**

**What they do:** Images have dimensions and (where possible) `loading="lazy"`; fonts are preloaded or subset so they don’t cause big layout shifts or blocking. Less reflow = more stable scroll and less ScrollTrigger refresh.

**Your stack:** Next.js `Image` handles dimensions and lazy loading. Keep using it; avoid unmeasured images or late-loading fonts that change layout and trigger ScrollTrigger.refresh() at bad times.

---

## 9. **Mobile: fewer effects or simplified ones**

**What they do:** On small screens or low-end devices they sometimes reduce parallax, simplify scrub, or disable the heaviest effects so 60fps is achievable.

**Your stack:** You already use `gsap.matchMedia()` in ImageParallax and similar. Continue to use it to simplify or disable scroll-driven effects on mobile when needed.

---

## 10. **No layout thrashing**

**What they do:** They avoid “read DOM, write DOM, read DOM again” in the same frame. They batch reads (e.g. `getBoundingClientRect`) and then do all writes (e.g. `gsap.set()`), so the browser doesn’t recalculate layout multiple times per frame.

**Your stack:** Using `gsap.set()` in ScrollTrigger’s `onUpdate` (like in TiltCard) is a single write per frame. Avoid mixing many `getBoundingClientRect()` or offset reads with style changes in the same scroll handler.

---

## Quick checklist for adding new animations

- [ ] Use only **transform** and **opacity** (via GSAP or CSS).
- [ ] If it’s scroll-driven, use **ScrollTrigger** (and Lenis), not a new scroll listener.
- [ ] If it’s “reveal once”, use **once** and **kill** the trigger when done.
- [ ] Add **will-change** only to elements that are about to animate; remove after.
- [ ] Use **numeric scrub** (e.g. `scrub: 1`) for scroll-linked motion.
- [ ] On mobile, **simplify or disable** the heaviest effects if needed.

---

## Summary

Awwwards-level smoothness comes from: **compositor-only properties**, **one scroll update per frame**, **killing one-off triggers**, **careful layer promotion**, and **no layout thrashing**. Your current setup already follows most of these; the guide above keeps you aligned as you add more intense animations.
