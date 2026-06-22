import React, { createContext, useContext, useEffect, useState } from 'react'
import { storage } from '../utils/storage'

const DEFAULT_SETTINGS = {
  currency: 'BDT',
  defaultVatEnabled: false,
  defaultVatPercent: 15,
  defaultTaxEnabled: false,
  defaultTaxPercent: 5,
  theme: 'light',
  business: {
    name: 'Ahmudul Kabir Alvi',
    designerName: 'Brand & Graphic Designer',
    address: 'Mirpur DOHS, Dhaka - 1216',
    phone: '+8801792576200',
    email: '',
    website: '',
    logo: './logo.png', // default brand mark, replace via Upload Logo
  },
  payment: {
    bankName: 'City Bank Limited',
    accountHolder: 'Ahmudul Kabir Alvi',
    accountNumber: '2103751720001',
    branch: 'Pallabi Branch, Mirpur, Dhaka - 1216',
    mobileBanking: '',
    notes: '',
  },
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = storage.getSettings()
    if (!saved) return DEFAULT_SETTINGS
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
      business: { ...DEFAULT_SETTINGS.business, ...(saved.business || {}) },
      payment: { ...DEFAULT_SETTINGS.payment, ...(saved.payment || {}) },
    }
  })

  useEffect(() => {
    storage.saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [settings.theme])

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }))
  const updateBusiness = (patch) => setSettings((s) => ({ ...s, business: { ...s.business, ...patch } }))
  const updatePayment = (patch) => setSettings((s) => ({ ...s, payment: { ...s.payment, ...patch } }))
  const toggleTheme = () => setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateBusiness, updatePayment, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
