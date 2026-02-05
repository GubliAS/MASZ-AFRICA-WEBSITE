'use client';

import React, { useState, memo, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeroSession from './sessions/HeroSession';
import AboutSession from './sessions/AboutSession';
import ServiceSession from './sessions/ServiceSession';
import CoreValueSession from './sessions/CoreValueSession';
import TestimonialSession from './sessions/TestimonialSession';
import FaqSession from './sessions/FaqSession';
import ScrollReveal from '@/app/components/ScrollReveal';

/**
 * PERFORMANCE OPTIMIZATION: Lazy Load RingCarousel3D
 * 
 * Why lazy load?
 * - Three.js + React Three Fiber is a large bundle (~200KB+)
 * - WebGL context creation is expensive (GPU initialization)
 * - Texture loading for 9+ images is heavy
 * 
 * Benefits:
 * 1. **Smaller Initial Bundle**: Main page loads faster
 * 2. **Deferred Loading**: Only loads when user scrolls near it
 * 3. **Code Splitting**: Creates separate chunk that loads on-demand
 * 4. **No SSR**: Three.js doesn't work on server anyway (ssr: false)
 * 
 * The loading placeholder maintains layout so page doesn't jump
 */
const RingCarousel3D = dynamic(
  () => import('@/app/components/RingCarousel3D').then((m) => m.default),
  {
    ssr: false, // Three.js requires browser APIs (WebGL)
    loading: () => (
      <div
        className="w-full min-h-[50vh] h-[65vh] sm:h-[75vh] lg:h-screen -mt-6 lg:-mt-12"
        aria-hidden
      />
    ),
  }
);

const MemoHeroSession = memo(HeroSession);
const MemoAboutSession = memo(AboutSession);
const MemoServiceSession = memo(ServiceSession);
const MemoCoreValueSession = memo(CoreValueSession);
const MemoTestimonialSession = memo(TestimonialSession);
const MemoFaqSession = memo(FaqSession);

/**
 * Ring Carousel section: always mounts carousel so it renders.
 * inView from IntersectionObserver only pauses Canvas when off-screen (saves GPU).
 */
function RingCarouselSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e) return;
        setInView(e.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full min-h-[50vh] h-[65vh] sm:h-[75vh] lg:h-screen -mt-12 lg:-mt-20 -mb-16 lg:-mb-24"
    >
      <RingCarousel3D inView={inView} />
    </div>
  );
}

export default function Page() {
  const [heroRevealNearlyComplete, setHeroRevealNearlyComplete] = useState(false);
  const [aboutRevealNearlyComplete, setAboutRevealNearlyComplete] = useState(false);
  const [serviceRevealNearlyComplete, setServiceRevealNearlyComplete] = useState(false);
  const [coreValueRevealNearlyComplete, setCoreValueRevealNearlyComplete] = useState(false);

  /**
   * PERFORMANCE OPTIMIZATION: useCallback for stable function references
   * 
   * Why useCallback?
   * - Prevents ScrollReveal from re-rendering when other state changes
   * - Memoized components (MemoHeroSession, etc.) won't re-render unnecessarily
   * - Reduces React reconciliation work
   * 
   * Without useCallback: New function created on every render → ScrollReveal sees new prop → re-renders
   * With useCallback: Same function reference → ScrollReveal doesn't re-render → better performance
   */
  const onHeroReveal = useCallback(() => setHeroRevealNearlyComplete(true), []);
  const onAboutReveal = useCallback(() => setAboutRevealNearlyComplete(true), []);
  const onServiceReveal = useCallback(() => setServiceRevealNearlyComplete(true), []);
  const onCoreValueReveal = useCallback(() => setCoreValueRevealNearlyComplete(true), []);

  return (
    <div>
      <ScrollReveal
        direction="up"
        duration={1.2}
        start="top 92%"
        once
        staggerChildren={0.08}
        onRevealNearlyComplete={onHeroReveal}
      >
        <MemoHeroSession startTextAnimation={heroRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={1.5}
        start="top 82%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onAboutReveal}
      >
        <MemoAboutSession startTextAnimation={aboutRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={1.5}
        start="top 82%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onServiceReveal}
      >
        <MemoServiceSession startTextAnimation={serviceRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={1.5}
        start="top 82%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onCoreValueReveal}
      >
        <MemoCoreValueSession startTextAnimation={coreValueRevealNearlyComplete} />
      </ScrollReveal>
      {/* <RingCarouselSection /> */}
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale once staggerChildren={0.1}>
        <MemoTestimonialSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale once staggerChildren={0.08}>
        <MemoFaqSession />
      </ScrollReveal>
    </div>
  );
}
