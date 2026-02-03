'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroParallax() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !mediaRef.current || !textRef.current) return;

    const mm = gsap.matchMedia();

    // ✅ FIX: Properly declared context
    const ctx = gsap.context(() => {
      /* ---------------- MOBILE ---------------- */
      mm.add('(max-width: 1023px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });

        tl.to(
          mediaRef.current,
          {
            y: '18%',
            scale: 1.06,
            ease: 'none',
          },
          0
        );

        tl.to(
          textRef.current,
          {
            y: '-10%',
            ease: 'none',
          },
          0
        );
      });

      /* ---------------- DESKTOP ---------------- */
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });

        tl.to(
          mediaRef.current,
          {
            y: '35%',
            scale: 1.12,
            ease: 'none',
          },
          0
        );

        tl.to(
          textRef.current,
          {
            y: '-18%',
            ease: 'none',
          },
          0
        );
      });
    }, sectionRef);

    // ✅ CLEANUP (NO MORE Rctx ERROR)
    return () => {
      ctx.revert();
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="hero-image mt-[50] lg:mb-[100]">
      {/* FULLSCREEN SECTION */}
      <section
        ref={sectionRef}
        className="relative w-full h-screen overflow-hidden z-0"
      >
        {/* MEDIA LAYER */}
        <div
          ref={mediaRef}
          className="absolute left-0 w-full h-[120%] lg:h-[130%] -top-[20%] will-change-transform"
        >
          <Image
            src="/homeAssets/image-10.webp"
            alt="Hero Image"
            fill
            priority
            className="object-cover object-center"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-surface-overlay z-10 opacity-100 lg:opacity-30" />
        </div>

        {/* TEXT LAYER */}
        <div
          ref={textRef}
          className="hero-image-text-info absolute inset-0 z-20 text-light font-bold lg:flex lg:items-center lg:justify-between lg:w-full lg:top-[100] will-change-transform"
        >
          <div className="hero-image-info-header flex items-center flex-col justify-center w-[430] lg:w-[790]">
            <p className="uppercase text-xl-semibold text-center py-[20] lg:p-0 lg:text-4xl-semibold lg:text-left lg:ml-[200] lg:leading-13">
              Empowering the global mining industry through
            </p>

            <Image
              src="/homeAssets/arrow-icon.svg"
              alt=""
              width={24}
              height={24}
              className="h-auto lg:hidden"
            />
          </div>

          <div className="hero-image-info-subtext mx-[55] lg:mr-[200] flex items-center justify-center flex-col backdrop-blur-sm p-[25] my-[20] lg:my-0 electric-border lg:w-[650] lg:h-[400]">
            <div className="subtext-header uppercase text-xl-semibold my-[10] lg:text-4xl-semibold">
              innovation
            </div>

            <div className="subtext-itself font-medium text-sm-medium my-[10] lg:text-xl-regular lg:w-[500]">
              Our approach to innovation is practical, solving real problems
              mines face everyday. Whether it’s choosing the right media,
              improving equipment life, or refining a supply process, we bring
              ideas and technical insight that make your work smoother and
              more efficient.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
