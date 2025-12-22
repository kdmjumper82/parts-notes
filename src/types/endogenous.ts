export type DriverCategory =
  | 'surveys'
  | 'money-supply'
  | 'interest-rates'
  | 'inflation'
  | 'employment'
  | 'central-authority';

export type BiasDirection = 'long' | 'short' | 'neutral';

export interface DriverData {
  id: string;
  name: string;
  category: DriverCategory;
  value: number;
  unit: string;
  score: number;
  maxScore: number;
  bias: BiasDirection;
  description: string;
  interpretation: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
  score: number;
}

export interface DriverWithHistory extends DriverData {
  history: HistoricalDataPoint[];
}

export interface EndogenousAnalysis {
  currency: string;
  overallScore: number;
  totalMinScore: number;
  totalMaxScore: number;
  bias: BiasDirection;
  condition: 'inflationary' | 'deflationary' | 'neutral';
  drivers: DriverWithHistory[];
  historicalScores: HistoricalDataPoint[];
  lastUpdated: string;
}

export interface CategorySummary {
  category: DriverCategory;
  categoryName: string;
  totalScore: number;
  drivers: DriverData[];
  color: string;
}
