'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import gsap from 'gsap';
import Tag from '../components/tag';
import Image from 'next/image';
import Button from '../components/button';
import { MoveRight } from 'lucide-react';
import AnimationCopy from '../animations/WritingTextAnimation';
import HeaderLineByLineAnimation from '../animations/HeaderLineByLineAnimation';
import LineByLineText from '../components/LineByLineText';

const ABOUT_BODY_TEXT = (
  <>
    MASZ-Africa is a Ghana-based mining supply and engineering support
    company committed to helping mining operations run efficiently,
    reliably, and without interruption. We provide high-quality
    consumables, certified equipment, and practical technical services
    backed by real hands-on industry experience. Through trusted
    global sourcing and strong technical understanding, we ensure
    every product we deliver performs exactly as required in demanding
    mining environments.
    <br />
    <br />
    Our team works closely with clients to understand their
    operational needs, recommend the right solutions, and provide
    support that genuinely improves performance. With a consistent
    focus on on-time delivery, transparent communication, and
    dependable field assistance, we help mines reduce downtime and
    keep production moving. At MASZ-Africa, our goal is simple —
    supply what works, support what matters, and deliver the level of
    service every mining operation expects and deserves.
  </>
);

interface AboutSessionProps {
  /** When true, the about body line-by-line animation starts (after scroll reveal is about to end). */
  startTextAnimation?: boolean;
}

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.12;
const HEADER_DURATION = 0.6;
const HEADER_DELAY = 0.1;

