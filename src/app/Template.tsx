'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Set initial hidden state before paint so no flash on navigation
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 16 });
    // Start at top so hero is in view and animates in once
    window.scrollTo(0, 0);
  }, [pathname]);

  // Animate page in once mounted (smooth enter on nav click)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: 'power2.out',
      clearProps: 'all',
    });
  }, [pathname]);

  return (
    <div ref={containerRef} className="page-enter-initial">
      {children}
    </div>
  );
}
