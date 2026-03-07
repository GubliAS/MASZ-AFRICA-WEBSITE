'use client';

import React, { useRef, useEffect, useLayoutEffect, useState, ReactNode } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import LineByLineText from '../components/LineByLineText';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxAnimationProps {
  /** Image source for parallax effect */
  imageSrc: string;
  /** Alt text for image */
  imageAlt?: string;
  /** Optional title text */
  title?: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Section height: 'lg' (520px/1100px) or 'sm' (420px/900px) */
  height?: 'lg' | 'sm' | 'fullscreen';
  /** When true, text animation starts */
  startTextAnimation?: boolean;
  /** Mobile parallax Y offset (default: '20%') */
  mobileY?: string;
  /** Desktop parallax Y offset (default: '40%') */
  desktopY?: string;
  /** Mobile scale (default: 1.05) */
  mobileScale?: number;
  /** Desktop scale (default: 1.12) */
  desktopScale?: number;
  /** Mobile text Y offset (default: '-10%') */
  mobileTextY?: string;
  /** Desktop text Y offset (default: '-20%') */
  desktopTextY?: string;
  /** Scrub value for ScrollTrigger (default: 1.2) */
  scrub?: number;
  /** Custom className */
  className?: string;
  /** Custom children to render instead of title/subtitle */
  children?: ReactNode;
  /** Image overlay opacity (default: true) */
  showOverlay?: boolean;
  /** Overlay gradient classes */
  overlayClassName?: string;
}

/**
 * Unified Parallax Animation Component
 * 
 * Replaces: ImageParallax, HeroTryParallax, ServicesHeroParallax
 * 
 * Features:
 * - Scroll-triggered parallax effect for images
 * - Optional text animations with LineByLineText
 * - Responsive mobile/desktop parallax values
 * - Configurable heights and animation parameters
 */
