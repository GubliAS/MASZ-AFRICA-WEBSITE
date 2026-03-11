"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { serviceDetailsTemplate } from "@/app/Data/serviceDetails";
import Tag from "@/app/components/tag";
import Button from "./button";
import { MoveRight } from "lucide-react";

interface Props {
  currentSlug: string;
}

const SPEED = 0.6;
const GAP   = 32;

export default function RelatedServicesCarousel({ currentSlug }: Props) {
  const base = serviceDetailsTemplate.filter((s) => s.slug !== currentSlug);

  const trackRef       = useRef<HTMLDivElement>(null);
  const posRef         = useRef(0);
  const pausedRef      = useRef(false);
  const draggingRef    = useRef(false);
  const dragStartXRef  = useRef(0);
  const dragStartPos   = useRef(0);
  const velocityRef    = useRef(0);
  const lastDragX      = useRef(0);
  const halfRef        = useRef(0);
  const cardWidthRef   = useRef(0);
  const totalDotsRef   = useRef(base.length);

  const [dotIndex,  setDotIndex]  = useState(0);
  const [totalDots, setTotalDots] = useState(base.length);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const firstCard = track.children[0] as HTMLElement;
      if (!firstCard) return;
      const cw             = firstCard.offsetWidth + GAP;
      const containerWidth = track.parentElement!.offsetWidth; // ← visible width, not scroll width
      cardWidthRef.current = cw;
      halfRef.current      = cw * base.length;
      const visible        = Math.max(1, Math.floor(containerWidth / cw));
      const dots           = Math.max(1, base.length - visible + 1);
      totalDotsRef.current = dots;
      setTotalDots(dots);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [base.length]);

  useEffect(() => {
    const wrap = (v: number) => {
      const h = halfRef.current;
      if (h <= 0) return v;
      return ((v % h) + h) % h;
    };

    const applyPos = () => {
      const track = trackRef.current;
      if (!track) return;
      posRef.current = wrap(posRef.current);
      track.scrollLeft = posRef.current;
      const cw = cardWidthRef.current;
      const td = totalDotsRef.current;
      if (cw > 0 && td > 0) {
        setDotIndex(Math.floor(posRef.current / cw) % td);
      }
    };

    const tick = () => {
      if (draggingRef.current) {
        // drag handlers write posRef directly
      } else if (Math.abs(velocityRef.current) > 0.1) {
        posRef.current     += velocityRef.current;
        velocityRef.current *= 0.92;
        if (Math.abs(velocityRef.current) < 0.1) velocityRef.current = 0;
        applyPos();
      } else if (!pausedRef.current) {
        posRef.current += SPEED;
        applyPos();
      }
      requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const wrap = (v: number) => {
    const h = halfRef.current;
    if (h <= 0) return v;
    return ((v % h) + h) % h;
  };

  const applyPos = () => {
    const track = trackRef.current;
    if (!track) return;
    posRef.current = wrap(posRef.current);
    track.scrollLeft = posRef.current;
    const cw = cardWidthRef.current;
    const td = totalDotsRef.current;
    if (cw > 0 && td > 0) {
      setDotIndex(Math.floor(posRef.current / cw) % td);
    }
  };

  const syncPos = () => {
    const track = trackRef.current;
    if (!track) return;
    posRef.current = track.scrollLeft;
  };

  // ── Mouse ──
  const onMouseEnter = () => { pausedRef.current = true; };

  const onMouseLeave = () => {
    syncPos();
    draggingRef.current = false;
    pausedRef.current   = false;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current   = true;
    pausedRef.current     = true;
    velocityRef.current   = 0;
    dragStartXRef.current = e.clientX;
    dragStartPos.current  = posRef.current;
    lastDragX.current     = e.clientX;
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    velocityRef.current   = lastDragX.current - e.clientX;
    lastDragX.current     = e.clientX;
    posRef.current        = wrap(dragStartPos.current - (e.clientX - dragStartXRef.current));
    applyPos();
  };

  const onMouseUp = () => {
    if (!draggingRef.current) return;
    syncPos();
    draggingRef.current = false;
  };

  // ── Touch ──
  const onTouchStart = (e: React.TouchEvent) => {
    draggingRef.current   = true;
    pausedRef.current     = true;
    velocityRef.current   = 0;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartPos.current  = posRef.current;
    lastDragX.current     = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    velocityRef.current = lastDragX.current - e.touches[0].clientX;
    lastDragX.current   = e.touches[0].clientX;
    posRef.current      = wrap(dragStartPos.current - (e.touches[0].clientX - dragStartXRef.current));
    applyPos();
  };

  const onTouchEnd = () => {
    syncPos();
    draggingRef.current = false;
    pausedRef.current   = false;
  };

  const goTo = (i: number) => {
    velocityRef.current = 0;
    posRef.current      = i * cardWidthRef.current;
    applyPos();
  };

  return (
    <section className="related-services-carousel py-[80px] lg:py-[120px]">
      <div className="mx-[24px] xl:mx-[120px]">
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

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-[16px] lg:gap-[32px] overflow-x-scroll
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                       cursor-grab active:cursor-grabbing select-none"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {[...base, ...base].map((service, i) => (
              <div
                key={`${service.slug}-${i}`}
                className="flex-shrink-0 group relative overflow-hidden
                           w-[calc(100%-0px)]
                           md:w-[calc(50%-10px)]
                           xl:w-[calc(33.333%-14px)]
                           h-[380px] lg:h-[469px]"
              >
                <Image
                  src={service.heroImage}
                  alt={service.heroAltText}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  draggable={false}
                />
                <div className="absolute lg:group-hover:opacity-100 lg:opacity-0 transition-all duration-150 ease-in-out bottom-0 left-0 right-0 px-[26px] py-[31px] mx-[16px] lg:mx-[27px] mb-4
                                bg-white/10 backdrop-blur-[6px]">
                  <h3 className="text-white uppercase text-md-semibold lg:text-2xl-semibold leading-tight mb-4 lg:mb-[22px]">
                    {service.heroTitle}
                  </h3>
                  <p
                    className="text-white text-xs-medium lg:text-sm-medium leading-snug mb-[16px]"
                    style={{ display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    dangerouslySetInnerHTML={{ __html: service.description.one.replace(/<br\s*\/?>/gi, " ") }}
                  />
                  <Link href={`/services/${service.slug}`} className="flex place-self-end">
                    <Button
                      label="Go to service"
                      variant="primaryWhite"
                      size="large"
                      iconClassName="lg:group-hover/btn:text-[#016BF2]! lg:text-white!"
                      icon={<MoveRight size={20} />}
                      className="border-white! bg-white! lg:hover:bg-white! group lg:bg-transparent!"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-[8px] mt-[28px] lg:mt-[36px]">
          {Array.from({ length: totalDots }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-[8px] rounded-[4px] cursor-pointer transition-all duration-300 ${
                i === dotIndex ? "w-[49px] bg-[#0160DA]" : "w-[49px] bg-[#E6F0FE]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}