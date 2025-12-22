import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Endogenous Analysis Dashboard',
  description: 'US Economic Statistics at a Glance - Endogenous Driver Analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFF1E0] min-h-screen">{children}</body>
    </html>
  )
}
