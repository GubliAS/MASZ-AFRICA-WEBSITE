'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });

    /**
     * PERFORMANCE OPTIMIZATION: Throttled ScrollTrigger Updates
     * 
     * DESKTOP OPTIMIZATION:
     * - Throttles ScrollTrigger.update() to max once per frame
     * - Prevents excessive calculations during fast scrolling
     * - Reduces CPU work by batching scroll events
     * 
     * Why this helps:
     * - ScrollTrigger.update() is expensive (recalculates all triggers)
     * - Without throttling: Called multiple times per scroll event → lag
     * - With throttling: Called max once per frame → smooth
     */
    let rafId: number | null = null;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 16; // ~60fps max update rate (16ms = 60fps)

    lenis.on('scroll', () => {
      const now = performance.now();
      // PERFORMANCE: Throttle ScrollTrigger updates to max 60fps
      // Prevents excessive updates during fast scrolling
      if (rafId === null && now - lastUpdateTime >= UPDATE_INTERVAL) {
        rafId = requestAnimationFrame(() => {
          ScrollTrigger.update();
          lastUpdateTime = performance.now();
          rafId = null;
        });
      }
    });

    /**
     * PERFORMANCE: Lenis RAF loop
     * 
     * This runs continuously to update smooth scroll position.
     * Optimized to run efficiently without blocking.
     */
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length
          ? lenis.scrollTo(value!)
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    /**
     * PERFORMANCE: ScrollTrigger Configuration
     * 
     * ignoreMobileResize: Prevents refresh on mobile resize (saves CPU)
     * refresh(): Initial refresh to set up all triggers
     * 
     * Note: refresh() is called once on mount, then debounced on resize
     */
    ScrollTrigger.config({ 
      ignoreMobileResize: true,
      // PERFORMANCE: Reduce refresh sensitivity for desktop
      // Prevents excessive recalculations during window operations
      autoRefreshEvents: "visibilitychange,resize",
    });
    ScrollTrigger.refresh();

    /**
     * PERFORMANCE: Debounced ScrollTrigger Refresh on Resize
     * 
     * Why debounce?
     * - Resize events fire many times during window resize
     * - ScrollTrigger.refresh() is expensive (recalculates all triggers)
     * - Debouncing waits until resize stops before refreshing
     * 
     * Increased delay to 250ms for desktop (was 150ms)
     * - Desktop users resize less frequently
     * - Longer delay = fewer refreshes = better performance
     */
    let refreshTid: ReturnType<typeof setTimeout>;
    const debouncedRefresh = () => {
      clearTimeout(refreshTid);
      refreshTid = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250); // PERFORMANCE: Increased delay for desktop (was 150ms)
    };
    window.addEventListener('resize', debouncedRefresh, { passive: true });

    return () => {
      window.removeEventListener('resize', debouncedRefresh);
      clearTimeout(refreshTid);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // Scroll to top when route changes so new page starts at top and hero animates in once
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
