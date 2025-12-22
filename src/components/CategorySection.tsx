'use client';

import { DriverWithHistory, DriverCategory } from '@/types/endogenous';
import DriverCard from './DriverCard';

interface CategorySectionProps {
  category: DriverCategory;
  drivers: DriverWithHistory[];
  title: string;
  description: string;
  color: string;
}

const categoryDescriptions: Record<DriverCategory, string> = {
  'surveys': 'Leading indicators that predict economic conditions and central bank policy reactions',
  'money-supply': 'Monetary lever used by the Federal Reserve to control liquidity',
  'interest-rates': 'Lagging indicators reflecting the Federal Reserve\'s policy stance',
  'inflation': 'Coincident indicators measuring current price levels in the economy',
  'employment': 'Coincident indicator reflecting labor market conditions',
  'central-authority': 'Government and central bank actions affecting sovereign liquidity'
};

export default function CategorySection({
  category,
  drivers,
  title,
  color
}: CategorySectionProps) {
  if (drivers.length === 0) return null;

  const totalScore = drivers.reduce((sum, d) => sum + d.score, 0);
  const totalMaxScore = drivers.reduce((sum, d) => sum + d.maxScore, 0);

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="mb-4 pb-3 border-b-2" style={{ borderColor: color }}>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="ft-serif text-2xl mb-1 text-[var(--ft-text)]">{title}</h2>
            <p className="text-sm text-gray-600">{categoryDescriptions[category]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Category Score</p>
            <div className="flex items-baseline gap-1">
              <span
                className="text-3xl font-bold"
                style={{ color: totalScore >= 0 ? 'var(--ft-red)' : 'var(--ft-blue)' }}
              >
                {totalScore > 0 ? '+' : ''}{totalScore}
              </span>
              <span className="text-lg text-gray-500">/ {totalMaxScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>
    </div>
  );
}
