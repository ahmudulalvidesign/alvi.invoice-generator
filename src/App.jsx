import React, { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CreateInvoice from './pages/CreateInvoice'
import SavedInvoices from './pages/SavedInvoices'
import Settings from './pages/Settings'
import { SettingsProvider } from './context/SettingsContext'
import { InvoiceProvider } from './context/InvoiceContext'
import { Menu, X } from 'lucide-react'
import { useSettings } from './context/SettingsContext'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toggleTheme, settings } = useSettings()

  return (
    <div className="flex min-h-screen bg-bg dark:bg-dark-bg">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div className={`
        fixed inset-y-0 left-0 z-40 lg:static lg:z-auto
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-white dark:bg-dark-card border-b border-border dark:border-dark-border flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="./logo.png" alt="logo" className="w-7 h-7 rounded-md object-contain" />
            <span className="font-semibold text-sm text-primary dark:text-gray-100">Invoice Generator</span>
          </div>
          <div className="w-9" />
        </header>

        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<CreateInvoice />} />
            <Route path="/edit/:id" element={<CreateInvoice />} />
            <Route path="/saved" element={<SavedInvoices />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <InvoiceProvider>
        <HashRouter>
          <Layout />
        </HashRouter>
      </InvoiceProvider>
    </SettingsProvider>
  )
}
