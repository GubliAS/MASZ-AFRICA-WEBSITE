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
  const [startContentPhase, setStartContentPhase] = useState(false);

  // PERFORMANCE: Memoize metrics array
  const memoizedMetrics = useMemo(() => metrics, [metrics]);

  // Start metrics animation when trigger fires
  useEffect(() => {
    if (startAnimation) setStartMetricsAnimation(true);
  }, [startAnimation]);

  // When first empty card is shown, start content phase for all cards simultaneously
  const handleEmptyShown = () => setStartContentPhase(true);
  const handleSequenceComplete = () => {};

  return (
    <div className={ `metrics-container my-[50px] lg:grid lg:gap-8 mt-[50] ${className}`}>
      {memoizedMetrics.map((metric, index) => (
        <AnimatedMetricCard
        index={index}
          key={index}
          text={metric.text}
          value={metric.value}
          showAsEmpty={startMetricsAnimation}
          showContent={startContentPhase}
          onEmptyShown={index === 0 ? handleEmptyShown : undefined}
          onSequenceComplete={handleSequenceComplete}
          className={cardClassName}
        />
      ))}
    </div>
  );
}

export default memo(MetricsCardAnimation);
