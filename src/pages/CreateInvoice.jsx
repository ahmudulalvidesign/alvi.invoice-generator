import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { Download, Printer, Save, Upload, X, Eye, EyeOff } from 'lucide-react'
import { Card, SectionTitle, Input, Textarea, Select, Button, Toggle } from '../components/ui'
import ServiceTable from '../components/ServiceTable'
import InvoicePreview from '../components/InvoicePreview'
import { useSettings } from '../context/SettingsContext'
import { useInvoices } from '../context/InvoiceContext'
import { calcTotals } from '../utils/calc'
import { peekNextInvoiceNumber, generateInvoiceNumber } from '../utils/storage'
import { exportNodeToPDF } from '../utils/pdf'

const today = () => new Date().toISOString().slice(0, 10)

function emptyDraft(settings) {
  return {
    id: uuid(),
    invoiceNumber: peekNextInvoiceNumber(),
    invoiceDate: today(),
    dueDate: '',
    client: { name: '', company: '', address: '', email: '', phone: '' },
    items: [{ id: uuid(), category: '', description: '', quantity: 1, rate: 0 }],
    financials: {
      vatEnabled: settings.defaultVatEnabled,
      vatPercent: settings.defaultVatPercent,
      taxEnabled: settings.defaultTaxEnabled,
      taxPercent: settings.defaultTaxPercent,
      discountEnabled: false,
      discountAmount: 0,
    },
    signature: null,
    isNumberFinal: false,
  }
}

