"use client";
import React, { useLayoutEffect, useEffect, useRef } from "react";
import { MoveRight } from "lucide-react";
import Button from "../components/button";
import Tag from "../components/tag";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Pure function: progress 0–1 through section, card index → scale (no React state) */
function getCardScale(progress: number, index: number): number {
  const cardsCount = 7;
  const cardProgress = progress * cardsCount;
  const cardPosition = cardProgress - index;
  const calculatedMinScale = 0.7 + index * 0.05;
  const minScale = Math.min(calculatedMinScale, 1.0);
  const maxScale = 1.0;
  if (cardPosition < 0) return maxScale;
  if (cardPosition >= 0 && cardPosition < 1)
    return maxScale - (maxScale - minScale) * cardPosition;
  return minScale;
}

interface CardData {
  id: number;
  slug: string;
  tag: string;
  number: string;
  title: string;
  description: string;
  image: string;
  category: string;
  href: string;
}

const cardsData: CardData[] = [
  {
    id: 1,
    slug: "grinding-media",
    tag: "product",
    number: "01",
    title: "Grinding media",
    description:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
    image: "/serviceAssets/Image-1-3.webp",
    category: "product",
    href: "/",
  },
  {
    id: 2,
    slug: "activated-carbon",
    tag: "service",
    number: "02",
    title: "ACTIVATED CARBON",
    description:
      "Advanced industrial solutions designed to optimize your operations. We provide cutting-edge technology and expert support to ensure maximum efficiency and minimal downtime in your production processes.",
    image: "/serviceAssets/Image-2-1.webp",
    category: "product",
    href: "/",
  },
  {
    id: 3,
    slug: "metal-and-steel-pipes",
    tag: "innovation",
    number: "03",
    title: "METAL AND STEEL PIPES",
    description:
      "Leverage the power of IoT and AI-driven insights to transform your manufacturing processes. Our smart solutions help you predict maintenance needs, optimize workflows, and reduce operational costs significantly.",
    image: "/serviceAssets/Image-4-1.webp",
    category: "product",
    href: "/",
  },
  {
    id: 4,
    slug: "gear-box-servicing-and-heavy-equipment-maintenance",
    tag: "technology",
    number: "04",
    title: "GEAR BOX SERVICING AND HEAVY EQUIPMENT MAINTENANCE",
    description:
      "State-of-the-art automation systems that streamline your production line. From robotics to control systems, we deliver comprehensive automation solutions tailored to your specific industry requirements.",
    image: "/serviceAssets/Image-6-1.webp",
    category: "services",
    href: "/",
  },
  {
    id: 5,
    slug: "crusher-seals-installation-and-equipment-protection",
    tag: "consulting",
    number: "05",
    title: "CRUSHER SEALS INSTALLATION AND EQUIPMENT PROTECTION",
    description:
      "Expert consulting services to help you navigate complex industrial challenges. Our team provides strategic insights and actionable plans to drive growth, improve efficiency, and maintain competitive advantage.",
    image: "/serviceAssets/Image-7-1.webp",
    category: "services",
    href: "/",
  },
  {
    id: 6,
    slug: "procurement-and-supply-chain-management",
    tag: "support",
    number: "06",
    title: "PROCUREMENT AND SUPPLY CHAIN MANAGEMENT",
    description:
      "24/7 technical support and maintenance services to keep your operations running smoothly. Our dedicated team ensures rapid response times and effective solutions to minimize disruptions.",
    image: "/serviceAssets/Image-8-1.webp",
    category: "services",
    href: "/",
  },
  {
    id: 7,
    slug: "technical-consultancy-and-field-support",
    tag: "training",
    number: "07",
    title: "TECHNICAL CONSULTANCY AND FIELD SUPPORT",
    description:
      "Comprehensive training programs designed to upskill your workforce. From basic operations to advanced techniques, we ensure your team stays ahead of industry standards.",
    image: "/serviceAssets/Image-9-1.webp",
    category: "services",
    href: "/",
  },
];

function ServicesCardsSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set initial scale in JSX so first paint is correct before any GSAP/ScrollTrigger runs
  useLayoutEffect(() => {
    if (window.innerWidth < 768) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    cards.forEach((el, i) => {
      if (el)
        gsap.set(el, {
          scale: getCardScale(0, i),
          transformOrigin: "top center",
          force3D: true,
        });
    });
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const section = sectionRef.current;
    if (!section) return;

    let st: ScrollTrigger | null = null;
    let refreshTid: ReturnType<typeof setTimeout>;
    const rafId = requestAnimationFrame(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;
      cards.forEach((el, i) =>
        gsap.set(el, {
          scale: getCardScale(0, i),
          transformOrigin: "top center",
          force3D: true,
        })
      );
      st = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          cardRefs.current.forEach((el, i) => {
            if (el)
              gsap.set(el, { scale: getCardScale(progress, i), force3D: true });
          });
        },
      });
      ScrollTrigger.refresh();
      // Recalc after layout/Lenis are fully ready (fixes first-load wrong positions)
      refreshTid = setTimeout(() => ScrollTrigger.refresh(), 150);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(refreshTid!);
      st?.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="md:bg-[#f3f3f3] py-20">
      {/* Ensure sticky top offset only applies at md+ */}
      <style>{`.sc-wrapper { top: 0 !important; } @media (min-width: 768px) { .sc-wrapper { top: var(--sc-top) !important; } }`}</style>
      {cardsData.map((card: CardData, index: number) => (
        <div
          key={card.id}
          className="sc-wrapper md:sticky md:h-screen flex justify-center items-center px-9  md:px-0 lg:px-[200px] mb-9 md:mb-0"
          style={{
            ["--sc-top" as string]: `${index * 15}px`,
            zIndex: index + 1,
          }}
        >
          <div
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="card-content w-[100%] md:w-[90%] mx-auto lg:mx-0 lg:w-[78%]  lg:h-[580px] cursor-pointer overflow-hidden shadow-2xl transition-transform duration-300 ease-out hover:scale-[1.02]"
            style={{
              transformOrigin: "top center",
              willChange: "transform",
              transform: `scale(${getCardScale(0, index)})`,
            }}
          >
            {/* ── MOBILE CARD (< md) — full-bleed image with overlay content ── */}
            <div
              className="md:hidden h-[500px] border border-[#D1D8E0] bg-white relative w-full overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Top row: tag + details */}
              <div className=" flex justify-between items-center  px-4 py-5">
                <Tag
                  className="py-[4.5px] px-2 rounded-[42px]"
                  text={card.category}
                />
                <Link
                  href={`/services/${card.slug}`}
                  className="text-[#8CA2C0] text-[10.4px] font-medium tracking-widest uppercase hover:underline"
                >
                  Details
                </Link>
              </div>
              <div className="relative w-full h-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="i w-full h-full  object-cover"
                />

{/* Blur layer with gradient mask — blends in from top, full blur at bottom */}
<div
  className="absolute inset-0 backdrop-blur-[4px] "

  style={{
    maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
  }}
/>

                {/* gradient darkens bottom for text legibility */}
                <div className="absolute inset-0 bg-black/20" />

              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-11 flex flex-col gap-6">
                <span className="text-white text-3xl-semibold mb-3 font-bold leading-none">
                  {card.number}
                </span>
                <h3 className="text-white text-xl-semibold  uppercase leading-snug">
                  {card.title}
                </h3>
                <p className="text-white text-[10.4px] font-medium leading-relaxed line-clamp-4">
                  {card.description}
                </p>
                <Link
                  href={`/services/${card.slug}`}
                  className="mt-2 inline-flex items-center gap-2 bg-[#016BF2] hover:bg-[#0057cc]
                             text-white text-[10.4px]   font-medium tracking-wide px-2.5 rounded-[56px] py-2.5 w-fit transition-colors"
                >
                  MORE ABOUT US <MoveRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            {/* ── DESKTOP CARD (md+) — original layout unchanged ── */}
            <div className="hidden md:block">
              {/* Upper Section */}
              <div className="upper-section flex justify-between items-center p-6 lg:p-8 bg-white">
                <div className="left-section">
                  <Tag text={card.category} />
                </div>
                <div className="right-section">
                  <Link
                    href={`/services/${card.slug}`}
                    className="text-sm lg:text-base font-medium hover:underline transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>

              {/* Lower Section with Image */}
              <div className="lower-section w-full h-[280px] sm:h-[360px] lg:h-[488px] relative">
                <div className="image-container relative w-full h-full overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex justify-between gap-4 items-center p-6 lg:p-12">
                    <div className="text-white text-3xl sm:text-5xl lg:text-8xl font-bold opacity-100">
                      {card.number}
                    </div>
                    <div className="text-container max-w-[600px] bg-white/10 backdrop-blur-lg border-2 border-white/40 p-3 sm:p-5 lg:p-8 shadow-xl">
                      <h3 className="text-base sm:text-xl lg:text-4xl font-semibold text-white uppercase mb-2 lg:mb-4">
                        {card.title}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-md-regular text-white/90 mb-3 lg:mb-6 leading-relaxed line-clamp-3 lg:line-clamp-none">
                        {card.description}
                      </p>
                      <Link href={`/services/${card.slug}`}>
                        <Button
                          label="Explore our services"
                          variant="primary"
                          size="large"
                          icon={
                            <>
                              <span className="lg:hidden">
                                <MoveRight size={16} strokeWidth={2} />
                              </span>
                              <span className="hidden lg:inline-block">
                                <MoveRight
                                  size={16}
                                  strokeWidth={3}
                                  width={50}
                                />
                              </span>
                            </>
                          }
                          className="mt-[25]"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Extra spacer to allow last card to complete stacking — tablet+ only */}
      <div className="hidden md:block h-screen"></div>
    </section>
  );
}

export default ServicesCardsSection;
