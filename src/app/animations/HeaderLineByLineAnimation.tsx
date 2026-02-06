'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';

export interface HeaderLineByLineAnimationProps {
  /** When true, the header animation starts */
  startAnimation?: boolean;
  /** Callback fired when animation completes */
  onComplete?: () => void;
  /** Initial Y offset for lines (default: 28) */
  lineY?: number;
  /** Animation duration (default: 0.6) */
  duration?: number;
  /** Stagger delay between lines (default: 0.12) */
  stagger?: number;
  /** Delay before animation starts (default: 0.1) */
  delay?: number;
  /** Easing function (default: 'power2.out') */
  ease?: string;
  /** Children to animate (should be text content) */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: React.CSSProperties;
}

/**
 * Reusable Header Line-by-Line Animation Component
 * 
 * This component handles the common pattern of:
 * 1. Splitting text into lines using SplitType
 * 2. Hiding lines initially
 * 3. Animating lines when startAnimation is true
 * 4. Calling onComplete when animation finishes
 * 
 * Used in: CoreValueSession, ServiceSession, AboutSession
 */
export default function HeaderLineByLineAnimation({
  startAnimation = false,
  onComplete,
  lineY = 28,
  duration = 0.6,
  stagger = 0.12,
  delay = 0.1,
  ease = 'power2.out',
  children,
  className,
  style,
}: HeaderLineByLineAnimationProps) {
  const headerTextRef = useRef<HTMLDivElement>(null);
  const headerSplitRef = useRef<{ split: SplitType; lines: Element[] } | null>(null);
  const hasStartedRef = useRef(false);

  // Split header into lines on mount and hide until animation starts
  useEffect(() => {
    const el = headerTextRef.current;
    if (!el) return;

    const split = new SplitType(el, { types: 'lines' });
    const lines = split.lines;
    if (!lines || lines.length === 0) return;

    headerSplitRef.current = { split, lines: Array.from(lines) };
    gsap.set(lines, { opacity: 0, y: lineY });

    return () => {
      split.revert();
      headerSplitRef.current = null;
    };
  }, [lineY]);

  // When startAnimation fires: animate header line-by-line
  useEffect(() => {
    if (!startAnimation || hasStartedRef.current || !headerSplitRef.current) return;
    hasStartedRef.current = true;

    const { lines } = headerSplitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: ease as gsap.EaseString,
      onComplete: () => {
        onComplete?.();
      },
    });
  }, [startAnimation, duration, stagger, delay, ease, onComplete]);

  return (
    <div ref={headerTextRef} className={className} style={style}>
      {children}
    </div>
  );
}
