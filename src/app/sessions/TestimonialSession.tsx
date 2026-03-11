"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Tag from "../components/tag";
import Image from "next/image";
import LineByLineText from "../components/LineByLineText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PartnersMarquee from "../components/PartnersMarquee";

gsap.registerPlugin(ScrollTrigger);

function TestimonialSession() {
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [startTitleAnimation, setStartTitleAnimation] = useState(false);
  const [startSubtextAnimation, setStartSubtextAnimation] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const offsetRef = useRef(0);
  const totalWidthRef = useRef(0);
  const lastTimeRef = useRef<number>(0);
  const scrollSpeedPxPerSec = 45;
  const hasAnimatedRef = useRef(false);

  const testimonialDetails = [
    {
      id: 1,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
    {
      id: 2,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
    {
      id: 3,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
    {
      id: 4,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
    {
      id: 5,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
    {
      id: 6,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
    {
      id: 7,
      logo: "/homeAssets/Logo-1.jpg",
      subtext:
        "MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.",
      picture: "/homeAssets/Picture-1.jpg",
      name: "Samuel Okwabeng",
      position: "CEO, the Builders' Friend",
    },
  ];

  const partners = [
    { id: 1, name: "DIADORA", logo: "" },
    { id: 2, name: "NIO", logo: "/partnerLogos/Partner-2.svg" },
    { id: 3, name: "adidas", logo: "/partnerLogos/Partner-1.svg" },
    { id: 4, name: "DIADORA", logo: "" },
    { id: 5, name: "PUMA", logo: "" },
    { id: 6, name: "NIKE", logo: "" },
  ];

  const scrollingItems = [...testimonialDetails, ...testimonialDetails];

  // Initial state: tag and cards hidden (tag from right, cards from right). Re-run when resetKey changes so remounted content is hidden again.
  useLayoutEffect(() => {
    const tag = tagRef.current;
    if (tag) gsap.set(tag, { opacity: 0, x: 80, force3D: true });
    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, x: 120, force3D: true });
    });
  }, [resetKey]);

  // Sequence when section fully enters viewport: tag → title (line by line) → subtext (line by line) → cards (right to left)
  useEffect(() => {
    const section = sectionRef.current;
    const tag = tagRef.current;
    if (!section || !tag) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => {
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        gsap.to(tag, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          force3D: true,
          onComplete: () => setStartTitleAnimation(true),
        });
      },
      // onLeaveBack: () => {
      //   setResetKey((k) => k + 1);
      //   setStartTitleAnimation(false);
      //   setStartSubtextAnimation(false);
      //   hasAnimatedRef.current = false;
      // },
    });

    return () => {
      st.kill();
    };
  }, []);

  const handleTitleComplete = () => setStartSubtextAnimation(true);

  const handleSubtextComplete = () => {
    const cards = cardRefs.current.filter(Boolean);
    if (cards.length > 0) {
      gsap.to(cards, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        force3D: true,
      });
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrameId: number;

    const step = (time: number) => {
      const dt = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / 1000, 0.1)
        : 0;
      lastTimeRef.current = time;

      // Use actual track width so loop resets seamlessly (no flicker)
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) totalWidthRef.current = halfWidth;

      if (!isPaused && totalWidthRef.current > 0) {
        offsetRef.current += scrollSpeedPxPerSec * dt;
        if (offsetRef.current >= totalWidthRef.current) {
          offsetRef.current -= totalWidthRef.current;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, scrollingItems.length]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-[#f3f3f3] py-24   mt-[100] relative "
    >
      <div className="testimonial-session-main-container lg:mx-[24] lg:mb-[180]  xl:mx-[120] min-[1920px]:mx-[200]!">
        <div className="testimonial-session-content" key={resetKey}>
          <div ref={tagRef}>
            <Tag text="testimonial" className="uppercase ml-5" />
          </div>
          <div className="md:flex gap-[50px] md:mx-5 md:justify-between">
            <div className="testimonial-session-header uppercase text-xl font-semibold my-6  leading-6 ml-5 md:ml-0 lg:text-4xl-semibold lg:leading-15">
              <LineByLineText
                startAnimation={startTitleAnimation}
                onComplete={handleTitleComplete}
                className="text-default-heading"
                duration={0.2}
                stagger={0.08}
                delay={0.08}
                yFrom={24}
                as="div"
              >
               <span className=" text-nowrap">Why our clients</span> <br />
                <span className="text-primary-default text-nowrap">
                  love to work with us
                </span>
              </LineByLineText>
            </div>

            <div className="testimonial-section-subtext max-w-[484px] md:my-6 text-md-medium lg:text-xl-medium font-medium text-default-body mx-5">
              <LineByLineText
                startAnimation={startSubtextAnimation}
                onComplete={handleSubtextComplete}
                duration={0.13}
                stagger={0.05}
                delay={0.03}
                yFrom={20}
                as="div"
              >
                Our clients choose us for our expert knowledge, clear communication, commitment to their businesses, ability to adapt, and our trustworthy approach.
              </LineByLineText>
            </div>
          </div>

          <div className="scroll ">
            {/* Scroll container */}
            <div
              ref={containerRef}
              className="relative overflow-hidden w-full py-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                ref={trackRef}
                className="flex gap-6 mt-[50] will-change-transform"
                style={{ transition: "none" }}
              >
                {scrollingItems.map((item, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="bg-surface-card-primary border border-transparent hover:border-[#0160DA] w-[280] lg:w-[320] p-5 shrink-0 transition-colors duration-300"
                  >
                    <div className="relative w-10 h-10 mb-4 overflow-hidden">
                      <Image
                        src={item.logo}
                        alt=""
                        fill
                        className="object-cover"
                        quality={60}
                        sizes="40px"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm-medium text-default-body lg:my-[40]">
                      {item.subtext}
                    </p>
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden border border-gray-400">
                        <Image
                          src={item.picture}
                          alt=""
                          fill
                          className="object-cover"
                          quality={60}
                          sizes="40px"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="text-sm-bold text-default-body">
                          {item.name}
                        </div>
                        <div className="text-sm-regular text-default-body">
                          {item.position}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left fade/vanishing point */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-[#f3f3f3] to-transparent" />
              {/* Right fade/vanishing point */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-[#f3f3f3] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Partners Marquee */}
      <div className="absolute  bottom-0 left-0 right-0">
        <PartnersMarquee partners={partners} speed={60}  scrollReverse />
      </div>
    </section>
  );
}

export default TestimonialSession;