function AboutSession({ startTextAnimation = false }: AboutSessionProps) {
  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [showAnimationCopy, setShowAnimationCopy] = useState(false);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasLeftSectionRef = useRef(false);
  const prevInViewRef = useRef(false);
  const hasScrolledDownFromTopRef = useRef(false);
  const hasReturnedToTopRef = useRef(false);
  const pendingCopyRef = useRef<{ idleId: number; timeoutId: ReturnType<typeof setTimeout> } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Only run AnimationCopy on second scroll down from top (not on first load/first scroll)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const clearPending = () => {
      const p = pendingCopyRef.current;
      if (p) {
        cancelIdleCallback(p.idleId);
        clearTimeout(p.timeoutId);
        pendingCopyRef.current = null;
      }
    };

    // Track scroll position to detect "second scroll down from top"
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const TOP_THRESHOLD = 150; // Consider "at top" if within 150px
    let wasAtTop = lastScrollY <= TOP_THRESHOLD;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY <= TOP_THRESHOLD;
      const isScrollingDown = currentScrollY > lastScrollY;
      const justLeftTop = wasAtTop && !isAtTop && isScrollingDown;

      // If user scrolled back to top, mark that they've returned
      if (isAtTop && hasScrolledDownFromTopRef.current && !hasReturnedToTopRef.current) {
        hasReturnedToTopRef.current = true;
      }

      // Detect second scroll down from top: was at top, now scrolling down and leaving top
      if (justLeftTop && hasReturnedToTopRef.current && !showAnimationCopy) {
        clearPending();
        const runCopy = () => {
          clearPending();
          setShowAnimationCopy(true);
          // Smooth fade-in after state update — use GSAP for GPU-accelerated transition
          requestAnimationFrame(() => {
            const overlay = overlayRef.current;
            if (overlay) {
              gsap.fromTo(overlay, 
                { opacity: 0, force3D: true },
                { opacity: 1, duration: 0.5, ease: 'power2.out', force3D: true }
              );
            }
          });
        };
        // Triple rAF for ultra-smooth transition — ensures all layout is settled
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const idleId = requestIdleCallback(runCopy, { timeout: 500 });
              const timeoutId = setTimeout(runCopy, 500);
              pendingCopyRef.current = { idleId, timeoutId };
            });
          });
        });
      }

      // Track first scroll down from top
      if (justLeftTop && !hasScrolledDownFromTopRef.current) {
        hasScrolledDownFromTopRef.current = true;
      }

      wasAtTop = isAtTop;
      lastScrollY = currentScrollY;
    };

    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e) return;
        const inView = e.isIntersecting;
        if (prevInViewRef.current && !inView) hasLeftSectionRef.current = true;
        prevInViewRef.current = inView;
      },
      { root: null, rootMargin: '50px', threshold: [0, 0.1, 0.5] }
    );
    io.observe(section);

    // Listen to scroll events to detect "scroll down from top"
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearPending();
    };
  }, [showAnimationCopy]);

  return (
    <section ref={sectionRef} className="lg:ml-[200] relative lg:my-[180]">
      <div className="about-session-container my-[100] lg:flex lg:justify-between lg:items-start lg:gap-[50px]">
        {/* Left: Text + Button */}
        <div className="session-container lg:w-1/2" data-scroll-reveal-item>
          <Tag text="About us" className="ml-[22]" />
          <div className="about-us-header text-xl-semibold uppercase ml-[22] my-[30] lg:my-[70] lg:text-4xl-semibold">
            <HeaderLineByLineAnimation
              startAnimation={startTextAnimation}
              onComplete={() => setStartBodyAnimation(true)}
              lineY={HEADER_LINE_Y}
              duration={HEADER_DURATION}
              stagger={HEADER_STAGGER}
              delay={HEADER_DELAY}
              style={{ overflow: 'hidden' }}
            >
              Who <span className="text-primary-default">We are</span>
            </HeaderLineByLineAnimation>
          </div>

          {/* Phase 1: line-by-line; Phase 2: static text; Phase 3: AnimationCopy overlay (spacer keeps layout, no jump) */}
          {!lineByLineComplete ? (
            <LineByLineText
              startAnimation={startBodyAnimation}
              onComplete={() => setLineByLineComplete(true)}
              className="about-us-text mx-[25] text-lg-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body"
            >
              {ABOUT_BODY_TEXT}
            </LineByLineText>
          ) : (
            <div className="relative overflow-hidden" style={{ contain: 'layout style paint' }}>
              {/* Spacer: always in DOM, holds height; hidden when overlay is shown so layout never shifts */}
              <div
                className="about-us-text mx-[25] text-lg-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body text-[#000000]"
                style={showAnimationCopy ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
                aria-hidden={showAnimationCopy}
              >
                {ABOUT_BODY_TEXT}
              </div>
              {/* Pre-render AnimationCopy but keep it completely hidden until ready — prevents mount-time layout shift */}
              <div 
                ref={overlayRef}
                className="absolute top-0 left-0 right-0" 
                style={{ 
                  opacity: 0,
                  visibility: showAnimationCopy ? 'visible' : 'hidden',
                  pointerEvents: showAnimationCopy ? 'auto' : 'none',
                  willChange: showAnimationCopy ? 'opacity' : 'auto',
                  contain: 'layout style paint',
                  isolation: 'isolate',
                }}
                aria-hidden={!showAnimationCopy}
              >
                <AnimationCopy>
                  <div className="about-us-text mx-[25] text-lg-medium lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
                    {ABOUT_BODY_TEXT}
                  </div>
                </AnimationCopy>
              </div>
            </div>
          )}

          {/* Mobile-only image */}
          <div className="lg:hidden about-us-image relative w-[88%] h-[400px] mx-[25] mt-[50] bg-red-500 flex items-center justify-center">
            <Image
              src="/homeAssets/Image-2.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>

          <Button
            label="Explore our services"
            variant="primary"
            size="large"
            icon={<MoveRight size={16} />}
            className="ml-[22] my-[35] lg:my-[65]"
          />
        </div>

        {/* Right: Large screen image */}
        <div className="hidden lg:flex lg:w-1/2 lg:justify-end lg:items-start" data-scroll-reveal-item>
          <div className="about-us-image relative w-full h-[900px] flex items-center justify-center  transition-all ease-in-out">
            <Image
              src="/homeAssets/Image-14.webp"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSession;
