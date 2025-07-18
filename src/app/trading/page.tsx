"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import TradingChart from '@/components/TradingChart'
import TradeDetails from '@/components/TradeDetails'
import TradeHistory from '@/components/TradeHistory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatCurrency, calculatePnL } from '@/lib/tradingUtils'
import type { TradingSignal, MarketData } from '@/lib/tradingUtils'

export default function TradingDashboard() {
  const [signals, setSignals] = useState<TradingSignal[]>([])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [currentPrices, setCurrentPrices] = useState<{ [key: string]: number }>({})
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch trading signals
  const fetchSignals = async () => {
    try {
      const response = await fetch('/api/trading/signals')
      if (!response.ok) throw new Error('Failed to fetch signals')
      const data = await response.json()
      setSignals(data.signals || [])
    } catch (err) {
      console.error('Error fetching signals:', err)
      setError('Failed to load trading signals')
    }
  }

  // Fetch market data
  const fetchMarketData = async (pair: string) => {
    try {
      const response = await fetch(`/api/trading/market?pair=${pair}`)
      if (!response.ok) throw new Error('Failed to fetch market data')
      const data = await response.json()
      setMarketData(data.data || [])
      setCurrentPrices(data.currentPrices || {})
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError('Failed to load market data')
    }
  }

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchSignals(),
        fetchMarketData(selectedPair)
      ])
      setLoading(false)
    }
    loadData()
  }, [])

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignals()
      fetchMarketData(selectedPair)
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [selectedPair])

  // Handle pair change
  const handlePairChange = (pair: string) => {
    setSelectedPair(pair)
    fetchMarketData(pair)
  }

  // Handle signal close
  const handleCloseSignal = async (signalId: string) => {
    try {
      await fetch('/api/trading/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close', signalId })
      })
      await fetchSignals()
    } catch (err) {
      console.error('Error closing signal:', err)
    }
  }

  // Calculate total P&L
  const totalPnL = signals
    .filter(s => s.status === 'Active')
    .reduce((sum, signal) => {
      const currentPrice = currentPrices[signal.pair] || signal.entryPrice
      return sum + calculatePnL(signal, currentPrice)
    }, 0)

  const activeSignals = signals.filter(s => s.status === 'Active')
  const completedSignals = signals.filter(s => s.status !== 'Active')

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading trading platform...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-64 border-r border-slate-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Dashboard Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Trading Dashboard</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-green-600 text-green-400">
                    {activeSignals.length} Active
                  </Badge>
                  <Badge variant="outline" className="border-blue-600 text-blue-400">
                    {completedSignals.length} Completed
                  </Badge>
                </div>
                <div className="text-slate-300">
                  Total P&L: <span className={totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatCurrency(totalPnL)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Chart and Details */}
              <div className="xl:col-span-2 space-y-6">
                <TradingChart
                  pair={selectedPair}
                  data={marketData}
                  signals={signals}
                  onPairChange={handlePairChange}
                />
                
                <TradeHistory signals={signals} />
              </div>

              {/* Right Column - Trade Details */}
              <div className="space-y-6">
                <TradeDetails
                  signals={signals}
                  currentPrices={currentPrices}
                  onCloseSignal={handleCloseSignal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
