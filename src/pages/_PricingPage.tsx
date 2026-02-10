import { useState } from 'react';
import { Check, Zap, Star } from 'lucide-react';
import { PageTitle } from '../components/PageTitle';

type BillingCycle = 'monthly' | 'yearly';

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>('yearly');

  const price = billing === 'monthly' ? 10 : 50;
  const perMonth = billing === 'monthly' ? 10 : Math.round((50 / 12) * 100) / 100;

  const features = [
    'All learning paths (React, Git, Web Fundamentals & more)',
    'Hands-on exercises with AI feedback',
    'Project Labs with guided steps',
    'XP, levels & leaderboard',
    'New courses added regularly',
  ];

  return (
    <div className="page-enter max-w-2xl mx-auto py-6 sm:py-12 px-4">
      <div className="text-center mb-8">
        <PageTitle className="justify-center mb-3">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase">
            Simple Pricing
          </h1>
        </PageTitle>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          One plan. Full access. No hidden fees.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setBilling('monthly')}
          className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${
            billing === 'monthly'
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling('yearly')}
          className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-all relative ${
            billing === 'yearly'
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          Yearly
          <span className="absolute -top-2.5 -right-2.5 text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded font-bold">
            -58%
          </span>
        </button>
      </div>

      {/* Pricing card */}
      <div className="border-2 border-gray-900 rounded-2xl overflow-hidden bg-white">
        <div className="bg-gray-900 text-white px-6 py-5 sm:py-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400 mb-1">Pro</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black">{price}€</span>
                <span className="text-gray-400 text-sm font-bold">/{billing === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
            </div>
            {billing === 'yearly' && (
              <p className="text-xs text-primary-400 font-bold">
                ~{perMonth}€/mo
              </p>
            )}
          </div>
        </div>

        <div className="p-6">
          <ul className="space-y-4 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <a
            href="/login"
            className="block w-full text-center bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition-colors text-sm uppercase"
          >
            <Zap className="w-4 h-4 inline mr-1" />
            Get Started
          </a>

          <p className="text-center text-xs text-gray-400 mt-3">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </div>

      {/* Free tier mention */}
      <div className="mt-6 border-2 border-gray-200 rounded-xl p-5 bg-gray-50 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-bold text-gray-700 uppercase">Free Preview</p>
        </div>
        <p className="text-xs text-gray-500">
          Try the first lessons of each path for free. No credit card required.
        </p>
      </div>
    </div>
  );
}
