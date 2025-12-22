'use client';

import { EndogenousAnalysis } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

interface OverallScoreProps {
  analysis: EndogenousAnalysis;
}

export default function OverallScore({ analysis }: OverallScoreProps) {
  const scorePercentage = ((analysis.overallScore - analysis.minScore) / (analysis.maxScore - analysis.minScore)) * 100;
  const isInflationary = analysis.overallScore > 0;

  return (
    <div className="driver-card mb-8">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="stat-label mb-2">US ECONOMIC STATISTICS AT A GLANCE</div>
          <h1 className="text-4xl font-bold mb-2">Endogenous Analysis</h1>
          <p className="text-gray-600">
            Systematic analysis of domestic drivers measuring inflationary or deflationary conditions on an absolute basis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Overall Score Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-red-50 rounded-lg border-2 border-gray-200">
            <div className="stat-label mb-2">OVERALL ENDOGENOUS SCORE</div>
            <div className="text-7xl font-bold mb-2" style={{ color: isInflationary ? '#A84E5C' : '#2E5F8A' }}>
              {analysis.overallScore > 0 ? '+' : ''}{analysis.overallScore}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Range: {analysis.minScore} to {analysis.maxScore}
            </div>

            {/* Score bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${scorePercentage}%`,
                  background: isInflationary
                    ? 'linear-gradient(to right, #FCD34D, #F87171, #DC2626)'
                    : 'linear-gradient(to right, #3B82F6, #60A5FA, #93C5FD)'
                }}
              />
            </div>

            <div className={`text-center p-4 rounded mt-4 ${
              isInflationary ? 'bg-red-100 border border-red-300' : 'bg-blue-100 border border-blue-300'
            }`}>
              <div className="font-bold text-lg mb-1">
                {isInflationary ? 'INFLATIONARY BIAS' : 'DEFLATIONARY BIAS'}
              </div>
              <div className="text-sm">
                {isInflationary
                  ? 'USD losing purchasing power - Short bias indicated'
                  : 'USD gaining purchasing power - Long bias indicated'
                }
              </div>
            </div>
          </div>

          {/* Historical Trend */}
          <div className="flex flex-col">
            <div className="stat-label mb-3">ENDOGENOUS SCORE HISTORICAL TREND</div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analysis.historicalScores}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    formatter={(value: number) => [value.toFixed(0), 'Score']}
                  />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#A84E5C"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              The overall endogenous score measures the cumulative effect of all domestic drivers.
              Positive scores indicate inflationary conditions from monetary and fiscal policy injections.
            </p>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="stat-label mb-1">TOTAL DRIVERS ANALYZED</div>
            <div className="text-3xl font-bold text-gray-700">{analysis.drivers.length}</div>
          </div>
          <div className="text-center">
            <div className="stat-label mb-1">INFLATIONARY DRIVERS</div>
            <div className="text-3xl font-bold text-red-600">
              {analysis.drivers.filter(d => d.score > 0).length}
            </div>
          </div>
          <div className="text-center">
            <div className="stat-label mb-1">DEFLATIONARY DRIVERS</div>
            <div className="text-3xl font-bold text-blue-600">
              {analysis.drivers.filter(d => d.score < 0).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
