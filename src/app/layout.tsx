import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Endogenous Analysis Dashboard - USD',
  description: 'Financial Times-inspired Endogenous Analysis for Forex Trading',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
