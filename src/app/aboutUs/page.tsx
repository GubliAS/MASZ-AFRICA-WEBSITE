"use client";
import Tag from "../components/tag";
import AnimationCopy from "../animations/WritingTextAnimation";
import TiltCard from "../animations/TiltCard";
import CoreValueCard from "../components/MainCoreValuesCard";
import { IconAwardFilled } from "@tabler/icons-react";
import TeamMembersSection from "../sessions/TeamMembersSection";
import GallerySection from "../sessions/GallerySection";
import ScrollReveal from "../components/ScrollReveal";
import LineByLineText from "../components/LineByLineText";
import MetricsCardAnimation from "../animations/MetricsCardAnimation";
import ParallaxAnimation from "../animations/ParallaxAnimation";
import AnimatedCardsContainer from "../animations/AnimatedCardsContainer";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useRef, useEffect, useLayoutEffect, memo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { div } from "three/src/nodes/TSL.js";
import AchievementsSession from "../sessions/AchievementsSession";
import { achievements } from "../data/achievements";

gsap.registerPlugin(ScrollTrigger);

type CoreValue = {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
};

const valueCards: CoreValue[] = [
  {
    id: 1,
    number: "01",
    title: "Innovation",
    image: "/aboutAssets/M-1.webp",
    description:
      "We are driven by a culture of creativity, curiosity, and continuous improvement. By embracing new ideas, modern technologies, and unconventional thinking, we consistently challenge the status quo to design smarter, more efficient, and future-ready solutions. Our approach to innovation enables us to adapt quickly to change, solve complex problems, and create long-term value for our clients and partners.",
  },
  {
    id: 2,
    number: "02",
    title: "Integrity",
    image: "/aboutAssets/M-2.webp",
    description:
      "Integrity is the foundation of everything we do. We operate with honesty, transparency, and accountability in every interaction, ensuring that our decisions and actions are guided by strong ethical principles. By keeping our commitments and maintaining open communication, we build trust, credibility, and lasting relationships with our clients, partners, and stakeholders.",
  },
  {
    id: 3,
    number: "03",
    title: "Excellence",
    image: "/aboutAssets/M-3.webp",
    description:
      "We pursue excellence through discipline, expertise, and an unwavering commitment to quality. Every project we undertake is approached with attention to detail, continuous evaluation, and a desire to exceed expectations. By combining technical competence with professionalism, we deliver outcomes that are reliable, impactful, and aligned with the highest industry standards.",
  },
  {
    id: 4,
    number: "04",
    title: "Customer Partnership",
    image: "/aboutAssets/M-4.webp",
    description:
      "We believe that true success is built through strong, collaborative partnerships. By deeply understanding our clients’ objectives, challenges, and environments, we tailor solutions that are both practical and strategic. Through trust, open dialogue, and shared goals, we foster long-term relationships that generate sustainable growth and mutual success.",
  },
  {
    id: 5,
    number: "05",
    title: "Safety & Sustainability",
    image: "/aboutAssets/M-4.webp",
    description:
      "Safety and sustainability are integral to our operations and decision-making processes. We prioritize the well-being of our people while actively minimizing environmental impact through responsible and efficient practices. By promoting safe working environments and sustainable resource management, we contribute to long-term environmental, social, and economic resilience.",
  },
];

// achievements data moved to src/app/data/achievements.ts to avoid circular dependency

// const OUR_STORY_TEXT = (
//   <>
//     MASZ-AFRICA Ltd is a Ghana-based private limited liability company that
//     provides high-quality mining consumables, engineering support, and
//     procurement solutions to mining and mineral processing industries across
//     Africa. Established in September 2025 by a multidisciplinary team with more
//     than 15 years of combined experience in metallurgy, engineering, finance,
//     supply chain management, and business improvement, the company was created
//     to address the lack of dependable, responsive, and technically knowledgeable
//     supply partners within the African mining sector.From the beginning,
//     MASZ-Africa has focused on quality, reliability, and client satisfaction.
//     Through strong partnerships with globally recognized manufacturers and
//     original equipment suppliers, the company delivers world-class products
//     supported by solid technical expertise and consistent on-time delivery. With
//     a growing presence across West Africa, MASZ-Africa aims to become a
//     continental leader in mining supply, logistics, and technical services. The
//     company is committed to empowering mining operations with reliable supplies,
//     innovative solutions, and smooth service delivery that keeps production
//     running efficiently.
//   </>
// );

