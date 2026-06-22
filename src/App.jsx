import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import CreateInvoice from './pages/CreateInvoice'
import SavedInvoices from './pages/SavedInvoices'
import Settings from './pages/Settings'
import { SettingsProvider } from './context/SettingsContext'
import { InvoiceProvider } from './context/InvoiceContext'

export default function App() {
  return (
    <SettingsProvider>
      <InvoiceProvider>
        <HashRouter>
          <div className="flex min-h-screen bg-bg dark:bg-dark-bg">
            <Sidebar />
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<CreateInvoice />} />
                <Route path="/edit/:id" element={<CreateInvoice />} />
                <Route path="/saved" element={<SavedInvoices />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </HashRouter>
      </InvoiceProvider>
    </SettingsProvider>
  )
}
