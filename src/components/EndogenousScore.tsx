'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';

interface EndogenousScoreProps {
  score: number;
  minScore: number;
  maxScore: number;
  bias: 'long' | 'short' | 'neutral';
  condition: 'inflationary' | 'deflationary' | 'neutral';
  currency: string;
}

export default function EndogenousScore({
  score,
  minScore,
  maxScore,
  bias,
  condition,
  currency
}: EndogenousScoreProps) {
  const percentage = ((score - minScore) / (maxScore - minScore)) * 100;

  return (
    <div className="bg-white border-2 border-[var(--ft-border)] p-8 mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="ft-serif text-4xl mb-2 text-[var(--ft-text)]">
              {currency} Endogenous Analysis
            </h1>
            <p className="text-sm text-gray-600">Absolute Basis - Idea Generation Phase</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Last Updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overall Score */}
          <div className="border-l-4 border-[var(--ft-red)] pl-6">
            <p className="text-sm text-gray-600 mb-2">Overall Endogenous Score</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="ft-serif text-6xl font-bold text-[var(--ft-text)]">
                {score > 0 ? '+' : ''}{score}
              </span>
              <span className="text-xl text-gray-500">
                / {maxScore}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                <div
                  className="h-full bg-[var(--ft-red)] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Economic Condition */}
          <div className="border-l-4 border-[var(--ft-blue)] pl-6">
            <p className="text-sm text-gray-600 mb-2">Economic Condition</p>
            <div className="flex items-center gap-3">
              <span className="ft-serif text-4xl font-bold capitalize text-[var(--ft-text)]">
                {condition}
              </span>
              {condition === 'inflationary' && (
                <ArrowUp className="w-8 h-8 text-[var(--ft-red)]" />
              )}
              {condition === 'deflationary' && (
                <ArrowDown className="w-8 h-8 text-[var(--ft-blue)]" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Central authorities employing {condition} monetary and fiscal policy levers
            </p>
          </div>

          {/* Currency Bias */}
          <div className="border-l-4 border-[var(--ft-purple)] pl-6">
            <p className="text-sm text-gray-600 mb-2">Currency Bias</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="ft-serif text-4xl font-bold uppercase text-[var(--ft-text)]">
                {bias}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                bias === 'short'
                  ? 'bg-red-100 text-red-700'
                  : bias === 'long'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {bias === 'short' ? 'Bearish' : bias === 'long' ? 'Bullish' : 'Neutral'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {bias === 'short' && 'Currency losing purchasing power - expected to depreciate'}
              {bias === 'long' && 'Currency gaining purchasing power - expected to appreciate'}
              {bias === 'neutral' && 'Balanced conditions - no clear directional bias'}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[var(--ft-pink)] border-l-4 border-[var(--ft-red)]">
          <p className="text-sm">
            <strong>Analysis Summary:</strong> With a score of <strong>{score}</strong> out of {maxScore},
            the {currency} economy shows <strong>{condition}</strong> conditions on an absolute basis.
            This results in a fundamental <strong>{bias}</strong> bias, suggesting the currency is
            {bias === 'short' ? ' losing purchasing power and likely to depreciate' :
             bias === 'long' ? ' gaining purchasing power and likely to appreciate' :
             ' in a balanced state with no clear directional movement'}.
          </p>
        </div>
      </div>
    </div>
  );
}
