'use client';

import React, { useRef, useEffect, useLayoutEffect, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface AnimatedCardsContainerProps {
  /** Children to animate (should be cards wrapped in divs) */
  children: ReactNode;
  /** ScrollTrigger start position (default: 'top 80%') */
  start?: string;
  /** Whether animation should run only once (default: true) */
  once?: boolean;
  /** Initial X offset for cards (default: 120) */
  initialX?: number;
  /** Animation duration (default: 0.8) */
  duration?: number;
  /** Stagger delay between cards (default: 0.15) */
  stagger?: number;
  /** Easing function (default: 'power3.out') */
  ease?: string;
  /** Additional className */
  className?: string;
}

/**
 * Reusable Animated Cards Container Component
 * 
 * Handles sequential animation of cards from right to left when scrolled into view.
 * Children should be wrapped in divs - the component will find all direct child divs and animate them.
 * Used for: Core Values Cards, Achievement Cards, etc.
 */
export default function AnimatedCardsContainer({
  children,
  start = 'top 80%',
  once = true,
  initialX = 120,
  duration = 0.8,
  stagger = 0.15,
  ease = 'power3.out',
  className,
}: AnimatedCardsContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial states before paint to prevent layout shift
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const cardElements = Array.from(containerRef.current.children) as HTMLElement[];
    cardElements.forEach((cardEl) => {
      gsap.set(cardEl, {
        x: initialX,
        opacity: 0,
        force3D: true,
      });
    });
  }, [initialX]);

  // Animate cards sequentially when section comes into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cardElements = Array.from(container.children) as HTMLElement[];
    if (cardElements.length === 0) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start,
      once,
      onEnter: () => {
        // Animate each card sequentially from right to left
        cardElements.forEach((card, index) => {
          gsap.to(card, {
            x: 0,
            opacity: 1,
            duration,
            delay: index * stagger,
            ease: ease as gsap.EaseString,
            force3D: true,
          });
        });
      },
    });

    // Refresh ScrollTrigger on resize so trigger positions stay accurate
    let resizeTid: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTid);
      resizeTid = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      st.kill();
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTid);
    };
  }, [start, once, duration, stagger, ease]);

  return (
    <div 
      ref={containerRef}
      className={className || 'flex flex-col lg:flex-row gap-4 lg:gap-8'}
      style={{ overflow: 'visible' }}
    >
      {children}
    </div>
  );
}
