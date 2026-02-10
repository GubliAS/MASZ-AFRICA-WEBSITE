'use client';
import React, { useEffect, useRef } from 'react';

interface AutoplayVideoProps {
  src: string;
  classname?: string;
}

function AutoplayVideo({ src, classname = '' }: AutoplayVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.classList.add('video-in-view');
        } else {
          document.body.classList.remove('video-in-view');
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      document.body.classList.remove('video-in-view');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-screen h-[300px] lg:h-screen bg-[#0d0d0d] overflow-hidden flex items-center justify-center ${classname}`}
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
