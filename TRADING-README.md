# Endogenous Analysis Dashboard

A Financial Times-inspired Next.js web application for analyzing currency values through systematic endogenous driver analysis.

## Overview

This dashboard provides a comprehensive view of domestic economic drivers to determine whether a currency (USD in this case) is experiencing inflationary or deflationary conditions on an absolute basis.

## Features

- **Overall Endogenous Score**: Displays cumulative score from all drivers (-150 to +160 scale)
- **Historical Trend Analysis**: Visual representation of score changes over time
- **Categorized Drivers**: Economic indicators grouped by:
  - Surveys (Leading Indicators)
  - Money Supply
  - Interest Rates
  - Inflation Metrics
  - Employment Data
  - Central Authority/Sovereign Liquidity

- **Individual Driver Cards**: Each driver includes:
  - Current value and scoring
  - Historical chart (line or bar)
  - Interpretation and reasoning
  - Color-coded by category

## Economic Drivers Analyzed

### Surveys (Leading Indicators)
- ISM Manufacturing Index (PMI)
- University of Michigan Consumer Sentiment Index
- Building Permits

### Money Supply
- M2 Growth Rate

### Interest Rates
- Federal Funds Rate

### Inflation
- Core CPI (Consumer Price Index)
- Core PPI (Producer Price Index)

### Employment
- Non-Farm Payrolls (NFP)

### Central Authority
- Government Deficit (% of GDP)
- Debt-to-GDP Ratio
- Interest Bill (% of GDP)
- 10-Year Treasury Yield
- Fed Balance Sheet (% of GDP)

## Scoring Methodology

Each driver is scored on a scale typically ranging from -10 (highly deflationary) to +10 (highly inflationary):

- **Positive scores** indicate inflationary pressure (short currency bias)
- **Negative scores** indicate deflationary pressure (long currency bias)
- **Overall score** is the sum of all individual driver scores

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Technology Stack

- **Next.js 14** with App Router
- **React 18**
- **TypeScript**
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

## Design Principles

The dashboard follows Financial Times design aesthetics:
- Clean, minimalist layout
- Cream background (#FFF1E0)
- Category-specific color coding
- Emphasis on data clarity and readability
- Responsive design for all screen sizes

## Data

The current implementation uses mock data generated for demonstration purposes. In a production environment, this would connect to:
- Federal Reserve Economic Data (FRED)
- Bureau of Labor Statistics
- Treasury Department
- Other official economic data sources

## Usage

Navigate to the dashboard to view:
1. Overall endogenous score and bias (inflationary/deflationary)
2. Historical trend of the score
3. Breakdown by category with individual driver analysis
4. Charts and interpretations for each economic indicator

## License

Educational purposes - based on systematic endogenous driver analysis methodology.
