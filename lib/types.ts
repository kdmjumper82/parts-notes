export interface DataPoint {
  date: string;
  value: number;
}

export interface Driver {
  id: string;
  category: string;
  name: string;
  description: string;
  currentValue: number;
  unit: string;
  score: number; // -10 to +10
  scoreReasoning: string;
  color: string;
  data: DataPoint[];
  interpretation: string;
}

export interface EndogenousAnalysis {
  currency: string;
  overallScore: number;
  minScore: number;
  maxScore: number;
  drivers: Driver[];
  historicalScores: DataPoint[];
}
