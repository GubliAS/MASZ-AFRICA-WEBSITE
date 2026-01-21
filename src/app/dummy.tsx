'use client'
import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceHero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { y: "-10%" },
        {
          y: "10%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="service-hero-section h-[600px] lg:h-screen"
    >
      <div className="image-container relative h-full overflow-hidden">
        
        {/* 🔥 Parallax wrapper */}
        <div ref={imageRef} className="absolute inset-0 scale-110">
          <Image
            src="/serviceAssets/Image-1-3.webp"
            alt="Grinding media"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/60 pointer-events-none" />

        <div className="text-container text-light absolute bottom-20 left-0 right-0 flex items-center justify-center flex-col">
          <div className="hero-tag text-md-medium uppercase border-2 rounded-full lg:p-[10]">
            Consumables
          </div>

          <div className="title uppercase lg:text-4xl-semibold">
            grinding media
          </div>
        </div>
      </div>
    </div>
  );
}
