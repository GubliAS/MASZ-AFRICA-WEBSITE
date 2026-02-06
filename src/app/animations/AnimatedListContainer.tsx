'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface AnimatedListContainerProps {
  /** When true, the list container animation starts */
  startAnimation?: boolean;
  /** Children to animate */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: React.CSSProperties;
  /** Initial opacity (default: 0) */
  initialOpacity?: number;
  /** Initial Y offset (default: 20) */
  initialY?: number;
  /** Animation duration (default: 0.5) */
  duration?: number;
  /** Easing function (default: 'power2.out') */
  ease?: string;
}

/**
 * Reusable Animated List Container Component
 * 
 * Handles the common pattern of:
 * 1. Hiding list container initially
 * 2. Revealing it with fade + slide animation when startAnimation is true
 * 
 * Used in: ServiceSession
 */
export default function AnimatedListContainer({
  startAnimation = false,
  children,
  className,
  style,
  initialOpacity = 0,
  initialY = 20,
  duration = 0.5,
  ease = 'power2.out',
}: AnimatedListContainerProps) {
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Hide list container initially
  useEffect(() => {
    if (!listContainerRef.current) return;
    gsap.set(listContainerRef.current, { opacity: initialOpacity, y: initialY });
  }, [initialOpacity, initialY]);

  // When animation starts: reveal list container
  useEffect(() => {
    if (!startAnimation || !listContainerRef.current) return;
    gsap.to(listContainerRef.current, {
      opacity: 1,
      y: 0,
      duration,
      ease: ease as gsap.EaseString,
    });
  }, [startAnimation, duration, ease]);

  return (
    <div ref={listContainerRef} className={className} style={style}>
      {children}
    </div>
  );
}
