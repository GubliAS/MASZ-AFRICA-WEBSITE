"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
} from "react";
import gsap from "gsap";
import AnimationCopy from "../animations/WritingTextAnimation";
import AnimatedMetricCard from "../components/AnimatedMetricCard";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import Image from "next/image";
import LineByLineText from "../components/LineByLineText";
import Button from "../components/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

// Animation constants - now used by HeaderLineByLineAnimation component
const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.3;
const HEADER_DELAY = 0.1;
const CORE_VALUE_BODY_TEXT_DURATION = 0.1;
const CORE_VALUE_BODY_TEXT_STAGGER = 0.05;

// const CORE_VALUE_BODY_TEXT = (
//   <>
//     Our uniqueness comes from blending product authenticity with real technical
//     intelligence and dependable service delivery. Every item we supply is
//     verified, traceable, and backed by expert insight tailored to the realities
//     of mining environments. This combination allows us to offer solutions that
//     improve efficiency, reduce risk, and keep operations running without
//     interruption. But we don&apos;t just provide products—we provide peace of
//     mind. From precision-engineered consumables to end-to-end procurement
//     support, we anticipate your operational needs and deliver solutions that
//     empower your team to perform at their best. Our clients trust us not only
//     for the quality of our supplies but for our commitment to safety,
//     sustainability, and innovation, ensuring that every decision we make
//     enhances the value of your operations. With MASZ-Africa, you gain a partner
//     who is as invested in your success as you are, driving measurable results,
//     minimizing downtime, and unlocking new levels of operational excellence.
//   </>
// );

const CORE_VALUE_BODY_TEXT_1 = (
  <>
    Our uniqueness comes from blending product authenticity with real technical
    intelligence and dependable service delivery. Every item we supply is
    verified, traceable, and backed by expert insight tailored to the realities
    of mining environments. This combination allows us to offer solutions that
    improve efficiency, reduce risk, and keep operations running without
    interruption.
  </>
);

const CORE_VALUE_BODY_TEXT_2 = (
  <>
    We prioritize transparency, timely communication, and long-term client
    value. With each engagement, we reinforce our promise of reliability, giving
    mining companies the confidence that their supply partner fully understands
    their challenges.
  </>
);

interface CoreValueSessionProps {
  startTextAnimation?: boolean;
}

// PERFORMANCE: Memoize metrics array outside component
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
] as const;

