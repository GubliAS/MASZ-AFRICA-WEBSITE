'use client';

import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Tag from '../components/tag';
import { ChevronDown, MoveRight } from 'lucide-react';
import Button from '../components/button';
import LineByLineText from '../components/LineByLineText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FaqSession() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const faqItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [startTitleAnimation, setStartTitleAnimation] = useState(false);
  const [startSubtextAnimation, setStartSubtextAnimation] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const hasAnimatedRef = useRef(false);

  const faqObject = [
    {
      id: 1,
      title: 'What services does MASZ-Africa provide?',
      subtext:
        'MASZ-Africa specializes in mining operations support, equipment supply, technical consultancy, safety solutions, and workforce training tailored to the mining and mineral processing industry. We are committed to improving operational efficiency, reducing risks, and promoting sustainable mining practices. Through innovation and industry expertise, we help our partners achieve long-term productivity and growth.',
    },
    {
      id: 2,
      title: 'How can I contact MASZ-Africa for support?',
      subtext:
        'You can reach out via email, phone, or our contact form on the website.',
    },
    {
      id: 3,
      title: 'Does MASZ-Africa offer training services?',
      subtext:
        'Yes, MASZ-Africa provides workforce training tailored to mining operations and safety practices.',
    },
    {
      id: 4,
      title: 'Where does MASZ-Africa operate?',
      subtext: 'MASZ-Africa operates across West Africa.',
    },
    {
      id: 5,
      title: 'Why choose MASZ-Africa?',
      subtext:
        'MASZ-Africa combines reliability, expertise, innovation, and sustainability.',
    },
    {
      id: 6,
      title: 'What services does MASZ-Africa provide?',
      subtext:
        'MASZ-Africa specializes in mining operations support, equipment supply, technical consultancy, safety solutions, and workforce training tailored to the mining and mineral processing industry. We are committed to improving operational efficiency, reducing risks, and promoting sustainable mining practices. Through innovation and industry expertise, we help our partners achieve long-term productivity and growth.',
    },
  ];

  // Multi-open state: store all open card indices
  const [openCards, setOpenCards] = useState<Set<number>>(new Set());
  const [scrollHeights, setScrollHeights] = useState<number[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // Initial state: tag and FAQ items hidden (items staggered top-to-bottom later)
  useLayoutEffect(() => {
    if (tagRef.current) gsap.set(tagRef.current, { opacity: 0, x: 80, force3D: true });
    faqItemRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 48, force3D: true });
    });
  }, []);

  // Sequence when section fully enters viewport: tag → title (line by line) → subtext (line by line) → accordion
  useEffect(() => {
    const section = sectionRef.current;
    const tag = tagRef.current;
    if (!section || !tag) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        gsap.to(tag, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          force3D: true,
          onComplete: () => setStartTitleAnimation(true),
        });
      },
      // onLeaveBack: () => {
      //   setResetKey((k) => k + 1);
      //   setStartTitleAnimation(false);
      //   setStartSubtextAnimation(false);
      //   hasAnimatedRef.current = false;
      //   faqItemRefs.current.forEach((el) => {
      //     if (el) gsap.set(el, { opacity: 0, y: 48, force3D: true });
      //   });
      // },
    });
    return () => st.kill();
  }, []);

  const handleTitleComplete = () => setStartSubtextAnimation(true);

  const handleSubtextComplete = () => {
    const items = faqItemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (items.length > 0) {
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.08,
        ease: 'power2.out',
        force3D: true,
      });
    }
  };

  // Measure scrollHeights after mount and on resize
  useEffect(() => {
    const measure = () => {
      setScrollHeights(refs.current.map((el) => el?.scrollHeight ?? 0));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const toggleCard = (i: number) => {
    setOpenCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(i)) newSet.delete(i);
      else newSet.add(i);
      return newSet;
    });
  };

  return (
    <section ref={sectionRef} className="mt-[100px] mx-[21px] lg:mx-[200] lg:my-[120] bg-white relative z-10">
      <div className="main-faq-section-container lg:flex lg:justify-between">
        <div className="faq-left-side-for-large-screens" key={resetKey}>
          <div ref={tagRef}>
            <Tag text="Frequently asked questions" />
          </div>
          <div className="faq-title-and-card-for-large-screens lg:flex lg:flex-col lg:justify-between">
            <div className="text-xl-semibold my-[30px] leading-6 lg:text-4xl-semibold lg:leading-13 lg:my-[70]">
              <LineByLineText
                startAnimation={startTitleAnimation}
                onComplete={handleTitleComplete}
                duration={0.3}
                stagger={0.12}
                delay={0.04}
                yFrom={24}
                as="div"
              >
                GOT ANY QUESTIONS? <br />
                <span className="text-primary-default">WE'VE GOT ANSWERS</span>
              </LineByLineText>
            </div>

            {/* faq-cta-card displayed on mobile */}
            <div className="hidden lg:block faq-cta-card bg-surface-card-colored-primary lg:w-[530] px-[25] py-[25] my-[100] lg:mt-[] transition-all duration-300">
              <div className="header uppercase text-light text-lg-semibold lg:text-2xl-semibold">
                Still have a question?
              </div>
              <div className="subtext text-light text-sm-medium lg:text-md-medium my-[25]">
                <LineByLineText
                  startAnimation={startSubtextAnimation}
                  onComplete={handleSubtextComplete}
                  duration={0.2}
                  stagger={0.08}
                  delay={0.06}
                  yFrom={20}
                  as="div"
                  className="text-light"
                >
                  Our team of industry experts is ready to provide the clarity and
                support you need. Whether it’s a general inquiry or a
                project-specific discussion, we’re just a message away. Reach
                out today and let us help move your operations forward with
                confidence.
                </LineByLineText>
              </div>
              <Button
                label="Reach out to us"
                variant="primaryWhite"
                size="large"
                icon={<MoveRight size={16} />}
                className=""
              />
            </div>
          </div>
        </div>

        <div ref={accordionContainerRef} className="mt-[80px] lg:w-[40%] lg:mt-[120]">
          {faqObject.map((item, i) => {
            const isOpen = openCards.has(i);
            return (
              <div
                key={item.id}
                ref={(el) => {
                  faqItemRefs.current[i] = el;
                }}
                className={`relative mb-4 select-none
                border-2 transition-colors duration-400
                ${
                  isOpen
                    ? 'border-default-primary-thick'
                    : 'border-default-card-stroke'
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => toggleCard(i)}
                  className={`relative flex items-center justify-between p-[20px]
                  cursor-pointer transition-colors duration-300
                  ${
                    isOpen
                      ? 'bg-surface-card-primary'
                      : 'hover:bg-surface-card-primary'
                  }`}
                >
                  <div className="text-md-semibold text-default-heading lg:text-xl-semibold">
                    {item.title}
                  </div>

                  <div
                    className={`flex items-center justify-center rounded-full
                    transition-colors duration-300 w-8 h-8
                    ${
                      isOpen
                        ? 'bg-surface-card-colored-primary text-light'
                        : 'bg-transparent'
                    }`}
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-500 ease-in-out
                      ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </div>

                  {/* Divider */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] w-full bg-gray-200
                    transition-opacity duration-300
                    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>

                {/* Body */}
                <div
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    maxHeight: isOpen
                      ? (scrollHeights[i] ?? 0) + 32
                      : 0,
                  }}
                >
                  <div
                    className={`px-[23px] py-[20px] text-md-medium text-default-body
                    transition-opacity duration-500
                    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {item.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* faq-cta-card displayed on mobile */}
        <div className="lg:hidden faq-cta-card bg-surface-card-colored-primary px-[25] py-[25] my-[100] transition-all duration-300" data-scroll-reveal-item>
          <div className="header uppercase text-light text-lg-semibold">
            Still have a question?
          </div>
          <div className="subtext text-light text-sm-medium my-[25]">
            Our team of industry experts is ready to provide the clarity and
            support you need. Whether it’s a general inquiry or a
            project-specific discussion, we’re just a message away. Reach out
            today and let us help move your operations forward with confidence.
          </div>
          <Button
            label="Reach out to us"
            variant="primaryWhite"
            size="large"
            icon={<MoveRight size={16} />}
            className=""
          />
        </div>
      </div>
    </section>
  );
}
