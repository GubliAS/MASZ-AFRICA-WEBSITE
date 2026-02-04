"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import CarouselCard from "./CarouselCard";

const images = [
  "/aboutAssets/Image-1.webp",
  "/aboutAssets/Image-2.webp",
  "/aboutAssets/Image-3.webp",
  "/aboutAssets/Image-4.webp",
  "/aboutAssets/Image-5.webp",
  "/aboutAssets/Image-6.webp",
  "/aboutAssets/Image-7.webp",
  "/aboutAssets/Image-8.webp",
  "/aboutAssets/Image-9.webp",
  "/aboutAssets/Image-10.webp",
];

export default function PerfectCarousel3D() {
  const ringRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const rotation = useRef(0);
  const paused = useRef(false);

  useLayoutEffect(() => {
    const radius = 520;
    const total = cardsRef.current.length;
    const angleStep = 360 / total;

    cardsRef.current.forEach((card, i) => {
      const angle = angleStep * i;
      gsap.set(card, {
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        transformOrigin: "50% 50%",
        backfaceVisibility: "visible",
        willChange: "transform",
      });
      card.onmouseenter = () => {
        paused.current = true;
        gsap.to(card, { scale: 1.2, duration: 0.35, ease: "power3.out" });
      };
      card.onmouseleave = () => {
        paused.current = false;
        gsap.to(card, { scale: 1, duration: 0.35, ease: "power3.out" });
      };
    });

    const tick = () => {
      if (!paused.current) rotation.current += 0.06;
      gsap.set(ringRef.current, { rotateY: rotation.current });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <main className="w-full h-screen flex items-center justify-center overflow-hidden relative -mt-16 lg:-mt-24">
      <div
        style={{
          position: "absolute",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12), transparent 60%)",
          filter: "blur(100px)",
        }}
      />
      <div
        style={{
          perspective: "2800px",
          width: "700px",
          height: "700px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={ringRef}
          style={{
            position: "relative",
            width: "0px",
            height: "0px",
            transformStyle: "preserve-3d",
          }}
        >
          {images.map((src, i) => (
            <CarouselCard
              key={i}
              src={src}
              ref={(el: HTMLDivElement | null) => {
                if (el) cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
