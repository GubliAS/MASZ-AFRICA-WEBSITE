'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import TeamMemberCard, { TeamMember } from './TeamMemberCard';

type Props = {
  teamMembers: TeamMember[];
};

const AUTO_SLIDE_DELAY = 3000;
const SLIDE_DURATION = 0.8;
const MAX_TILT = 1.5; // ultra-subtle tilt

const TeamMembersSection: React.FC<Props> = ({ teamMembers }) => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const indicatorsRef = useRef<(HTMLDivElement | null)[]>([]);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  // Slide to a specific index
  const slideTo = (index: number) => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const indicators = indicatorsRef.current.filter(
      Boolean
    ) as HTMLDivElement[];
    const vw = window.innerWidth;
    const total = cards.length;

    cards.forEach((card, i) => {
      let position = (i - index + total) % total;
      if (position > total / 2) position -= total;

      gsap.to(card, {
        x: position * vw,
        opacity: i === index ? 1 : 0,
        duration: SLIDE_DURATION,
        ease: 'power3.inOut',
      });
    });

    indicators.forEach((dot, i) => {
      gsap.to(dot, {
        scale: i === index ? 1.4 : 1,
        opacity: i === index ? 1 : 0.4,
        duration: 0.4,
      });
    });

    currentIndexRef.current = index;
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    slideTo((currentIndexRef.current + 1) % teamMembers.length);
    console.log('hit');
  };

  /* ===== INITIAL SETUP ===== */
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const indicators = indicatorsRef.current.filter(
      Boolean
    ) as HTMLDivElement[];

    const vw = window.innerWidth;

    cards.forEach((card, i) => {
      gsap.set(card, {
        x: i * vw,
        opacity: i === 0 ? 1 : 0,
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
      });
    });

    indicators.forEach((dot, i) => {
      gsap.set(dot, {
        scale: i === 0 ? 1.4 : 1,
        opacity: i === 0 ? 1 : 0.4,
      });
    });

    slideInterval.current = setInterval(nextSlide, AUTO_SLIDE_DELAY);

    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, []);

  /* ===== HOVER TILT & PAUSE SLIDER ===== */
  /* ===== HOVER TILT & PAUSE SLIDER (SMOOTH FIX) ===== */
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    cards.forEach((card) => {
      // Make sure transform origin is centered
      gsap.set(card, { transformOrigin: 'center center' });

      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(card, {
          rotateX: ny * -MAX_TILT,
          rotateY: nx * MAX_TILT,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: 'auto', // smooths transitions
        });
      };

      const handleEnter = () => {
        // Pause slider
        if (slideInterval.current) clearInterval(slideInterval.current);
      };

      const handleLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8, // slightly longer for ultra-smooth return
          ease: 'power3.inOut',
          overwrite: 'auto',
        });

        // Resume slider
        slideInterval.current = setInterval(nextSlide, AUTO_SLIDE_DELAY);
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseenter', handleEnter);
      card.addEventListener('mouseleave', handleLeave);

      return () => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseenter', handleEnter);
        card.removeEventListener('mouseleave', handleLeave);
      };
    });
  }, []);

  const handleIndicatorClick = (index: number) => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    slideTo(index);
    slideInterval.current = setInterval(nextSlide, AUTO_SLIDE_DELAY);
    console.log('back');
  };

  return (
    <div className="lg:py-[120px] bg-[#f3f3f3] relative overflow-hidden cursor-pointer">
      <div
        className="relative w-full h-[600px] flex justify-center overflow-hidden"
        style={{ perspective: '1400px' }}
      >
        {/* LEFT FADE (exit) */}
        <div className="absolute left-0 top-0 h-full w-32 pointer-events-none bg-gradient-to-r from-[#f3f3f3] to-transparent z-40" />

        {/* RIGHT FADE (entrance) */}
        <div className="absolute right-0 top-0 h-full w-32 pointer-events-none bg-gradient-to-l from-[#f3f3f3] to-transparent z-40" />

        {/* INDICATORS */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
          {teamMembers.map((_, index) => (
            <div
              key={index}
              ref={(el) => { indicatorsRef.current[index] = el; }}
              className="w-2.5 h-2.5 bg-[#016BF2] cursor-pointer"
              onClick={() => handleIndicatorClick(index)}
            />
          ))}
        </div>

        {/* CARDS */}
        {teamMembers.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            ref={(el) => { cardsRef.current[index] = el; }}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamMembersSection;
