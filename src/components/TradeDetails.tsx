"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatCurrency, calculatePnL } from '@/lib/tradingUtils'
import type { TradingSignal } from '@/lib/tradingUtils'

interface TradeDetailsProps {
  signals: TradingSignal[]
  currentPrices: { [key: string]: number }
  onCloseSignal?: (signalId: string) => void
}

export default function TradeDetails({ signals, currentPrices, onCloseSignal }: TradeDetailsProps) {
  const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null)
  const [timeElapsed, setTimeElapsed] = useState<{ [key: string]: string }>({})

  // Update time elapsed for each signal
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeElapsed: { [key: string]: string } = {}
      signals.forEach(signal => {
        const timestamp = new Date(signal.timestamp)
        const elapsed = Date.now() - timestamp.getTime()
        const minutes = Math.floor(elapsed / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        
        if (days > 0) {
          newTimeElapsed[signal.id] = `${days}d ${hours % 24}h`
        } else if (hours > 0) {
          newTimeElapsed[signal.id] = `${hours}h ${minutes % 60}m`
        } else {
          newTimeElapsed[signal.id] = `${minutes}m`
        }
      })
      setTimeElapsed(newTimeElapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [signals])

  // Auto-select first active signal if none selected
  useEffect(() => {
    if (!selectedSignal && signals.length > 0) {
      const activeSignal = signals.find(s => s.status === 'Active') || signals[0]
      setSelectedSignal(activeSignal)
    }
  }, [signals, selectedSignal])

  const activeSignals = signals.filter(s => s.status === 'Active')
  const currentPrice = selectedSignal ? currentPrices[selectedSignal.pair] || selectedSignal.entryPrice : 0
  const unrealizedPnL = selectedSignal ? calculatePnL(selectedSignal, currentPrice) : 0

  // Calculate progress to target
  const getProgressToTarget = (signal: TradingSignal, current: number) => {
    const entryToTarget = Math.abs(signal.takeProfit - signal.entryPrice)
    const currentToEntry = Math.abs(current - signal.entryPrice)
    return Math.min((currentToEntry / entryToTarget) * 100, 100)
  }

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'Liquidity Sweep': return 'bg-purple-600'
      case 'Bank Entry': return 'bg-blue-600'
      case 'Institutional Flow': return 'bg-emerald-600'
      case 'Smart Money': return 'bg-amber-600'
      default: return 'bg-slate-600'
    }
  }

  if (signals.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Trade Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-4">No active signals</div>
            <p className="text-sm text-slate-500">
              Waiting for institutional liquidity sweeps and bank entries...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Signal Selector */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Active Signals ({activeSignals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {signals.slice(0, 5).map((signal) => (
              <div
                key={signal.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSignal?.id === signal.id
                    ? 'border-blue-500 bg-slate-800'
                    : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
                onClick={() => setSelectedSignal(signal)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getSignalTypeColor(signal.signalType)}>
                      {signal.signalType}
                    </Badge>
                    <span className="text-white font-medium">{signal.pair}</span>
                    <Badge variant={signal.status === 'Active' ? 'default' : 'secondary'}>
                      {signal.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">{timeElapsed[signal.id] || '0m'}</div>
                    <div className="text-xs text-slate-500">
                      {signal.confidence.toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Signal Details */}
      {selectedSignal && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {selectedSignal.pair} - {selectedSignal.signalType}
              </CardTitle>
              <Badge className={getSignalTypeColor(selectedSignal.signalType)}>
                {selectedSignal.confidence.toFixed(0)}% Confidence
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Levels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Entry Price</label>
                  <div className="text-lg font-mono text-white">
                    {formatPrice(selectedSignal.entryPrice, selectedSignal.pair)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Current Price</label>
                  <div className="text-lg font-mono text-white">
                    {formatPrice(currentPrice, selectedSignal.pair)}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-slate-400">Stop Loss</label>
                  <div className="text-lg font-mono text-red-400">
                    {formatPrice(selectedSignal.stopLoss, selectedSignal.pair)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Take Profit</label>
                  <div className="text-lg font-mono text-green-400">
                    {formatPrice(selectedSignal.takeProfit, selectedSignal.pair)}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* P&L and Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Unrealized P&L</span>
                <span className={`text-lg font-bold ${
                  unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(unrealizedPnL)}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Progress to Target</span>
                  <span className="text-sm text-slate-300">
                    {getProgressToTarget(selectedSignal, currentPrice).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={getProgressToTarget(selectedSignal, currentPrice)} 
                  className="h-2"
                />
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Trade Metrics */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Risk/Reward Ratio</span>
                <div className="text-white font-medium">1:{selectedSignal.riskRewardRatio}</div>
              </div>
              <div>
                <span className="text-slate-400">Time Active</span>
                <div className="text-white font-medium">{timeElapsed[selectedSignal.id] || '0m'}</div>
              </div>
              <div>
                <span className="text-slate-400">Signal Strength</span>
                <div className="text-white font-medium">
                  {selectedSignal.confidence > 90 ? 'Very High' : 
                   selectedSignal.confidence > 80 ? 'High' : 'Medium'}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Market Session</span>
                <div className="text-white font-medium">London/NY</div>
              </div>
            </div>

            {/* Action Buttons */}
            {selectedSignal.status === 'Active' && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => onCloseSignal?.(selectedSignal.id)}
                >
                  Close Position
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Modify Levels
                </Button>
              </div>
            )}

            {/* Signal Analysis */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Signal Analysis</h4>
              <p className="text-sm text-slate-300">
                {selectedSignal.signalType === 'Liquidity Sweep' && 
                  "Detected institutional liquidity sweep above previous highs. Banks likely entering short positions after grabbing retail stops."}
                {selectedSignal.signalType === 'Bank Entry' && 
                  "Major bank order flow detected. Large institutional position being established at key support/resistance level."}
                {selectedSignal.signalType === 'Institutional Flow' && 
                  "Significant institutional money flow identified. Smart money positioning for major market move."}
                {selectedSignal.signalType === 'Smart Money' && 
                  "Smart money accumulation pattern detected. Professional traders building positions at optimal levels."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
