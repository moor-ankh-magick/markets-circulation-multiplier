"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/tradingUtils'
import type { MarketData, TradingSignal } from '@/lib/tradingUtils'

interface TradingChartProps {
  pair: string
  data: MarketData[]
  signals: TradingSignal[]
  onPairChange: (pair: string) => void
}

const TIMEFRAMES = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' }
]

const CURRENCY_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 
  'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
]

export default function TradingChart({ pair, data, signals, onPairChange }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState('1h')
  const [showSignals, setShowSignals] = useState(true)

  // Format data for chart
  const chartData = data.map((item, index) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    index
  }))

  // Get current price and calculate change
  const currentPrice = data[data.length - 1]?.close || 0
  const previousPrice = data[data.length - 2]?.close || currentPrice
  const priceChange = currentPrice - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100)

  // Get active signals for this pair
  const pairSignals = signals.filter(s => s.pair === pair && s.status === 'Active')

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <p className="text-slate-300 text-sm">{`Time: ${label}`}</p>
          <p className="text-white font-medium">
            {`Price: ${formatPrice(payload[0].value, pair)}`}
          </p>
          <p className="text-slate-400 text-sm">
            {`Volume: ${data.volume.toLocaleString()}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-white text-xl">{pair}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-mono text-white">
                {formatPrice(currentPrice, pair)}
              </span>
              <Badge 
                variant={priceChange >= 0 ? "default" : "destructive"}
                className={priceChange >= 0 ? "bg-green-600" : "bg-red-600"}
              >
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={pair} onValueChange={onPairChange}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {CURRENCY_PAIRS.map((p) => (
                  <SelectItem key={p} value={p} className="text-white hover:bg-slate-700">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex bg-slate-800 rounded-lg p-1">
              {TIMEFRAMES.map((tf) => (
                <Button
                  key={tf.value}
                  variant={timeframe === tf.value ? "default" : "ghost"}
                  size="sm"
                  className={`px-3 py-1 text-xs ${
                    timeframe === tf.value 
                      ? "bg-slate-600 text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-700"
                  }`}
                  onClick={() => setTimeframe(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>

            <Button
              variant={showSignals ? "default" : "outline"}
              size="sm"
              className={showSignals ? "bg-emerald-600 hover:bg-emerald-700" : "border-slate-600 text-slate-300"}
              onClick={() => setShowSignals(!showSignals)}
            >
              Signals
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={['dataMin - 0.001', 'dataMax + 0.001']}
                tickFormatter={(value) => formatPrice(value, pair)}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10B981" }}
              />

              {/* Signal Reference Lines */}
              {showSignals && pairSignals.map((signal) => (
                <g key={signal.id}>
                  <ReferenceLine 
                    y={signal.entryPrice} 
                    stroke="#3B82F6" 
                    strokeDasharray="5 5"
                    label={{ value: "Entry", position: "right" }}
                  />
                  <ReferenceLine 
                    y={signal.stopLoss} 
                    stroke="#EF4444" 
                    strokeDasharray="3 3"
                    label={{ value: "Stop", position: "right" }}
                  />
                  <ReferenceLine 
                    y={signal.takeProfit} 
                    stroke="#10B981" 
                    strokeDasharray="3 3"
                    label={{ value: "Target", position: "right" }}
                  />
                </g>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-slate-400">Entry Price</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-slate-400">Stop Loss</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-slate-400">Take Profit</span>
            </div>
          </div>
          
          <div className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
