# Endogenous Analysis Dashboard

A Financial Times-inspired dashboard for analyzing endogenous drivers in forex trading. This Next.js application provides a comprehensive view of macroeconomic indicators and their impact on currency valuation using the Endogenous Analysis (Absolute Basis) methodology.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![React](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Overview

This application implements the **Endogenous Analysis** framework used in the **Idea Generation Phase** of forex trading, representing approximately 80% of the analytical work traders perform. The analysis evaluates a country's currency in isolation using the **static or absolute principle**, assessing inflationary or deflationary conditions on a standalone basis.

## Features

### 📊 Comprehensive Economic Driver Analysis
- **Leading Indicators (Surveys)**: ISM Manufacturing/Non-Manufacturing, Consumer Sentiment, Building Permits
- **Money Supply (M2)**: Federal Reserve monetary lever analysis
- **Interest Rates**: Fed Funds Rate and policy stance evaluation
- **Inflation Metrics**: Core CPI and PPI tracking
- **Employment Data**: Non-Farm Payrolls analysis
- **Central Authority Actions**: Deficit/GDP, Debt/GDP, Interest Bill, Treasury Rates, Fed Balance Sheet

### 📈 Interactive Data Visualization
- Historical trend charts for each driver (24-month view)
- Overall Endogenous Score trend analysis
- Real-time score calculations and bias determination
- Color-coded categories matching Financial Times aesthetic

### 🎯 Prominent Score Display
- Overall Endogenous Score with progress indicator
- Economic condition classification (Inflationary/Deflationary)
- Currency bias indication (Long/Short/Neutral)
- Detailed interpretation and analysis summary

### 🎨 Financial Times-Inspired Design
- Minimalist, professional layout
- FT color palette (salmon pink, cream, navy, burgundy)
- Typography matching FT style (serif headlines, sans-serif body)
- Responsive grid layout optimized for vertical stacking
- Clean, data-focused presentation

### 📱 Responsive Layout
- Desktop-optimized multi-column grid
- Tablet-friendly two-column layout
- Mobile-responsive single-column view
- Smooth transitions and hover effects

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kdmjumper82/parts-notes.git
cd parts-notes
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Methodology

### Endogenous Analysis (Absolute Basis)

**Endogenous Driver Analysis** focuses on a country's currency in isolation. The term "endogenous" originates from the Greek word "endo," meaning "coming from inside the system."

#### Scoring System

Each driver is analyzed and assigned a score (typically -10 for deflationary to +10 for inflationary):

- **Positive scores**: Indicate inflationary conditions → Short currency bias
- **Negative scores**: Indicate deflationary conditions → Long currency bias
- **Extreme readings**: Often predict future policy reversals by central authorities

#### Driver Categories

1. **Surveys (Leading Indicators)**: Predict economic conditions and central bank reactions
2. **Money Supply**: Tracks Federal Reserve's monetary lever (M2 growth analysis)
3. **Interest Rates**: Reflects Fed's policy stance (lagging indicator)
4. **Inflation**: Current price levels in the economy (coincident indicator)
5. **Employment**: Labor market conditions (coincident indicator)
6. **Central Authority**: Government and Fed actions affecting liquidity

### Understanding the Score

The overall Endogenous Score represents the cumulative effect of all drivers:

- **Inflationary Score** (positive): Currency losing purchasing power → Short bias
- **Deflationary Score** (negative): Currency gaining purchasing power → Long bias
- **Score magnitude**: Indicates strength of the bias

## Usage

### Dashboard Navigation

The dashboard presents data in a vertically-stacked layout:

1. **Header Section**: Overall Endogenous Score, economic condition, and currency bias
2. **Trend Chart**: 24-month historical view of the overall score
3. **Driver Breakdown**: Categorized cards showing individual economic indicators

### Interpreting Driver Cards

Each driver card displays:
- **Current Value**: Latest reading with units
- **Score**: Contribution to overall Endogenous Score
- **Trend**: 24-month historical chart
- **Bias Indicator**: Long/Short/Neutral classification
- **Interpretation**: Analysis of what the reading means

### Color Coding

- **Navy Blue**: Surveys and Employment categories
- **Burgundy**: Money Supply and Central Authority
- **Purple**: Interest Rates
- **Green**: Inflation Metrics

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18.3
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.12
- **Icons**: Lucide React

## Architecture

```
src/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page (Dashboard)
│   └── globals.css          # Global styles (FT theme)
├── components/
│   ├── Dashboard.tsx        # Main dashboard orchestration
│   ├── EndogenousScore.tsx  # Prominent score display
│   ├── ScoreHistoryChart.tsx # Overall trend visualization
│   ├── CategorySection.tsx  # Driver category grouping
│   ├── DriverCard.tsx       # Individual driver display
│   └── HistoricalChart.tsx  # Reusable line chart
├── data/
│   └── sample-data.ts       # Sample endogenous data
├── types/
│   └── endogenous.ts        # TypeScript interfaces
└── lib/                     # Utility functions
```

## Data Sources

The current implementation uses **sample data** for demonstration purposes. In a production environment, you would integrate:

### Real-Time Data APIs
- **Federal Reserve Economic Data (FRED)**: Free API for economic indicators
- **Bureau of Labor Statistics (BLS)**: Employment and inflation data
- **Institute for Supply Management (ISM)**: PMI data
- **University of Michigan**: Consumer sentiment
- **Treasury.gov**: Government debt and interest data

### Implementation Example

```typescript
// Example integration with FRED API
async function fetchM2Data() {
  const response = await fetch(
    'https://api.stlouisfed.org/fred/series/observations?series_id=M2SL&api_key=YOUR_KEY'
  );
  const data = await response.json();
  // Process and update dashboard
}
```

## Customization

### Adding New Drivers

1. Define the driver in `src/types/endogenous.ts`
2. Add data to `src/data/sample-data.ts`
3. Update scoring logic if needed
4. Driver cards will automatically render

### Modifying Scoring Logic

Edit the scoring interpretation in `sample-data.ts`:

```typescript
{
  score: 8,  // Your calculated score
  maxScore: 15,
  bias: 'long',  // long | short | neutral
}
```

### Styling Customization

FT color scheme is defined in:
- `tailwind.config.js`: Theme configuration
- `src/app/globals.css`: CSS variables

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning and development.

## Acknowledgments

- Inspired by [HiNotes by HiDock](https://www.hidock.com/pages/hinotes)
- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern note-taking apps

## Roadmap

- [ ] Real-time data integration with FRED API
- [ ] Multi-currency support (EUR, GBP, JPY, etc.)
- [ ] Comparative analysis (Exogenous/Relative Analysis)
- [ ] Historical playback (analyze past dates)
- [ ] Custom scoring models
- [ ] Export reports (PDF/Excel)
- [ ] Alert system for significant changes
- [ ] AI-powered insights and predictions
- [ ] Mobile-responsive enhancements
- [ ] Dark mode toggle

## Key Concepts

### Inflationary vs Deflationary

- **Inflationary Conditions**: Central authorities injecting money (QE, deficit spending, rate cuts)
  - Result: Currency loses purchasing power → **Short Bias**

- **Deflationary Conditions**: Central authorities withdrawing money (QT, surplus, rate hikes)
  - Result: Currency gains purchasing power → **Long Bias**

### Leading vs Lagging Indicators

- **Leading**: Surveys predict future conditions → inform central bank reactions
- **Coincident**: CPI, PPI, employment reflect current state
- **Lagging**: Interest rates react to conditions already signaled

## License

MIT License - Free to use for learning and trading analysis.

## Acknowledgments

- Design inspiration: [Financial Times](https://www.ft.com)
- Methodology: Forex trading Endogenous Analysis framework
- Charts: [Recharts](https://recharts.org/)
- Icons: [Lucide](https://lucide.dev/)

## Support

For issues and questions, please open an issue on GitHub.

---

Built with Next.js, React, TypeScript, and Tailwind CSS
