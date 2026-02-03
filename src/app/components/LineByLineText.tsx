'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
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

  // Split text into lines on mount and keep them hidden until startAnimation
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const split = new SplitType(el as HTMLElement, { types: 'lines' });
    const lines = split.lines;

    if (!lines || lines.length === 0) return;

    splitRef.current = { split, lines: Array.from(lines) };
    gsap.set(lines, { opacity: 0, y: yFrom });

    return () => {
      split.revert();
      splitRef.current = null;
    };
  }, [yFrom]);

  // Start line-by-line animation when startAnimation becomes true
  useEffect(() => {
    if (!startAnimation || !splitRef.current) return;

    const { lines } = splitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power2.out',
      delay,
      onComplete: () => {
        onComplete?.();
      },
    });
  }, [startAnimation, duration, stagger, delay, onComplete]);

  return (
    <Wrapper ref={wrapperRef as any} className={className ?? undefined} style={{ overflow: 'hidden' }}>
      {children}
    </Wrapper>
  );
}
