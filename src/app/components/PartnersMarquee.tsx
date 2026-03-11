'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  logo: string;
}

interface PartnersMarqueeProps {
  partners: Partner[];
  speed?: number;
  className?: string;
  reverse?: boolean;       // scroll right instead of left
  scrollReverse?: boolean; // flip direction when user scrolls up
}

const BG_COLORS = ['#016BF2', '#16a34a'];
const INTERVAL_MS = 3000;
const TRANSITION_MS = 800;

function PartnersMarquee({ partners, speed = 50, className = '', reverse = false, scrollReverse = false }: PartnersMarqueeProps) {
  const trackRef    = useRef<HTMLDivElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const offsetRef   = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const scrollDirRef = useRef<1 | -1>(1); // 1 = down, -1 = up
  const [colorIndex, setColorIndex] = useState(0);

  const scrollingPartners = [...partners, ...partners, ...partners];

  // Cycle background color
  useEffect(() => {
    const id = setInterval(() => {
      setColorIndex(i => (i + 1) % BG_COLORS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Watch scroll direction
  useEffect(() => {
    if (!scrollReverse) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollDirRef.current = y >= lastY ? 1 : -1;
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollReverse]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrameId: number;

    const step = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.1) : 0;
      lastTimeRef.current = time;

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        const baseDir  = reverse ? -1 : 1;
        const scrollDir = scrollReverse ? scrollDirRef.current : 1;
        offsetRef.current += speed * dt * baseDir * scrollDir;

        // Wrap in both directions
        if (offsetRef.current >= halfWidth) offsetRef.current -= halfWidth;
        if (offsetRef.current < 0)          offsetRef.current += halfWidth;

        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, reverse, scrollReverse, scrollingPartners.length]);

  return (
    <div
      ref={wrapperRef}
      className={`w-full py-5 md:py-6 lg:py-[75px] overflow-hidden ${className}`}
      style={{
        backgroundColor: BG_COLORS[colorIndex],
        transition: `background-color ${TRANSITION_MS}ms ease-in-out`,
      }}
    >
      <div
        ref={trackRef}
        className="flex items-center gap-16 lg:gap-24 will-change-transform"
        style={{ transition: 'none' }}
      >
        {scrollingPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="flex items-center gap-3 shrink-0"
          >
            {!partner.logo && (<div className="w-3 h-3 rotate-45 bg-white/30" />)}
            {partner.logo ? (
              <div className="relative h-8 w-auto">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={32}
                  className="object-contain h-8 w-auto brightness-0 invert"
                  loading="lazy"
                />
              </div>
            ) : (
              <span className="text-white text-xl-semibold uppercase tracking-wider">
                {partner.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersMarquee;