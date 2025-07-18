"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Markets Circulation Multiplier
          </h1>
          <p className="text-xl text-slate-300 mb-2">by Kijun Capital</p>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Professional trading platform with institutional-grade signals and advanced market analysis tools. 
            Access comprehensive trading platforms with candlestick charts and market circulation analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg"
              onClick={() => router.push('/trading')}
            >
              Launch Trading Platform
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-400 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Institutional Signals</CardTitle>
              <CardDescription className="text-slate-400">
                Detect liquidity sweeps and bank-level trade entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Advanced algorithms monitor market microstructure to identify when major institutions enter positions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Management</CardTitle>
              <CardDescription className="text-slate-400">
                Tight stops with optimized risk-reward ratios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Precision entry points with calculated stop losses and high-probability take profit targets.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Real-Time Analytics</CardTitle>
              <CardDescription className="text-slate-400">
                Professional trading tools and market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Comprehensive market data, order flow analysis, and institutional-grade charting tools.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            * This platform provides simulated trading signals for educational purposes. 
            Past performance does not guarantee future results. Trading involves risk.
          </p>
        </div>
      </div>
    </div>
  )
}
