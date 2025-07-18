"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/trading' },
    { name: 'Signals', href: '/trading#signals' },
    { name: 'History', href: '/trading#history' },
    { name: 'Analytics', href: '/trading#analytics' },
  ]

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Kijun Capital
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Market Open</span>
            </div>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Account
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300">
                  <span className="sr-only">Open menu</span>
                  <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span className="block w-5 h-0.5 bg-current mb-1"></span>
                    <span className="block w-5 h-0.5 bg-current mb-1"></span>
                    <span className="block w-5 h-0.5 bg-current"></span>
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 border-slate-700">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-slate-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-slate-300">Market Open</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 mx-3">
                      Account
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="bg-amber-900/20 border-b border-amber-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2">
            <p className="text-xs text-amber-200 text-center">
              Trading signals are simulated for educational purposes. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
