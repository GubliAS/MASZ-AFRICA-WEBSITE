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
  speed?: number; // pixels per second
  className?: string;
}

const BG_COLORS = ['#016BF2', '#16a34a']; // blue → green
const INTERVAL_MS = 3000;
const TRANSITION_MS = 800;

function PartnersMarquee({ partners, speed = 50, className = '' }: PartnersMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const [colorIndex, setColorIndex] = useState(0);

  // Duplicate partners for seamless loop
  const scrollingPartners = [...partners, ...partners, ...partners];

  // Cycle background color on interval
  useEffect(() => {
    const id = setInterval(() => {
      setColorIndex(i => (i + 1) % BG_COLORS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrameId: number;

    const step = (time: number) => {
      const dt = lastTimeRef.current ? Math.min((time - lastTimeRef.current) / 1000, 0.1) : 0;
      lastTimeRef.current = time;

      const halfWidth = track.scrollWidth / 2;

      if (halfWidth > 0) {
        offsetRef.current += speed * dt;
        if (offsetRef.current >= halfWidth) {
          offsetRef.current -= halfWidth;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, scrollingPartners.length]);

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
            {/* Diamond/arrow icon */}
            {!partner.logo && (<div className="w-3 h-3 rotate-45 bg-white/30" />)}
            
            {/* Partner logo or name */}
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