"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/dist/SplitText";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
} from "@tabler/icons-react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const teamMembers = [
  {
    id: 1,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-1.jpg",
  },
  {
    id: 2,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-2.jpg",
  },
  {
    id: 3,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-3.jpg",
  },
  {
    id: 4,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-4.jpg",
  },
  {
    id: 5,
    name: "Samuel Okwabeng",
    position: "CEO of MASZ-Africa",
    description: `Samuel Okwabeng is the Chief Executive Officer of MASZ-AFRICA, where he leads the company’s strategic vision and drives operational excellence across all its services. With extensive experience in procurement, supply chain management, engineering, and business operations, Samuel has transformed MASZ-AFRICA into a trusted partner for clients seeking quality, efficiency, and innovation. His leadership blends deep industry knowledge with a forward-thinking approach, ensuring the company stays ahead in a competitive and dynamic market. Under his guidance, MASZ-AFRICA has significantly expanded its reach across Africa and internationally, strengthened its service delivery, and earned a reputation for integrity, reliability, and client satisfaction.`,
    image: "/aboutAssets/TEAM-5.jpg",
  },
];

export default function TeamMembersAnimated() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const activeMember = teamMembers[activeIndex];

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const positionRef = useRef<HTMLParagraphElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const splitRef = useRef<any>(null);

  const animateMember = (direction: number = 1) => {
    if (!imageRef.current || !descriptionRef.current) return;

    const isDesktop = window.innerWidth >= 1024; // Tailwind lg breakpoint

    if (isDesktop) {
      // Only use SplitText on desktop
      if (splitRef.current) splitRef.current.revert();
      splitRef.current = new SplitText(descriptionRef.current, {
        type: "lines",
      });
      const lines = splitRef.current.lines;

      // Make lines inline-block to prevent gaps
      lines.forEach((line: HTMLElement) => {
        line.style.display = "inline-block";
        line.style.width = "100%";
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        imageRef.current,
        { x: 140 * direction, opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, duration: 1 }
      );

      tl.fromTo(
        nameRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.6"
      );

      tl.fromTo(
        positionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.5"
      );

      tl.fromTo(
        socialsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.4"
      );

      tl.fromTo(
        lines,
        { y: 20, opacity: 0, filter: "blur(2px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.15 },
        "-=0.4"
      );
    } else {
      // Mobile: animate the whole paragraph as one block
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        imageRef.current,
        { x: 140 * direction, opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, duration: 1 }
      );

      tl.fromTo(
        nameRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.6"
      );

      tl.fromTo(
        positionRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.5"
      );

      tl.fromTo(
        socialsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.4"
      );

      tl.fromTo(
        descriptionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      );
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      onEnter: () => animateMember(activeIndex > prevIndex ? 1 : -1),
      onEnterBack: () => animateMember(activeIndex > prevIndex ? 1 : -1),
    });

    return () => st.kill();
  }, [activeIndex, prevIndex]);

  useEffect(() => {
    if (activeIndex === 0) return;
    animateMember(activeIndex > prevIndex ? 1 : -1);
  }, [activeIndex, prevIndex]);

  const handleIndicatorClick = (index: number) => {
    if (index === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(index);
  };

  return (
    <div
      ref={sectionRef}
      className="bg-[#f3f3f3] py-16 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="flex flex-col gap-10 w-full px-6 lg:px-[24px] xl:px-[120px] lg:gap-25">
        {/* Upper Section */}
        <div className="flex flex-col lg:flex-row justify-center  items-center gap-10">
          {/* Image */}
          <div className="relative w-full max-w-[390px] lg:max-w-[450px] h-[270px] lg:h-[470px] cursor-pointer flex-shrink-0">
            <div
              ref={imageRef}
              className="relative w-full h-full overflow-hidden rounded-xl shadow-lg transition-transform duration-500 ease-out hover:rotate-[3deg] hover:scale-[1.02]"
            >
              <Image
                src={activeMember.image}
                alt={activeMember.name}
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          {/* Details */}
          <div className="  flex flex-col  justify-center lg:justify-start lg:items-start items-center  lg:mt-0 lg:text-left">
            <h2
              ref={nameRef}
              className="uppercase text-blue-600 text-2xl-semibold  lg:text-3xl-semibold font-semibold mb-2 mx-[21] lg:mx-0"
            >
              {activeMember.name}
            </h2>

            <p
              ref={positionRef}
              className="text-md font-semibold text-gray-900 mb-6 uppercase mx-[21] lg:mx-0"
            >
              {activeMember.position}
            </p>

            {/* Social icons */}
            <div ref={socialsRef} className="footer-socials flex mb-6 items-center gap-4">
              {/* LinkedIn */}
              <Link href="/">
                <button className="cursor-pointer hover:border-[#016BF2] hover:border hover:bg-white hover:text-[#016BF2] transition-colors ease-in-out duration-150 bg-[#016BF2] rounded-full p-[8px] text-white">
                  <Linkedin size={20} fill="currentColor" strokeWidth={0} />
                </button>
              </Link>

              {/* Instagram */}
              <Link href="/">
                <button className="cursor-pointer hover:bg-white hover:text-[#016BF2] hover:border-[#016BF2] hover:border transition-colors ease-in-out duration-150 bg-[#016BF2] rounded-full p-[8px] text-white">
                  <IconBrandInstagram size={20} />
                </button>
              </Link>

              {/* Facebook */}
              <Link href="/">
                <button className="cursor-pointer hover:border-[#016BF2] hover:border hover:bg-white hover:text-[#016BF2] transition-colors ease-in-out duration-150 bg-[#016BF2] rounded-full p-[8px] text-white">
                  <IconBrandFacebook size={20} fill="currentColor" stroke={0} />
                </button>
              </Link>
            </div>
            <p
              ref={descriptionRef}
              className="text-gray-700 text-sm-regular  text-center lg:text-left mx-[5] lg:mx-0 lg:text-md-regular lg:leading-relaxed   lg:px-0 lg:max-w-[700px]"
            >
              {activeMember.description}
            </p>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex items-center justify-center gap-2 bg-white p-4 rounded-full shadow-sm w-fit mx-auto cursor-pointer">
          {teamMembers.map((member, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={member.id}
                onClick={() => handleIndicatorClick(index)}
                className={`relative rounded-full p-[3px] transition-all duration-300 hover:scale-105 cursor-pointer
                  ${
                    isActive
                      ? "ring-2 ring-blue-500"
                      : "ring-1 ring-transparent"
                  }
                `}
              >
                <div className="relative w-[30px] lg:w-[50] h-[30px] lg:h-[50] rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
