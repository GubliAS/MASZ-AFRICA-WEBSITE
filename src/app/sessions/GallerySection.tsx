'use client';

import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LineByLineText from '@/app/components/LineByLineText';

gsap.registerPlugin(ScrollTrigger);

const images = [
  '/aboutAssets/Image-1.webp',
  '/aboutAssets/Image-2.webp',
  '/aboutAssets/Image-3.webp',
  '/aboutAssets/Image-4.webp',
  '/aboutAssets/Image-5.webp',
  '/aboutAssets/Image-6.webp',
  '/aboutAssets/Image-7.webp',
  '/aboutAssets/Image-8.webp',
  '/aboutAssets/Image-9.webp',
  '/aboutAssets/Image-10.webp',
  '/aboutAssets/Image-11.webp',
  '/aboutAssets/Image-12.webp',
  '/aboutAssets/Image-13.webp',
  '/aboutAssets/Image-14.webp',
  '/aboutAssets/Image-8.webp',
  '/aboutAssets/Image-14.webp',
  '/aboutAssets/Image-3.webp',
  '/aboutAssets/Image-5.webp',
  '/aboutAssets/Image-6.webp',
  '/aboutAssets/Image-4.webp',
  '/aboutAssets/Image-3.webp',
  '/aboutAssets/Image-5.webp',
  '/aboutAssets/Image-6.webp',
  '/aboutAssets/Image-4.webp',
];

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [startTextAnimation, setStartTextAnimation] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimatedImages = useRef(false);

  // Split images into rows of 6
  const rows: string[][] = [];
  for (let i = 0; i < images.length; i += 6) {
    rows.push(images.slice(i, i + 6));
  }

  const handleHeaderComplete = () => {
    if (hasAnimatedImages.current) return;
    hasAnimatedImages.current = true;
    const refs = imageRefs.current.filter(Boolean);
    if (refs.length === 0) return;
    gsap.to(refs, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      force3D: true,
      overwrite: 'auto',
    });
  };

  useLayoutEffect(() => {
    const refs = imageRefs.current.filter(Boolean);
    gsap.set(refs, {
      opacity: 0,
      y: 56,
      scale: 0.88,
      force3D: true,
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => setStartTextAnimation(true),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16">
      {/* ===== Header with LineByLineText ===== */}
      <div className=" mx-[24] xl:mx-[120]  min-[1920px]:mx-[200]! overflow-hidden">
        <div className="mb-6 space-y-5">
          <div className="uppercase text-2xl lg:text-4xl font-semibold">
            <LineByLineText
              startAnimation={startTextAnimation}
              className="text-default-body"
              duration={0.55}
              stagger={0.1}
              delay={0.05}
              yFrom={24}
            >
              Take a walk through
            </LineByLineText>
            <LineByLineText
              startAnimation={startTextAnimation}
              className="text-primary-default block mt-1"
              duration={0.55}
              stagger={0.1}
              delay={0.2}
              yFrom={24}
            >
              Our company gallery
            </LineByLineText>
          </div>

          <LineByLineText
            startAnimation={startTextAnimation}
            onComplete={handleHeaderComplete}
            className="max-w-4xl text-default-body text-base lg:text-lg leading-relaxed"
            duration={0.45}
            stagger={0.06}
            delay={0.35}
            yFrom={18}
            as="p"
          >
            Take a walk through our company gallery, presenting the people and
            processes behind our success, reflecting our commitment to quality
            and integrity, reinforcing the standards we operate by and the
            impact we strive to create every day.
          </LineByLineText>
        </div>
      </div>

      {/* ===== Gallery - each image animates individually ===== */}
      <div className="mt-12 md:mx-[24] xl:mx-[120]  min-[1920px]:mx-[200]!   space-y-2 lg:space-y-4">
        {rows.map((rowImages, rowIndex) => {
          const isNormalRow = rowIndex % 2 === 0;
          const rowStartIdx = rowIndex * 6;

          return (
            <div
              key={rowIndex}
              className="flex  lg:flex-nowrap justify-center gap-2 lg:gap-4"
            >
              <ImageBlock
                images={rowImages.slice(0, 3)}
                reverse={!isNormalRow}
                startIndex={rowStartIdx}
                imageRefs={imageRefs}

              />
              <ImageBlock
                images={rowImages.slice(3, 6)}
                reverse={!isNormalRow}
                startIndex={rowStartIdx + 3}
                imageRefs={imageRefs}
              />
            </div>
          );
        })}
      </div>

      {/* ===== Bottom Fade Overlay ===== */}
      <div className="absolute bottom-16 left-0 w-full h-58 lg:h-64 bg-linear-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default GallerySection;

/* ============================= */
/* ===== Reusable Image Block === */
/* ============================= */

type BlockProps = {
  images: string[];
  reverse?: boolean;
  startIndex: number;
  imageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

const ImageBlock = ({ images, reverse, startIndex, imageRefs }: BlockProps) => {
  const renderImage = (src: string, tall: boolean, idx: number) => {
    const globalIdx = startIndex + idx;
    return (
      <div
        ref={(el) => { imageRefs.current[globalIdx] = el; }}
        className={`w-[120px]   md:w-full lg:w-full overflow-hidden cursor-pointer opacity-0 ${
          tall ? 'h-[400px] md:h-full lg:h-[520px]' : 'h-[200px] lg:h-[250px]'
        }`}
      >
        <Image
          src={src}
          alt="Gallery"
          width={340}
          height={520}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 300px, 340px"
        />
      </div>
    );
  };

  return (
    <div className={`flex gap-2 lg:gap-4 ${reverse ? 'flex-row-reverse' : ''}`}>
      {renderImage(images[0], true, 0)}
      <div className="flex flex-col justify-between gap-2 lg:gap-4">
        {renderImage(images[1], false, 1)}
        {renderImage(images[2], false, 2)}
      </div>
    </div>
  );
};