const OUR_STORY_TEXT_1 = (
  <>
    MASZ-AFRICA Ltd is a Ghana-based private limited liability company that
    provides high-quality mining consumables, engineering support, and
    procurement solutions to mining and mineral processing industries across
    Africa. Established in September 2025 by a multidisciplinary team with more
    than 15 years of combined experience in metallurgy, engineering, finance,
    supply chain management, and business improvement, the company was created
    to address the lack of dependable, responsive, and technically knowledgeable
    supply partners within the African mining sector.
    <br className="hidden md:block" />
    <br  />
    From the beginning, MASZ-Africa has focused on quality, reliability, and
    client satisfaction.
  </>
);

const OUR_STORY_TEXT_2 = (
  <>
    Through strong partnerships with globally recognized manufacturers and
    original equipment suppliers, the company delivers world-class products
    supported by solid technical expertise and consistent on-time delivery.
    <br className="hidden md:block" />
    <br  />
    With a growing presence across West Africa, MASZ-Africa aims to become a
    continental leader in mining supply, logistics, and technical services. The
    company is committed to empowering mining operations with reliable supplies,
    innovative solutions, and smooth service delivery that keeps production
    running efficiently.
  </>
);

const METRICS = [
  { text: "years of combined experience", value: "15+" },
  {
    text: "clients who rely on our consistent delivery and expertise.",
    value: "5+",
  },
  {
    text: "client satisfaction built on trust, transparency, and performance.",
    value: "99%",
  },
  {
    text: "on-time delivery, driven by efficiency and dependable logistics.",
    value: "98%",
  },
];

const MemoAchievementsSession = memo(AchievementsSession);


