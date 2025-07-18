"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPrice, formatCurrency } from '@/lib/tradingUtils'
import type { TradingSignal } from '@/lib/tradingUtils'

interface TradeHistoryProps {
  signals: TradingSignal[]
}

// Generate some historical trades for demo
const generateHistoricalTrades = (): TradingSignal[] => {
  const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF']
  const signalTypes = ['Liquidity Sweep', 'Bank Entry', 'Institutional Flow', 'Smart Money']
  const trades: TradingSignal[] = []

  for (let i = 0; i < 25; i++) {
    const pair = pairs[Math.floor(Math.random() * pairs.length)]
    const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)] as TradingSignal['signalType']
    const isWin = Math.random() > 0.25 // 75% win rate
    
    const basePrice = pair === 'USD/JPY' ? 149.50 : 1.0850
    const entryPrice = basePrice + (Math.random() - 0.5) * 0.01
    const stopDistance = entryPrice * (0.0008 + Math.random() * 0.0012)
    const profitDistance = entryPrice * (0.003 + Math.random() * 0.008)
    
    const pnl = isWin ? 
      (50 + Math.random() * 300) : // Win: $50-$350
      -(20 + Math.random() * 100)  // Loss: -$20 to -$120

    trades.push({
      id: `HIST_${i}`,
      timestamp: new Date(Date.now() - (i * 3600000) - Math.random() * 86400000), // Random times in past days
      signalType,
      pair,
      entryPrice,
      stopLoss: entryPrice - stopDistance,
      takeProfit: entryPrice + profitDistance,
      riskRewardRatio: Number((profitDistance / stopDistance).toFixed(2)),
      confidence: 85 + Math.random() * 15,
      status: isWin ? 'Completed' : 'Stopped',
      pnl
    })
  }

  return trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export default function TradeHistory({ signals }: TradeHistoryProps) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [historicalTrades] = useState(() => generateHistoricalTrades())

  // Combine current signals with historical trades
  const allTrades = useMemo(() => {
    const completedSignals = signals.filter(s => s.status !== 'Active')
    return [...completedSignals, ...historicalTrades]
  }, [signals, historicalTrades])

  // Filter trades
  const filteredTrades = useMemo(() => {
    let filtered = allTrades

    if (filter === 'wins') {
      filtered = filtered.filter(t => (t.pnl || 0) > 0)
    } else if (filter === 'losses') {
      filtered = filtered.filter(t => (t.pnl || 0) < 0)
    } else if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      filtered = filtered.filter(t => t.timestamp >= today)
    }

    // Sort trades
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    } else if (sortBy === 'pnl') {
      filtered.sort((a, b) => (b.pnl || 0) - (a.pnl || 0))
    } else if (sortBy === 'pair') {
      filtered.sort((a, b) => a.pair.localeCompare(b.pair))
    }

    return filtered
  }, [allTrades, filter, sortBy])

  // Calculate statistics
  const stats = useMemo(() => {
    const trades = filteredTrades.filter(t => t.pnl !== undefined)
    const totalTrades = trades.length
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0).length
    const losingTrades = trades.filter(t => (t.pnl || 0) < 0).length
    const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0)
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const avgWin = winningTrades > 0 ? 
      trades.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades : 0
    const avgLoss = losingTrades > 0 ? 
      Math.abs(trades.filter(t => (t.pnl || 0) < 0).reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades) : 0

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0
    }
  }, [filteredTrades])

  const getSignalTypeColor = (type: string) => {
    switch (type) {
      case 'Liquidity Sweep': return 'bg-purple-600'
      case 'Bank Entry': return 'bg-blue-600'
      case 'Institutional Flow': return 'bg-emerald-600'
      case 'Smart Money': return 'bg-amber-600'
      default: return 'bg-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Statistics */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
              <div className="text-sm text-slate-400">Total Trades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(stats.totalPnL)}
              </div>
              <div className="text-sm text-slate-400">Total P&L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.profitFactor.toFixed(2)}
              </div>
              <div className="text-sm text-slate-400">Profit Factor</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-400">
                {formatCurrency(stats.avgWin)}
              </div>
              <div className="text-sm text-slate-400">Avg Win</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-400">
                {formatCurrency(stats.avgLoss)}
              </div>
              <div className="text-sm text-slate-400">Avg Loss</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade History Table */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-white">Trade History</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white">All Trades</SelectItem>
                  <SelectItem value="wins" className="text-white">Wins Only</SelectItem>
                  <SelectItem value="losses" className="text-white">Losses Only</SelectItem>
                  <SelectItem value="today" className="text-white">Today</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="date" className="text-white">By Date</SelectItem>
                  <SelectItem value="pnl" className="text-white">By P&L</SelectItem>
                  <SelectItem value="pair" className="text-white">By Pair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Date/Time</TableHead>
                  <TableHead className="text-slate-300">Signal Type</TableHead>
                  <TableHead className="text-slate-300">Pair</TableHead>
                  <TableHead className="text-slate-300">Entry</TableHead>
                  <TableHead className="text-slate-300">Exit</TableHead>
                  <TableHead className="text-slate-300">R:R</TableHead>
                  <TableHead className="text-slate-300">P&L</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrades.slice(0, 20).map((trade) => (
                  <TableRow key={trade.id} className="border-slate-700 hover:bg-slate-800/50">
                    <TableCell className="text-slate-300">
                      <div className="text-sm">
                        {new Date(trade.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSignalTypeColor(trade.signalType)}>
                        {trade.signalType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {trade.pair}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      {formatPrice(trade.entryPrice, trade.pair)}
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono">
                      {trade.status === 'Completed' ? 
                        formatPrice(trade.takeProfit, trade.pair) :
                        formatPrice(trade.stopLoss, trade.pair)
                      }
                    </TableCell>
                    <TableCell className="text-slate-300">
                      1:{trade.riskRewardRatio}
                    </TableCell>
                    <TableCell className={`font-bold ${
                      (trade.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.pnl ? formatCurrency(trade.pnl) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={trade.status === 'Completed' ? 'default' : 'destructive'}
                        className={trade.status === 'Completed' ? 'bg-green-600' : 'bg-red-600'}
                      >
                        {trade.status === 'Completed' ? 'Win' : 'Loss'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTrades.length === 0 && (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-2">No trades found</div>
              <p className="text-sm text-slate-500">
                Try adjusting your filters or wait for more trading activity.
              </p>
            </div>
          )}
          
          {filteredTrades.length > 20 && (
            <div className="text-center mt-4 pt-4 border-t border-slate-700">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                Load More Trades
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
