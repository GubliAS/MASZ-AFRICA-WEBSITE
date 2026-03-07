"use client";

import React, {
  useEffect,
  useRef,
  memo,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface Achievement {
  id: number;
  title: string;
}

export interface AchievementsTimelineProps {
  achievements: Achievement[];
  className?: string;
  /** Wait for parent reveal animation to finish before setting up ScrollTrigger.
   *  Pass the same flag that fires once the wrapping ScrollReveal is nearly complete. */
  ready?: boolean;
}

const AchievementCard = memo(function AchievementCard({
  achievement,
  isActive,
}: {
  achievement: Achievement;
  isActive: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 lg:gap-13 p-5 lg:px-10 lg:py-12.5 transition-colors duration-300 ${
        isActive
          ? "bg-[#016BF2] text-white"
          : "bg-white border border-[#C0DAFC] text-default-body"
      }`}
    >
      <div
        className={`shrink-0 rounded-full size-[50px] lg:size-[63px] flex items-center justify-center ${
          isActive ? "bg-white" : "bg-[#E6F0FE]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="30"
          viewBox="0 0 37 39"
          fill="none"
          className="lg:w-[37px] lg:h-[39px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.2695 31.7244C22.5456 31.8247 22.8523 31.7987 23.1074 31.6531L36.2519 24.1411C36.5852 23.9506 37 24.1913 37 24.5752V30.4947C37 30.6742 36.9039 30.8398 36.7481 30.9289L22.8125 38.8916C22.6849 38.9645 22.5317 38.9776 22.3936 38.9274L0.329141 30.9046C0.131541 30.8327 0 30.6449 0 30.4347V24.3396C0 23.9926 0.34479 23.7511 0.670883 23.8697L22.2695 31.7244ZM22.2695 21.446C22.5457 21.5464 22.8523 21.5205 23.1074 21.3747L36.2519 13.8628C36.5852 13.6723 37 13.913 37 14.2969V21.1197C37 21.2992 36.9039 21.4648 36.7481 21.5539L22.7178 29.5713C22.5902 29.6442 22.437 29.6573 22.2988 29.6071L0.329135 21.6184C0.131537 21.5466 0 21.3588 0 21.1485V14.0613C0 13.7143 0.34479 13.4728 0.670883 13.5914L22.2695 21.446ZM36.6709 8.05388C36.8685 8.12574 37 8.31353 37 8.52378V10.8414C37 21.1865 36.9039 11.1865 36.7481 11.2755L22.7178 19.293C22.5902 19.3659 22.437 19.379 22.2988 19.3288L0.329135 11.3401C0.131537 11.2683 0 11.0805 0 10.8702V8.46372C0 8.2843 0.0961375 8.11863 0.251918 8.02961L14.1875 0.0658867C14.3151 -0.00703658 14.4683 -0.0201227 14.6064 0.0301066L36.6709 8.05388Z"
            fill="#016BF2"
          />
        </svg>
      </div>
      <p
        className={`text-sm-medium lg:text-md-medium leading-relaxed ${
          isActive ? "text-white" : ""
        }`}
      >
        {achievement.title}
      </p>
    </div>
  );
});

function AchievementsTimeline({
  achievements,
  className = "",
  ready = false,
}: AchievementsTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const mobileLineContainerRef = useRef<HTMLDivElement>(null);
  const desktopLineContainerRef = useRef<HTMLDivElement>(null);
  const mobileCardsContainerRef = useRef<HTMLDivElement>(null);
  const desktopCardsContainerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const connectorsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileConnectorsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateLinePositions = useCallback(() => {
    // Mobile line positioning
    const mobileContainer = mobileCardsContainerRef.current;
    const mobileLineEl = mobileLineContainerRef.current;
    if (mobileContainer && mobileLineEl) {
      const cards = mobileContainer.querySelectorAll("[data-mobile-card]");
      if (cards.length >= 2) {
        const firstCard = cards[0] as HTMLElement;
        const lastCard = cards[cards.length - 1] as HTMLElement;
        const containerRect = mobileContainer.getBoundingClientRect();
        const firstCardRect = firstCard.getBoundingClientRect();
        const lastCardRect = lastCard.getBoundingClientRect();

        if (firstCardRect.height > 0 && lastCardRect.height > 0) {
          const firstCenter =
            firstCardRect.top - containerRect.top + firstCardRect.height / 2;
          const lastCenter =
            lastCardRect.top - containerRect.top + lastCardRect.height / 2;
          mobileLineEl.style.top = `${firstCenter}px`;
          mobileLineEl.style.height = `${lastCenter - firstCenter}px`;
        }
      }
    }

    // Desktop line positioning
    const desktopContainer = desktopCardsContainerRef.current;
    const desktopLineEl = desktopLineContainerRef.current;
    if (desktopContainer && desktopLineEl) {
      const cards = desktopContainer.querySelectorAll("[data-desktop-card]");
      if (cards.length >= 2) {
        const firstCard = cards[0] as HTMLElement;
        const lastCard = cards[cards.length - 1] as HTMLElement;
        const containerRect = desktopContainer.getBoundingClientRect();
        const firstCardRect = firstCard.getBoundingClientRect();
        const lastCardRect = lastCard.getBoundingClientRect();

        if (firstCardRect.height > 0 && lastCardRect.height > 0) {
          const firstCenter =
            firstCardRect.top - containerRect.top + firstCardRect.height / 2;
          const lastCenter =
            lastCardRect.top - containerRect.top + lastCardRect.height / 2;
          desktopLineEl.style.top = `${firstCenter}px`;
          desktopLineEl.style.height = `${lastCenter - firstCenter}px`;
        }
      }
    }
  }, []);

  // Main effect for line positioning
  useEffect(() => {
    if (!isMounted) return;

    let resizeObserver: ResizeObserver | null = null;
    let rafId: number;
    const timeouts: NodeJS.Timeout[] = [];

    const startTime = Date.now();
    const rafLoop = () => {
      updateLinePositions();
      if (Date.now() - startTime < 2000) {
        rafId = requestAnimationFrame(rafLoop);
      }
    };
    rafId = requestAnimationFrame(rafLoop);

    const setupResizeObserver = () => {
      resizeObserver = new ResizeObserver(() => {
        updateLinePositions();
      });

      const mobileCards =
        mobileCardsContainerRef.current?.querySelectorAll("[data-mobile-card]");
      const desktopCards =
        desktopCardsContainerRef.current?.querySelectorAll(
          "[data-desktop-card]"
        );

      mobileCards?.forEach((card) => resizeObserver?.observe(card));
      desktopCards?.forEach((card) => resizeObserver?.observe(card));

      if (mobileCardsContainerRef.current) {
        resizeObserver.observe(mobileCardsContainerRef.current);
      }
      if (desktopCardsContainerRef.current) {
        resizeObserver.observe(desktopCardsContainerRef.current);
      }
    };

    timeouts.push(setTimeout(setupResizeObserver, 50));

    window.addEventListener("resize", updateLinePositions);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        updateLinePositions();
        timeouts.push(setTimeout(updateLinePositions, 100));
      });
    }

    ScrollTrigger.addEventListener("refresh", updateLinePositions);

    const handleScroll = () => updateLinePositions();
    window.addEventListener("scroll", handleScroll, { passive: true });

    timeouts.push(setTimeout(updateLinePositions, 100));
    timeouts.push(setTimeout(updateLinePositions, 300));
    timeouts.push(setTimeout(updateLinePositions, 600));
    timeouts.push(setTimeout(updateLinePositions, 1000));
    timeouts.push(setTimeout(updateLinePositions, 2000));

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateLinePositions);
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.removeEventListener("refresh", updateLinePositions);
      timeouts.forEach(clearTimeout);
    };
  }, [isMounted, achievements, updateLinePositions]);

  useLayoutEffect(() => {
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center", force3D: true });
    }

    dotsRef.current.forEach((dot) => {
      if (dot) gsap.set(dot, { scale: 0, force3D: true });
    });
    cardsRef.current.forEach((card, index) => {
      if (card) {
        const isLeft = index % 2 === 0;
        gsap.set(card, { opacity: 0, x: isLeft ? -40 : 40, force3D: true });
      }
    });
    connectorsRef.current.forEach((connector, index) => {
      if (connector) {
        const isLeft = index % 2 === 0;
        gsap.set(connector, {
          scaleX: 0,
          transformOrigin: isLeft ? "left center" : "right center",
          force3D: true,
        });
      }
    });

    if (mobileLineRef.current) {
      gsap.set(mobileLineRef.current, { scaleY: 0, transformOrigin: "top center", force3D: true });
    }

    mobileDotsRef.current.forEach((dot) => {
      if (dot) gsap.set(dot, { scale: 0, force3D: true });
    });
    mobileCardsRef.current.forEach((card) => {
      if (card) gsap.set(card, { opacity: 0, x: 40, force3D: true });
    });
    mobileConnectorsRef.current.forEach((connector) => {
      if (connector) {
        gsap.set(connector, { scaleX: 0, transformOrigin: "left center", force3D: true });
      }
    });
  }, [achievements.length]);

  useEffect(() => {
    // Wait until the parent ScrollReveal animation has finished before setting up
    // ScrollTrigger — otherwise bounds are calculated while the section is still
    // transformed (opacity:0, y:120, scale:0.94) and everything is wrong.
    if (!ready) return;

    const container = containerRef.current;
    const line = lineRef.current;
    const mobileLine = mobileLineRef.current;

    if (!container || (!line && !mobileLine)) return;

    const totalItems = achievements.length;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 70%",
          end: "bottom 40%",
          scrub: 0.8,
          onUpdate: (self) => {
            const progress = self.progress;
            const newActiveIndex = Math.min(
              Math.floor(progress * totalItems),
              totalItems - 1
            );
            setActiveIndex(newActiveIndex);
          },
          onRefresh: () => {
            updateLinePositions();
          },
        },
      });

      if (line) tl.to(line, { scaleY: 1, duration: 1, ease: "none" }, 0);
      if (mobileLine) tl.to(mobileLine, { scaleY: 1, duration: 1, ease: "none" }, 0);

      achievements.forEach((_, index) => {
        const progress = totalItems > 1 ? (index / (totalItems - 1)) * 0.95 : 0;

        const dot = dotsRef.current[index];
        const card = cardsRef.current[index];
        const connector = connectorsRef.current[index];

        if (connector)
          tl.to(connector, { scaleX: 1, duration: 0.05, ease: "power2.out" }, progress);
        if (dot)
          tl.to(dot, { scale: 1, duration: 0.05, ease: "back.out(2)" }, progress + 0.03);
        if (card)
          tl.to(card, { opacity: 1, x: 0, duration: 0.1, ease: "power2.out" }, progress + 0.05);

        const mobileDot = mobileDotsRef.current[index];
        const mobileCard = mobileCardsRef.current[index];
        const mobileConnector = mobileConnectorsRef.current[index];

        if (mobileConnector)
          tl.to(mobileConnector, { scaleX: 1, duration: 0.05, ease: "power2.out" }, progress);
        if (mobileDot)
          tl.to(mobileDot, { scale: 1, duration: 0.05, ease: "back.out(2)" }, progress + 0.03);
        if (mobileCard)
          tl.to(mobileCard, { opacity: 1, x: 0, duration: 0.1, ease: "power2.out" }, progress + 0.05);
      });

    }, container);

    const t1 = setTimeout(() => {
      updateLinePositions();
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(t1);
      ctx.revert();
    };
  }, [achievements, updateLinePositions, ready]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* ==================== DESKTOP LAYOUT ==================== */}
      <div className="hidden lg:block relative">
        <div
          ref={desktopLineContainerRef}
          className="absolute left-1/2 -translate-x-1/2 w-[2px]"
        >
          <div className="absolute inset-0 bg-gray-200" />
          <div ref={lineRef} className="absolute inset-0 bg-[#016BF2]" />
        </div>

        <div ref={desktopCardsContainerRef} className="flex flex-col gap-[200px]">
          {achievements.map((achievement, index) => {
            const isLeft = index % 2 === 0;
            const isActive = index === activeIndex;

            return (
              <div
                key={achievement.id}
                data-desktop-card
                ref={(el) => { rowRefs.current[index] = el; }}
                className="relative grid grid-cols-2 gap-0"
              >
                {isLeft && (
                  <>
                    <div className="relative flex items-center">
                      <div
                        ref={(el) => { cardsRef.current[index] = el; }}
                        className="w-full mr-2.5 pr-[50px]"
                      >
                        <AchievementCard isActive={isActive} achievement={achievement} />
                      </div>
                      <div
                        ref={(el) => { connectorsRef.current[index] = el; }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[50px] h-[2px] bg-[#016BF2] origin-left"
                      />
                      <div
                        ref={(el) => { dotsRef.current[index] = el; }}
                        className="absolute right-[44px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#016BF2] rounded-full z-10"
                      />
                    </div>
                    <div className="relative" />
                  </>
                )}

                {!isLeft && (
                  <>
                    <div className="relative" />
                    <div className="relative flex items-center">
                      <div
                        ref={(el) => { connectorsRef.current[index] = el; }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[50px] h-[2px] bg-[#016BF2] origin-right"
                      />
                      <div
                        ref={(el) => { dotsRef.current[index] = el; }}
                        className="absolute left-[44px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#016BF2] rounded-full z-10"
                      />
                      <div
                        ref={(el) => { cardsRef.current[index] = el; }}
                        className="w-full ml-2.5 pl-[50px]"
                      >
                        <AchievementCard isActive={isActive} achievement={achievement} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== MOBILE/TABLET LAYOUT ==================== */}
      <div className="lg:hidden relative">
        <div
          ref={mobileLineContainerRef}
          className="absolute left-[14px] w-[2px]"
        >
          <div className="absolute inset-0 bg-gray-200" />
          <div ref={mobileLineRef} className="absolute inset-0 bg-[#016BF2]" />
        </div>

        <div ref={mobileCardsContainerRef} className="flex flex-col gap-[60px]">
          {achievements.map((achievement, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={achievement.id}
                data-mobile-card
                className="relative flex items-center pl-[50px]"
              >
                <div
                  ref={(el) => { mobileConnectorsRef.current[index] = el; }}
                  className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[30px] h-[2px] bg-[#016BF2] origin-left"
                />
                <div
                  ref={(el) => { mobileDotsRef.current[index] = el; }}
                  className="absolute left-[38px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#016BF2] rounded-full z-10"
                />
                <div
                  ref={(el) => { mobileCardsRef.current[index] = el; }}
                  className="w-full"
                >
                  <AchievementCard isActive={isActive} achievement={achievement} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(AchievementsTimeline);