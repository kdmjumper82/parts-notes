'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalDataPoint } from '@/types/endogenous';

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  title: string;
  color: string;
  valueFormatter?: (value: number) => string;
  small?: boolean;
}

export default function HistoricalChart({
  data,
  title,
  color,
  valueFormatter = (v) => v.toFixed(2),
  small = false
}: HistoricalChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const chartHeight = small ? 150 : 250;

  return (
    <div className="w-full h-full">
      <h4 className="text-xs font-medium text-gray-600 mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: '#666' }}
            stroke="#ccc"
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#666' }}
            stroke="#ccc"
            tickLine={false}
            tickFormatter={(v) => valueFormatter(v)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [valueFormatter(value), 'Value']}
            labelFormatter={(label) => formatDate(label as string)}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
