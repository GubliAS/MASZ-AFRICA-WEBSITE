'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import LineByLineText from './LineByLineText';
import CountUpNumber from './CountUpNumber';

export interface AnimatedMetricCardProps {
  text: string;
  value: string;
  /** When true, the empty card shell animates in; content stays hidden. */
  showAsEmpty?: boolean;
  /** When true, content (text line-by-line then number) animates. */
  showContent?: boolean;
  /** Called when the empty card appear animation completes. */
  onEmptyShown?: () => void;
  /** Called when the full content sequence (text + number) completes. */
  onSequenceComplete?: () => void;
  className?: string;
  /** Card index for alternating styles (0-based) */
  index?: number;
}

const CARD_APPEAR_DURATION = 0.07;
const TEXT_LINE_DURATION = 0.2;
const TEXT_LINE_STAGGER = 0.05;
const COUNT_UP_DURATION = 0.8;

export default function AnimatedMetricCard({
  text,
  value,
  showAsEmpty = false,
  showContent = false,
  onEmptyShown,
  onSequenceComplete,
  className,
  index = 0,
}: AnimatedMetricCardProps) {
  const [startText, setStartText] = useState(false);
  const [startNumber, setStartNumber] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasStartedEmptyRef = useRef(false);
  const hasStartedContentRef = useRef(false);

  // Phase 1: empty card shell appears
  useEffect(() => {
    if (!showAsEmpty || hasStartedEmptyRef.current || !cardRef.current) return;
    hasStartedEmptyRef.current = true;

    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      duration: CARD_APPEAR_DURATION,
      ease: 'power2.out',
      force3D: true,
      onComplete: () => onEmptyShown?.(),
    });
  }, [showAsEmpty, onEmptyShown]);

  // Phase 2: content appears (text line-by-line then number)
  useEffect(() => {
    if (!showContent || hasStartedContentRef.current) return;
    hasStartedContentRef.current = true;
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 1,
        duration: 0,
        onComplete: () => setStartText(true),
      });
    }
  }, [showContent]);

  const handleTextComplete = () => setStartNumber(true);

  const handleNumberComplete = () => {
    onSequenceComplete?.();
  };

  // const cardClassName =
  //   className ??
  //   'metrics-container flex items-center bg-surface-card-colored-secondary justify-between lg:flex lg:justify-center lg:gap-22 w-auto lg:w-auto my-[20] px-[20] lg:px-[25] h-[90] lg:h-[95]';

  const isOdd = index % 2 === 0; // 0, 2 are "odd" positions (1st, 3rd cards)
  const bgColor = isOdd ? 'bg-[#4693F6]' : 'bg-[#FFFFFF]';
  const textColor = isOdd ? 'text-white' : 'text-primary-default';
  
  const cardClassName =
    
    `metrics-container flex items-center ${bgColor} justify-between xl:flex xl:justify-center xl:gap-[26px] w-auto lg:w-auto  px-[20]  xl:px-[25] py-[27] min-h-[90]  ${className}`;

  return (
    <div
      ref={cardRef}
      className={cardClassName}
      style={{ opacity: 0, transform: 'translateY(20px)' }}
    >
      <div
        ref={contentRef}
        style={{ opacity: 0 }}
        className="flex w-full flex-1  items-center justify-between gap-4 lg:gap-6"
      >
<div className={`metrics-desription ${textColor} text-sm-medium w-full leading-5`}>
            <LineByLineText
            startAnimation={startText}
            onComplete={handleTextComplete}
            duration={TEXT_LINE_DURATION}
            stagger={TEXT_LINE_STAGGER}
            yFrom={16}
            as="div"
          >
            {text}
          </LineByLineText>
        </div>
        <div
  className={`metrics-value  text-3xl-semibold xl:text-4xl-semibold ${textColor}`}
          style={{ opacity: startNumber ? 1 : 0, visibility: startNumber ? 'visible' : 'hidden' }}
          aria-hidden={!startNumber}
        >
          {!startNumber ? (
            <span>{'0' + (value.replace(/^\d+/, '') || '')}</span>
          ) : (
            <CountUpNumber
              value={value}
              startAnimation
              onComplete={handleNumberComplete}
              duration={COUNT_UP_DURATION}
            />
          )}
        </div>
      </div>
    </div>
  );
}
