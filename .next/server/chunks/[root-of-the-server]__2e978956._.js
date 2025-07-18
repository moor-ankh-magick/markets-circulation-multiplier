module.exports = {

"[project]/.next-internal/server/app/api/trading/signals/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/tradingUtils.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "calculatePnL": (()=>calculatePnL),
    "formatCurrency": (()=>formatCurrency),
    "formatPrice": (()=>formatPrice),
    "generateMarketData": (()=>generateMarketData),
    "generateRandomPrice": (()=>generateRandomPrice),
    "generateTradingSignal": (()=>generateTradingSignal)
});
const CURRENCY_PAIRS = [
    'EUR/USD',
    'GBP/USD',
    'USD/JPY',
    'USD/CHF',
    'AUD/USD',
    'USD/CAD',
    'NZD/USD',
    'EUR/GBP',
    'EUR/JPY',
    'GBP/JPY'
];
const SIGNAL_TYPES = [
    'Liquidity Sweep',
    'Bank Entry',
    'Institutional Flow',
    'Smart Money'
];
function generateRandomPrice(basePrice, volatility = 0.001) {
    const change = (Math.random() - 0.5) * 2 * volatility;
    return Number((basePrice * (1 + change)).toFixed(5));
}
function generateTradingSignal() {
    const pair = CURRENCY_PAIRS[Math.floor(Math.random() * CURRENCY_PAIRS.length)];
    const signalType = SIGNAL_TYPES[Math.floor(Math.random() * SIGNAL_TYPES.length)];
    // Base prices for different pairs
    const basePrices = {
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
    };
    const basePrice = basePrices[pair] || 1.0000;
    const entryPrice = generateRandomPrice(basePrice, 0.002);
    // Generate tight stop loss (10-20 pips typically)
    const stopDistance = entryPrice * (0.0008 + Math.random() * 0.0012) // 8-20 pips
    ;
    const stopLoss = Number((entryPrice - stopDistance).toFixed(5));
    // Generate large take profit (50-150 pips typically)
    const profitDistance = entryPrice * (0.003 + Math.random() * 0.008) // 30-80 pips
    ;
    const takeProfit = Number((entryPrice + profitDistance).toFixed(5));
    const riskRewardRatio = Number((profitDistance / stopDistance).toFixed(2));
    return {
        id: `SIG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        signalType,
        pair,
        entryPrice,
        stopLoss,
        takeProfit,
        riskRewardRatio,
        confidence: 85 + Math.random() * 15,
        status: 'Active'
    };
}
function generateMarketData(pair, hours = 24) {
    const data = [];
    const basePrices = {
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
    };
    let currentPrice = basePrices[pair] || 1.0000;
    const now = new Date();
    // Generate data points every 5 minutes for the specified hours
    const totalPoints = hours * 12 // 12 points per hour (every 5 minutes)
    ;
    for(let i = totalPoints; i >= 0; i--){
        const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000);
        // Generate candlestick data
        const volatility = 0.0005 + Math.random() * 0.0010;
        const open = currentPrice;
        const close = generateRandomPrice(currentPrice, volatility);
        const high = Math.max(open, close) + Math.random() * 0.0005;
        const low = Math.min(open, close) - Math.random() * 0.0005;
        const volume = 1000 + Math.random() * 5000;
        data.push({
            timestamp,
            open,
            high,
            low,
            close,
            volume: Math.floor(volume)
        });
        currentPrice = close;
    }
    return data;
}
function calculatePnL(signal, currentPrice) {
    if (signal.status !== 'Active') return signal.pnl || 0;
    const priceDiff = currentPrice - signal.entryPrice;
    const pips = Math.abs(priceDiff) * 10000 // Convert to pips
    ;
    if (currentPrice >= signal.takeProfit) {
        return Number((pips * 10).toFixed(2)) // $10 per pip profit
        ;
    } else if (currentPrice <= signal.stopLoss) {
        return Number((-pips * 10).toFixed(2)) // $10 per pip loss
        ;
    }
    return Number((priceDiff > 0 ? pips * 10 : -pips * 10).toFixed(2));
}
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
function formatPrice(price, pair) {
    const decimalPlaces = pair.includes('JPY') ? 3 : 5;
    return price.toFixed(decimalPlaces);
}
}}),
"[project]/src/app/api/trading/signals/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tradingUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tradingUtils.ts [app-route] (ecmascript)");
;
;
// In-memory storage for demo purposes
let activeSignals = [];
let lastSignalTime = 0;
async function GET() {
    try {
        const now = Date.now();
        // Generate new signal every 30-60 seconds
        if (now - lastSignalTime > 30000 + Math.random() * 30000) {
            const newSignal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tradingUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTradingSignal"])();
            activeSignals.unshift(newSignal);
            lastSignalTime = now;
            // Keep only last 10 signals
            if (activeSignals.length > 10) {
                activeSignals = activeSignals.slice(0, 10);
            }
        }
        // Generate some initial signals if none exist
        if (activeSignals.length === 0) {
            for(let i = 0; i < 3; i++){
                const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tradingUtils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateTradingSignal"])();
                // Stagger timestamps
                signal.timestamp = new Date(now - i * 60000);
                activeSignals.push(signal);
            }
            lastSignalTime = now;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            signals: activeSignals,
            timestamp: new Date().toISOString(),
            marketStatus: 'OPEN'
        });
    } catch (error) {
        console.error('Error generating trading signals:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to generate trading signals',
            signals: [],
            timestamp: new Date().toISOString()
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { action, signalId } = body;
        if (action === 'close' && signalId) {
            const signalIndex = activeSignals.findIndex((s)=>s.id === signalId);
            if (signalIndex !== -1) {
                activeSignals[signalIndex].status = 'Completed';
                activeSignals[signalIndex].pnl = Math.random() > 0.3 ? 50 + Math.random() * 200 : -(20 + Math.random() * 80) // 30% chance of loss
                ;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Signal updated successfully'
        });
    } catch (error) {
        console.error('Error updating signal:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to update signal'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__2e978956._.js.map