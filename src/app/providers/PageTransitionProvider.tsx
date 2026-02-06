'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

const BOX_COUNT = 6;

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevPathnameRef = useRef(pathname);
  const isNavigatingRef = useRef(false);

  const animateOverlayIn = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.classList.add('page-transition-overlay--active');
    overlay.style.pointerEvents = 'auto';
    overlay.style.visibility = 'visible';

    const boxes = boxRefs.current.filter(Boolean);
    gsap.set(boxes, { scaleY: 0, transformOrigin: 'top' });

    gsap.to(boxes, {
      scaleY: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      stagger: 0.06,
    });
  }, []);

  const animateOverlayOut = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const boxes = boxRefs.current.filter(Boolean);

    gsap.to(boxes, {
      scaleY: 0,
      duration: 0.45,
      ease: 'power3.inOut',
      stagger: 0.05,
      transformOrigin: 'top',
      onComplete: () => {
        overlay.classList.remove('page-transition-overlay--active');
        overlay.style.pointerEvents = 'none';
        overlay.style.visibility = 'hidden';
        gsap.set(boxes, { clearProps: 'transform' });
        isNavigatingRef.current = false;
      },
    });
  }, []);

  // Intercept internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor || isNavigatingRef.current) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        !href.startsWith('/') ||
        href.startsWith('//') ||
        anchor.hasAttribute('target') ||
        anchor.hasAttribute('download') ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || url.pathname === pathname) {
        return;
      }

      e.preventDefault();
      isNavigatingRef.current = true;
      animateOverlayIn();

      setTimeout(() => {
        router.push(href);
      }, 500);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, router, animateOverlayIn]);

  // Animate overlay out when pathname changes (navigation complete)
  useEffect(() => {
    if (pathname !== prevPathnameRef.current && isNavigatingRef.current) {
      prevPathnameRef.current = pathname;
      window.scrollTo(0, 0);
      setTimeout(() => animateOverlayOut(), 100);
    } else {
      prevPathnameRef.current = pathname;
    }
  }, [pathname, animateOverlayOut]);

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        className="page-transition-overlay page-transition-overlay--boxes"
        aria-hidden="true"
        style={{ visibility: 'hidden' }}
      >
        <div className="page-transition-overlay__boxes">
          {Array.from({ length: BOX_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                boxRefs.current[i] = el;
              }}
              className="page-transition-overlay__box"
            />
          ))}
        </div>
      </div>
    </>
  );
}
