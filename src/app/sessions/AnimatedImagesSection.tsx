'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LineByLineText from '@/app/components/LineByLineText';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImageProps {
  src: string;
  alt: string;
  index: number;
  title: string;
  subtext: string[];
}

function GalleryImage({ src, alt, index, title, subtext }: GalleryImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    if (!imageRef.current || !imageInnerRef.current) return;

    const image = imageRef.current;
    const imageInner = imageInnerRef.current;

    // Initial state
    gsap.set(image, {
      opacity: 0,
      scale: 0.9,
      x: 50,
    });

    gsap.set(imageInner, {
      scale: 1.05,
    });

    // Reveal animation
    ScrollTrigger.create({
      trigger: image,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(image, {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1,
          delay: index * 0.1,
          ease: 'power3.out',
        });

        gsap.to(imageInner, {
          scale: 1,
          duration: 1.2,
          delay: index * 0.1,
          ease: 'power3.out',
        });
      },
    });
  }, [index]);

  // Portrait: width < height (e.g. 360×540)
  const IMAGE_WIDTH = 360;
  const IMAGE_HEIGHT = 540;

  const hoverTextContent = [title, ...subtext].join('\n');

  return (
    <div
      ref={imageRef}
      className="relative shrink-0 overflow-hidden group"
      style={{
        width: `${IMAGE_WIDTH}px`,
        minWidth: `${IMAGE_WIDTH}px`,
        height: `${IMAGE_HEIGHT}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={imageInnerRef}
        className="relative w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 360px, 720px"
          quality={95}
          priority={index < 3}
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        {/* Title and subtext overlay - line-by-line animation on hover */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-6 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
          <div className="text-white">
            {isHovered && (
              <LineByLineText
                key="hover-text"
                startAnimation={true}
                className="text-sm lg:text-base font-medium capitalize tracking-wide text-white whitespace-pre-line"
                duration={0.5}
                stagger={0.08}
                delay={0.05}
                yFrom={20}
                as="div"
              >
                {hoverTextContent}
              </LineByLineText>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnimatedImagesSection() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const IMAGE_WIDTH = 360;
  const IMAGE_HEIGHT = 540;
  const IMAGE_GAP = 16;

  const images = [
    {
      src: '/homeAssets/Image-1.jpg',
      title: 'High Performance',
      subtext: [
        'Delivering exceptional quality mining equipment',
        'that meets the highest industry standards.',
        'Built for durability and maximum efficiency',
        'in the most challenging environments.',
      ],
    },
    {
      src: '/homeAssets/Image-2.jpg',
      title: 'Reliable Solutions',
      subtext: [
        'Trusted by industry leaders worldwide',
        'for consistent performance and reliability.',
        'Our products ensure uninterrupted operations',
        'and optimal productivity.',
      ],
    },
    {
      src: '/homeAssets/Image-3.jpg',
      title: 'Expert Engineering',
      subtext: [
        'Designed by experienced engineers',
        'who understand mining challenges.',
        'Every product is tested and certified',
        'for safety and performance excellence.',
      ],
    },
    {
      src: '/homeAssets/Image-4.jpg',
      title: 'Quality Assurance',
      subtext: [
        'Rigorous quality control processes',
        'ensure every product meets specifications.',
        'We maintain the highest standards',
        'from manufacturing to delivery.',
      ],
    },
    {
      src: '/homeAssets/Image-5.jpg',
      title: 'Innovation Driven',
      subtext: [
        'Cutting-edge technology solutions',
        'for modern mining operations.',
        'Continuous innovation to stay ahead',
        'of industry demands and challenges.',
      ],
    },
    {
      src: '/homeAssets/Image-6.jpg',
      title: 'Global Reach',
      subtext: [
        'Serving clients across continents',
        'with reliable supply chain networks.',
        'Local expertise with global standards',
        'for seamless operations worldwide.',
      ],
    },
    {
      src: '/homeAssets/Image-7.webp',
      title: 'Technical Excellence',
      subtext: [
        'Advanced technical support services',
        'to maximize your equipment performance.',
        'Expert guidance and on-site assistance',
        'whenever you need it.',
      ],
    },
    {
      src: '/homeAssets/Image-8.webp',
      title: 'Sustainable Operations',
      subtext: [
        'Environmentally conscious solutions',
        'for responsible mining practices.',
        'Efficient processes that reduce waste',
        'and minimize environmental impact.',
      ],
    },
    {
      src: '/homeAssets/Image-9.webp',
      title: 'Customer Focused',
      subtext: [
        'Dedicated to your success',
        'with personalized service and support.',
        'Building long-term partnerships',
        'based on trust and reliability.',
      ],
    },
    {
      src: '/homeAssets/Image-10.webp',
      title: 'Proven Results',
      subtext: [
        'Track record of successful projects',
        'and satisfied clients worldwide.',
        'Measurable improvements in efficiency',
        'and operational excellence.',
      ],
    },
  ];

  // Duplicate images for seamless infinite loop (like testimonial section)
  const scrollingItems = [...images, ...images];

  // ScrollTrigger for direction – we read .direction each frame so it stays in sync with Lenis
  useGSAP(() => {
    if (!sectionRef.current) return;

    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
    });

    return () => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, []);

  // Continuous horizontal scroll - direction changes based on vertical scroll
  useEffect(() => {
    let animationFrameId: number;

    const step = () => {
      if (!isPaused) {
        const direction = scrollTriggerRef.current?.direction ?? 1;

        setOffset((prev) => {
          const totalWidth = (scrollingItems.length / 2) * (IMAGE_WIDTH + IMAGE_GAP);
          const scrollSpeed = 0.5;
          const directionMultiplier = direction === 1 ? -1 : 1;
          const newOffset = prev + (scrollSpeed * directionMultiplier);
          if (newOffset >= totalWidth) return 0;
          if (newOffset < 0) return totalWidth;
          return newOffset;
        });
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, scrollingItems.length, IMAGE_WIDTH, IMAGE_GAP]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#f3f3f3] py-32 lg:py-40 overflow-hidden"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '144px 144px',
        }}
      />
      <div className="relative w-full">
        {/* Horizontal Scrolling Gallery – portrait images (height > width) */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={galleryRef}
            className="relative"
            style={{ height: '650px' }}
          >
            <div
              ref={scrollContainerRef}
              className="relative overflow-hidden w-full py-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="flex gap-4"
                style={{
                  transform: `translateX(-${offset}px)`,
                  transition: 'transform 0s linear',
                  willChange: 'transform',
                }}
              >
                {scrollingItems.map((imageData, index) => {
                  const imageIndex = index % images.length;
                  const image = images[imageIndex];
                  return (
                    <GalleryImage
                      key={index}
                      src={image.src}
                      alt={`Gallery image ${imageIndex + 1}`}
                      index={imageIndex}
                      title={image.title}
                      subtext={image.subtext}
                    />
                  );
                })}
              </div>

              {/* Left fade/vanishing point */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-[#f3f3f3] to-transparent z-20" />
              {/* Right fade/vanishing point */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-[#f3f3f3] to-transparent z-20" />
            </div>

          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[20%] left-[5%] w-2 h-2 bg-primary-default rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-[20%] right-[5%] w-3 h-3 bg-primary-default rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </section>
  );
}
