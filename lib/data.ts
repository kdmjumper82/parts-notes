import { EndogenousAnalysis, Driver } from './types';

// Generate sample time series data
const generateMonthlyData = (months: number, baseValue: number, volatility: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    data.push({
      date: date.toISOString().split('T')[0],
      value: baseValue + (Math.random() - 0.5) * volatility
    });
  }
  return data;
};

const generateScoreHistory = (months: number) => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  let score = 20;

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    score += (Math.random() - 0.5) * 10;
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(-50, Math.min(80, score))
    });
  }
  return data;
};

export const usEndogenousAnalysis: EndogenousAnalysis = {
  currency: 'USD',
  overallScore: 36,
  minScore: -150,
  maxScore: 160,
  historicalScores: generateScoreHistory(24),
  drivers: [
    // SURVEYS
    {
      id: 'ism-manufacturing',
      category: 'Surveys',
      name: 'ISM Manufacturing (PMI)',
      description: 'Leading indicator of manufacturing sector health. Above 50 indicates expansion.',
      currentValue: 52.3,
      unit: 'index',
      score: -3,
      scoreReasoning: 'Above 50 signals growth, predicting future inflation',
      color: '#2E5F8A',
      data: generateMonthlyData(24, 52, 4),
      interpretation: 'Manufacturing sector showing moderate expansion. This leads to inflationary pressure as production increases.'
    },
    {
      id: 'umcsi',
      category: 'Surveys',
      name: 'Consumer Sentiment (UMCSI)',
      description: 'University of Michigan Consumer Sentiment Index measures consumer confidence.',
      currentValue: 68.5,
      unit: 'index',
      score: -2,
      scoreReasoning: 'Moderate sentiment suggests stable consumer spending',
      color: '#2E5F8A',
      data: generateMonthlyData(24, 68, 8),
      interpretation: 'Consumer confidence at moderate levels indicating steady spending patterns and economic stability.'
    },
    {
      id: 'building-permits',
      category: 'Surveys',
      name: 'Building Permits',
      description: 'Leading indicator of future construction activity and housing market health.',
      currentValue: 1.52,
      unit: 'millions',
      score: -2,
      scoreReasoning: 'Stable permits indicate healthy housing market',
      color: '#2E5F8A',
      data: generateMonthlyData(24, 1.5, 0.15),
      interpretation: 'Housing construction remains steady, supporting economic growth and future inflation.'
    },
    // MONEY SUPPLY
    {
      id: 'm2-supply',
      category: 'Money Supply',
      name: 'M2 Money Supply Growth',
      description: 'Measures the rate of change in M2 money supply. Normal growth is 5-6% annually.',
      currentValue: 5.8,
      unit: '%',
      score: -4,
      scoreReasoning: 'Normal growth rate indicates standard inflationary conditions',
      color: '#8B4A6F',
      data: generateMonthlyData(24, 5.8, 2),
      interpretation: 'M2 growing at normal rate. Steady monetary expansion supports ongoing inflation.'
    },
    // INTEREST RATES
    {
      id: 'fed-funds',
      category: 'Interest Rates',
      name: 'Fed Funds Rate',
      description: 'The target interest rate set by the Federal Reserve. Changes indicate policy shifts.',
      currentValue: 5.33,
      unit: '%',
      score: -6,
      scoreReasoning: 'Elevated rates to combat inflation, but stable pace',
      color: '#6B7C93',
      data: generateMonthlyData(24, 5.2, 0.5),
      interpretation: 'Fed maintaining restrictive policy to moderate inflation. Current level indicates tight monetary conditions.'
    },
    // INFLATION
    {
      id: 'core-cpi',
      category: 'Inflation',
      name: 'Core CPI (YoY)',
      description: 'Core Consumer Price Index excluding food and energy. Measures underlying inflation.',
      currentValue: 3.2,
      unit: '%',
      score: -5,
      scoreReasoning: 'Above target inflation persists',
      color: '#A84E5C',
      data: generateMonthlyData(24, 3.5, 0.8),
      interpretation: 'Core inflation remains elevated above Fed target of 2%, indicating persistent price pressures.'
    },
    {
      id: 'core-ppi',
      category: 'Inflation',
      name: 'Core PPI (YoY)',
      description: 'Producer Price Index measures business-level inflation and future consumer prices.',
      currentValue: 2.4,
      unit: '%',
      score: -3,
      scoreReasoning: 'Moderate producer inflation signals future CPI pressure',
      color: '#A84E5C',
      data: generateMonthlyData(24, 2.6, 1.2),
      interpretation: 'Producer prices moderating but still elevated, suggesting continued pass-through to consumers.'
    },
    // EMPLOYMENT
    {
      id: 'nfp',
      category: 'Employment',
      name: 'Non-Farm Payrolls (Monthly Change)',
      description: 'Monthly change in jobs added. Strong job growth supports consumer spending.',
      currentValue: 187,
      unit: 'thousands',
      score: -4,
      scoreReasoning: 'Solid job growth maintains wage pressure',
      color: '#4A7C8B',
      data: generateMonthlyData(24, 200, 80),
      interpretation: 'Labor market remains robust with steady job creation, supporting wage growth and consumption.'
    },
    // CENTRAL AUTHORITY - DEFICIT
    {
      id: 'deficit-gdp',
      category: 'Central Authority',
      name: 'Deficit (% of GDP)',
      description: 'Government spending minus revenues as percentage of GDP. Deficit adds to debt.',
      currentValue: -2.74,
      unit: '% GDP',
      score: 3,
      scoreReasoning: 'Deficit spending is inflationary, though moderating',
      color: '#8B6B4A',
      data: generateMonthlyData(24, -2.8, 0.5),
      interpretation: 'Government running deficit, continuously adding to outstanding debt and injecting liquidity.'
    },
    // CENTRAL AUTHORITY - DEBT
    {
      id: 'debt-gdp',
      category: 'Central Authority',
      name: 'Debt-to-GDP Ratio',
      description: 'Total government debt as percentage of GDP. High levels create pressure to inflate.',
      currentValue: 123,
      unit: '% GDP',
      score: 10,
      scoreReasoning: 'Very high debt creates strong pressure to inflate away obligations',
      color: '#8B6B4A',
      data: generateMonthlyData(24, 120, 3),
      interpretation: 'Debt levels near all-time highs create structural need for inflation to reduce real burden.'
    },
    // CENTRAL AUTHORITY - INTEREST BILL
    {
      id: 'interest-bill',
      category: 'Central Authority',
      name: 'Interest Bill (% of GDP)',
      description: 'Government interest payments on debt. Higher payments are deflationary withdrawals.',
      currentValue: 1.29,
      unit: '% GDP',
      score: -5,
      scoreReasoning: 'Interest payments withdraw capital from economy',
      color: '#8B6B4A',
      data: generateMonthlyData(24, 1.2, 0.15),
      interpretation: 'Interest burden manageable but rising with higher rates, creating deflationary pressure.'
    },
    // CENTRAL AUTHORITY - SOVEREIGN RATES
    {
      id: 'treasury-10y',
      category: 'Central Authority',
      name: 'US 10Y Treasury Yield',
      description: 'Market interest rate for government borrowing. Low rates enable deficit spending.',
      currentValue: 4.24,
      unit: '%',
      score: 5,
      scoreReasoning: 'Rates elevated but government can still finance deficit',
      color: '#8B6B4A',
      data: generateMonthlyData(24, 4.1, 0.4),
      interpretation: 'Treasury yields elevated but stable, allowing continued government borrowing at manageable cost.'
    },
    // CENTRAL AUTHORITY - FED BALANCE SHEET
    {
      id: 'fed-balance-sheet',
      category: 'Central Authority',
      name: 'Fed Balance Sheet (% of GDP)',
      description: 'Central bank assets from QE and bond purchases. Growth indicates monetary stimulus.',
      currentValue: 25.3,
      unit: '% GDP',
      score: 8,
      scoreReasoning: 'Elevated balance sheet maintains inflationary pressure',
      color: '#8B6B4A',
      data: generateMonthlyData(24, 26, 2),
      interpretation: 'Fed balance sheet remains historically elevated despite QT, supporting inflationary conditions.'
    },
  ]
};

export const getDriversByCategory = (analysis: EndogenousAnalysis) => {
  const categories = ['Surveys', 'Money Supply', 'Interest Rates', 'Inflation', 'Employment', 'Central Authority'];
  return categories.map(category => ({
    category,
    drivers: analysis.drivers.filter(d => d.category === category),
    totalScore: analysis.drivers
      .filter(d => d.category === category)
      .reduce((sum, d) => sum + d.score, 0)
  }));
};
