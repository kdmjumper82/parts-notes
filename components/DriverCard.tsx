'use client';

import { Driver } from '@/lib/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DriverCardProps {
  driver: Driver;
}

export default function DriverCard({ driver }: DriverCardProps) {
  const isPositiveScore = driver.score > 0;
  const isNegativeScore = driver.score < 0;

  // Format score with + or -
  const formattedScore = driver.score > 0 ? `+${driver.score}` : driver.score;

  // Determine chart type based on data characteristics
  const useBarChart = driver.id === 'nfp' || driver.id === 'building-permits';

  return (
    <div className="driver-card">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Info and Score */}
        <div className="lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="stat-label mb-1">{driver.category}</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: driver.color }}>
              {driver.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{driver.description}</p>

            <div className="mb-4">
              <div className="stat-label mb-1">Current Value</div>
              <div className="text-2xl font-bold">
                {driver.currentValue.toFixed(2)}
                <span className="text-lg text-gray-500 ml-1">{driver.unit}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded ${
            isPositiveScore ? 'bg-red-50 border border-red-200' :
            isNegativeScore ? 'bg-blue-50 border border-blue-200' :
            'bg-gray-50 border border-gray-200'
          }`}>
            <div className="stat-label mb-1">Endogenous Score</div>
            <div className={`stat-value ${
              isPositiveScore ? 'text-red-600' :
              isNegativeScore ? 'text-blue-600' :
              'text-gray-600'
            }`}>
              {formattedScore}
            </div>
            <p className="text-xs text-gray-600 mt-2">{driver.scoreReasoning}</p>
          </div>
        </div>

        {/* Right: Chart and Interpretation */}
        <div className="lg:col-span-2">
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              {useBarChart ? (
                <BarChart data={driver.data}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    formatter={(value: number) => [value.toFixed(2), driver.name]}
                  />
                  <Bar dataKey="value" fill={driver.color} />
                </BarChart>
              ) : (
                <LineChart data={driver.data}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    formatter={(value: number) => [value.toFixed(2), driver.name]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={driver.color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="stat-label mb-1">Interpretation</div>
            <p className="text-sm text-gray-700">{driver.interpretation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
