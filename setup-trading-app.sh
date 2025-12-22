#!/bin/bash

echo "Setting up Endogenous Analysis Dashboard..."

# Backup original package.json if it exists
if [ -f "package.json" ]; then
    echo "Backing up original package.json to package.json.backup"
    cp package.json package.json.backup
fi

# Use the trading package.json
echo "Installing Next.js and dependencies..."
cp trading-package.json package.json
npm install

# Use the trading tailwind config
if [ -f "tailwind.config.js" ]; then
    echo "Backing up original tailwind.config.js to tailwind.config.js.backup"
    cp tailwind.config.js tailwind.config.js.backup
fi
cp tailwind-trading.config.js tailwind.config.js

# Use the Next.js tsconfig
if [ -f "tsconfig.json" ]; then
    echo "Backing up original tsconfig.json to tsconfig.json.backup"
    cp tsconfig.json tsconfig.json.backup
fi
cp tsconfig-next.json tsconfig.json

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "To restore original files:"
echo "  mv package.json.backup package.json"
echo "  mv tailwind.config.js.backup tailwind.config.js"
echo "  mv tsconfig.json.backup tsconfig.json"
echo "  npm install"
