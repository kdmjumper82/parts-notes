'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HistoricalDataPoint } from '@/types/endogenous';

interface ScoreHistoryChartProps {
  data: HistoricalDataPoint[];
}

export default function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="bg-white border border-[var(--ft-border)] p-6 mb-6">
      <div className="mb-4">
        <h3 className="ft-serif text-2xl mb-1 text-[var(--ft-text)]">Overall Score Trend</h3>
        <p className="text-sm text-gray-600">Historical Endogenous Score over 24 months</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--ft-red)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--ft-red)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: '#666' }}
            stroke="#ccc"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#666' }}
            stroke="#ccc"
            tickLine={false}
            domain={[0, 60]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [value.toFixed(1), 'Score']}
            labelFormatter={(label) => formatDate(label as string)}
          />
          <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--ft-red)"
            strokeWidth={2}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--ft-red)]"></div>
          <span>Positive score indicates inflationary conditions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--ft-blue)]"></div>
          <span>Negative score indicates deflationary conditions</span>
        </div>
      </div>
    </div>
  );
}
