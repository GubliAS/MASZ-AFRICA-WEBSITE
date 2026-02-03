'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimationCopy from '../animations/WritingTextAnimation';
import PerformanceMetrics from '../components/PerformanceMetrics';
import Image from 'next/image';
import LineByLineText from '../components/LineByLineText';

gsap.registerPlugin(ScrollTrigger);

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

function CoreValueSession({ startTextAnimation = false }: CoreValueSessionProps) {
  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [showAnimationCopy, setShowAnimationCopy] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasLeftSectionRef = useRef(false);
  const prevInViewRef = useRef(false);

  // Only run AnimationCopy when user has scrolled away and scrolled back (not on first load)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const progress = self.progress;
        const inView = progress > 0.05 && progress < 0.95;

        if (prevInViewRef.current && !inView) {
          hasLeftSectionRef.current = true;
        }
        if (inView && hasLeftSectionRef.current) {
          setShowAnimationCopy(true);
        }
        prevInViewRef.current = inView;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} className="lg:my-[180]">
      <div className="core-value-section-container">
        {/* Header */}
        <div className="section-header uppercase text-xl-semibold lg:mx-[200] ml-[22px] my-[30px] lg:text-4xl-semibold">
          what makes us <span className="text-primary-default">stand out</span>
        </div>

        {/* Description: line-by-line on first load; AnimationCopy only after user scrolls away and back */}
        {!lineByLineComplete ? (
          <LineByLineText
            startAnimation={startTextAnimation}
            onComplete={() => setLineByLineComplete(true)}
            className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body"
          >
            {CORE_VALUE_BODY_TEXT}
          </LineByLineText>
        ) : showAnimationCopy ? (
          <AnimationCopy>
            <div className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight">
              {CORE_VALUE_BODY_TEXT}
            </div>
          </AnimationCopy>
        ) : (
          <div className="core-value-section-subtext lg:mx-[200] text-lg-medium mx-[25px] lg:text-2xl-medium lg:leading-8 lg:tracking-tight text-default-body text-[#000000]">
            {CORE_VALUE_BODY_TEXT}
          </div>
        )}

        {/* Metrics */}
        <div className="metrics-container lg: lg:mx-[200] lg:mb-[100] my-[50px] gap-6 mx-[21] lg:flex">
          <PerformanceMetrics text="years of combined experience" value="15+" />
          <PerformanceMetrics
            text="clients who rely on our consistent delivery and expertise."
            value="5+"
          />
          <PerformanceMetrics
            text="client satisfaction built on trust, transparency, and performance."
            value="99%"
          />
          <PerformanceMetrics
            text="on-time delivery, driven by efficiency and dependable logistics."
            value="98%"
          />
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
