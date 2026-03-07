'use client';
import React, { useEffect, useRef } from 'react';

interface AutoplayVideoProps {
  src: string;
  classname?: string;
  /** If true, video takes full viewport width (w-screen). If false, respects parent width. Default: true */
  fullWidth?: boolean;
}

function AutoplayVideo({ src, classname = '', fullWidth = true }: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   const el = containerRef.current;
  //   if (!el || typeof window === 'undefined') return;

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         document.body.classList.add('video-in-view');
  //       } else {
  //         document.body.classList.remove('video-in-view');
  //       }
  //     },
  //     {
  //       threshold: 0.5,
  //     }
  //   );

  //   observer.observe(el);

  //   return () => {
  //     observer.disconnect();
  //     document.body.classList.remove('video-in-view');
  //   };
  // }, []);
  
//New useEffect with improved logic to prevent navbar hiding on initial load and ensure video is more centered in viewport before triggering class changes  
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;
  
    let observer: IntersectionObserver | null = null;
  
    // Delay observer setup to prevent hiding navbar on initial page load
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            document.body.classList.add('video-in-view');
          } else {
            document.body.classList.remove('video-in-view');
          }
        },
        {
          // Only trigger when video is significantly in viewport
          threshold: 0.6,
          // Shrink the detection zone so video needs to be more centered
          rootMargin: '-10% 0px -10% 0px',
        }
      );
  
      observer.observe(el);
    }, 500); // 500ms delay after page load
  
    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
      document.body.classList.remove('video-in-view');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-[300px] lg:max-h-[840px] lg:h-full bg-[#0d0d0d] overflow-hidden flex items-center justify-center ${
        fullWidth ? 'w-screen' : 'w-full'
      } ${classname}`}
    >
      <video
        src={src}
        autoPlay
        muted
        playsInline
        loop
        controls={false}
        preload="auto"
        className="h-full w-full object-contain"
      />
    </div>
  );
  
}

export default AutoplayVideo;