function CoreValueSession({
  startTextAnimation = false,
}: CoreValueSessionProps) {
  // PERFORMANCE: Memoize metrics array reference
  const memoizedMetrics = useMemo(() => METRICS, []);

  const [lineByLineComplete, setLineByLineComplete] = useState(false);
  const [showAnimationCopy, setShowAnimationCopy] = useState(false);
  const [startBodyAnimation, setStartBodyAnimation] = useState(false);
  const [startMetricsAnimation, setStartMetricsAnimation] = useState(false);
  const [startContentPhase, setStartContentPhase] = useState(false);

  // PERFORMANCE: Memoize callbacks to prevent re-renders
  const handleEmptyShown = useCallback(() => {
    setStartContentPhase(true);
  }, []);

  const handleSequenceComplete = useCallback(() => {}, []);
  const sectionRef = useRef<HTMLElement>(null);
  const hasLeftSectionRef = useRef(false);
  const prevInViewRef = useRef(false);
  const hasScrolledDownFromTopRef = useRef(false);
  const hasReturnedToTopRef = useRef(false);
  const pendingCopyRef = useRef<{
    idleId: number;
    timeoutId: ReturnType<typeof setTimeout>;
  } | null>(null);
  const overlayRef1 = useRef<HTMLDivElement>(null);
  const overlayRef2 = useRef<HTMLDivElement>(null);

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
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const TOP_THRESHOLD = 150; // Consider "at top" if within 150px
    let wasAtTop = lastScrollY <= TOP_THRESHOLD;

    // PERFORMANCE: Throttle scroll handler to reduce work
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
      }, 16); // ~60fps max

      const currentScrollY = window.scrollY;
      const isAtTop = currentScrollY <= TOP_THRESHOLD;
      const isScrollingDown = currentScrollY > lastScrollY;
      const justLeftTop = wasAtTop && !isAtTop && isScrollingDown;

      // If user scrolled back to top, mark that they've returned
      if (
        isAtTop &&
        hasScrolledDownFromTopRef.current &&
        !hasReturnedToTopRef.current
      ) {
        hasReturnedToTopRef.current = true;
      }

      // Detect second scroll down from top: was at top, now scrolling down and leaving top
      if (justLeftTop && hasReturnedToTopRef.current && !showAnimationCopy) {
        clearPending();
        const runCopy = () => {
          clearPending();
          setShowAnimationCopy(true);
          // Smooth fade-in after state update — use GSAP for GPU-accelerated transition

          // requestAnimationFrame(() => {
          //   const overlay = overlayRef.current;
          //   if (overlay) {
          //     gsap.fromTo(
          //       overlay,
          //       { opacity: 0, force3D: true },
          //       { opacity: 1, duration: 0.5, ease: "power2.out", force3D: true }
          //     );
          //   }
          // });
          requestAnimationFrame(() => {
            const overlay1 = overlayRef1.current;
            const overlay2 = overlayRef2.current;
            if (overlay1) {
              gsap.fromTo(
                overlay1,
                { opacity: 0, force3D: true },
                { opacity: 1, duration: 0.5, ease: "power2.out", force3D: true }
              );
            }
            if (overlay2) {
              gsap.fromTo(
                overlay2,
                { opacity: 0, force3D: true },
                { opacity: 1, duration: 0.5, ease: "power2.out", force3D: true }
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
      { root: null, rootMargin: "50px", threshold: [0, 0.1, 0.5] }
    );
    io.observe(section);

    // Listen to scroll events to detect "scroll down from top"
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", handleScroll);
      clearPending();
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [showAnimationCopy]);

  return (
    <section ref={sectionRef} className="lg:my-[140] my-[80]">
      <div className="core-value-section-container">
        {/* Header - line-by-line first, then body animates */}
        <div className="section-header uppercase text-xl-semibold lg:mx-[24] xl:mx-[120] ml-[22] mt-[30] mb-[51] lg:text-4xl-semibold">
          <HeaderLineByLineAnimation
            startAnimation={startTextAnimation}
            onComplete={() => setStartBodyAnimation(true)}
            lineY={HEADER_LINE_Y}
            duration={HEADER_DURATION}
            stagger={HEADER_STAGGER}
            delay={HEADER_DELAY}
            style={{ overflow: "hidden" }}
          >
            what makes us{" "}
            <span className="text-primary-default">stand out</span>
          </HeaderLineByLineAnimation>
        </div>

        {/* Description: line-by-line; then static; then AnimationCopy overlay (spacer keeps layout, no jump) */}
       
          <div className="flex flex-col  lg:flex-row gap-5 lg:gap-[50px] xl:gap-[100px] mb-[60] lg:mx-[24] xl:mx-[120]  justify-between mx-[25px]">
            <LineByLineText
              duration={CORE_VALUE_BODY_TEXT_DURATION}
              stagger={CORE_VALUE_BODY_TEXT_STAGGER}
              startAnimation={startBodyAnimation}
              onComplete={() => {
                setLineByLineComplete(true);
                setStartMetricsAnimation(true);
              }}
              className="core-value-section-subtext w-full lg:w-1/2  text-lg-medium  lg:text-xl-medium lg:leading-8 lg:tracking-tight text-default-body"
            >
              {CORE_VALUE_BODY_TEXT_1}
            </LineByLineText>
            {/* -------------------------2------------------------- */}
            <LineByLineText
              duration={CORE_VALUE_BODY_TEXT_DURATION}
              stagger={CORE_VALUE_BODY_TEXT_STAGGER}
              startAnimation={startBodyAnimation}
              onComplete={() => {
                setLineByLineComplete(true);
                setStartMetricsAnimation(true);
              }}
              className="core-value-section-subtext w-full lg:w-1/2  text-lg-medium  lg:text-xl-medium lg:leading-8 lg:tracking-tight text-default-body"
            >
              {CORE_VALUE_BODY_TEXT_2}
            </LineByLineText>
          </div>
      
        <div className="lg:mx-[24] xl:mx-[120] bg-[#016BF2]">
          {/* Image above metrics */}
          <div className="relative h-[500px]  overflow-hidden   lg:h-[700px]">
            {/* overlay */}
            <div
              className="absolute justify-end left-0 right-0 bottom-[47px] px-[24px] lg:px-[36px] flex flex-row  items-center lg:flex-row gap-5  lg:gap-[50px] lg:items-center lg:justify-between z-10"
              aria-hidden="true"
            >
              <div className="bg-white/19 hidden md:flex backdrop-blur-xs px-6 w-full  lg:px-[43px] justify-center  flex-col gap-2.5  min-h-[152px]  text-light flex-1 rounded-[4px] ">
                <div className="bg-white w-fit rounded-[4px] text-default-heading text-sm-medium absolute top-0 -translate-y-1/2 py-2 px-4 ">
                  <span>Our Foundation</span>
                </div>
                <h3 className=" text-2xl-medium lg:text-3xl-medium">
                  Values That Shape Every Project
                </h3>
                <p className=" text-md-medium lg:text-lg-medium">
                  Our core values guide how we operate, shaping our decisions.
                </p>
              </div>
              <Link href="/aboutUs#core-values">
                <Button
                  label="Our core values"
                  variant="primaryWhite"
                  size="large"
                  icon={
                    <MoveRight
                      className="lg:group-hover:text-[#016BF2]"
                      size={20}
                    />
                  }
                  className="border-none "
                />
              </Link>
            </div>

            <Image
              src="/homeAssets/Image-15.webp"
              width={1920}
              height={1080}
              alt=""
              className="w-full h-full object-cover "
              data-scroll-reveal-item
            />
          </div>
          {/* Metrics: Phase 1 – empty card shells appear one after the other; Phase 2 – per card: text line-by-line then number (YouTube-style scroll) */}
          <div className="metrics-container    py-[32px] gap-4 flex flex-col mx-[21] lg:mx-[34] md:grid grid-cols-2 2xl:grid-cols-4">
            {memoizedMetrics.map((metric, index) => (
              <AnimatedMetricCard
                key={index}
                index={index}
                text={metric.text}
                value={metric.value}
                showAsEmpty={startMetricsAnimation}
                showContent={startContentPhase}
                onEmptyShown={handleEmptyShown}
                onSequenceComplete={handleSequenceComplete}
              />
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="core-value-section-images  flex flex-col gap-[20px] lg:flex">
          {/* Image 1 */}
          <div className="relative h-[300px] mx-[21px] overflow-hidden lg:hidden">
            <Image
              src="/homeAssets/Image-3.jpg"
              alt="Core value visual"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 0px"
              className="object-cover"
            />
          </div>

          {/* Image 2 & 3 */}
          <div className="flex gap-[20px] lg:gap-[40] mx-[21px] lg:mx-0">
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800] lg:hidden">
              <Image
                src="/homeAssets/Image-4.jpg"
                alt="Core value visual"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 0px"
                className="object-cover"
              />
            </div>
            <div className="relative h-[200px] flex-1 overflow-hidden lg:h-[800] lg:mx-0 lg:hidden">
              <Image
                src="/homeAssets/Image-5.jpg"
                alt="Core value visual"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 0px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// PERFORMANCE: Memoize component to prevent unnecessary re-renders
export default memo(CoreValueSession);