export default function ParallaxAnimation({
  imageSrc,
  imageAlt = 'Parallax image',
  title,
  subtitle,
  height = 'lg',
  startTextAnimation = false,
  mobileY = '20%',
  desktopY = '40%',
  mobileScale = 1.05,
  desktopScale = 1.12,
  mobileTextY = '-10%',
  desktopTextY = '-20%',
  scrub = 1.2,
  className,
  children,
  showOverlay = true,
  overlayClassName,
}: ParallaxAnimationProps) {
  const [titleComplete, setTitleComplete] = useState(false);
  const [showTextContainer, setShowTextContainer] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  // Show text container when trigger fires
  useEffect(() => {
    if (!startTextAnimation || showTextContainer) return;
    const id = requestAnimationFrame(() => {
      setShowTextContainer(true);
      requestAnimationFrame(() => {
        if (textRef.current) {
          gsap.to(textRef.current, {
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
            duration: 0.5,
            ease: 'power2.out',
            force3D: true,
          });
        }
      });
    });
    return () => cancelAnimationFrame(id);
  }, [startTextAnimation, showTextContainer]);

  // Set initial states synchronously before first paint – prevents flicker
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const text = textRef.current;
    if (!section || !media) return;

    gsap.set(media, {
      y: 0,
      scale: 1,
      opacity: 1,
      visibility: 'visible',
      force3D: true,
    });
    gsap.set(section, { opacity: 1, visibility: 'visible', force3D: true });
    if (text) {
      gsap.set(text, {
        y: 0,
        opacity: 0,
        visibility: 'hidden',
        pointerEvents: 'none',
        force3D: true,
      });
    }
  }, [title, subtitle]);

  // Parallax ScrollTrigger – deferred until layout + image ready to avoid flicker
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const hasText = Boolean(title || subtitle || children);
    const textEl = hasText ? textRef.current : null;
    let ctx: ReturnType<typeof gsap.context> | null = null;
    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let mounted = true;
    let initDone = false;
    let fallbackId: ReturnType<typeof setTimeout> | null = null;

    const initParallax = () => {
      if (!mounted || !section || !media || initDone) return;
      initDone = true;

      gsap.set(media, { y: 0, scale: 1, opacity: 1, force3D: true });

      mm = gsap.matchMedia();
      ctx = gsap.context(() => {
        /* MOBILE */
        mm!.add('(max-width: 1023px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub,
              markers: false,
              refreshPriority: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            media,
            { y: 0, scale: 1 },
            { y: mobileY, scale: mobileScale, ease: 'none', force3D: true, immediateRender: false },
            0
          );
          if (textEl) {
            gsap.set(textEl, { y: 0, force3D: true });
            tl.fromTo(
              textEl,
              { y: 0 },
              { y: mobileTextY, ease: 'none', force3D: true, immediateRender: false },
              0
            );
          }
        });

        /* DESKTOP */
        mm!.add('(min-width: 1024px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub,
              markers: false,
              refreshPriority: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            media,
            { y: 0, scale: 1 },
            { y: desktopY, scale: desktopScale, ease: 'none', force3D: true, immediateRender: false },
            0
          );
          if (textEl) {
            gsap.set(textEl, { y: 0, force3D: true });
            tl.fromTo(
              textEl,
              { y: 0 },
              { y: desktopTextY, ease: 'none', force3D: true, immediateRender: false },
              0
            );
          }
        });

        requestIdleCallback(() => ScrollTrigger.refresh(), { timeout: 100 });
      }, section);
    };

    const runAfterLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (mounted) initParallax();
          });
        });
      });
    };

    if (imageLoaded) {
      runAfterLayout();
    } else {
      fallbackId = setTimeout(runAfterLayout, 800);
    }

    return () => {
      mounted = false;
      if (fallbackId) clearTimeout(fallbackId);
      ctx?.revert();
      mm?.revert();
    };
  }, [
    title,
    subtitle,
    children,
    mobileY,
    desktopY,
    mobileScale,
    desktopScale,
    mobileTextY,
    desktopTextY,
    scrub,
    imageLoaded,
  ]);

  // Height classes
  const heightClass = height === 'fullscreen' 
    ? 'h-screen' 
    : height === 'lg'
    ? 'h-[520px] lg:h-[1100px]'
    : 'h-[420px] lg:h-[900px]';

  // Media layer positioning for fullscreen
  const mediaPositionClass = height === 'fullscreen'
    ? 'absolute left-0 w-full h-[120%] lg:h-[130%] -top-[20%]'
    : 'absolute top-[-6%] left-0 w-full h-[110%] lg:h-[120%]';

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${heightClass} ${className || ''}`}
      style={{ 
        opacity: 1,
        visibility: 'visible',
      }}
    >
      {/* MEDIA LAYER – explicit transform prevents flash before GSAP runs */}
      <div
        ref={mediaRef}
        className={mediaPositionClass}
        style={{ 
          transform: 'translate3d(0px, 0px, 0px) scale(1)',
          willChange: 'transform',
          opacity: 1,
          visibility: 'visible',
          backfaceVisibility: 'hidden',
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
          fetchPriority="high"
          className="object-cover object-top"
          style={{ 
            opacity: imageLoaded ? 1 : 0,
            visibility: 'visible',
            pointerEvents: 'none',
            transition: 'opacity 0.4s ease-out',
          }}
          onLoad={() => {
            requestAnimationFrame(() => {
              setImageLoaded(true);
            });
          }}
        />

        {/* OVERLAY */}
        {showOverlay && (
          <div className={`absolute inset-0 pointer-events-none ${overlayClassName || 'bg-gradient-to-b from-black/50 via-black/30 to-black/70'}`} />
        )}
      </div>

      {/* TEXT LAYER */}
      {(title || subtitle || children) && (
        <div 
          ref={textRef} 
          className={height === 'fullscreen' 
            ? "absolute inset-0 z-20 will-change-transform" 
            : "relative z-10 h-full flex items-end"} 
          style={{ 
            willChange: showTextContainer || height === 'fullscreen' ? 'transform, opacity' : 'auto',
            opacity: height === 'fullscreen' ? 1 : (showTextContainer ? 1 : 0),
            visibility: height === 'fullscreen' ? 'visible' : (showTextContainer ? 'visible' : 'hidden'),
            pointerEvents: height === 'fullscreen' ? 'auto' : (showTextContainer ? 'auto' : 'none'),
          }}
        >
          <div className={height === 'fullscreen' 
            ? "h-full flex items-center lg:items-center lg:justify-between lg:w-full lg:top-[100]" 
            : "max-w-[1200px] mx-auto px-6 pb-12 lg:pb-24"} 
            style={{ opacity: showTextContainer || height === 'fullscreen' ? 1 : 0 }}>
            {children ? (
              children
            ) : (
              <>
                {title && (
                  <LineByLineText
                    startAnimation={showTextContainer}
                    onComplete={() => setTitleComplete(true)}
                    className="text-light text-xl-semibold lg:text-6xl font-bold leading-tight"
                    duration={0.6}
                    stagger={0.12}
                    delay={0.1}
                    yFrom={28}
                    as="div"
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
              </>
            )}
          </div>
        </div>
      )}
      {!title && !subtitle && !children && <div ref={textRef} style={{ display: 'none' }} />}
    </section>
  );
}
