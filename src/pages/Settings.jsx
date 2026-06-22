import React, { useRef } from 'react'
import { Download, Upload, Sun, Moon } from 'lucide-react'
import { Card, SectionTitle, Input, Textarea, Select, Toggle, Button } from '../components/ui'
import { useSettings } from '../context/SettingsContext'
import { useInvoices } from '../context/InvoiceContext'
import { storage } from '../utils/storage'

export default function Settings() {
  const { settings, updateSettings, updateBusiness, updatePayment, toggleTheme } = useSettings()
  const { services, addService, removeService, clients, removeClient } = useInvoices()
  const fileInputRef = useRef(null)
  const [newService, setNewService] = React.useState('')

  function handleExportJSON() {
    const json = storage.exportAllAsJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-app-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportJSON(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        storage.importAllFromJSON(reader.result)
        alert('Data imported. Reloading...')
        window.location.reload()
      } catch { alert('Invalid JSON file.') }
    }
    reader.readAsText(file)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 max-w-[900px] space-y-5">
      <div>
        <h1 className="text-lg lg:text-xl font-bold text-primary dark:text-gray-100 mb-1">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Defaults applied to every new invoice.</p>
      </div>

      <Card>
        <SectionTitle>Currency & Theme</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Currency" value={settings.currency} onChange={(e) => updateSettings({ currency: e.target.value })}>
            <option value="BDT">BDT — Bangladeshi Taka</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
          </Select>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Theme</label>
            <div className="flex gap-2">
              <button onClick={() => settings.theme !== 'light' && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${settings.theme === 'light' ? 'border-accent text-accent bg-blue-50 dark:bg-blue-500/10' : 'border-border dark:border-dark-border text-gray-500'}`}>
                <Sun size={15} /> Light
              </button>
              <button onClick={() => settings.theme !== 'dark' && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition ${settings.theme === 'dark' ? 'border-accent text-accent bg-blue-50 dark:bg-blue-500/10' : 'border-border dark:border-dark-border text-gray-500'}`}>
                <Moon size={15} /> Dark
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Default Tax Rates</SectionTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Toggle label="Enable VAT by default" checked={settings.defaultVatEnabled} onChange={(v) => updateSettings({ defaultVatEnabled: v })} />
            <input type="number" value={settings.defaultVatPercent} onChange={(e) => updateSettings({ defaultVatPercent: e.target.value })}
              className="w-20 px-3 py-1.5 text-right rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
          <div className="flex items-center justify-between">
            <Toggle label="Enable Tax by default" checked={settings.defaultTaxEnabled} onChange={(v) => updateSettings({ defaultTaxEnabled: v })} />
            <input type="number" value={settings.defaultTaxPercent} onChange={(e) => updateSettings({ defaultTaxPercent: e.target.value })}
              className="w-20 px-3 py-1.5 text-right rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-accent/30" />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Used as the default on every new invoice">Default Business Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Business Name" value={settings.business.name} onChange={(e) => updateBusiness({ name: e.target.value })} />
          <Input label="Role / Designation" value={settings.business.designerName} onChange={(e) => updateBusiness({ designerName: e.target.value })} />
          <Input label="Address" className="sm:col-span-2" value={settings.business.address} onChange={(e) => updateBusiness({ address: e.target.value })} />
          <Input label="Phone" value={settings.business.phone} onChange={(e) => updateBusiness({ phone: e.target.value })} />
          <Input label="Email" value={settings.business.email} onChange={(e) => updateBusiness({ email: e.target.value })} />
          <Input label="Website" className="sm:col-span-2" value={settings.business.website} onChange={(e) => updateBusiness({ website: e.target.value })} />
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Applied to the payment section of every invoice">Default Payment Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Bank Name" value={settings.payment.bankName} onChange={(e) => updatePayment({ bankName: e.target.value })} />
          <Input label="Account Holder's Name" value={settings.payment.accountHolder} onChange={(e) => updatePayment({ accountHolder: e.target.value })} />
          <Input label="Account Number" value={settings.payment.accountNumber} onChange={(e) => updatePayment({ accountNumber: e.target.value })} />
          <Input label="Branch" value={settings.payment.branch} onChange={(e) => updatePayment({ branch: e.target.value })} />
          <Input label="Mobile Banking" className="sm:col-span-2" value={settings.payment.mobileBanking} onChange={(e) => updatePayment({ mobileBanking: e.target.value })} />
          <Textarea label="Payment Notes" className="sm:col-span-2" rows={3} value={settings.payment.notes} onChange={(e) => updatePayment({ notes: e.target.value })} />
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Quick-pick suggestions in the service table">Frequently Used Services</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          {services.map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-sm text-gray-700 dark:text-gray-200">
              {s}
              <button onClick={() => removeService(s)} className="text-gray-400 hover:text-red-500">x</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Add a service template..." />
          <Button variant="outline" onClick={() => { addService(newService); setNewService('') }}>Add</Button>
        </div>
      </Card>

      <Card>
        <SectionTitle subtitle="Saved automatically whenever you bill someone new">Client Database</SectionTitle>
        {clients.length === 0 ? (
          <p className="text-sm text-gray-400">No clients saved yet.</p>
        ) : (
          <div className="divide-y divide-border dark:divide-dark-border">
            {clients.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-primary dark:text-gray-100">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.company}</p>
                </div>
                <button onClick={() => removeClient(c.id)} className="text-xs text-gray-400 hover:text-red-500">Remove</button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle subtitle="Back up everything or move it to another browser">Data</SectionTitle>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExportJSON}><Download size={15} /> Export JSON</Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload size={15} /> Import JSON</Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportJSON} />
        </div>
      </Card>
    </div>
  )
}
