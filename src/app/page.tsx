'use client';

import React, { useState } from 'react';
import HeroSession from './sessions/HeroSession';
import AboutSession from './sessions/AboutSession';
import ServiceSession from './sessions/ServiceSession';
import CoreValueSession from './sessions/CoreValueSession';
import TestimonialSession from './sessions/TestimonialSession';
import FaqSession from './sessions/FaqSession';
import ScrollReveal from '@/app/components/ScrollReveal';

export default function Page() {
  const [heroRevealNearlyComplete, setHeroRevealNearlyComplete] = useState(false);
  const [aboutRevealNearlyComplete, setAboutRevealNearlyComplete] = useState(false);
  const [coreValueRevealNearlyComplete, setCoreValueRevealNearlyComplete] = useState(false);

  return (
    <div>
      <ScrollReveal
        direction="up"
        duration={1.2}
        start="top 92%"
        staggerChildren={0.08}
        onRevealNearlyComplete={() => setHeroRevealNearlyComplete(true)}
      >
        <HeroSession startTextAnimation={heroRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={1.5}
        start="top 82%"
        scale
        staggerChildren={0.1}
        onRevealNearlyComplete={() => setAboutRevealNearlyComplete(true)}
      >
        <AboutSession startTextAnimation={aboutRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale staggerChildren={0.1}>
        <ServiceSession />
      </ScrollReveal>
      <ScrollReveal
        direction="up"
        duration={1.5}
        start="top 82%"
        scale
        staggerChildren={0.1}
        onRevealNearlyComplete={() => setCoreValueRevealNearlyComplete(true)}
      >
        <CoreValueSession startTextAnimation={coreValueRevealNearlyComplete} />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale staggerChildren={0.1}>
        <TestimonialSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale staggerChildren={0.08}>
        <FaqSession />
      </ScrollReveal>
    </div>
  );
}