function OurStorySection({
  startTextAnimation = false,
}: {
  startTextAnimation?: boolean;
}) {
  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [showAnimationCopy, setShowAnimationCopy] = useState(false);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const [startMetricsAnimation, setStartMetricsAnimation] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef1 = useRef<HTMLDivElement>(null);
  const overlayRef2 = useRef<HTMLDivElement>(null);
  const hasScrolledDownFromTopRef = useRef(false);
  const hasReturnedToTopRef = useRef(false);
  const pendingCopyRef = useRef<{
    idleId: number;
    timeoutId: ReturnType<typeof setTimeout>;
  } | null>(null);

  // ✅ FIX 1: useLayoutEffect now uses overlayRef1 and overlayRef2
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.set(section, { opacity: 1, force3D: true });

    [overlayRef1, overlayRef2].forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, {
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
          force3D: true,
        });
      }
    });
  }, []);

  // Handle hash navigation with Lenis
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#core-values") {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById("core-values");
        if (element) {
          const yOffset = -100;
          const y =
            element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Start body animation when scroll reveal triggers
  useEffect(() => {
    if (startTextAnimation) {
      setStartBodyAnimation(true);
    }
  }, [startTextAnimation]);

  // When body line-by-line completes, start metrics animation
  useEffect(() => {
    if (!lineByLineComplete) return;
    setStartMetricsAnimation(true);
  }, [lineByLineComplete]);

  // Only run AnimationCopy on second scroll down from top
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

    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const TOP_THRESHOLD = 150;
    let wasAtTop = lastScrollY <= TOP_THRESHOLD;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY <= TOP_THRESHOLD;
      const isScrollingDown = currentScrollY > lastScrollY;
      const justLeftTop = wasAtTop && !isAtTop && isScrollingDown;

      if (
        isAtTop &&
        hasScrolledDownFromTopRef.current &&
        !hasReturnedToTopRef.current
      ) {
        hasReturnedToTopRef.current = true;
      }

      // ✅ FIX 2: runCopy now fades in both overlayRef1 and overlayRef2
      if (justLeftTop && hasReturnedToTopRef.current && !showAnimationCopy) {
        clearPending();
        const runCopy = () => {
          clearPending();
          setShowAnimationCopy(true);
          requestAnimationFrame(() => {
            [overlayRef1, overlayRef2].forEach((ref) => {
              if (ref.current) {
                gsap.set(ref.current, {
                  visibility: "visible",
                  pointerEvents: "auto",
                  ariaHidden: false,
                });
                gsap.fromTo(
                  ref.current,
                  { opacity: 0, force3D: true },
                  {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    force3D: true,
                  }
                );
              }
            });
          });
        };
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

      if (justLeftTop && !hasScrolledDownFromTopRef.current) {
        hasScrolledDownFromTopRef.current = true;
      }

      wasAtTop = isAtTop;
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearPending();
    };
  }, [showAnimationCopy]);

  return (
    <div
      ref={sectionRef}
      className="desctiption-text mx-[21] lg:mx-[24] xl:mx-[120]"
      style={{ contain: "layout style paint" }}
    >
      <Tag text="our story" className="my-[40]" />
      {/* Phase 1: line-by-line; Phase 2: static text; Phase 3: AnimationCopy overlay (spacer keeps layout, no jump) */}
      {!lineByLineComplete ? (
        <div
          className="flex flex-col md:flex-row  gap-8 md:gap-6 lg:gap-[50px] relative"
          style={{ contain: "layout style paint" }}
        >
          <LineByLineText
            duration={0.13}
            stagger={0.07}
            delay={0}
            startAnimation={startBodyAnimation}
            onComplete={() => setLineByLineComplete(true)}
            className="main-text-description md:w-1/2 text-md-medium   lg:text-xl-medium lg:mt-[10] lg:leading-8 lg:tracking-tight text-[#777777]"
          >
            {OUR_STORY_TEXT_1}
          </LineByLineText>
          <LineByLineText
            duration={0.13}
            stagger={0.07}
            delay={0}
            startAnimation={startBodyAnimation}
            onComplete={() => setLineByLineComplete(true)}
            className="main-text-description md:w-1/2 text-md-medium lg:text-xl-medium lg:mt-[10] lg:leading-8 lg:tracking-tight text-[#777777]"
          >
            {OUR_STORY_TEXT_2}
          </LineByLineText>
        </div>
      ) : (
        <div
          className="flex flex-col md:flex-row gap-8 md:gap-6 lg:gap-[50px] relative"
          style={{ contain: "layout style paint" }}
        >
          {/* 1 */}
          <div
            className="relative md:w-1/2 overflow-hidden"
            style={{ contain: "layout style paint" }}
          >
            {/* Spacer: always in DOM, holds height; hidden when overlay is shown so layout never shifts */}
            <div
              className="main-text-description text-md-medium lg:text-xl-medium lg:mt-[10] lg:leading-8 lg:tracking-tight text-[#777777]"
              style={
                showAnimationCopy
                  ? { visibility: "hidden", pointerEvents: "none" }
                  : undefined
              }
              aria-hidden={showAnimationCopy}
            >
              {OUR_STORY_TEXT_1}
            </div>
            {/* Pre-render AnimationCopy but keep it completely hidden until ready — prevents mount-time layout shift */}
            <div
              ref={overlayRef1}
              className="absolute top-0 left-0 right-0"
              style={{
                opacity: 0,
                visibility: "hidden",
                pointerEvents: "none",
                contain: "layout style paint",
                isolation: "isolate",
              }}
              aria-hidden={true}
            >
              <AnimationCopy>
                <div className="main-text-description text-[#777777] text-md-medium lg:text-xl-medium lg:mt-[10] lg:leading-8 lg:tracking-tight">
                  {OUR_STORY_TEXT_1}
                </div>
              </AnimationCopy>
            </div>
          </div>
          {/* 2 */}
          <div
            className="relative md:w-1/2 overflow-hidden"
            style={{ contain: "layout style paint" }}
          >
            {/* Spacer: always in DOM, holds height; hidden when overlay is shown so layout never shifts */}
            <div
              className="main-text-description text-md-medium lg:text-xl-medium lg:mt-[10] lg:leading-8 lg:tracking-tight text-[#777777]"
              style={
                showAnimationCopy
                  ? { visibility: "hidden", pointerEvents: "none" }
                  : undefined
              }
              aria-hidden={showAnimationCopy}
            >
              {OUR_STORY_TEXT_2}
            </div>
            {/* Pre-render AnimationCopy but keep it completely hidden until ready — prevents mount-time layout shift */}
            <div
              ref={overlayRef2}
              className="absolute top-0 left-0 right-0"
              style={{
                opacity: 0,
                visibility: "hidden",
                pointerEvents: "none",
                contain: "layout style paint",
                isolation: "isolate",
              }}
              aria-hidden={true}
            >
              <AnimationCopy>
                <div className="main-text-description text-md-medium text-[#777777] lg:text-xl-medium lg:mt-[10] lg:leading-8 lg:tracking-tight">
                  {OUR_STORY_TEXT_2}
                </div>
              </AnimationCopy>
            </div>
          </div>
        </div>
      )}
      {/* Metrics Cards Animation */}
      <MetricsCardAnimation
        cardClassName=""
        metrics={METRICS}
        startAnimation={startMetricsAnimation}        
        className="my-[50px]  bg-[#016BF2]! lg:gap-4! py-[31px] px-[36px] gap-4! flex flex-col md:grid md:grid-cols-2 xl:grid-cols-4 mt-[50]"
      />
    </div>
  );
}

