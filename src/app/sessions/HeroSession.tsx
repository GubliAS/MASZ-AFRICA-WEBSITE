"use client";

import React from "react";
import Image from "next/image";
import Button from "../components/button";
import { MoveRight } from "lucide-react";
import LineByLineText from "../components/LineByLineText";
import AutoplayVideo from "../components/AutoplayVideo";

interface HeroSessionProps {
  /** When true, the hero subtext line-by-line animation starts (after scroll reveal is about to end). */
  startTextAnimation?: boolean;
}

function HeroSession({ startTextAnimation = false }: HeroSessionProps) {
  return (
    <div className="hero-session-container mt-[50]">
      <div className="relative">
        {/* Grid background behind logo and subtext */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="hero-message lg:flex lg:items-center lg:justify-between lg:mx-[24] xl:mx-[120] lg:my-[80] relative z-10">
          <div className="hero-logo mx-[24px] flex items-center justify-center mt-[40] lg:mt-0">
            <Image
              src="/maszAssets/logotype.svg"
              alt="masz-africa logotype"
              width={370}
              height={100}
              className="w-full h-auto lg:h-auto lg:w-[550]"
            />
          </div>

          {/* Hero subtext: line-by-line reveal after scroll reveal */}
          <div className="hero-section-logo-and-subtext lg:w-[40%]">
            <LineByLineText
            duration={0.4}
            stagger={0.08}
              startAnimation={startTextAnimation}
              className="text-sm-medium sm:text-md-medium md:text-lg-medium text-default-body mx-[24] mt-[30] lg:text-xl-medium tracking-tight"
            >
              Unleash reliable mining performance with MASZ-Africa, delivering
              certified consumables built for tough environments, supported by
              real engineering expertise and on-site technical service, so your
              operation stays efficient, productive, and continuously running.
            </LineByLineText>

            {/* Button now shows correctly */}
            <Button
              label="Explore our services"
              variant="primary"
              size="large"
              icon={
                <>
                  {/* Mobile / default arrow */}
                  <span className="lg:hidden">
                    <MoveRight size={16} strokeWidth={2} />
                  </span>

                  {/* Desktop / large screen thicker arrow */}
                  <span className="hidden lg:inline-block">
                    <MoveRight size={16} strokeWidth={3} width={50} />
                  </span>
                </>
              }
              className="ml-[22] my-[35]"
            />
          </div>
        </div>
      </div>

      {/* <div className="hero-image mt-[50]">
        <div className="hero-image-info h-[600] relative overflow-hidden z-0">
          <Image
            src="/homeAssets/image-6.jpg"
            alt="Hero Image"
            fill
            priority
            className="object-cover will-change-transform"
          />

          <div className="absolute inset-0 bg-surface-overlay z-10 opacity-50 lg:opacity-30" />

          <div className="hero-image-text-info absolute z-20 text-light font-bold lg:flex lg:items-center lg:justify-between lg:w-full  lg:top-[100] lg:text">
            <div className="hero-image-info-header flex items-center flex-col justify-center w-[430] lg:w-[790] ">
              <p className="uppercase text-xl-semibold text-center py-[20] lg:p-0 lg:text-4xl-semibold lg:text-left lg:w-[] lg:ml-[200] lg:leading-13 lg: lg:">
                Empowering the global mining industry through
              </p>
              <Image
                src="/homeAssets/arrow-icon.svg"
                alt=""
                width={24}
                height={24}
                className="h-auto lg:hidden"
              />
            </div>

            <div className="hero-image-info-subtext mx-[55] lg:mr-[200] flex items-center justify-center flex-col backdrop-blur-sm p-[25] my-[20] lg:my-0 electric-border lg:w-[650] lg:h-[400]">
              <div className="subtext-header uppercase text-xl-semibold my-[10] lg:text-4xl-semibold">
                innovation
              </div>
              <div className="subtext-itself font-medium text-sm-medium my-[10] lg:text-xl-regular lg:w-[500]">
                Our approach to innovation is practical, solving real problems
                mines face everyday. Whether it’s choosing the right media,
                improving equipment life, or refining a supply process, we bring
                ideas and technical insight that make your work smoother and
                more efficient.
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="hero-image mt-[50] lg:mb-[100]">
        <div className="relative w-full h-[600px] lg:h-screen overflow-hidden z-0">
          <Image
            src="/homeAssets/image-10.webp"
            alt="Hero Image"
            fill
            priority
            className="object-cover object-center"
          />

     
          <div className="absolute inset-0 bg-surface-overlay z-10 opacity-100 lg:opacity-30" />

   
          <div className="hero-image-text-info absolute inset-0 z-20 text-light font-bold lg:flex lg:items-center lg:justify-between lg:w-full lg:top-[100]">
            <div className="hero-image-info-header flex items-center flex-col justify-center w-[430] lg:w-[790]">
              <p className="uppercase text-xl-semibold text-center py-[20] lg:p-0 lg:text-4xl-semibold lg:text-left lg:ml-[200] lg:leading-13">
                Empowering the global mining industry through
              </p>
              <Image
                src="/homeAssets/arrow-icon.svg"
                alt=""
                width={24}
                height={24}
                className="h-auto lg:hidden"
              />
            </div>

            <div className="hero-image-info-subtext mx-[55] lg:mr-[200] flex items-center justify-center flex-col backdrop-blur-sm p-[25] my-[20] lg:my-0 electric-border lg:w-[650] lg:h-[400]">
              <div className="subtext-header uppercase text-xl-semibold my-[10] lg:text-4xl-semibold">
                innovation
              </div>
              <div className="subtext-itself font-medium text-sm-medium my-[10] lg:text-xl-regular lg:w-[500]">
                Our approach to innovation is practical, solving real problems
                mines face everyday. Whether it's choosing the right media,
                improving equipment life, or refining a supply process, we bring
                ideas and technical insight that make your work smoother and
                more efficient.
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Full viewport hero video */}
      <div className="hero-video-wrapper mx-[21px] lg:mx-[24] xl:mx-[120px]">
        <AutoplayVideo src="/videos/homePageVid.mp4" fullWidth={false} />
      </div>
    </div>
  );
}

export default HeroSession;
