'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import SplitType from 'split-type';
import AnimationCopy from '../animations/WritingTextAnimation';
import AnimatedMetricCard from '../components/AnimatedMetricCard';
import Image from 'next/image';
import LineByLineText from '../components/LineByLineText';

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.12;
const HEADER_DURATION = 0.6;
const HEADER_DELAY = 0.1;

const CORE_VALUE_BODY_TEXT = (
  <>
    Our uniqueness comes from blending product authenticity with real
    technical intelligence and dependable service delivery. Every item
    we supply is verified, traceable, and backed by expert insight
    tailored to the realities of mining environments. This combination
    allows us to offer solutions that improve efficiency, reduce risk,
    and keep operations running without interruption. But we don't just
    provide products—we provide peace of mind. From precision-engineered
    consumables to end-to-end procurement support, we anticipate your
    operational needs and deliver solutions that empower your team to
    perform at their best. Our clients trust us not only for the quality
    of our supplies but for our commitment to safety, sustainability,
    and innovation, ensuring that every decision we make enhances the
    value of your operations. With MASZ-Africa, you gain a partner who
    is as invested in your success as you are, driving measurable
    results, minimizing downtime, and unlocking new levels of
    operational excellence.
  </>
);

interface CoreValueSessionProps {
  startTextAnimation?: boolean;
}

const METRICS = [
  { text: 'years of combined experience', value: '15+' },
  { text: 'clients who rely on our consistent delivery and expertise.', value: '5+' },
  { text: 'client satisfaction built on trust, transparency, and performance.', value: '99%' },
  { text: 'on-time delivery, driven by efficiency and dependable logistics.', value: '98%' },
];

function CoreValueSession({ startTextAnimation = false }: CoreValueSessionProps) {
  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [showAnimationCopy, setShowAnimationCopy] = useState(false);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const [startMetricsAnimation, setStartMetricsAnimation] = useState(false);
  const [emptyCardIndex, setEmptyCardIndex] = useState(0);
  const [startContentPhase, setStartContentPhase] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerTextRef = useRef<HTMLDivElement>(null);
  const headerSplitRef = useRef<{ split: SplitType; lines: Element[] } | null>(null);
  const hasLeftSectionRef = useRef(false);
  const prevInViewRef = useRef(false);
  const hasScrolledDownFromTopRef = useRef(false);
  const hasReturnedToTopRef = useRef(false);
  const hasStartedHeaderRef = useRef(false);
  const pendingCopyRef = useRef<{ idleId: number; timeoutId: ReturnType<typeof setTimeout> } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Split header into lines on mount and hide until animation starts
  useEffect(() => {
    const el = headerTextRef.current;
    if (!el) return;

    const split = new SplitType(el, { types: 'lines' });
    const lines = split.lines;
    if (!lines || lines.length === 0) return;

    headerSplitRef.current = { split, lines: Array.from(lines) };
    gsap.set(lines, { opacity: 0, y: HEADER_LINE_Y });

    return () => {
      split.revert();
      headerSplitRef.current = null;
    };
  }, []);

  // When scroll reveal fires: animate header line-by-line, then start body animation
  useEffect(() => {
    if (!startTextAnimation || hasStartedHeaderRef.current || !headerSplitRef.current) return;
    hasStartedHeaderRef.current = true;

    const { lines } = headerSplitRef.current;
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: HEADER_DURATION,
      stagger: HEADER_STAGGER,
      delay: HEADER_DELAY,
      ease: 'power2.out',
      onComplete: () => setStartBodyAnimation(true),
    });
  }, [startTextAnimation]);

  // When body line-by-line completes, start empty cards phase (shells appear one after the other)
  useEffect(() => {
    if (!lineByLineComplete) return;
    setStartMetricsAnimation(true);
  }, [lineByLineComplete]);

  // When all 4 empty cards have been shown, start content phase (text + number per card)
  useEffect(() => {
    if (emptyCardIndex < 4) return;
    setStartContentPhase(true);
    setActiveCardIndex(0);
  }, [emptyCardIndex]);

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
    <section ref={sectionRef} className="lg:my-[180]">
      <div className="core-value-section-container">
        {/* Header - line-by-line first, then body animates */}
        <div className="section-header uppercase text-xl-semibold lg:mx-[200] ml-[22px] my-[30px] lg:text-4xl-semibold">
          <div ref={headerTextRef} style={{ overflow: 'hidden' }}>
            what makes us <span className="text-primary-default">stand out</span>
          </div>
        </div>

        {/* Description: line-by-line; then static; then AnimationCopy overlay (spacer keeps layout, no jump) */}
        {!lineByLineComplete ? (
          <LineByLineText
            startAnimation={startBodyAnimation}
            onComplete={() => setLineByLineComplete(true)}
            className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body"
          >
            {CORE_VALUE_BODY_TEXT}
          </LineByLineText>
        ) : (
          <div className="relative overflow-hidden" style={{ contain: 'layout style paint' }}>
            {/* Spacer: always in DOM, holds height; hidden when overlay is shown so layout never shifts */}
            <div
              className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body text-[#000000]"
              style={showAnimationCopy ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
              aria-hidden={showAnimationCopy}
            >
              {CORE_VALUE_BODY_TEXT}
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
                <div className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
                  {CORE_VALUE_BODY_TEXT}
                </div>
              </AnimationCopy>
            </div>
          </div>
        )}

        {/* Metrics: Phase 1 – empty card shells appear one after the other; Phase 2 – per card: text line-by-line then number (YouTube-style scroll) */}
        <div className="metrics-container lg: lg:mx-[200] lg:mb-[100] my-[50px] gap-6 mx-[21] lg:flex">
          {METRICS.map((metric, index) => (
            <AnimatedMetricCard
              key={index}
              text={metric.text}
              value={metric.value}
              showAsEmpty={startMetricsAnimation && emptyCardIndex === index}
              showContent={startContentPhase && activeCardIndex === index}
              onEmptyShown={() => setEmptyCardIndex((i) => Math.min(i + 1, METRICS.length))}
              onSequenceComplete={() =>
                setActiveCardIndex((i) => Math.min(i + 1, METRICS.length))
              }
            />
          ))}
        </div>

        {/* Images */}
        <div className="core-value-section-images flex flex-col gap-[20px] lg:flex">
          {/* Image 1 */}
          <div className="relative h-[300px] mx-[21px] overflow-hidden lg:hidden">
            <Image
              src="/homeAssets/Image-3.jpg"
              alt="Core value visual"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Image 2 & 3 */}
          <div className="flex gap-[20px] lg:gap-[40] mx-[21px] lg:mx-0">
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800]">
              <Image
                src="/homeAssets/Image-4.jpg"
                alt="Core value visual"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800] lg:mx-0">
              <Image
                src="/homeAssets/Image-5.jpg"
                alt="Core value visual"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoreValueSession;
