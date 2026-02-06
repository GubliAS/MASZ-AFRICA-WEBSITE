'use client';

import React, { useEffect, useRef, useState } from 'react';
import Tag from '../components/tag';
import Image from 'next/image';

function TestimonialSession() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const offsetRef = useRef(0);

  const testimonialDetails = [
    {
      id: 1,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
    {
      id: 2,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
    {
      id: 3,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
    {
      id: 4,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
    {
      id: 5,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
    {
      id: 6,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
    {
      id: 7,
      logo: '/homeAssets/Logo-1.jpg',
      subtext:
        'MASZ-Africa has been one of the most reliable suppliers we’ve worked with. Every product we receive is authentic, traceable, and exactly as specified. Their on-time delivery record has helped us avoid unnecessary downtime, and their communication is always clear and professional.',
      picture: '/homeAssets/Picture-1.jpg',
      name: 'Samuel Okwabeng',
      position: "CEO, the Builders' Friend",
    },
  ];

  const scrollingItems = [...testimonialDetails, ...testimonialDetails];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationFrameId: number;
    const totalWidth = (scrollingItems.length / 2) * 304; // card width + gap

    const step = () => {
      if (!isPaused) {
        offsetRef.current += 0.5;
        if (offsetRef.current >= totalWidth) offsetRef.current = 0;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, scrollingItems.length]);

  return (
    <section className="h-screen bg-[#f3f3f3] py-24 mt-[100]  relative ">
      <div className="testimonial-session-main-container lg:mx-[200]">
        <div className="testimonial-session-content">
          <Tag text="testimonial" className="uppercase ml-5" />
          <div className="testimonial-session-header uppercase text-xl font-semibold my-6 leading-6 ml-5 lg:text-4xl-semibold lg:leading-15">
            Why our clients <br />
            <span className="text-primary-default">love to work with us</span>
          </div>

          <div className="testimonial-section-subtext text-md-medium font-medium text-default-body ml-5">
            Our clients choose us for our expert knowledge, <br /> clear
            communication, commitment to their <br /> businesses, ability to
            adapt, and our trustworthy <br /> approach.
          </div>

          <div className="scroll ">
            {/* Scroll container */}
            <div
              ref={containerRef}
              className="relative overflow-hidden w-full py-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                ref={trackRef}
                className="flex gap-6 mt-[50]"
                style={{ transition: 'transform 0s linear' }}
              >
                {scrollingItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-surface-card-primary border-default-card-stroke w-[280] lg:w-[320] p-5 flex-shrink-0"
                  >
                    <div className="relative w-10 h-10 mb-4 overflow-hidden">
                      <Image
                        src={item.logo}
                        alt=""
                        fill
                        className="object-cover"
                        quality={60}
                        sizes="40px"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm-medium text-default-body lg:my-[40]">
                      {item.subtext}
                    </p>
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-3 rounded-full overflow-hidden border border-gray-400">
                        <Image
                          src={item.picture}
                          alt=""
                          fill
                          className="object-cover"
                          quality={60}
                          sizes="40px"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="text-sm-bold text-default-body">
                          {item.name}
                        </div>
                        <div className="text-sm-regular text-default-body">
                          {item.position}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Left fade/vanishing point */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-[#f3f3f3] to-transparent" />
              {/* Right fade/vanishing point */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-[#f3f3f3] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSession;
