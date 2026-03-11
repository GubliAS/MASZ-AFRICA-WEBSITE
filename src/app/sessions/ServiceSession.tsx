"use client";

import React, { useState, useMemo, memo } from "react";
import Tag from "../components/tag";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import Button from "../components/button";
import HeaderLineByLineAnimation from "../animations/HeaderLineByLineAnimation";
import AnimatedListContainer from "../animations/AnimatedListContainer";
import LineByLineText from "../components/LineByLineText";

const HEADER_LINE_Y = 28;
const HEADER_STAGGER = 0.07;
const HEADER_DURATION = 0.3;
const HEADER_DELAY = 0.1;
const LIST_TITLE_STAGGER = 0.08;

interface ServiceSessionProps {
  /** When true, header line-by-line runs; on complete, list appears and list titles animate. */
  startTextAnimation?: boolean;
}

// PERFORMANCE: Memoize service list outside component
const serviceList = [
  {
    id: 1,
    title: "Grinding media",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
  },
  {
    id: 2,
    title: "Activated Carbon",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
  },
  {
    id: 3,
    title: "Metal and steel Pipes",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
  },
  {
    id: 4,
    title: "Gear Box servicing and Heavy Machine Maintenance",
    subtext:
      "We offer complete gearbox diagnostics, repairs, and component replacements using OEM parts and experienced technicians. Our work helps restore equipment reliability and prevent costly downtime across crushers, mills, and conveyors.",
  },
] as const;

function ServiceSession({ startTextAnimation = false }: ServiceSessionProps) {
  const [startListAnimation, setStartListAnimation] = useState(false);

  // PERFORMANCE: Memoize service list reference
  const memoizedServiceList = useMemo(() => serviceList, []);

  return (
    <section className="xl:mx-[120] min-[1920px]:mx-[200]! mx-[24] bg-white relative z-10">
      <div className="services-section-container my-[100]">
        <Tag text="services" className="ml-[22] lg:ml-[0]" />

        <div className="services-section-header flex items-center justify-between text-xl-semibold uppercase  my-[30] lg:mt-[37] lg:mb-[98] lg:text-4xl-semibold">
          <HeaderLineByLineAnimation
            startAnimation={startTextAnimation}
            onComplete={() => setStartListAnimation(true)}
            lineY={HEADER_LINE_Y}
            duration={HEADER_DURATION}
            stagger={HEADER_STAGGER}
            delay={HEADER_DELAY}
            style={{ overflow: "hidden" }}
          >
            Explore our <span className="text-primary-default">products</span>{" "}
            <span>and</span>{" "}
            <span className="text-primary-default">services</span>
          </HeaderLineByLineAnimation>

          {/* CTA button — always expanded (label always visible) */}
          <Link href="/services" className=" hidden md:block shrink-0 ml-8 mr-[24]">
            <Button
              label="ALL PRODUCTS & SERVICES"
              variant="primaryWhite"
              iconClassName="text-primary-default group-hover/btn:text-white! "
              size="large"
              className="hover:bg-[#0160DA]! hover:text-white! border-primary-default! bg-transparent!"
              alwaysExpanded
              icon={<MoveRight size={20} />}
            />
          </Link>
        </div>

        <AnimatedListContainer
          startAnimation={startListAnimation}
          className="services-session-product-list-container my-[60]"
        >
          <ul>
            {memoizedServiceList.map((list, index) => (
              <li
                key={list.id}
                tabIndex={0} // allows focus for :focus-within
                className="relative mx-[22px]  flex cursor-pointer border-b border-gray-300 outline-none service-item"
              >
                {/* Number */}
                <p className="pr-[80px] py-[20px] text-lg-semibold lg:text-2xl-semibold text-gray-700 flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] transform-gpu origin-center service-number">
                  {list.id}
                </p>

                <div className="flex-1 relative">
                  {/* Title - line-by-line animation with stagger per item */}
                  <div className="uppercase pr-[20px] py-[20px] text-lg-semibold lg:text-3xl-semibold text-[#626262] transition-colors duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] service-title">
                    <LineByLineText
                      startAnimation={startListAnimation}
                      delay={index * LIST_TITLE_STAGGER}
                      duration={0.5}
                      stagger={0.08}
                      yFrom={20}
                      as="div"
                    >
                      {list.title}
                    </LineByLineText>
                  </div>

                  {/* Expandable Content */}
                  <div className="overflow-hidden max-h-0 opacity-0 translate-y-2 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] service-subtext-container">
                    <div className="list-subtext text-sm-medium pr-[20px] lg:pb-[50] lg:text-xl-medium lg:w-[800] lg:leading-7 lg:tracking-tight">
                      {list.subtext}
                    </div>

                    {/* Mobile "Learn More" link */}
                    <div className="lg:hidden flex items-center bg-white my-[20px] pr-[20px] lg:my-[40]">
                      <Link
                        href="/"
                        className="uppercase text-sm-medium text-primary-default transition-colors duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                      >
                        Learn More
                      </Link>

                      <MoveRight className="ml-2 text-blue-600 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]" />
                    </div>
                  </div>
                </div>

                {/* Desktop Button */}
                <Button
                  label="learn more"
                  variant="primary"
                  size="large"
                  icon={
                    <>
                      <span className="lg:hidden">
                        <MoveRight size={16} strokeWidth={2} />
                      </span>
                      <span className="hidden lg:inline-block">
                        <MoveRight size={16} strokeWidth={3} />
                      </span>
                    </>
                  }
                  className="hidden lg:flex absolute right-0 inset-y-0 my-auto service-button"
                />
              </li>
            ))}
          </ul>

          <Button
            label="Explore our services"
            variant="primary"
            size="large"
            icon={<MoveRight size={16} />}
            className="ml-[22] my-[35] lg:my-[100]"
          />
        </AnimatedListContainer>
      </div>
    </section>
  );
}

// PERFORMANCE: Memoize component to prevent unnecessary re-renders
export default memo(ServiceSession);
