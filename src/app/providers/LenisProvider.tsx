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

    // Batch ScrollTrigger updates — throttle to reduce work during fast scrolling
    let rafId: number | null = null;
    lenis.on('scroll', () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          ScrollTrigger.update();
          rafId = null;
        });
      }
    });

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

    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.refresh();

    let refreshTid: ReturnType<typeof setTimeout>;
    const debouncedRefresh = () => {
      clearTimeout(refreshTid);
      refreshTid = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('resize', debouncedRefresh);

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
