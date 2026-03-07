'use client';

import React, { memo, useState } from 'react';
import Tag from '../components/tag';
import AchievementsTimeline, { Achievement } from '../components/AchievementsTimeline';
import LineByLineText from '../components/LineByLineText';
import HeaderLineByLineAnimation from '../animations/HeaderLineByLineAnimation';
import { achievements } from '../data/achievements';
// ============================================
// DATA
// ============================================
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: 'Founded in 2025 and operational across Ghana, West-Africa and Globally.',
   
  },
  {
    id: 2,
    title: '5+ Major clients served with repeated contracts.',
    
  },
  {
    id: 3,
    title: 'Expanded into technical maintenance and engineering advisory services.',
    
  },
  {
    id: 4,
    title: '5+ Major clients served with repeated contracts.',
    
  },
  {
    id: 5,
    title: 'Established strategic alliances with international manufacturers.',
    
  },
];

// ============================================
// ANIMATION CONSTANTS
// ============================================
const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.3;
const HEADER_DELAY = 0.1;

// ============================================
// COMPONENT PROPS
// ============================================
interface AchievementsSessionProps {
  startTextAnimation?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================
function AchievementsSession({ startTextAnimation = false }: AchievementsSessionProps) {
  const [startSubtextAnimation, setStartSubtextAnimation] = useState(false);

  return (
    <section className="achievements-session py-[80px] lg:py-[120px]">
      <div className="achievements-content mx-[21px] lg:mx-[24px] xl:mx-[120px]">
        {/* Tag */}
        <Tag text="Key Achievements" className="mb-[30px]" />

        {/* Header */}
        <div className="section-header uppercase text-xl-semibold lg:text-4xl-semibold mb-[20px]">
          <HeaderLineByLineAnimation
            startAnimation={startTextAnimation}
            onComplete={() => setStartSubtextAnimation(true)}
            lineY={HEADER_LINE_Y}
            duration={HEADER_DURATION}
            stagger={HEADER_STAGGER}
            delay={HEADER_DELAY}
            style={{ overflow: 'hidden' }}
          >
            Checkout our key{' '}
            <span className="text-primary-default">achievements and milestones</span>
          </HeaderLineByLineAnimation>
        </div>

        {/* Subtext */}
        <div className="subtext mb-[60px] lg:mb-[80px] lg:max-w-[700px]">
          <LineByLineText
            startAnimation={startSubtextAnimation}
            duration={0.13}
            stagger={0.05}
            className="text-sm-medium lg:text-lg-medium text-default-body"
          >
            Every milestone we&apos;ve reached is a result of hard work, strong partnerships, 
            and a genuine commitment to supporting our clients&apos; operations. These achievements 
            represent the trust we&apos;ve earned and our ongoing mission to keep Africa&apos;s mining 
            industry moving forward.
          </LineByLineText>
        </div>

        {/* Timeline — only initialise ScrollTrigger once the parent ScrollReveal
             has finished animating in, so bounds are calculated on the real layout */}
        <AchievementsTimeline achievements={achievements} ready={startTextAnimation} />
      </div>
    </section>
  );
}

export default memo(AchievementsSession);