const MemoOurStorySection = memo(OurStorySection);

function CoreValuesCardsContainer({ cards }: { cards: CoreValue[] }) {
  return (
    <AnimatedCardsContainer className="flex flex-col   lg:flex-row  gap-4 lg:gap-8">
      {cards.map((card) => (
        // No wrapper div — card must be a direct child of the flex row
        // so GSAP can correctly target parentElement as the container
        <CoreValueCard key={card.id} card={card} />
      ))}
    </AnimatedCardsContainer>
  );
}

function ParallaxTextTrigger({ onTrigger }: { onTrigger: () => void }) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || hasTriggeredRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e || hasTriggeredRef.current) return;
        if (e.isIntersecting) {
          hasTriggeredRef.current = true;
          // Delay slightly to ensure image is visible first
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              onTrigger();
            });
          });
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    io.observe(trigger);
    return () => io.disconnect();
  }, [onTrigger]);

  return (
    <div
      ref={triggerRef}
      style={{
        position: "absolute",
        top: "85%",
        width: "1px",
        height: "1px",
        pointerEvents: "none",
      }}
    />
  );
}

function AboutUSPage() {
  const [ourStoryRevealNearlyComplete, setOurStoryRevealNearlyComplete] =
    useState(false);
  const [
    parallaxTextRevealNearlyComplete,
    setParallaxTextRevealNearlyComplete,
  ] = useState(false);
  const [visionRevealNearlyComplete, setVisionRevealNearlyComplete] =
    useState(false);
  const [missionRevealNearlyComplete, setMissionRevealNearlyComplete] =
    useState(false);
    const [
        achievementsRevealNearlyComplete,
        setAchievementsRevealNearlyComplete,
      ] = useState(false);
      const onAchievementsReveal = useCallback(
        () => setAchievementsRevealNearlyComplete(true),
        []
      );

  // Make TiltCard client-only
  const TiltCard = dynamic(() => import("../animations/TiltCard"), {
    ssr: false,
  });

  // Make AnimationCopy client-only
  const AnimationCopy = dynamic(
    () => import("../animations/WritingTextAnimation"),
    { ssr: false }
  );

  return (
    <section className="w-full">
      <div className="main-about-page-content">
        <ScrollReveal
          direction="up"
          duration={0.6}
          start="top 60%"
          once
          staggerChildren={0.08}
        >
          <div
            className="main-about-hero-content  "
            style={{ contain: "layout style paint" }}
          >
            <div className="tag-container flex flex-col  items-start  mt-[30] lg:mt-[60] mx-6 lg:mx-[24] xl:mx-[120]">
              <Tag text="About us" />
            </div>

            {/* TOP TEXT */}
            <div className="about-page-hero-text-container flex flex-col  items-start  mx-6  lg:mx-[24] xl:mx-[120px] my-[40px] lg:my-[40px]">
              <div className="page-header text-xl-semibold uppercase lg:text-4xl-bold">
                We are{" "}
                <span className="subtext text-primary-default">
                  Masz-Africa
                </span>
              </div>
              <div className=" text-xs-medium text-default-body lg:text-2xl-medium">
                General Mining & procurement services limited
              </div>
            </div>

            {/* PARALLAX IMAGE */}
            <div
              style={{ contain: "layout style paint", willChange: "transform" }}
              className="lg:mx-6 mx-6 xl:mx-[120]"
            >
              <ParallaxAnimation
                imageSrc="/aboutAssets/Image-18.webp"
                imageAlt="About us hero image"
                height="lg"
              />
            </div>
            <div className="flex justify-between text-[13.4px] px-2 leading-[140%] text-[#777777] mx-6 mt-4.5 lg:mx-6 xl:mx-[120]">
              <span>Concept 1.0</span>
              <span>Brand Identity Animation</span>
            </div>
          </div>
        </ScrollReveal>

        {/* conpany-description-section */}
        <ScrollReveal
          direction="up"
          duration={0.4}
          start="top 90%"
          scale
          once
          onRevealNearlyComplete={() => setOurStoryRevealNearlyComplete(true)}
        >
          <div
            className="company-description-content lg:my-[100]"
            style={{ contain: "layout style paint" }}
          >
            <MemoOurStorySection
              startTextAnimation={ourStoryRevealNearlyComplete}
            />
          </div>
        </ScrollReveal>

        {/* vision-mission-hero-section */}
        <div
          className="vision-mission-section-container relative"
          style={{ contain: "layout style paint" }}
        >
          <ScrollReveal
            direction="up"
            duration={0.6}
            start="top 90%"
            once
            staggerChildren={0.08}
          >
            <div
              className="vision-mission-parallax-section relative "
              style={{ contain: "layout style paint" }}
            >
              <ParallaxAnimation
                imageSrc="/aboutAssets/Image-19.webp"
                imageAlt="Vision and mission hero image"
                height="lg"
              />

            

              {/* Text content */}
              <div
                className="absolute bg-[#FFFFFF05] max-w-[387px] lg:max-w-full  backdrop-blur-[5px] bottom-0 left-0 right-0 pl-[44px] pr-[28px] pb-[30px] pt-[20px] lg:px-[116px] lg:pb-[67px] lg:pt-[52px] flex items-end justify-between"
                style={{ zIndex: 3 }}
              >
                <div className="max-w-[480px] lg:max-w-[820px]">
                  {/* Shield icon */}
                  <div className="mb-[13px] lg:mb-[32px]">
                    <div className="inline-flex items-center justify-center w-[42px] h-[38px] lg:w-[95px] lg:h-[85px] bg-[#016BF2]">
                      <svg
                      className="w-[19px] h-[22px] lg:w-[42px] lg:h-[48px]" 
                        xmlns="http://www.w3.org/2000/svg"
                        width="42"
                        height="48"
                        viewBox="0 0 42 48"
                        fill="none"
                      >
                        <path
                          d="M41.4683 7.25694L20.7341 0L0 7.25694V23.9687C0 32.5256 5.25403 38.5074 10.1514 42.2209C13.1083 44.4404 16.3514 46.2502 19.7928 47.6014C20.0278 47.6899 20.2642 47.7742 20.5019 47.8544L20.7341 47.9373L20.9705 47.8544C21.4239 47.6969 21.8732 47.5282 22.3182 47.3484C25.5232 46.028 28.547 44.305 31.3168 42.2209C36.2163 38.5074 41.4683 32.5256 41.4683 23.9687V7.25694ZM18.6628 31.0494L9.86945 22.2519L12.8013 19.318L18.6649 25.1837L30.3942 13.4544L33.328 16.3862L18.6628 31.0494Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Heading */}
                  <h2 className="text-white text-xl-semibold lg:text-4xl-bold  leading-tight tracking-tight mb-[9px] lg:mb-[21px]">
                    Defining The Future We Stand For
                  </h2>

                  {/* Subtext */}
                  <p className="text-[rgba(255,255,255,0.75)] text-[10.4px] font-medium lg:text-xl-medium leading-relaxed">
                    Our guiding principles define how we operate today—and the
                    impact we aim to make tomorrow. They guide our work, shape
                    our decisions, and keep us aligned with the needs of a
                    fast-evolving mining sector. Every step we take reflects our
                    commitment to progress and long-term value.
                  </p>
                </div>
                <div className=" w-[53px] hidden xl:block h-[29px]">
                  {/* Brand mark — desktop only */}
                  <Image
                    className=" w-full h-full object-fill"
                    width={800}
                    height={500}
                    src="/maszAssets/logo-on-color.svg"
                    alt="logo"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ParallaxTextTrigger
            onTrigger={() => setParallaxTextRevealNearlyComplete(true)}
          />
        </div>

        {/* vision-statement-section */}
        <ScrollReveal direction="up" duration={0.3} start="top 90%" scale once>
          <div
            className="vision-mission-statement lg:mx-[24] xl:mx-[120] lg:my-[150] "
            style={{ contain: "layout style paint" }}
          >
            <div className="vision-statement lg:flex lg:justify-between ">
              <div className="text mx-[21]">
                <Tag text="our vision" className="my-[80] lg:my-0" />
                <AnimationCopy>
                  <div className="main-text text-xl-semibold md:text-2xl-semibold lg:text-3xl-semibold lg:leading-10 tracking-tight text-default-body lg:my-[50] lg:w-[650]">
                    To deliver trusted mining consumables and technical
                    solutions that enhance productivity, reliability, and
                    sustainability across Africa’s mining value chain.
                  </div>
                </AnimationCopy>
                <div className="subtext text-sm-medium md:text-md-medium lg:w-[650] text-default-body lg:text-xl-medium lg:leading-6 my-[40] lg:bg-surface-card-colored-primary">
                  As a trusted global partner, MASZ-AFRICA supplies quality
                  mining products backed by technical expertise. We focus on
                  improving productivity and ensuring uninterrupted operations.
                  Our team works closely with clients to provide solutions
                  tailored to their needs. We emphasize reliability, timely
                  delivery, and long-term value creation. Our approach blends
                  global standards with local understanding and responsiveness.
                </div>
              </div>
              <div className="image-container relative w-full lg:w-1/2 h-[520px]">
                <TiltCard
                  imageSrc="/aboutAssets/Image-7.webp"
                  title="Vision Image"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* mission-statement */}
        <ScrollReveal direction="up" duration={0.35} start="top 90%" scale once>
          <div
            className="mission-statement lg:mx-[24] xl:mx-[120]  lg:my-[250]"
            style={{ contain: "layout style paint" }}
          >
            <div className="mission-statement lg:flex lg:justify-between lg:flex-row">
              <div className="hidden lg:block image-container relative w-full lg:w-1/2 h-[520px]">
                <TiltCard
                  imageSrc="/aboutAssets/Image-13.webp"
                  title="mision Image"
                />
              </div>
              <div className="text mx-[21]">
                <Tag text="our mission" className="mb-[60] lg:mb-0" />
                <AnimationCopy>
                  <div className="main-text text-xl-semibold md:text-2xl-semibold lg:text-3xl-semibold lg:leading-10 tracking-tight text-default-body lg:my-[50] lg:w-[650]">
                    To become Africa’s most trusted and efficient mining
                    procurement and service brand, connecting global
                    manufacturing quality with local operational realities.
                  </div>
                </AnimationCopy>
                <div className="subtext text-sm-medium md:text-md-medium lg:w-[650] text-default-body lg:text-xl-medium lg:leading-6  my-[40] lg:my-[18] lg:bg-surface-card-colored-primary">
                  MASZ-AFRICA aims to be Africa’s most trusted and efficient
                  mining procurement and service brand. We connect global
                  manufacturing quality with the practical needs of local mining
                  operations. Our focus is on reliability, timely delivery, and
                  technical excellence. We provide solutions that streamline
                  procurement, reduce downtime, and enhance productivity. By
                  combining international standards with local understanding, we
                  empower mining operations
                </div>
              </div>
              <div className="lg:hidden image-container relative w-full lg:w-1/2 h-[520px]">
                <TiltCard
                  imageSrc="/aboutAssets/Image-13.webp"
                  title="mision Image"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Core Values section */}
        <ScrollReveal direction="up" duration={0.4} start="top 85%" scale once>
          <div
            id="core-values"
            className="core-values-section bg-[#f3f3f3]  my-[100] lg:pt-[50]"
          >
            <div className="core-value-section-content-wrapper  mx-[21] lg:mx-[24px] xl:mx-[120]">
              <Tag text="Our core values" className="my-[60]" />
              <div className="core-values-text-wrapper">
                <div className="section-header uppercase text-xl-semibold lg:text-4xl-semibold">
                  <span className="text-primary-default">The heart </span>of our
                  work
                </div>
                <div className="subtext text-sm-medium lg:text-md-medium my-[20] lg:w-[700]">
                  Our core values guide how we operate, shaping our decisions,
                  relationships, and the standard we deliver every day, ensuring
                  we remain consistent, trustworthy, and committed to excellence
                  across all our operations.
                </div>
              </div>
              <div className="core-value-core-content-wrapper lg:pb-[200] lg:pt-[80] overflow-visible">
                <CoreValuesCardsContainer cards={valueCards} />
              </div>
            </div>
          </div>
        </ScrollReveal>

       <ScrollReveal
               direction="up"
               duration={0.4}
               start="top 90%"
               scale
               once
               staggerChildren={0.1}
               onRevealNearlyComplete={onAchievementsReveal}
             >
               <MemoAchievementsSession
                 startTextAnimation={achievementsRevealNearlyComplete}
               />
             </ScrollReveal>

        {/* <div className="Team-members-section h-screen bg-[#f3f3f3]">
          <div className="team-member-section-main-content flex lg:flex-col lg:justify-center lg:items-center gap-40 lg:pt-[100]">
            <div className="details-section-upper flex lg:justify-center lg:gap-25 lg:mx-[200]">
              <div className="image-left relative lg:w-[30%] lg:h-[500]">
                <Image
                  src="/aboutAssets/TEAM-1.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="details-right lg:w-[50%]">
                <div className="team-member-name uppercase text-primary-default lg:text-3xl-semibold lg:mb-[20]">
                  samuel Okwabeng
                </div>
                <div className="text-description lg:text-lg-medium text-default-body">
                  Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA,
                  where he leads the company’s strategic vision and drives
                  operational excellence across all its services. With extensive
                  experience in procurement, supply chain management,
                  engineering, and business operations, Samuel has transformed
                  MASZ-AFRICA into a trusted partner for clients seeking
                  quality, efficiency, and innovation.His leadership blends
                  deep industry knowledge with a forward-thinking approach,
                  ensuring the company stays ahead in a competitive and dynamic
                  market. Under his guidance, MASZ-AFRICA has significantly
                  expanded its reach across Africa and internationally,
                  strengthened its service delivery, and earned a reputation for
                  integrity, reliability, and client satisfaction. 
                  continent.
                </div>
              </div>
            </div>
            <div className="indicator-section-lower flex items-center justify-center gap-6 w-[20%] h-auto bg-white p-[10] ">
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-1.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-2.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-3.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-4.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
              <div className="circular-indicators-with-image relative bg-surface-card-colored-primary lg:flex lg:items-center lg:justify-center lg:w-[50] lg:h-[50] rounded-full overflow-hidden">
                <Image
                  src="/aboutAssets/TEAM-5.jpg"
                  alt="Team-1"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div> */}

        <ScrollReveal direction="up" duration={0.4} start="top 85%" scale once>
          <TeamMembersSection />
        </ScrollReveal>

        <div
          className="gallery-container lg:py-[100]"
          style={{ contain: "layout style paint" }}
        >
          <GallerySection />
        </div>
      </div>
    </section>
  );
}

export default AboutUSPage;
