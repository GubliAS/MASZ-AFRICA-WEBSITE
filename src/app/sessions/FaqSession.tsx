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
  const mobileTagRef = useRef<HTMLDivElement>(null);
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

  // Initial state: tag and FAQ items hidden
  useLayoutEffect(() => {
    if (tagRef.current) gsap.set(tagRef.current, { opacity: 0, x: 80, force3D: true });
    if (mobileTagRef.current) gsap.set(mobileTagRef.current, { opacity: 0, x: 80, force3D: true });
    faqItemRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 48, force3D: true });
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const tag = tagRef.current;
    const mobileTag = mobileTagRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        // animate whichever tag is visible
        const activeTag = tag || mobileTag;
        if (activeTag) {
          gsap.to(activeTag, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            force3D: true,
            onComplete: () => setStartTitleAnimation(true),
          });
        } else {
          setStartTitleAnimation(true);
        }
        // also animate the other one silently
        if (tag && mobileTag) {
          gsap.to([tag, mobileTag], { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', force3D: true });
        }
      },
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
    <section ref={sectionRef} className="mt-[100px] mx-[21px] lg:mx-[24] xl:mx-[120] lg:my-[120] bg-white relative z-10">
      <div className="main-faq-section-container lg:flex lg:justify-between lg:items-stretch lg:gap-[50px]">

        {/* ─────────────────────────────────────────────
            DESKTOP LEFT PANEL — bg image + overlay
        ───────────────────────────────────────────── */}
        <div
          className="hidden lg:flex flex-col gap-[50px] lg:px-[32px] xl:px-[52] py-[47] justify-between relative overflow-hidden lg:w-[50%] min-h-[800px]"
          style={{
            backgroundImage: "url('/homeAssets/Image-16.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          key={resetKey}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/0" />

          {/* TAG + TITLE — top */}
          <div className="relative z-10 ">
            <div ref={tagRef}>
              <Tag className='lg:text-white! lg:border-white!' text="Frequently asked questions" />
            </div>
            <div className="text-xl-semibold mt-[28px] leading-6 lg:text-2xl-semibold xl:text-3xl-semibold  lg:leading-13">
              <LineByLineText
                startAnimation={startTitleAnimation}
                onComplete={handleTitleComplete}
                duration={0.3}
                stagger={0.12}
                delay={0.04}
                yFrom={24}
                as="div"
                className="text-white! uppercase lg:text-4xl-semibold"
              >
                GOT ANY QUESTIONS? <br />
                <span className="text-white!">WE&apos;VE GOT ANSWERS</span>
              </LineByLineText>
            </div>
          </div>

          {/* CTA CARD — bottom, backdrop blur dark tint */}
          <div className="relative z-10  lg:px-[32px] 2xl:px-[40] py-[32px] max-w-[450px]  flex flex-col lg:gap-[28px] xl:gap-[32px] bg-[#8B8B8B24] backdrop-blur-[10px] border border-[#8B8B8B24] ">
            <div className="header uppercase text-white text-lg-semibold lg:text-2xl-semibold ">
              Still have a question?
            </div>
            <div className="subtext text-white/75 text-sm-medium lg:text-sm-medium ">
              <LineByLineText
                startAnimation={startSubtextAnimation}
                onComplete={handleSubtextComplete}
                duration={0.2}
                stagger={0.08}
                delay={0.06}
                yFrom={20}
                as="div"
                className='text-md-medium text-white'
              >
                Our team of industry experts is ready to provide the clarity and
                support you need. Whether it&apos;s a general inquiry or a
                project-specific discussion, we&apos;re just a message away. Reach
                out today and let us help move your operations forward with
                confidence.
              </LineByLineText>
            </div>
            <Button
              label="Reach out to us"
              variant="primaryWhite"
              size="large"
              icon={<MoveRight className='text-white group-hover:text-[#016BF2]!'  size={16} />}
              className=" lg:bg-transparent! lg:border-white! text-white! hover:bg-white! hover:text-[#016BF2]! hover:w-fit! hover:border-transparent! transition-colors duration-300"
            />
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            MOBILE LEFT — plain tag + title (unchanged)
        ───────────────────────────────────────────── */}
        <div className="lg:hidden" key={resetKey + '-mobile'}>
          <div ref={mobileTagRef}>
            <Tag text="Frequently asked questions" />
          </div>
          <div className="text-xl-semibold my-[30px] leading-6">
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
              <span className="text-primary-default">WE&apos;VE GOT ANSWERS</span>
            </LineByLineText>
          </div>
        </div>

        {/* ─────────────────────────────────────────────
            ACCORDION — same on both breakpoints
        ───────────────────────────────────────────── */}
        <div ref={accordionContainerRef} className="mt-[80px] flex flex-col gap-4 justify-between lg:w-[50%] lg:mt-0">
          {faqObject.map((item, i) => {
            const isOpen = openCards.has(i);
            return (
              <div
                key={item.id}
                ref={(el) => {
                  faqItemRefs.current[i] = el;
                }}
                className={`relative lg:flex-1 lg:flex lg:flex-col lg:justify-center   select-none
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
                    transition-colors duration-300 w-8 h-8 shrink-0
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

        {/* ─────────────────────────────────────────────
            MOBILE CTA card — below accordion (unchanged)
        ───────────────────────────────────────────── */}
        <div className="lg:hidden faq-cta-card bg-surface-card-colored-primary px-[25] py-[25] my-[100] transition-all duration-300" data-scroll-reveal-item>
          <div className="header uppercase text-light text-lg-semibold">
            Still have a question?
          </div>
          <div className="subtext text-light text-sm-medium my-[25]">
            Our team of industry experts is ready to provide the clarity and
            support you need. Whether it&apos;s a general inquiry or a
            project-specific discussion, we&apos;re just a message away. Reach out
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
