'use client';

import React, { useState, memo } from 'react';
import HeroSession from './sessions/HeroSession';
import AboutSession from './sessions/AboutSession';
import ServiceSession from './sessions/ServiceSession';
import CoreValueSession from './sessions/CoreValueSession';
import TestimonialSession from './sessions/TestimonialSession';
import FaqSession from './sessions/FaqSession';
import ScrollReveal from '@/app/components/ScrollReveal';

const MemoHeroSession = memo(HeroSession);
const MemoAboutSession = memo(AboutSession);
const MemoServiceSession = memo(ServiceSession);
const MemoCoreValueSession = memo(CoreValueSession);
const MemoTestimonialSession = memo(TestimonialSession);
const MemoFaqSession = memo(FaqSession);

export default function Page() {
  const [heroRevealNearlyComplete, setHeroRevealNearlyComplete] = useState(false);
  const [aboutRevealNearlyComplete, setAboutRevealNearlyComplete] = useState(false);
  const [serviceRevealNearlyComplete, setServiceRevealNearlyComplete] = useState(false);
  const [coreValueRevealNearlyComplete, setCoreValueRevealNearlyComplete] = useState(false);

  return (
    <div>
      <ScrollReveal
        direction="up"
        duration={1.2}
        start="top 92%"
        once
        staggerChildren={0.08}
        onRevealNearlyComplete={() => setHeroRevealNearlyComplete(true)}
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
        onRevealNearlyComplete={() => setAboutRevealNearlyComplete(true)}
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
        onRevealNearlyComplete={() => setServiceRevealNearlyComplete(true)}
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
        onRevealNearlyComplete={() => setCoreValueRevealNearlyComplete(true)}
      >
        <MemoCoreValueSession startTextAnimation={coreValueRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale once staggerChildren={0.1}>
        <MemoTestimonialSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale once staggerChildren={0.08}>
        <MemoFaqSession />
      </ScrollReveal>
    </div>
  );
}
