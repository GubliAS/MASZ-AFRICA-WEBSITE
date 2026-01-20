"use client"; // If using Next.js 13 app directory

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BenefitSectionHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const titleLines = titleRef.current?.innerHTML.split(". ").map((line) => line + "."); // Split by sentence
    const subtextLines = subtextRef.current?.innerHTML.split(". ").map((line) => line + ".");

    // Replace content with spans for animation
    titleRef.current.innerHTML = titleLines
      .map((line) => `<span class="line-block opacity-0 block">${line}</span>`)
      .join("");
    subtextRef.current.innerHTML = subtextLines
      .map((line) => `<span class="line-block opacity-0 block">${line}</span>`)
      .join("");

    // GSAP animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", // when the top of the section hits 80% of viewport
      },
    });

    tl.to(titleRef.current.querySelectorAll(".line-block"), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: "power2.out",
    })
      .to(
        subtextRef.current.querySelectorAll(".line-block"),
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        },
        "+=0.2"
      );
  }, []);

  return (
    <div
      ref={sectionRef}
      className="beneit-section-hero bg-[#f3f3f3] w-full lg:h-[700px] relative overflow-hidden"
    >
      <Image
        src="/serviceAssets/Image-16.jpg"
        alt="Grinding media"
        fill
        priority
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="text-container text-light absolute bottom-20 left-0 right-0 flex flex-col items-start lg:mx-[200px]">
        <div
          ref={titleRef}
          className="title uppercase lg:text-4xl-semibold leading-13 translate-y-5"
        >
          Engineered for Efficiency and Profitability.
        </div>
        <div
          ref={subtextRef}
          className="subtext lg:text-lg-medium max-w-[500px] translate-y-5 mt-4"
        >
          Delivering reliable mining consumables and expert technical support to keep your operations running smoothly, reduce downtime, and maximize efficiency—helping your business save costs and boost profitability. Partner with us for innovative solutions and unwavering support that drive growth and success in every project.
        </div>
      </div>
    </div>
  );
}
