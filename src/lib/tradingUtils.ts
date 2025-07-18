export interface TradingSignal {
  id: string
  timestamp: Date
  signalType: 'Liquidity Sweep' | 'Bank Entry' | 'Institutional Flow' | 'Smart Money'
  pair: string
  entryPrice: number
  stopLoss: number
  takeProfit: number
  riskRewardRatio: number
  confidence: number
  status: 'Active' | 'Completed' | 'Stopped'
  pnl?: number
}

export interface MarketData {
  timestamp: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
  signal?: TradingSignal
}

const CURRENCY_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 
  'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
]

const SIGNAL_TYPES: TradingSignal['signalType'][] = [
  'Liquidity Sweep', 'Bank Entry', 'Institutional Flow', 'Smart Money'
]

export function generateRandomPrice(basePrice: number, volatility: number = 0.001): number {
  const change = (Math.random() - 0.5) * 2 * volatility
  return Number((basePrice * (1 + change)).toFixed(5))
}

export function generateTradingSignal(): TradingSignal {
  const pair = CURRENCY_PAIRS[Math.floor(Math.random() * CURRENCY_PAIRS.length)]
  const signalType = SIGNAL_TYPES[Math.floor(Math.random() * SIGNAL_TYPES.length)]
  
  // Base prices for different pairs
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

  const basePrice = basePrices[pair] || 1.0000
  const entryPrice = generateRandomPrice(basePrice, 0.002)
  
  // Generate tight stop loss (10-20 pips typically)
  const stopDistance = entryPrice * (0.0008 + Math.random() * 0.0012) // 8-20 pips
  const stopLoss = Number((entryPrice - stopDistance).toFixed(5))
  
  // Generate large take profit (50-150 pips typically)
  const profitDistance = entryPrice * (0.003 + Math.random() * 0.008) // 30-80 pips
  const takeProfit = Number((entryPrice + profitDistance).toFixed(5))
  
  const riskRewardRatio = Number((profitDistance / stopDistance).toFixed(2))
  
  return {
    id: `SIG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    signalType,
    pair,
    entryPrice,
    stopLoss,
    takeProfit,
    riskRewardRatio,
    confidence: 85 + Math.random() * 15, // 85-100% confidence
    status: 'Active'
  }
}

export function generateMarketData(pair: string, hours: number = 24): MarketData[] {
  const data: MarketData[] = []
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

  let currentPrice = basePrices[pair] || 1.0000
  const now = new Date()
  
  // Generate data points every 5 minutes for the specified hours
  const totalPoints = hours * 12 // 12 points per hour (every 5 minutes)
  
  for (let i = totalPoints; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000))
    
    // Generate candlestick data
    const volatility = 0.0005 + Math.random() * 0.0010
    const open = currentPrice
    const close = generateRandomPrice(currentPrice, volatility)
    const high = Math.max(open, close) + (Math.random() * 0.0005)
    const low = Math.min(open, close) - (Math.random() * 0.0005)
    
    const volume = 1000 + Math.random() * 5000
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: Math.floor(volume)
    })
    
    currentPrice = close
  }
  
  return data
}

export function calculatePnL(signal: TradingSignal, currentPrice: number): number {
  if (signal.status !== 'Active') return signal.pnl || 0
  
  const priceDiff = currentPrice - signal.entryPrice
  const pips = Math.abs(priceDiff) * 10000 // Convert to pips
  
  if (currentPrice >= signal.takeProfit) {
    return Number((pips * 10).toFixed(2)) // $10 per pip profit
  } else if (currentPrice <= signal.stopLoss) {
    return Number((-pips * 10).toFixed(2)) // $10 per pip loss
  }
  
  return Number((priceDiff > 0 ? pips * 10 : -pips * 10).toFixed(2))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatPrice(price: number, pair: string): string {
  const decimalPlaces = pair.includes('JPY') ? 3 : 5
  return price.toFixed(decimalPlaces)
}
