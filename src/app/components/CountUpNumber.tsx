'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface CountUpNumberProps {
  /** Display value like "15+", "99%", "5+", "98%" */
  value: string;
  /** When true, the count-up animation runs from 0 to the number with scroll effect. */
  startAnimation?: boolean;
  /** Called when the count-up animation completes. */
  onComplete?: () => void;
  /** Duration of the count-up in seconds. */
  duration?: number;
  /** Ease. */
  ease?: string;
  className?: string;
}

/** Parses "15+", "99%", "5" into { number: 15, suffix: "+" } etc. */
function parseValue(value: string): { number: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: value };
  return {
    number: parseInt(match[1], 10),
    suffix: match[2] ?? '',
  };
}

/** YouTube-style: vertical strip of numbers that scrolls smoothly into view. */
export default function CountUpNumber({
  value,
  startAnimation = false,
  onComplete,
  duration = 1.2,
  ease = 'power2.out',
  className,
}: CountUpNumberProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const { number: target, suffix } = parseValue(value);

  useEffect(() => {
    if (!startAnimation || hasStartedRef.current || !stripRef.current) return;
    hasStartedRef.current = true;

    stripRef.current.style.transform = 'translate3d(0, 0, 0)';
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: target,
      duration,
      ease,
      onUpdate: () => {
        if (stripRef.current) {
          stripRef.current.style.transform = `translate3d(0, -${proxy.val}em, 0)`;
        }
      },
      onComplete: () => {
        if (stripRef.current) {
          stripRef.current.style.transform = `translate3d(0, -${target}em, 0)`;
        }
        onComplete?.();
      },
    });
  }, [startAnimation, target, duration, ease, onComplete]);

  const maxVal = Math.max(target, 1);
  const numbers = Array.from({ length: maxVal + 1 }, (_, i) => i);

  if (!startAnimation) {
    return <span className={className ?? undefined}>{value}</span>;
  }

  return (
    <span className={className ?? undefined} style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
      <span
        className="count-up-window"
        style={{
          display: 'inline-block',
          height: '1em',
          overflow: 'hidden',
          lineHeight: 1,
          verticalAlign: 'middle',
        }}
      >
        <div
          ref={stripRef}
          className="count-up-strip"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
          }}
        >
          {numbers.map((n) => (
            <span key={n} style={{ height: '1em', minHeight: '1em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {n}
            </span>
          ))}
        </div>
      </span>
      {suffix && <span style={{ marginLeft: '0.05em' }}>{suffix}</span>}
    </span>
  );
}
