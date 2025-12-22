import { Driver } from '@/lib/types';
import DriverCard from './DriverCard';

interface CategorySectionProps {
  category: string;
  drivers: Driver[];
  totalScore: number;
}

export default function CategorySection({ category, drivers, totalScore }: CategorySectionProps) {
  if (drivers.length === 0) return null;

  const isInflationary = totalScore > 0;
  const categoryColors: { [key: string]: string } = {
    'Surveys': '#2E5F8A',
    'Money Supply': '#8B4A6F',
    'Interest Rates': '#6B7C93',
    'Inflation': '#A84E5C',
    'Employment': '#4A7C8B',
    'Central Authority': '#8B6B4A',
  };

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold" style={{ color: categoryColors[category] || '#333' }}>
            {category}
          </h2>
          <div className={`px-4 py-2 rounded ${
            isInflationary ? 'bg-red-100 border border-red-300' : 'bg-blue-100 border border-blue-300'
          }`}>
            <span className="stat-label mr-2">Category Score:</span>
            <span className={`text-2xl font-bold ${
              isInflationary ? 'text-red-600' : 'text-blue-600'
            }`}>
              {totalScore > 0 ? '+' : ''}{totalScore}
            </span>
          </div>
        </div>
        <div className="h-1 rounded-full" style={{ backgroundColor: categoryColors[category] || '#333', opacity: 0.2 }} />
      </div>

      <div className="space-y-6">
        {drivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>
    </div>
  );
}
