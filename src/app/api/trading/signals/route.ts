import { NextResponse } from 'next/server'
import { generateTradingSignal, generateMarketData, type TradingSignal } from '@/lib/tradingUtils'

// In-memory storage for demo purposes
let activeSignals: TradingSignal[] = []
let lastSignalTime = 0

export async function GET() {
  try {
    const now = Date.now()
    
    // Generate new signal every 30-60 seconds
    if (now - lastSignalTime > 30000 + Math.random() * 30000) {
      const newSignal = generateTradingSignal()
      activeSignals.unshift(newSignal)
      lastSignalTime = now
      
      // Keep only last 10 signals
      if (activeSignals.length > 10) {
        activeSignals = activeSignals.slice(0, 10)
      }
    }
    
    // Generate some initial signals if none exist
    if (activeSignals.length === 0) {
      for (let i = 0; i < 3; i++) {
        const signal = generateTradingSignal()
        // Stagger timestamps
        signal.timestamp = new Date(now - (i * 60000))
        activeSignals.push(signal)
      }
      lastSignalTime = now
    }
    
    return NextResponse.json({
      success: true,
      signals: activeSignals,
      timestamp: new Date().toISOString(),
      marketStatus: 'OPEN'
    })
    
  } catch (error) {
    console.error('Error generating trading signals:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate trading signals',
        signals: [],
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, signalId } = body
    
    if (action === 'close' && signalId) {
      const signalIndex = activeSignals.findIndex(s => s.id === signalId)
      if (signalIndex !== -1) {
        activeSignals[signalIndex].status = 'Completed'
        activeSignals[signalIndex].pnl = Math.random() > 0.3 ? 
          (50 + Math.random() * 200) : // 70% chance of profit
          -(20 + Math.random() * 80)   // 30% chance of loss
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Signal updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating signal:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update signal' 
      },
      { status: 500 }
    )
  }
}
