"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceDetailsTemplate } from "@/app/Data/serviceDetails";
import Tag from "@/app/components/tag";
import Button from "./button";
import { MoveRight } from "lucide-react";
import gsap from "gsap";

interface Props {
  currentSlug: string;
}

export default function RelatedServicesCarousel({ currentSlug }: Props) {
  const services = [...serviceDetailsTemplate.filter((s) => s.slug !== currentSlug), ...serviceDetailsTemplate.filter((s) => s.slug !== currentSlug)];

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Responsive visible count
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setVisibleCount(1);
      else if (window.innerWidth < 1280) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, services.length - visibleCount);

  // Sync active dot to actual scroll position
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const card = track.children[0] as HTMLElement;
      if (!card) return;
      const cardWidth = card.offsetWidth + 20; // 20 = gap (lg:gap-[20px])
      const index = Math.round(track.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(index, maxIndex)));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [maxIndex]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setActiveIndex(clamped);
      const track = trackRef.current;
      if (!track) return;
      // Use the actual card offsetLeft inside the scrollable track
      const card = track.children[clamped] as HTMLElement;
      if (!card) return;
      gsap.to(track, {
        scrollLeft: card.offsetLeft,
        duration: 0.55,
        ease: "power3.inOut",
      });
    },
    [maxIndex]
  );

  const goTo = (i: number) => scrollToIndex(i);

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartScroll.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft =
      dragStartScroll.current - (e.clientX - dragStartX.current);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 50) scrollToIndex(activeIndex + (delta < 0 ? 1 : -1));
    else scrollToIndex(activeIndex);
  };

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    dragStartScroll.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 40) scrollToIndex(activeIndex + (delta < 0 ? 1 : -1));
    else scrollToIndex(activeIndex);
  };

  return (
    <section className="related-services-carousel py-[80px] lg:py-[120px]">
      <div className="mx-[24px] xl:mx-[120px]">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[40px] lg:mb-[71px] gap-4">
          <div>
            <Tag text="services" className="mb-[30px] lg:mb-[50px]" />
            <h2 className="text-2xl-semibold lg:text-4xl-semibold uppercase leading-tight text-default-heading">
              More <span className="text-primary-default">Products</span> And
              <br />
              <span className="text-primary-default">Services</span>
            </h2>
          </div>
          <p className="text-sm-medium md:text-md-medium mb-10 lg:text-xl-medium text-[#777777] lg:max-w-full lg:text-right leading-relaxed">
            Explore other products and services we are ready to offer
          </p>
        </div>

        {/* Outer clip — hides overflow without blocking scrollLeft */}
        <div className="overflow-hidden">
          {/* 
            Track: overflow-x-scroll so GSAP can animate scrollLeft freely,
            but scrollbar is hidden via [&::-webkit-scrollbar]:hidden.
            Cards use calc width so exactly visibleCount fit per page.
          */}
          <div
            ref={trackRef}
            className="flex gap-[16px] lg:gap-[32px] overflow-x-scroll
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                       cursor-grab active:cursor-grabbing select-none"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {services.map((service) => (
              <div
                key={service.slug}
                // Width: fill exactly 1/visibleCount of the track minus gaps
                className="flex-shrink-0 group relative overflow-hidden group
                           w-[calc(100%-0px)]
                           md:w-[calc(50%-10px)]
                           xl:w-[calc(33.333%-14px)]
                           h-[380px] lg:h-[469px]"
              >
                {/* Image */}
                <Image
                  src={service.heroImage}
                  alt={service.heroAltText}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  draggable={false}
                />

                {/* Bottom frosted text block */}
                <div className="absolute group-hover:opacity-100 opacity-0 transition-all duration-150 ease-in-out bottom-0 left-0 right-0 px-[26px] py-[31px] mx-[16px] lg:mx-[27px] mb-4
                                bg-white/10 backdrop-blur-[6px]">
                  <h3 className="text-white uppercase text-md-semibold lg:text-2xl-semibold leading-tight mb-4 lg:mb-[22px]">
                    {service.heroTitle}
                  </h3>
                  <p
                    className="text-white text-xs-medium lg:text-sm-medium leading-snug mb-[16px]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: service.description.one.replace(/<br\s*\/?>/gi, " "),
                    }}
                  />
                  <Link href={`/services/${service.slug}`} className="flex place-self-end">
                    <Button
                      label="Go to service"
                      variant="primaryWhite"
                      size="large"
                      iconClassName="lg:group-hover/btn:text-[#016BF2]! text-white!"

                      icon={
                        <MoveRight
                          className=""
                          size={20}
                        />
                      }
                      className="border-white! lg:hover:bg-white! group  bg-transparent!"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots — centered, no arrow buttons */}
        <div className="flex items-center justify-center gap-[8px] mt-[28px] lg:mt-[36px]">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-[8px] rounded-[4px] cursor-pointer transition-all duration-300 ${
                i === activeIndex
                  ? "w-[49px] bg-[#0160DA]"
                  : "w-[49px] bg-[#E6F0FE]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
