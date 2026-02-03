'use client';

import React from 'react';
import HeroSession from './sessions/HeroSession';
import AboutSession from './sessions/AboutSession';
import ServiceSession from './sessions/ServiceSession';
import CoreValueSession from './sessions/CoreValueSession';
import TestimonialSession from './sessions/TestimonialSession';
import FaqSession from './sessions/FaqSession';
import ScrollReveal from '@/app/components/ScrollReveal';

export default function Page() {
  return (
    <div>
      <ScrollReveal direction="up" duration={1.2} start="top 92%" staggerChildren={0.08}>
        <HeroSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale staggerChildren={0.1}>
        <AboutSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale staggerChildren={0.1}>
        <ServiceSession />
      </ScrollReveal>
      <ScrollReveal direction="up" duration={1.5} start="top 82%" scale staggerChildren={0.1}>
        <CoreValueSession />
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
