import OverallScore from '@/components/OverallScore';
import CategorySection from '@/components/CategorySection';
import { usEndogenousAnalysis, getDriversByCategory } from '@/lib/data';

export default function Home() {
  const categorizedDrivers = getDriversByCategory(usEndogenousAnalysis);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-[#2E5F8A] text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">FINANCIAL TIMES</h1>
              <p className="text-xs text-blue-100">Economic Statistics Dashboard</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-100">Currency Analysis</div>
              <div className="text-xl font-bold">USD</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Overall Score Section */}
        <OverallScore analysis={usEndogenousAnalysis} />

        {/* Methodology Note */}
        <div className="bg-white border border-gray-200 rounded p-6 mb-8">
          <h3 className="text-lg font-bold mb-3">About Endogenous Analysis</h3>
          <p className="text-sm text-gray-700 mb-2">
            Endogenous Driver Analysis focuses on a currency in isolation, applying the static or absolute principle.
            This systematic process analyzes multiple domestic drivers to determine the fundamental predisposition—whether
            the currency is losing or gaining value in absolute terms.
          </p>
          <p className="text-sm text-gray-700">
            Each driver is scored (typically -10 for deflationary to +10 for inflationary) based on its contribution
            to inflationary or deflationary conditions. The cumulative score indicates whether central authorities
            are employing monetary and fiscal levers that result in inflationary injections or deflationary withdrawals.
          </p>
        </div>

        {/* Category Sections */}
        {categorizedDrivers.map(({ category, drivers, totalScore }) => (
          <CategorySection
            key={category}
            category={category}
            drivers={drivers}
            totalScore={totalScore}
          />
        ))}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p className="mb-2">
            Data sourced from Federal Reserve Economic Data (FRED), Bureau of Labor Statistics, and other official sources.
          </p>
          <p className="text-xs text-gray-500">
            This dashboard is for educational purposes. Analysis based on systematic endogenous driver methodology.
          </p>
        </footer>
      </div>
    </main>
  );
}
