import { EndogenousAnalysis } from '@/types/endogenous';

// Generate historical data
const generateHistoricalData = (baseValue: number, volatility: number, months: number) => {
  const data = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const randomChange = (Math.random() - 0.5) * volatility;
    const value = baseValue + randomChange;

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
      score: 0 // Will be calculated based on value
    });
  }

  return data;
};

// Generate overall score history
const generateScoreHistory = () => {
  const months = 24;
  const data = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const score = 30 + (Math.random() - 0.5) * 20; // Fluctuate around 30-40

    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(score.toFixed(1)),
      score: parseFloat(score.toFixed(1))
    });
  }

  return data;
};

export const sampleEndogenousData: EndogenousAnalysis = {
  currency: 'USD',
  overallScore: 36,
  totalMinScore: -150,
  totalMaxScore: 160,
  bias: 'short',
  condition: 'inflationary',
  lastUpdated: new Date().toISOString(),
  historicalScores: generateScoreHistory(),
  drivers: [
    // SURVEYS (Leading Indicators)
    {
      id: 'ism-manufacturing',
      name: 'ISM Manufacturing PMI',
      category: 'surveys',
      value: 52.3,
      unit: 'Index',
      score: -2,
      maxScore: 10,
      bias: 'short',
      description: 'Manufacturing purchasing managers index',
      interpretation: 'Above 50 indicates expansion. Current reading suggests mild growth, leading to slight deflationary pressure.',
      color: '#0f5499',
      trend: 'stable',
      history: generateHistoricalData(52.3, 3, 24)
    },
    {
      id: 'ism-nonmanufacturing',
      name: 'ISM Non-Manufacturing Index',
      category: 'surveys',
      value: 54.1,
      unit: 'Index',
      score: -3,
      maxScore: 10,
      bias: 'short',
      description: 'Services sector purchasing managers index',
      interpretation: 'Services sector showing solid expansion, indicating future growth and deflationary bias.',
      color: '#0f5499',
      trend: 'up',
      history: generateHistoricalData(54.1, 2.5, 24)
    },
    {
      id: 'consumer-sentiment',
      name: 'U. Michigan Consumer Sentiment',
      category: 'surveys',
      value: 68.2,
      unit: 'Index',
      score: 2,
      maxScore: 10,
      bias: 'long',
      description: 'Consumer confidence and sentiment index',
      interpretation: 'Below historical average, suggesting potential future stimulus and mild inflationary pressure.',
      color: '#0f5499',
      trend: 'down',
      history: generateHistoricalData(68.2, 5, 24)
    },
    {
      id: 'building-permits',
      name: 'Building Permits',
      category: 'surveys',
      value: 1.495,
      unit: 'Million Units',
      score: -1,
      maxScore: 10,
      bias: 'neutral',
      description: 'New residential building permits issued',
      interpretation: 'Steady construction activity indicates stable housing market with neutral bias.',
      color: '#0f5499',
      trend: 'stable',
      history: generateHistoricalData(1.495, 0.1, 24)
    },

    // MONEY SUPPLY
    {
      id: 'm2-money-supply',
      name: 'M2 Money Supply Growth',
      category: 'money-supply',
      value: -1.2,
      unit: '% YoY',
      score: 8,
      maxScore: 15,
      bias: 'long',
      description: 'Year-over-year M2 money supply growth rate',
      interpretation: 'Negative M2 growth is highly abnormal and deflationary, strongly predicting future stimulus.',
      color: '#990f3d',
      trend: 'down',
      history: generateHistoricalData(-1.2, 2, 24)
    },

    // INTEREST RATES
    {
      id: 'fed-funds-rate',
      name: 'Federal Funds Rate',
      category: 'interest-rates',
      value: 5.33,
      unit: '% Rate',
      score: -5,
      maxScore: 15,
      bias: 'short',
      description: 'Federal Reserve benchmark interest rate',
      interpretation: 'Elevated rates indicate restrictive policy, creating deflationary pressure in the economy.',
      color: '#593380',
      trend: 'stable',
      history: generateHistoricalData(5.33, 0.25, 24)
    },

    // INFLATION
    {
      id: 'core-cpi',
      name: 'Core CPI',
      category: 'inflation',
      value: 3.2,
      unit: '% YoY',
      score: -2,
      maxScore: 15,
      bias: 'short',
      description: 'Consumer Price Index excluding food and energy',
      interpretation: 'Above Fed target of 2%, but declining. Moderate deflationary bias.',
      color: '#4a7c59',
      trend: 'down',
      history: generateHistoricalData(3.2, 0.5, 24)
    },
    {
      id: 'core-ppi',
      name: 'Core PPI',
      category: 'inflation',
      value: 2.4,
      unit: '% YoY',
      score: -1,
      maxScore: 15,
      bias: 'neutral',
      description: 'Producer Price Index excluding food and energy',
      interpretation: 'Near target levels, indicating stable producer-level inflation.',
      color: '#4a7c59',
      trend: 'down',
      history: generateHistoricalData(2.4, 0.4, 24)
    },

    // EMPLOYMENT
    {
      id: 'nfp',
      name: 'Non-Farm Payrolls',
      category: 'employment',
      value: 199,
      unit: 'K Jobs',
      score: 0,
      maxScore: 10,
      bias: 'neutral',
      description: 'Monthly change in non-farm employment',
      interpretation: 'Moderate job growth indicating stable labor market with neutral bias.',
      color: '#0f5499',
      trend: 'stable',
      history: generateHistoricalData(199, 50, 24)
    },

    // CENTRAL AUTHORITY / SOVEREIGN LIQUIDITY
    {
      id: 'deficit-gdp',
      name: 'Deficit as % of GDP',
      category: 'central-authority',
      value: -2.74,
      unit: '% of GDP',
      score: 3,
      maxScore: 15,
      bias: 'long',
      description: 'Government deficit relative to GDP',
      interpretation: 'Government running deficit adds to debt, creating mildly inflationary conditions.',
      color: '#990f3d',
      trend: 'stable',
      history: generateHistoricalData(-2.74, 0.5, 24)
    },
    {
      id: 'debt-gdp',
      name: 'Debt-to-GDP Ratio',
      category: 'central-authority',
      value: 123,
      unit: '% of GDP',
      score: 10,
      maxScore: 15,
      bias: 'long',
      description: 'Total government debt as percentage of GDP',
      interpretation: 'Very high debt level creates strong pressure for inflationary policies to inflate away debt.',
      color: '#990f3d',
      trend: 'up',
      history: generateHistoricalData(123, 3, 24)
    },
    {
      id: 'interest-bill',
      name: 'Interest Bill as % of GDP',
      category: 'central-authority',
      value: 1.29,
      unit: '% of GDP',
      score: -5,
      maxScore: 10,
      bias: 'short',
      description: 'Government interest payments on debt',
      interpretation: 'Interest payments represent capital withdrawal, creating mildly deflationary pressure.',
      color: '#990f3d',
      trend: 'up',
      history: generateHistoricalData(1.29, 0.15, 24)
    },
    {
      id: 'us-10yr-treasury',
      name: 'US 10-Year Treasury Rate',
      category: 'central-authority',
      value: 4.23,
      unit: '% Yield',
      score: 5,
      maxScore: 10,
      bias: 'long',
      description: 'Benchmark 10-year government bond yield',
      interpretation: 'Moderate rates provide some fiscal flexibility for inflationary spending.',
      color: '#990f3d',
      trend: 'stable',
      history: generateHistoricalData(4.23, 0.3, 24)
    },
    {
      id: 'fed-balance-sheet',
      name: "Fed's Balance Sheet",
      category: 'central-authority',
      value: 25.2,
      unit: '% of GDP',
      score: 3,
      maxScore: 10,
      bias: 'long',
      description: 'Federal Reserve balance sheet size relative to GDP',
      interpretation: 'Expanded balance sheet from QE creates mild inflationary pressure.',
      color: '#990f3d',
      trend: 'down',
      history: generateHistoricalData(25.2, 2, 24)
    }
  ]
};
