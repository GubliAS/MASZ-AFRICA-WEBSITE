'use client';

import React, { useState, memo, useCallback } from 'react';
import HeroSession from './sessions/HeroSession';
import AboutSession from './sessions/AboutSession';
import ServiceSession from './sessions/ServiceSession';
import HeroCarousel from './sessions/HeroCarousel';
import CoreValueSession from './sessions/CoreValueSession';
import TestimonialSession from './sessions/TestimonialSession';
import AnimatedImagesSection from './sessions/AnimatedImagesSection';
import FaqSession from './sessions/FaqSession';
import ScrollReveal from '@/app/components/ScrollReveal';

// PERFORMANCE: All session components are already memoized in their own files
// No need to re-memoize here, but keeping for consistency
const MemoHeroSession = memo(HeroSession);
const MemoAboutSession = memo(AboutSession);
const MemoServiceSession = memo(ServiceSession);
const MemoHeroCarousel = memo(HeroCarousel);
const MemoCoreValueSession = memo(CoreValueSession);
const MemoTestimonialSession = memo(TestimonialSession);
const MemoAnimatedImagesSection = memo(AnimatedImagesSection);
const MemoFaqSession = memo(FaqSession);

export default function Page() {
  const [heroRevealNearlyComplete, setHeroRevealNearlyComplete] = useState(false);
  const [aboutRevealNearlyComplete, setAboutRevealNearlyComplete] = useState(false);
  const [serviceRevealNearlyComplete, setServiceRevealNearlyComplete] = useState(false);
  const [carouselRevealNearlyComplete, setCarouselRevealNearlyComplete] = useState(false);
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
  const onCarouselReveal = useCallback(() => setCarouselRevealNearlyComplete(true), []);
  const onCoreValueReveal = useCallback(() => setCoreValueRevealNearlyComplete(true), []);

  return (
    <div>
      <ScrollReveal
        direction="up"
        duration={0.75}
        start="top 60%"
        once
        staggerChildren={0.08}
        onRevealNearlyComplete={onHeroReveal}
      >
        <MemoHeroSession startTextAnimation={heroRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.75}
        start="top 60%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onAboutReveal}
      >
        <MemoAboutSession startTextAnimation={aboutRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.75}
        start="top 60%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onServiceReveal}
      >
        <MemoServiceSession startTextAnimation={serviceRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.75}
        start="top 60%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onCarouselReveal}
      >
        <MemoHeroCarousel startTextAnimation={carouselRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={0.75}
        start="top 60%"
        scale
        once
        staggerChildren={0.1}
        onRevealNearlyComplete={onCoreValueReveal}
      >
        <MemoCoreValueSession startTextAnimation={coreValueRevealNearlyComplete} />
      </ScrollReveal>
      <MemoTestimonialSession />
      <ScrollReveal direction="up" duration={0.75} start="top top" scale staggerChildren={0.1}>
        <MemoAnimatedImagesSection />
      </ScrollReveal>
      <MemoFaqSession />
    </div>
  );
}
