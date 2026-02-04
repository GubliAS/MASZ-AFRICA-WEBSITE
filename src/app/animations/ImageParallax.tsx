'use client';

import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import LineByLineText from '../components/LineByLineText';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection({
  imageSrc,
  imageAlt = 'Parallax image',
  title = '',
  subtitle = '',
  height = 'lg',
  startTextAnimation = false,
}) {
  const [titleComplete, setTitleComplete] = useState(false);
  const [showTextContainer, setShowTextContainer] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  // Show text container only after scroll reveal completes — prevents jump
  useEffect(() => {
    if (!startTextAnimation || showTextContainer) return;

    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Triple rAF + idle callback to ensure scroll reveal is fully complete and layout is settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const showText = () => {
              setShowTextContainer(true);
              // Smoothly reveal text container after state update
              requestAnimationFrame(() => {
                if (textRef.current) {
                  gsap.to(textRef.current, {
                    opacity: 1,
                    visibility: 'visible',
                    pointerEvents: 'auto',
                    duration: 0.4,
                    ease: 'power2.out',
                    force3D: true,
                  });
                }
              });
            };
          idleId = requestIdleCallback(showText, { timeout: 300 });
          timeoutId = setTimeout(showText, 300);
        });
      });
    });

    return () => {
      if (idleId !== null) cancelIdleCallback(idleId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [startTextAnimation, showTextContainer]);

  // Set initial states before paint to prevent layout shift — ensure image is ALWAYS visible
  useLayoutEffect(() => {
    if (!sectionRef.current || !mediaRef.current) return;
    
    // CRITICAL: Force image to always be visible — never let it be hidden
    gsap.set(mediaRef.current, { 
      y: 0, 
      scale: 1, 
      opacity: 1,
      visibility: 'visible',
      force3D: true 
    });
    
    // Ensure section itself is always visible
    gsap.set(sectionRef.current, { 
      opacity: 1,
      visibility: 'visible',
      force3D: true 
    });
    
    if (textRef.current) {
      // Hide text container initially — will be shown after scroll reveal
      gsap.set(textRef.current, { 
        y: 0, 
        opacity: 0, 
        visibility: 'hidden',
        pointerEvents: 'none',
        force3D: true 
      });
    }
  }, [title, subtitle]);

  // Ensure image stays visible after ScrollTrigger setup — prevents any conflicts
  useEffect(() => {
    if (!mediaRef.current || !sectionRef.current) return;
    
    // Small delay to ensure all animations are set up, then lock visibility
    const timeoutId = setTimeout(() => {
      if (mediaRef.current) {
        gsap.set(mediaRef.current, { opacity: 1, visibility: 'visible', force3D: true });
      }
      if (sectionRef.current) {
        gsap.set(sectionRef.current, { opacity: 1, visibility: 'visible', force3D: true });
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !mediaRef.current) return;
    const hasText = title || subtitle;
    const textEl = hasText ? textRef.current : null;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* ---------------- MOBILE ---------------- */
      mm.add('(max-width: 1023px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        tl.to(
          mediaRef.current,
          { y: '20%', scale: 1.05, ease: 'none', force3D: true },
          0
        );
        if (textEl) {
          tl.to(
            textEl,
            { y: '-10%', ease: 'none', force3D: true },
            0
          );
        }
      });

      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        tl.to(
          mediaRef.current,
          { y: '40%', scale: 1.12, ease: 'none', force3D: true },
          0
        );
        if (textEl) {
          tl.to(
            textEl,
            { y: '-20%', ease: 'none', force3D: true },
            0
          );
        }
      });
      
      // CRITICAL: After ScrollTrigger setup, ensure image stays visible
      requestAnimationFrame(() => {
        if (mediaRef.current) {
          gsap.set(mediaRef.current, { opacity: 1, visibility: 'visible', force3D: true });
        }
        if (sectionRef.current) {
          gsap.set(sectionRef.current, { opacity: 1, visibility: 'visible', force3D: true });
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [title, subtitle]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${
        height === 'lg'
          ? 'h-[520px] lg:h-[1100px]'
          : 'h-[420px] lg:h-[900px]'
      }`}
      style={{ 
        opacity: 1,
        visibility: 'visible',
        contain: 'layout style paint',
        isolation: 'isolate',
      }}
    >
      {/* MEDIA LAYER — always visible, never affected by parent animations */}
      <div
        ref={mediaRef}
        className="absolute top-[-6%] left-0 w-full h-[110%] lg:h-[120%]"
        style={{ 
          willChange: 'transform',
          opacity: 1,
          visibility: 'visible',
          contain: 'layout style paint',
          isolation: 'isolate',
          zIndex: 1,
          backgroundColor: '#0D0D0D',
        }}
        data-parallax-image="true"
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-top"
          style={{ 
            opacity: 1, 
            visibility: 'visible',
            pointerEvents: 'none',
          }}
          onLoad={() => {
            // Ensure image stays visible after load
            if (mediaRef.current) {
              gsap.set(mediaRef.current, { opacity: 1, visibility: 'visible', force3D: true });
            }
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 pointer-events-none" />
      </div>

      {/* TEXT LAYER — completely hidden until scroll reveal completes, then smoothly revealed */}
      {(title || subtitle) && (
        <div 
          ref={textRef} 
          className="relative z-10 h-full flex items-end" 
          style={{ 
            willChange: showTextContainer ? 'transform, opacity' : 'auto',
            contain: 'layout style paint',
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div className="max-w-[1200px] mx-auto px-6 pb-12 lg:pb-24" style={{ contain: 'layout style paint', opacity: showTextContainer ? 1 : 0 }}>
            {title && (
              <LineByLineText
                startAnimation={showTextContainer}
                onComplete={() => setTitleComplete(true)}
                className="text-light text-xl-semibold lg:text-6xl font-bold leading-tight"
                duration={0.6}
                stagger={0.12}
                delay={0.1}
                yFrom={28}
                as="h2"
              >
                {title}
              </LineByLineText>
            )}

            {subtitle && (
              <LineByLineText
                startAnimation={titleComplete && showTextContainer}
                className="mt-4 text-sm-regular lg:text-xl-regular text-light lg:w-[1000px]"
                duration={0.5}
                stagger={0.08}
                delay={0.2}
                yFrom={20}
                as="p"
              >
                {subtitle}
              </LineByLineText>
            )}
          </div>
        </div>
      )}
      {!title && !subtitle && <div ref={textRef} style={{ display: 'none' }} />}
    </section>
  );
}
