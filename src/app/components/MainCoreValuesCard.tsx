'use client';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type CoreValue = {
  id: number;
  number: string;
  title: string;
  description: string;
  image: string;
};

type CoreValueCardProps = {
  card: CoreValue;
};

const DESKTOP_BP = 1024;
const BASE_WIDTH  = 208;
const EXPANDED_WIDTH = 635;
const GAP = 32; // gap-8 = 2rem = 32px

// All positioning is owned exclusively by GSAP — no Tailwind transform classes on these elements.
// Desktop resting state
const D = {
  number:      { x: 30, y: 30 },
  title:       { rotation: 90, x: 40, y: 55, fontSize: '1.25rem', fontWeight: 600, padding: 0 },
  description: { autoAlpha: 0, x: 0, y: 230 },
  card:        { width: BASE_WIDTH, height: 550 },
} as const;

// Mobile resting state
const M = {
  number:      { x: 20, y: 20 },
  title:       { rotation: 0, x: 72, y: 22, fontSize: '1rem', fontWeight: 600 },
  description: { autoAlpha: 0, x: 20, y: 60 },
  card:        { height: 72 },
} as const;

const CoreValueCard: React.FC<CoreValueCardProps> = ({ card }) => {
  const cardRef        = useRef<HTMLDivElement | null>(null);
  const imageRef       = useRef<HTMLDivElement | null>(null);
  const numberRef      = useRef<HTMLParagraphElement | null>(null);
  const titleRef       = useRef<HTMLParagraphElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const hoverTl        = useRef<gsap.core.Timeline | null>(null);
  const isMobile       = useRef(false);
  const wasDesktop     = useRef<boolean | null>(null);

  // ─── Apply resting state for current breakpoint ───────────────────────────
  const applyInitialState = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    hoverTl.current?.kill();
    hoverTl.current = gsap.timeline({ paused: true });

    const image  = imageRef.current;
    const number = numberRef.current;
    const title  = titleRef.current;
    const desc   = descriptionRef.current;

    if (isMobile.current) {
      // Clear any desktop width override so flex-col can size naturally
      gsap.set(cardEl, { clearProps: 'width', height: M.card.height });
      gsap.set(number, { x: M.number.x, y: M.number.y, clearProps: 'fontSize' });
      gsap.set(title,  {
        rotation: M.title.rotation,
        x: M.title.x, y: M.title.y,
        fontSize: M.title.fontSize, fontWeight: M.title.fontWeight,
        padding: 0,
      });
      gsap.set(desc,   { autoAlpha: 0, x: M.description.x, y: M.description.y });
      gsap.set(image,  { autoAlpha: 0 });
    } else {
      // Distribute available width equally among all cards
      const container = cardEl.parentElement;
      const allCards  = Array.from(container?.children ?? []) as HTMLElement[];
      const containerWidth = container?.offsetWidth ?? 0;
      const equalWidth = containerWidth > 0
        ? Math.floor((containerWidth - (allCards.length - 1) * GAP) / allCards.length)
        : BASE_WIDTH;
      gsap.set(allCards, { width: equalWidth });

      gsap.set(cardEl, { height: D.card.height, width: equalWidth });
      gsap.set(number, { x: D.number.x, y: D.number.y, clearProps: 'fontSize' });
      gsap.set(title,  {
        rotation: D.title.rotation,
        x: D.title.x, y: D.title.y,
        fontSize: D.title.fontSize, fontWeight: D.title.fontWeight,
        padding: D.title.padding,
      });
      gsap.set(desc,   { autoAlpha: 0, x: D.description.x, y: D.description.y });
      gsap.set(image,  { autoAlpha: 0 });
    }
  };

  // ─── Mount ───────────────────────────────────────────────────────────────
  useEffect(() => {
    isMobile.current  = window.innerWidth < DESKTOP_BP;
    wasDesktop.current = !isMobile.current;
    applyInitialState();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Breakpoint crossing on resize ────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const nowDesktop = window.innerWidth >= DESKTOP_BP;
      isMobile.current = !nowDesktop;
      if (wasDesktop.current !== nowDesktop) {
        wasDesktop.current = nowDesktop;
        applyInitialState();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Hover / tap wiring ───────────────────────────────────────────────────
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const image  = imageRef.current;
    const number = numberRef.current;
    const title  = titleRef.current;
    const desc   = descriptionRef.current;
    const container = cardEl.parentElement as HTMLElement | null;

    const getSiblings = () =>
      Array.from(container?.children ?? []).filter(el => el !== cardEl) as HTMLElement[];

    // ── Desktop expand ──────────────────────────────────────────────────────
    const onEnterDesktop = () => {
      if (isMobile.current) return;
      const siblings       = getSiblings();
      const containerWidth = container?.offsetWidth ?? 0;
      const shrinkWidth    = Math.max(
        60,
        Math.floor((containerWidth - EXPANDED_WIDTH - siblings.length * GAP) / siblings.length)
      );

      hoverTl.current?.kill();
      hoverTl.current = gsap.timeline();
      hoverTl.current
        .to(cardEl,  { width: EXPANDED_WIDTH,  duration: 0.35, ease: 'power3.out' }, 0)
        .to(siblings,{ width: shrinkWidth,     duration: 0.35, ease: 'power3.out' }, 0)
        .to(image,   { autoAlpha: 1,           duration: 0.35, ease: 'power3.out' }, 0)
        .to(number,  { x: 30, y: 30, fontSize: '1.875rem',   duration: 0.35, ease: 'power3.out' }, 0)
        .to(title,   {
          rotation: 0, x: 90, y:34,
          fontSize: '1.5rem', fontWeight: 700, padding: 0,
          duration: 0.35, ease: 'power3.out',
        }, 0)
        .to(desc, { autoAlpha: 1, x: 30, y: 90, duration: 0.35, delay: 0.05, ease: 'power3.out' }, 0);
    };

    // ── Desktop collapse ────────────────────────────────────────────────────
    const onLeaveDesktop = () => {
      if (isMobile.current) return;
      const siblings       = getSiblings();
      const containerWidth = container?.offsetWidth ?? 0;
      const allCount       = siblings.length + 1;
      const restoreWidth   = containerWidth > 0
        ? Math.floor((containerWidth - (allCount - 1) * GAP) / allCount)
        : BASE_WIDTH;

      hoverTl.current?.kill();
      hoverTl.current = gsap.timeline();
      hoverTl.current
        .to(cardEl,  { width: restoreWidth, duration: 0.35, ease: 'power3.in' }, 0)
        .to(siblings,{ width: restoreWidth, duration: 0.35, ease: 'power3.in' }, 0)
        .to(image,   { autoAlpha: 0,                 duration: 0.25, ease: 'power3.in' }, 0)
        .to(number,  { x: D.number.x, y: D.number.y, fontSize: D.title.fontSize,   duration: 0.35, ease: 'power3.in' }, 0)
        .to(title,   {
          rotation: D.title.rotation,
          x: D.title.x, y: D.title.y,
          fontSize: D.title.fontSize, fontWeight: D.title.fontWeight,
          padding: D.title.padding,
          duration: 0.35, ease: 'power3.in',
        }, 0)
        .to(desc, { autoAlpha: 0, x: D.description.x, y: D.description.y, duration: 0.25, ease: 'power3.in' }, 0);
    };

    // ── Mobile expand ───────────────────────────────────────────────────────
    const mobileExpand = () => {
      hoverTl.current?.kill();
      hoverTl.current = gsap.timeline();
      hoverTl.current
        .to(cardEl, { height: 420, duration: 0.5, ease: 'cubic-bezier(0.22,1,0.36,1)' }, 0)
        .to(image,  { autoAlpha: 1, duration: 0.4 }, 0)
        .to(desc,   { autoAlpha: 1, y: 200, duration: 0.5, delay: 0.1 }, 0);
    };

    const mobileCollapse = () => {
      hoverTl.current?.kill();
      hoverTl.current = gsap.timeline();
      hoverTl.current
        .to(cardEl, { height: M.card.height, duration: 0.5, ease: 'cubic-bezier(0.22,1,0.36,1)' }, 0)
        .to(image,  { autoAlpha: 0, duration: 0.3 }, 0)
        .to(desc,   { autoAlpha: 0, y: M.description.y, duration: 0.3 }, 0);
    };

    const onEnter = () => { if (!isMobile.current) onEnterDesktop(); };
    const onLeave = () => { if (!isMobile.current) onLeaveDesktop(); };
    const onFocus = () => { if  (isMobile.current) mobileExpand();   };
    const onBlur  = () => { if  (isMobile.current) mobileCollapse(); };

    cardEl.addEventListener('mouseenter', onEnter);
    cardEl.addEventListener('mouseleave', onLeave);
    cardEl.addEventListener('focus',      onFocus);
    cardEl.addEventListener('blur',       onBlur);

    return () => {
      cardEl.removeEventListener('mouseenter', onEnter);
      cardEl.removeEventListener('mouseleave', onLeave);
      cardEl.removeEventListener('focus',      onFocus);
      cardEl.removeEventListener('blur',       onBlur);
      hoverTl.current?.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      // No transform/rotation/position Tailwind classes — GSAP owns all of that
      className="relative cursor-pointer overflow-hidden text-white bg-surface-card-colored-primary focus:outline-none shrink-0"
      style={{ willChange: 'width, height', minWidth: 0 }}
    >
      {/* Background image — hidden until hover */}
      <div ref={imageRef} className="absolute inset-0 z-0" style={{ opacity: 0 }}>
        <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Content — absolutely positioned, coordinates set entirely by GSAP */}
      <div className="relative z-10  h-full">
        <p ref={numberRef} className="text-[22px] absolute" >
          {card.number}.
        </p>

        <p
          ref={titleRef}
          className="uppercase font-semibold absolute  whitespace-nowrap"
          style={{ transformOrigin: 'left center' }}
        >
          {card.title}
        </p>

        <p
          ref={descriptionRef}
          className="absolute text-white text-sm-semibold md:text-md-semibold lg:text-lg-semibold w-full pr-[50px] md:pr-[74px] lg:bottom-[150px]   leading-relaxed"
          // width capped so text wraps nicely inside expanded card
          // style={{ width: '340px', fontSize: '0.875rem', opacity: 0 }}
        >
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default CoreValueCard;
