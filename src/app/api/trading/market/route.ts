import { NextResponse } from 'next/server'
import { generateMarketData, generateRandomPrice } from '@/lib/tradingUtils'

const MAJOR_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD']

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pair = searchParams.get('pair') || 'EUR/USD'
    const hours = parseInt(searchParams.get('hours') || '24')
    
    // Generate market data
    const marketData = generateMarketData(pair, Math.min(hours, 168)) // Max 1 week
    
    // Generate current prices for all major pairs
    const currentPrices: { [key: string]: number } = {}
    const basePrices: { [key: string]: number } = {
      'EUR/USD': 1.0850,
      'GBP/USD': 1.2650,
      'USD/JPY': 149.50,
      'USD/CHF': 0.8750,
      'AUD/USD': 0.6550,
      'USD/CAD': 1.3650,
      'NZD/USD': 0.6050,
      'EUR/GBP': 0.8580,
      'EUR/JPY': 162.30,
      'GBP/JPY': 189.20
    }
    
    MAJOR_PAIRS.forEach(p => {
      currentPrices[p] = generateRandomPrice(basePrices[p] || 1.0000, 0.001)
    })
    
    // Calculate some market statistics
    const closes = marketData.map(d => d.close)
    const highs = marketData.map(d => d.high)
    const lows = marketData.map(d => d.low)
    const high24h = Math.max(...highs)
    const low24h = Math.min(...lows)
    const open24h = marketData[0].open
    const current = marketData[marketData.length - 1].close
    const change24h = ((current - open24h) / open24h) * 100
    
    return NextResponse.json({
      success: true,
      pair,
      data: marketData,
      currentPrices,
      statistics: {
        current: Number(current.toFixed(5)),
        high24h: Number(high24h.toFixed(5)),
        low24h: Number(low24h.toFixed(5)),
        open24h: Number(open24h.toFixed(5)),
        change24h: Number(change24h.toFixed(2)),
        volume24h: marketData.reduce((sum, d) => sum + d.volume, 0)
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error generating market data:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate market data',
        data: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
