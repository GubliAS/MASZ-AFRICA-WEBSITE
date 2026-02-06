'use client';

import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import AnimatedMetricCard, { AnimatedMetricCardProps } from '../components/AnimatedMetricCard';

export interface Metric {
  text: string;
  value: string;
}

export interface MetricsCardAnimationProps {
  /** Array of metrics to display */
  metrics: Metric[];
  /** When true, starts the sequential animation of metric cards */
  startAnimation?: boolean;
  /** Delay between each card appearing (default: 0.2) */
  cardDelay?: number;
  /** Additional className for the container */
  className?: string;
  /** Custom card className */
  cardClassName?: string;
}

/**
 * Reusable Metrics Card Animation Component
 * 
 * Handles sequential animation of multiple metric cards:
 * 1. Empty card shells appear one after another
 * 2. Content (text + number) animates per card sequentially
 * 
 * Used in: CoreValueSession, AboutUsPage
 */
function MetricsCardAnimation({
  metrics,
  startAnimation = false,
  cardDelay = 0.2,
  className,
  cardClassName,
}: MetricsCardAnimationProps) {
  const [startMetricsAnimation, setStartMetricsAnimation] = useState(false);
  const [emptyCardIndex, setEmptyCardIndex] = useState(0);
  const [startContentPhase, setStartContentPhase] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // PERFORMANCE: Memoize metrics array
  const memoizedMetrics = useMemo(() => metrics, [metrics]);

  // Start metrics animation when trigger fires
  useEffect(() => {
    if (startAnimation) {
      setStartMetricsAnimation(true);
    }
  }, [startAnimation]);

  // When all empty cards have been shown, start content phase
  useEffect(() => {
    if (emptyCardIndex < memoizedMetrics.length) return;
    setStartContentPhase(true);
    setActiveCardIndex(0);
  }, [emptyCardIndex, memoizedMetrics.length]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleEmptyShown = () => {
    setEmptyCardIndex((i) => Math.min(i + 1, memoizedMetrics.length));
  };

  const handleSequenceComplete = () => {
    setActiveCardIndex((i) => Math.min(i + 1, memoizedMetrics.length));
  };

  return (
    <div className={className || 'metrics-container my-[50px] lg:flex lg:gap-8 mt-[50]'}>
      {memoizedMetrics.map((metric, index) => (
        <AnimatedMetricCard
          key={index}
          text={metric.text}
          value={metric.value}
          showAsEmpty={startMetricsAnimation && emptyCardIndex === index}
          showContent={startContentPhase && activeCardIndex === index}
          onEmptyShown={handleEmptyShown}
          onSequenceComplete={handleSequenceComplete}
          className={cardClassName}
        />
      ))}
    </div>
  );
}

export default memo(MetricsCardAnimation);
