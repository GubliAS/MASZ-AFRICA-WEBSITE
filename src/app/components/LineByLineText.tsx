'use client';

import React, { useEffect, useRef, useLayoutEffect, ReactNode } from 'react';
import SplitType from 'split-type';
import gsap from 'gsap';

export interface LineByLineTextProps {
  children: ReactNode;
  /** When true, the line-by-line reveal animation runs. */
  startAnimation?: boolean;
  /** Called when the line animation completes (e.g. to then show AnimationCopy). */
  onComplete?: () => void;
  className?: string;
  /** Duration per line (seconds). */
  duration?: number;
  /** Delay between lines (seconds). */
  stagger?: number;
  /** Delay before first line (seconds). */
  delay?: number;
  /** Initial y offset (px). */
  yFrom?: number;
  /** Wrapper element. */
  as?: 'div' | 'p' | 'span';
}

export default function LineByLineText({
  children,
  startAnimation = false,
  onComplete,
  className,
  duration = 0.7,
  stagger = 0.12,
  delay = 0.1,
  yFrom = 28,
  as: Wrapper = 'div',
}: LineByLineTextProps) {
  const wrapperRef = useRef<HTMLDivElement | HTMLParagraphElement | HTMLSpanElement>(null);
  const splitRef = useRef<{ split: SplitType; lines: Element[] } | null>(null);

  // Split text into lines BEFORE paint to prevent layout shift — useLayoutEffect ensures this happens synchronously
  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Set initial opacity to prevent flash
    gsap.set(el, { opacity: 1, force3D: true });

    const split = new SplitType(el as HTMLElement, { types: 'lines' });
    const lines = split.lines;

    if (!lines || lines.length === 0) return;

    splitRef.current = { split, lines: Array.from(lines) };
    // Set lines to hidden state immediately — prevents any visible jump
    gsap.set(lines, { opacity: 0, y: yFrom, force3D: true });

    return () => {
      split.revert();
      splitRef.current = null;
    };
  }, [yFrom]);

  // Start line-by-line animation when startAnimation becomes true
  useEffect(() => {
    if (!startAnimation || !splitRef.current) return;

    const { lines, split } = splitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      delay,
      force3D: true,
      onComplete: () => {
        // Revert SplitType BEFORE calling onComplete — this restores the
        // natural DOM (no split wrapper divs) so the text reflows cleanly
        // instead of staying in fixed-width line divs that look distorted.
        gsap.set(lines, { clearProps: 'all' });
        split.revert();
        splitRef.current = null;
        onComplete?.();
      },
    });
  }, [startAnimation, duration, stagger, delay, onComplete]);

  return (
    <Wrapper 
      ref={wrapperRef as any} 
      className={className ?? undefined} 
      style={{ 
        overflow: 'hidden',
        willChange: startAnimation ? 'transform, opacity' : 'auto',
      }}
    >
      {children}
    </Wrapper>
  );
}
