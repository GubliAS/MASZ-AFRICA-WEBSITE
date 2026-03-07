"use client";

import React from "react";
import Tag from "@/app/components/tag";
import Image from "next/image";
import AnimationCopy from "@/app/animations/WritingTextAnimation";
import { Square3Stack3DIcon } from "@heroicons/react/16/solid";
import ScrollReveal from "@/app/components/ScrollReveal";
import type { serviceDetails } from "@/app/Data/serviceDetails";
import LineByLineText from "@/app/components/LineByLineText";
import RelatedServicesCarousel from "@/app/components/RelatedServicesCarousel";

export default function ServiceDetailContent({
  service,
}: {
  service: serviceDetails;
}) {
  return (
    <section className="">
      <div className="main-section-content-container">
        <ScrollReveal
          className="mx-[24] xl:mx-[120] py-[60] lg:py-[100]"
          direction="up"
          duration={0.75}
          start="top 60%"
          scale
          staggerChildren={0.1}
        >
          <div className="service-hero-section ">
            {/* tag */}
            <div>
              <Tag
                text="products and services"
                className="mb-[20] lg:mb-[56]"
              />
            </div>
            {/* text */}
            <div>
              <LineByLineText
                startAnimation={true}
                delay={0.5}
                duration={0.4}
                stagger={0.05}
                className="description text-default-heading leading-tight text-2xl-semibold lg:text-4xl-semibold"
              >
                CONSUMABLES THAT KEEP YOUR MINE
                <br />
                MOVING{" "}
                <span className="text-primary-default">WITHOUT COMPROMISE</span>
              </LineByLineText>
            </div>
            {/* Image */}
            <div className="image-container relative h-[600] mt-[85px] lg:h-[850] overflow-hidden ">
              <Image
                src={service.heroImage}
                alt={service.heroAltText}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 pointer-events-none" />
              <div className="text-container text-light absolute bottom-20 left-0 right-0 flex items-center justify-center flex-col">
                <div className="hero-tag text-md-medium uppercase border-2 rounded-full lg:p-[10]">
                  {service.heroTag}
                </div>
                <div className="title uppercase lg:text-4xl-semibold">
                  {service.heroTitle}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-[13.4px] leading-[140%] text-[#777777] mx-2 mt-4.5 ">
              <span>Concept 1.0</span>
              <span>Brand Identity Animation</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          duration={0.75}
          start="top 85%"
          scale
          staggerChildren={0.1}
        >
          <div className="description lg:h-screen">
            <div className="description-content mx-[21] lg:mx-[24] xl:mx-[120] my-[100] lg:my-[150]">
              <Tag text="details" className="mb-[40] lg:mb-[50]" />
              <div className=" lg:flex gap-[50] xl:gap-[100] text-default-body">
                <AnimationCopy>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.description.one || "",
                    }}
                    className="description text-md-medium lg:text-xl-medium text-default-body lg:leading-8 lg:tracking-tight"
                  />
                </AnimationCopy>
                <AnimationCopy>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: service.description.two || "",
                    }}
                    className="description text-md-medium lg:text-xl-medium text-default-body lg:leading-8 lg:tracking-tight"
                  />
                </AnimationCopy>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          duration={0.75}
          start="top 85%"
          scale
          staggerChildren={0.1}
        >
          <div className="benefit-section-hero bg-[#f3f3f3] w-full lg:h-[700]">
            <div className="image-container relative w-full lg:h-full overflow-hidden">
              <Image
                src={service.benefitsImage}
                alt={service.benefitsAltText}
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              <div className="text-container text-light absolute bottom-70 left-0 right-0 flex ">
                <div className="title uppercase  lg:text-4xl-semibold lg:w-[650] lg:mx-[24] xl:mx-[120] leading-13">
                  {service.benefitsTitle}
                </div>
                <div className="subtext lg:text-lg-medium lg:max-w-[500]">
                  {service.benefitsSubtitle}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          duration={0.75}
          start="top 70%"
          scale
          staggerChildren={0.1}
          className="py-[80] bg-[#f3f3f3]  px-[24]"
        >
          <div className=" lg:hidden lg:mx-[24]   xl:mx-[120]">
            <Tag className="mb-[50]" text="benefits" />
            <LineByLineText
              startAnimation={true}
              delay={0.5}
              duration={0.4}
              stagger={0.05}
              className="description text-default-heading leading-tight text-2xl-semibold lg:text-4xl-semibold"
            >
              ENGINEERED FOR{" "}
              <span className="text-primary-default">EFFICIENCY</span>{" "}
              AND{" "}<br />
              <span className="text-primary-default">PROFITABILITY</span>
            </LineByLineText>
          </div>
          <div className="benefits flex justify-center lg:justify-start  py-[60]">
            <div className="benefits-main-content flex">
              <div className="left-side    xl:mx-[120]">
                <div className="benefits-list grid grid-cols-1 md:grid-cols-2 lg:flex items-center justify-center lg:flex-start gap-6 lg:flex-wrap">
                  {service.benefits.map((item, index) => (
                    <div
                      key={item.id}
                      className="item-list group  relative overflow-hidden bg-white flex flex-col 
                    max-w-[400px] lg:h-[350px] items-center justify-center 
                    lg:gap-10 px-[30px] py-[40px] cursor-pointer"
                    >
                      <span className="liquid-bg absolute inset-0 -z-0" />
                      <div className="item-icon relative z-10 bg-surface-card-colored-secondary rounded-full p-[10px] transition-colors duration-500 group-hover:bg-white">
                        <Square3Stack3DIcon className="h-8  lg:w-auto text-primary-default transition-colors duration-500 group-hover:text-blue-600" />
                      </div>
                      <div className="mt-2 item-text relative z-10 text-center flex flex-col items-center justify-center transition-colors duration-500 group-hover:text-white">
                        <div className="title capitalize lg:text-xl-medium">
                          {item.title}
                        </div>
                        <div className="subtext lg:mt-[20px] lg:text-md-regular">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Related services carousel */}
        <ScrollReveal direction="up" duration={0.6} start="top 85%" scale once>
          <RelatedServicesCarousel currentSlug={service.slug} />
        </ScrollReveal>
      </div>
    </section>
  );
}
