'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DriverWithHistory } from '@/types/endogenous';
import HistoricalChart from './HistoricalChart';

interface DriverCardProps {
  driver: DriverWithHistory;
}

export default function DriverCard({ driver }: DriverCardProps) {
  const getTrendIcon = () => {
    switch (driver.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBiasColor = () => {
    switch (driver.bias) {
      case 'long':
        return 'bg-blue-100 text-blue-700';
      case 'short':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-[var(--ft-border)] overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="ft-serif text-lg font-medium text-[var(--ft-text)] mb-1">
              {driver.name}
            </h3>
            <p className="text-xs text-gray-500">{driver.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-3">
            {getTrendIcon()}
            <span className={`px-2 py-1 rounded text-xs font-medium ${getBiasColor()}`}>
              {driver.bias.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Value and Score */}
        <div className="flex items-baseline gap-4 mb-4">
          <div>
            <p className="text-2xl font-bold text-[var(--ft-text)]">
              {driver.value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">{driver.unit}</p>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold" style={{ color: driver.score >= 0 ? 'var(--ft-red)' : 'var(--ft-blue)' }}>
                {driver.score > 0 ? '+' : ''}{driver.score}
              </span>
              <span className="text-sm text-gray-500">/ {driver.maxScore}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${Math.abs((driver.score / driver.maxScore) * 100)}%`,
                  backgroundColor: driver.score >= 0 ? 'var(--ft-red)' : 'var(--ft-blue)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-4">
          <HistoricalChart
            data={driver.history}
            title="24-Month Trend"
            color={driver.color}
            small
          />
        </div>

        {/* Interpretation */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-700 leading-relaxed">
            {driver.interpretation}
          </p>
        </div>
      </div>

      {/* Category Indicator */}
      <div
        className="h-1.5"
        style={{ backgroundColor: driver.color }}
      />
    </div>
  );
}
