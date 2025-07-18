"use client"

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const [activeSection, setActiveSection] = useState('dashboard')

  const navigation = [
    {
      name: 'Dashboard',
      id: 'dashboard',
      href: '#dashboard',
      description: 'Overview & Live Signals'
    },
    {
      name: 'Active Signals',
      id: 'signals',
      href: '#signals',
      description: 'Current Trading Opportunities'
    },
    {
      name: 'Market Analysis',
      id: 'analysis',
      href: '#analysis',
      description: 'Charts & Technical Analysis'
    },
    {
      name: 'Trade History',
      id: 'history',
      href: '#history',
      description: 'Past Trades & Performance'
    },
    {
      name: 'Risk Management',
      id: 'risk',
      href: '#risk',
      description: 'Position Sizing & Stops'
    },
    {
      name: 'Order Flow',
      id: 'orderflow',
      href: '#orderflow',
      description: 'Institutional Activity'
    },
    {
      name: 'Economic Calendar',
      id: 'calendar',
      href: '#calendar',
      description: 'Market Events & News'
    },
    {
      name: 'Settings',
      id: 'settings',
      href: '#settings',
      description: 'Platform Configuration'
    }
  ]

  const marketStats = [
    { label: 'Active Signals', value: '3', color: 'text-green-400' },
    { label: 'Win Rate', value: '87%', color: 'text-emerald-400' },
    { label: 'Daily P&L', value: '+$2,340', color: 'text-green-400' },
    { label: 'Risk Level', value: 'Low', color: 'text-blue-400' }
  ]

  return (
    <div className={cn("bg-slate-900 border-r border-slate-700 h-full flex flex-col", className)}>
      {/* Trading Tools Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-1">Kijun Capital</h2>
        <p className="text-xs text-slate-400">Markets Circulation Multiplier</p>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Live Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {marketStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={cn("text-sm font-bold", stat.color)}>
                {stat.value}
              </div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "block px-3 py-3 rounded-lg text-sm transition-all duration-200 group",
              activeSection === item.id
                ? "bg-slate-800 text-white border border-slate-600"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-slate-500 group-hover:text-slate-400 mt-1">
              {item.description}
            </div>
          </a>
        ))}
      </nav>

      {/* Market Status */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">Market Status</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">ACTIVE</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          <div>Session: London/NY Overlap</div>
          <div>Volatility: High</div>
          <div>Next Event: 2h 15m</div>
        </div>
      </div>

      {/* Trading Session Timer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Session Ends In</div>
          <div className="text-lg font-mono text-white">04:23:17</div>
          <div className="text-xs text-slate-500 mt-1">
            Optimal trading window active
          </div>
        </div>
      </div>
    </div>
  )
}
