'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number; // 0 to 100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  label = 'Higher indication',
  size = 'lg',
  showSubtitle = true,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1200; // ms
    const steps = 40;
    const increment = score / steps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      if (step >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(increment * step));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Size dimensions
  const dimensions = {
    sm: { width: 120, strokeWidth: 10, fontSize: 'text-2xl', labelSize: 'text-xs' },
    md: { width: 180, strokeWidth: 14, fontSize: 'text-4xl', labelSize: 'text-sm' },
    lg: { width: 220, strokeWidth: 16, fontSize: 'text-5xl', labelSize: 'text-base' },
  }[size];

  const radius = (dimensions.width - dimensions.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine color based on score
  const getScoreColor = (val: number) => {
    if (val < 35) return { stroke: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Low Indication' };
    if (val < 65) return { stroke: '#06B6D4', bg: 'bg-cyan-50', text: 'text-cyan-800', label: 'Moderate Indication' };
    return { stroke: '#0284C7', bg: 'bg-brand-50', text: 'text-brand-800', label: 'Higher Indication' };
  };

  const colorInfo = getScoreColor(score);
  const displayLabel = label || colorInfo.label;

  return (
    <div className="flex flex-col items-center justify-center text-center p-2">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.width}
          className="transform -rotate-90 drop-shadow-sm"
        >
          {/* Outer track background */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          {/* Animated score circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke={colorInfo.stroke}
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span className={cn('font-bold text-brand-900 font-mono tracking-tight', dimensions.fontSize)}>
              {animatedScore}
            </span>
            <span className="text-slate-400 font-medium text-sm ml-0.5">/100</span>
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
            Concern Index
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border border-brand-200', colorInfo.bg, colorInfo.text)}>
            {displayLabel}
          </span>
          <span className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
            Preliminary BruxShield AI indicator
          </span>
        </div>
      )}
    </div>
  );
};
