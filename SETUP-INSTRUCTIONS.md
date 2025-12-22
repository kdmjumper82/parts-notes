# Setup Instructions for Endogenous Analysis Dashboard

## Quick Start

The easiest way to set up the trading dashboard:

```bash
chmod +x setup-trading-app.sh
./setup-trading-app.sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Manual Setup

If you prefer to set up manually:

1. **Install dependencies**:
   ```bash
   cp trading-package.json package.json
   npm install
   ```

2. **Configure Tailwind**:
   ```bash
   cp tailwind-trading.config.js tailwind.config.js
   ```

3. **Configure TypeScript**:
   ```bash
   cp tsconfig-next.json tsconfig.json
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main dashboard page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── OverallScore.tsx    # Main score display
│   ├── CategorySection.tsx  # Category grouping
│   └── DriverCard.tsx       # Individual driver cards
├── lib/                     # Data and utilities
│   ├── types.ts            # TypeScript types
│   └── data.ts             # Mock economic data
├── next.config.js           # Next.js configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Features

- **Overall Endogenous Score**: Main dashboard showing cumulative analysis
- **Category Sections**: Drivers grouped by economic category
- **Interactive Charts**: Historical data visualization using Recharts
- **Responsive Design**: Works on desktop and mobile devices
- **FT-Inspired Design**: Clean, professional layout

## Customization

### Modify Economic Data

Edit `lib/data.ts` to update:
- Driver scores and values
- Historical data points
- Interpretations and descriptions

### Change Styling

Edit `app/globals.css` or `tailwind.config.js` to customize:
- Colors and themes
- Typography
- Component styles

### Add New Drivers

In `lib/data.ts`, add new drivers to the `drivers` array:

```typescript
{
  id: 'new-driver',
  category: 'Category Name',
  name: 'Driver Name',
  description: 'Description...',
  currentValue: 0,
  unit: '%',
  score: 0,
  scoreReasoning: 'Reasoning...',
  color: '#2E5F8A',
  data: generateMonthlyData(24, 0, 1),
  interpretation: 'Interpretation...'
}
```

## Restoring Original Project

To restore the original notes app:

```bash
mv package.json.backup package.json
mv tailwind.config.js.backup tailwind.config.js
mv tsconfig.json.backup tsconfig.json
npm install
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

### Dependencies Issues

Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Ensure all files are in place:
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- All component files in `components/`
- Data files in `lib/`

## Next Steps

1. Connect to real economic data APIs
2. Add user authentication
3. Implement data caching
4. Add more currencies (EUR, GBP, JPY, etc.)
5. Create comparison views
6. Add export functionality (PDF, Excel)
7. Implement real-time updates

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
