'use client';

import { sampleEndogenousData } from '@/data/sample-data';
import { DriverCategory } from '@/types/endogenous';
import EndogenousScore from './EndogenousScore';
import ScoreHistoryChart from './ScoreHistoryChart';
import CategorySection from './CategorySection';

const categoryConfig: Record<DriverCategory, { title: string; color: string; order: number }> = {
  'surveys': { title: 'Surveys - Leading Indicators', color: '#0f5499', order: 1 },
  'money-supply': { title: 'Money Supply', color: '#990f3d', order: 2 },
  'interest-rates': { title: 'Interest Rates', color: '#593380', order: 3 },
  'inflation': { title: 'Inflation Metrics', color: '#4a7c59', order: 4 },
  'employment': { title: 'Employment', color: '#0f5499', order: 5 },
  'central-authority': { title: 'Central Authority & Sovereign Liquidity', color: '#990f3d', order: 6 }
};

export default function Dashboard() {
  const data = sampleEndogenousData;

  // Group drivers by category
  const driversByCategory = data.drivers.reduce((acc, driver) => {
    if (!acc[driver.category]) {
      acc[driver.category] = [];
    }
    acc[driver.category].push(driver);
    return acc;
  }, {} as Record<DriverCategory, typeof data.drivers>);

  // Sort categories by order
  const sortedCategories = Object.keys(driversByCategory).sort(
    (a, b) => categoryConfig[a as DriverCategory].order - categoryConfig[b as DriverCategory].order
  ) as DriverCategory[];

  return (
    <div className="min-h-screen bg-[var(--ft-cream)]">
      {/* Header */}
      <header className="bg-[var(--ft-text)] text-white py-3 px-6 border-b-4 border-[var(--ft-red)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="ft-serif text-2xl">FINANCIAL TIMES</h1>
          <p className="text-xs mt-1 opacity-90">Economic Statistics at a Glance</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overall Score Section */}
        <EndogenousScore
          score={data.overallScore}
          minScore={data.totalMinScore}
          maxScore={data.totalMaxScore}
          bias={data.bias}
          condition={data.condition}
          currency={data.currency}
        />

        {/* Historical Score Trend */}
        <ScoreHistoryChart data={data.historicalScores} />

        {/* Driver Breakdown by Category */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="ft-serif text-3xl mb-2 text-[var(--ft-text)]">Driver Breakdown</h2>
            <p className="text-sm text-gray-600">
              Detailed analysis of individual endogenous drivers contributing to the overall score.
              Each driver is scored on a scale from highly deflationary (negative) to highly inflationary (positive).
            </p>
          </div>

          {sortedCategories.map((category) => {
            const config = categoryConfig[category];
            return (
              <CategorySection
                key={category}
                category={category}
                drivers={driversByCategory[category]}
                title={config.title}
                description=""
                color={config.color}
              />
            );
          })}
        </div>

        {/* Methodology Footer */}
        <div className="mt-12 p-6 bg-white border border-[var(--ft-border)]">
          <h3 className="ft-serif text-xl mb-3 text-[var(--ft-text)]">Methodology</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Endogenous Analysis (Absolute Basis)</strong> evaluates a currency's value in isolation,
              focusing on inflationary or deflationary conditions within the domestic economy.
            </p>
            <p>
              Each driver is scored on a scale, typically ranging from -10 (highly deflationary) to +10 (highly inflationary).
              The cumulative score determines the fundamental predisposition of the currency.
            </p>
            <p>
              <strong>Scoring Logic:</strong> Positive scores indicate inflationary conditions (short bias on currency),
              while negative scores indicate deflationary conditions. Extreme readings in either direction often predict
              future policy reversals by central authorities.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Last updated: {new Date(data.lastUpdated).toLocaleString()} | Data for illustrative purposes only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
