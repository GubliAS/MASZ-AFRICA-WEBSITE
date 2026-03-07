'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServicesHeroParallaxProps {
  imageSrc: string;
  imageAlt?: string;
  tag?: string;
  title?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ServicesHeroParallax({
  imageSrc,
  imageAlt = 'Parallax image',
  tag,
  title,
  height = 'lg',
}: ServicesHeroParallaxProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !mediaRef.current || !textRef.current) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ---------------- MOBILE ---------------- */
      mm.add('(max-width: 1023px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        tl.to(
          mediaRef.current,
          { y: '20%', scale: 1.05, ease: 'none', force3D: true },
          0
        );
        tl.to(
          textRef.current,
          { y: '-10%', ease: 'none', force3D: true },
          0
        );
      });

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        tl.to(
          mediaRef.current,
          { y: '40%', scale: 1.12, ease: 'none', force3D: true },
          0
        );
        tl.to(
          textRef.current,
          { y: '-20%', ease: 'none', force3D: true },
          0
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${
        height === 'lg'
          ? 'h-[520px] lg:h-[1100px]'
          : 'h-[420px] lg:h-[900px]'
      }`}
    >
      {/* MEDIA LAYER */}
      <div
        ref={mediaRef}
        className="absolute top-[-6%] left-0 w-full h-[110%] lg:h-[120%]"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-top"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 pointer-events-none" />
      </div>

      {/* TEXT LAYER */}
      <div ref={textRef} className="relative z-10 h-full flex items-end">
        <div className="max-w-[1200px] mx-auto px-6 pb-12 lg:pb-24">
         
        <h2 className="flex text-white text-sm lg:text-base font-semibold border border-white/70 rounded-2xl px-4 py-2 uppercase tracking-wide">
  {tag}
</h2>

{title && (
  <p className="mt-4 text-white text-xl lg:text-3xl font-bold leading-tight max-w-[1000px]">
    {title}
  </p>
)}

        </div>
      </div>
    </section>
  );
}