export default function CreateInvoice() {
  const { settings, updateBusiness } = useSettings()
  const { invoices, upsertInvoice, clients } = useInvoices()
  const { id } = useParams()
  const navigate = useNavigate()
  const previewRef = useRef(null)
  const exportRef = useRef(null)
  const autosaveTimer = useRef(null)

  const [draft, setDraft] = useState(() => {
    if (id) {
      const existing = invoices.find((inv) => inv.id === id)
      if (existing) return { ...existing, isNumberFinal: true }
    }
    return emptyDraft(settings)
  })
  const [savedFlash, setSavedFlash] = useState(false)
  const [clientSuggestions, setClientSuggestions] = useState(false)
  const [showPreview, setShowPreview] = useState(false) // mobile preview toggle

  useEffect(() => {
    if (id) {
      const existing = invoices.find((inv) => inv.id === id)
      if (existing) setDraft({ ...existing, isNumberFinal: true })
    }
  }, [id])

  const totals = useMemo(() => calcTotals(draft.items, draft.financials), [draft.items, draft.financials])

  useEffect(() => {
    if (!draft.client.name && draft.items.every((it) => !it.description)) return
    clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => { handleSave({ silent: true }) }, 4000)
    return () => clearTimeout(autosaveTimer.current)
  }, [draft])

  function handleSave({ silent } = {}) {
    let toSave = draft
    if (!draft.isNumberFinal) {
      const finalNumber = generateInvoiceNumber()
      toSave = { ...draft, invoiceNumber: finalNumber, isNumberFinal: true }
      setDraft(toSave)
    }
    upsertInvoice(toSave)
    if (!silent) {
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 1800)
    }
  }

  function handleNewInvoice() {
    setDraft(emptyDraft(settings))
    navigate('/')
  }

  async function handleDownloadPDF() {
    handleSave({ silent: true })
    await new Promise((r) => setTimeout(r, 50))
    await exportNodeToPDF(exportRef.current, `Invoice-${draft.invoiceNumber}.pdf`)
  }

  function handlePrint() { window.print() }

  function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateBusiness({ logo: reader.result })
    reader.readAsDataURL(file)
  }

  function handleSignatureUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDraft((d) => ({ ...d, signature: reader.result }))
    reader.readAsDataURL(file)
  }

  function pickClient(c) {
    setDraft((d) => ({ ...d, client: { name: c.name, company: c.company, address: c.address, email: c.email, phone: c.phone } }))
    setClientSuggestions(false)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 max-w-[1500px]">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 lg:mb-7">
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-primary dark:text-gray-100">Create Invoice</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {draft.isNumberFinal ? `Editing ${draft.invoiceNumber}` : `Next: ${draft.invoiceNumber}`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {savedFlash && <span className="text-xs text-success font-medium mr-1">Saved ✓</span>}
          {/* Mobile: show preview toggle + download + save */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden p-2 rounded-lg border border-border dark:border-dark-border text-gray-500 hover:bg-gray-50"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Button variant="outline" className="hidden sm:inline-flex" onClick={handleNewInvoice}>New</Button>
          <Button variant="outline" className="hidden md:inline-flex" onClick={handlePrint}><Printer size={15} /> Print</Button>
          <Button variant="accent" onClick={handleDownloadPDF}><Download size={15} /><span className="hidden sm:inline"> Download PDF</span></Button>
          <Button variant="primary" onClick={() => handleSave()}><Save size={15} /><span className="hidden sm:inline"> Save</span></Button>
        </div>
      </div>

      {/* Mobile preview panel — shown when toggled */}
      {showPreview && (
        <div className="lg:hidden mb-5 overflow-x-auto">
          <div className="origin-top-left scale-[0.48] sm:scale-[0.6]" style={{ marginBottom: '-52%' }}>
            <InvoicePreview ref={previewRef} draft={draft} settings={settings} totals={totals} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7">
        {/* LEFT: Form */}
        <div className="space-y-5">
          {/* Business info */}
          <Card>
            <SectionTitle subtitle="Shown at the top of every invoice">Business Information</SectionTitle>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-xl border border-dashed border-border dark:border-dark-border flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-white/5 shrink-0">
                {settings.business.logo
                  ? <img src={settings.business.logo} alt="logo" className="w-full h-full object-contain" />
                  : <span className="text-gray-300 text-xs">Logo</span>}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-blue-700">
                  <Upload size={14} /> Upload logo
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Business Name" value={settings.business.name} onChange={(e) => updateBusiness({ name: e.target.value })} />
              <Input label="Role / Designation" value={settings.business.designerName} onChange={(e) => updateBusiness({ designerName: e.target.value })} />
              <Input label="Address" className="sm:col-span-2" value={settings.business.address} onChange={(e) => updateBusiness({ address: e.target.value })} />
              <Input label="Phone" value={settings.business.phone} onChange={(e) => updateBusiness({ phone: e.target.value })} />
              <Input label="Email" type="email" value={settings.business.email} onChange={(e) => updateBusiness({ email: e.target.value })} />
              <Input label="Website" className="sm:col-span-2" value={settings.business.website} onChange={(e) => updateBusiness({ website: e.target.value })} />
            </div>
          </Card>

          {/* Client info */}
          <Card>
            <SectionTitle subtitle="Pulled from your client database when names match">Client Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 relative">
                <Input
                  label="Client Name"
                  value={draft.client.name}
                  onChange={(e) => setDraft((d) => ({ ...d, client: { ...d.client, name: e.target.value } }))}
                  onFocus={() => setClientSuggestions(true)}
                  onBlur={() => setTimeout(() => setClientSuggestions(false), 150)}
                  placeholder="e.g. Sajida Foundation"
                />
                {clientSuggestions && draft.client.name && clients.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-card py-1 max-h-44 overflow-auto">
                    {clients
                      .filter((c) => c.name.toLowerCase().includes(draft.client.name.toLowerCase()))
                      .map((c) => (
                        <button key={c.id} type="button" onMouseDown={() => pickClient(c)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/5 text-primary dark:text-gray-100">
                          {c.name} <span className="text-gray-400">{c.company}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <Input label="Company Name" value={draft.client.company} onChange={(e) => setDraft((d) => ({ ...d, client: { ...d.client, company: e.target.value } }))} />
              <Input label="Client Phone" value={draft.client.phone} onChange={(e) => setDraft((d) => ({ ...d, client: { ...d.client, phone: e.target.value } }))} />
              <Input label="Client Address" className="sm:col-span-2" value={draft.client.address} onChange={(e) => setDraft((d) => ({ ...d, client: { ...d.client, address: e.target.value } }))} />
              <Input label="Client Email" type="email" className="sm:col-span-2" value={draft.client.email} onChange={(e) => setDraft((d) => ({ ...d, client: { ...d.client, email: e.target.value } }))} />
            </div>
          </Card>

          {/* Invoice details */}
          <Card>
            <SectionTitle>Invoice Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input label="Invoice Number" value={draft.invoiceNumber} disabled className="font-mono-num opacity-70" />
              <Input label="Invoice Date" type="date" value={draft.invoiceDate} onChange={(e) => setDraft((d) => ({ ...d, invoiceDate: e.target.value }))} />
              <Input label="Due Date" type="date" value={draft.dueDate} onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))} />
            </div>
          </Card>

          {/* Services */}
          <Card>
            <SectionTitle subtitle="Total = Quantity × Rate">Services</SectionTitle>
            <ServiceTable items={draft.items} onChange={(items) => setDraft((d) => ({ ...d, items }))} currency={settings.currency} />
          </Card>

          {/* Financials */}
          <Card>
            <SectionTitle>Financials</SectionTitle>
            <div className="space-y-4">
              {[
                { key: 'vat', label: 'VAT', enabled: draft.financials.vatEnabled, pct: draft.financials.vatPercent,
                  onToggle: (v) => setDraft((d) => ({ ...d, financials: { ...d.financials, vatEnabled: v } })),
                  onPct: (v) => setDraft((d) => ({ ...d, financials: { ...d.financials, vatPercent: v } })) },
                { key: 'tax', label: 'Tax', enabled: draft.financials.taxEnabled, pct: draft.financials.taxPercent,
                  onToggle: (v) => setDraft((d) => ({ ...d, financials: { ...d.financials, taxEnabled: v } })),
                  onPct: (v) => setDraft((d) => ({ ...d, financials: { ...d.financials, taxPercent: v } })) },
              ].map(({ key, label, enabled, pct, onToggle, onPct }) => (
                <div key={key} className="flex items-center justify-between">
                  <Toggle label={label} checked={enabled} onChange={onToggle} />
                  {enabled && (
                    <input type="number" value={pct} onChange={(e) => onPct(e.target.value)}
                      className="w-20 px-3 py-1.5 text-right rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-accent/30" />
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between">
                <Toggle label="Discount" checked={draft.financials.discountEnabled}
                  onChange={(v) => setDraft((d) => ({ ...d, financials: { ...d.financials, discountEnabled: v } }))} />
                {draft.financials.discountEnabled && (
                  <input type="number" value={draft.financials.discountAmount}
                    onChange={(e) => setDraft((d) => ({ ...d, financials: { ...d.financials, discountAmount: e.target.value } }))}
                    className="w-20 px-3 py-1.5 text-right rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-accent/30" />
                )}
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card>
            <SectionTitle subtitle="Managed in Settings, applied to every invoice">Payment Information</SectionTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edit your bank details once in <span className="text-accent font-medium">Settings → Default Payment Information</span>.
            </p>
          </Card>

          {/* Signature */}
          <Card>
            <SectionTitle>Signature</SectionTitle>
            <div className="flex items-center gap-4">
              <div className="w-28 h-14 rounded-xl border border-dashed border-border dark:border-dark-border flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-white/5 shrink-0">
                {draft.signature
                  ? <img src={draft.signature} alt="signature" className="w-full h-full object-contain" />
                  : <span className="text-gray-300 text-xs">Preview</span>}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-blue-700">
                  <Upload size={14} /> Upload signature
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleSignatureUpload} />
              </label>
              {draft.signature && (
                <button onClick={() => setDraft((d) => ({ ...d, signature: null }))} className="text-gray-400 hover:text-red-500">
                  <X size={16} />
                </button>
              )}
            </div>
          </Card>

          {/* Mobile bottom actions */}
          <div className="lg:hidden flex gap-2 pb-6">
            <Button variant="outline" className="flex-1" onClick={handleNewInvoice}>New</Button>
            <Button variant="outline" className="flex-1" onClick={handlePrint}><Printer size={15} /> Print</Button>
          </div>
        </div>

        {/* RIGHT: Live preview — desktop only */}
        <div className="hidden xl:block">
          <div className="sticky top-7">
            <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">Live Preview</p>
            <div className="origin-top scale-[0.74] -mb-[26%]">
              <InvoicePreview ref={previewRef} draft={draft} settings={settings} totals={totals} />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden export copy */}
      <div style={{ position: 'fixed', top: 0, left: '-99999px', pointerEvents: 'none' }} aria-hidden="true">
        <InvoicePreview ref={exportRef} id="invoice-print-area" draft={draft} settings={settings} totals={totals} />
      </div>
    </div>
  )
}
