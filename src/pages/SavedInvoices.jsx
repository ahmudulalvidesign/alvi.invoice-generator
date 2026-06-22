import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Eye, Pencil, Copy, Trash2, FileText, TrendingUp, CalendarDays, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Card, Select, Badge } from '../components/ui'
import { useInvoices } from '../context/InvoiceContext'
import { useSettings } from '../context/SettingsContext'
import { formatCurrency, formatDate } from '../utils/calc'

const STATUS_OPTIONS = ['Unpaid', 'Due', 'Paid']

const STATUS_STYLE = {
  Paid:   'bg-green-50 text-green-700 border border-green-200',
  Due:    'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Unpaid: 'bg-red-50 text-red-600 border border-red-200',
}

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[status] || STATUS_STYLE.Unpaid}`}>
      {status || 'Unpaid'}
    </span>
  )
}

function SimplePreview({ inv, settings }) {
  return (
    <div className="a4-page p-12 text-[13px]" style={{ width: '210mm' }}>
      <div className="flex justify-between items-start border-b border-border pb-6 mb-6">
        <div>
          <p className="font-bold text-primary">{settings.business.name}</p>
          <p className="text-gray-500 text-xs">{settings.business.designerName}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-extrabold text-primary">INVOICE</h2>
          <p className="text-accent font-semibold font-mono-num text-sm">{inv.invoiceNumber}</p>
        </div>
      </div>
      <p className="text-sm mb-1"><span className="text-gray-400">Bill to:</span> <span className="font-semibold text-primary">{inv.client?.name}</span></p>
      <p className="text-sm mb-6"><span className="text-gray-400">Date:</span> {formatDate(inv.invoiceDate)}</p>
      <table className="w-full text-sm mb-6">
        <thead>
          <tr className="text-left text-xs uppercase text-gray-400 border-b border-border">
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Rate</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {inv.items?.map((it, i) => (
            <tr key={i} className="border-b border-border">
              <td className="py-2">{it.description}</td>
              <td className="py-2 text-right">{it.quantity}</td>
              <td className="py-2 text-right">{formatCurrency(it.rate, settings.currency)}</td>
              <td className="py-2 text-right">{formatCurrency((it.quantity || 0) * (it.rate || 0), settings.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <p className="font-bold text-primary">
          Grand Total: <span className="text-accent">{formatCurrency(inv.totals?.grandTotal, settings.currency)}</span>
        </p>
      </div>
    </div>
  )
}

export default function SavedInvoices() {
  const { invoices, deleteInvoice, duplicateInvoice, updateInvoiceStatus } = useInvoices()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [previewInvoice, setPreviewInvoice] = useState(null)

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + (inv.totals?.grandTotal || 0), 0)
    const now = new Date()
    const thisMonth = invoices.filter((inv) => {
      const d = new Date(inv.invoiceDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const monthlyRevenue = thisMonth.reduce((sum, inv) => sum + (inv.totals?.grandTotal || 0), 0)

    const paidTotal   = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + (i.totals?.grandTotal || 0), 0)
    const dueTotal    = invoices.filter(i => i.status === 'Due').reduce((s, i) => s + (i.totals?.grandTotal || 0), 0)
    const unpaidTotal = invoices.filter(i => !i.status || i.status === 'Unpaid').reduce((s, i) => s + (i.totals?.grandTotal || 0), 0)

    const paidCount   = invoices.filter(i => i.status === 'Paid').length
    const dueCount    = invoices.filter(i => i.status === 'Due').length
    const unpaidCount = invoices.filter(i => !i.status || i.status === 'Unpaid').length

    return { count: invoices.length, total, monthlyRevenue, paidTotal, dueTotal, unpaidTotal, paidCount, dueCount, unpaidCount }
  }, [invoices])

  const filtered = useMemo(() => {
    let list = invoices.filter(
      (inv) =>
        inv.invoiceNumber?.toLowerCase().includes(query.toLowerCase()) ||
        inv.client?.name?.toLowerCase().includes(query.toLowerCase())
    )
    return [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.invoiceDate) - new Date(a.invoiceDate)
      if (sortBy === 'oldest') return new Date(a.invoiceDate) - new Date(b.invoiceDate)
      if (sortBy === 'amount_high') return (b.totals?.grandTotal || 0) - (a.totals?.grandTotal || 0)
      if (sortBy === 'amount_low') return (a.totals?.grandTotal || 0) - (b.totals?.grandTotal || 0)
      return 0
    })
  }, [invoices, query, sortBy])

  return (
    <div className="px-8 py-7 max-w-[1300px]">
      <h1 className="text-xl font-bold text-primary dark:text-gray-100 mb-1">Saved Invoices</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">Manage everything you've created and billed so far.</p>

      {/* Row 1: Overview stats */}
      <div className="grid grid-cols-3 gap-5 mb-4">
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-accent">
            <FileText size={19} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Invoices Created</p>
            <p className="text-xl font-bold text-primary dark:text-gray-100">{stats.count}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-success">
            <TrendingUp size={19} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="text-xl font-bold text-primary dark:text-gray-100">{formatCurrency(stats.total, settings.currency)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-primary dark:text-gray-100">
            <CalendarDays size={19} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
            <p className="text-xl font-bold text-primary dark:text-gray-100">{formatCurrency(stats.monthlyRevenue, settings.currency)}</p>
          </div>
        </Card>
      </div>

      {/* Row 2: Payment status breakdown */}
      <div className="grid grid-cols-3 gap-5 mb-7">
        <Card className="flex items-center gap-4 border-l-4 border-l-green-400">
          <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
            <CheckCircle size={19} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Paid <span className="text-gray-400 font-normal">({stats.paidCount})</span></p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(stats.paidTotal, settings.currency)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-l-yellow-400">
          <div className="w-11 h-11 rounded-xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
            <Clock size={19} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Due <span className="text-gray-400 font-normal">({stats.dueCount})</span></p>
            <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.dueTotal, settings.currency)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-l-red-400">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <AlertCircle size={19} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Unpaid <span className="text-gray-400 font-normal">({stats.unpaidCount})</span></p>
            <p className="text-xl font-bold text-red-500">{formatCurrency(stats.unpaidTotal, settings.currency)}</p>
          </div>
        </Card>
      </div>

      {/* Search + sort */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by invoice number or client..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-primary dark:text-gray-100"
          />
        </div>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="max-w-[180px]">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="amount_high">Amount: High to Low</option>
          <option value="amount_low">Amount: Low to High</option>
        </Select>
      </div>

      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {invoices.length === 0 ? "You haven't created any invoices yet." : 'No invoices match your search.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-border dark:border-dark-border">
                <th className="py-3 px-5 font-semibold">Invoice No.</th>
                <th className="py-3 px-5 font-semibold">Client</th>
                <th className="py-3 px-5 font-semibold">Date</th>
                <th className="py-3 px-5 font-semibold text-right">Amount</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border dark:border-dark-border last:border-0 hover:bg-gray-50/60 dark:hover:bg-white/[0.03]">
                  <td className="py-3.5 px-5 font-mono-num font-medium text-primary dark:text-gray-100">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-5 text-gray-700 dark:text-gray-300">
                    {inv.client?.name || '—'}
                  </td>
                  <td className="py-3.5 px-5 text-gray-500">
                    {formatDate(inv.invoiceDate)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-medium text-primary dark:text-gray-100">
                    {formatCurrency(inv.totals?.grandTotal, settings.currency)}
                  </td>

                  {/* Status dropdown */}
                  <td className="py-3.5 px-5 text-center">
                    <div className="flex items-center justify-center">
                      <div className="relative inline-block">
                        <StatusBadge status={inv.status || 'Unpaid'} />
                        <select
                          value={inv.status || 'Unpaid'}
                          onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer"
                          title="Change status"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setPreviewInvoice(inv)} title="View" className="p-1.5 text-gray-400 hover:text-accent transition">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => navigate(`/edit/${inv.id}`)} title="Edit" className="p-1.5 text-gray-400 hover:text-accent transition">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => duplicateInvoice(inv.id)} title="Duplicate" className="p-1.5 text-gray-400 hover:text-accent transition">
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete invoice ${inv.invoiceNumber}?`)) deleteInvoice(inv.id) }}
                        title="Delete"
                        className="p-1.5 text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Quick view modal */}
      {previewInvoice && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6"
          onClick={() => setPreviewInvoice(null)}
        >
          <div
            className="bg-white dark:bg-dark-card rounded-xl2 max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Badge tone="accent">{previewInvoice.invoiceNumber}</Badge>
                <StatusBadge status={previewInvoice.status || 'Unpaid'} />
              </div>
              <button
                onClick={() => setPreviewInvoice(null)}
                className="text-sm text-gray-500 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
            <div className="scale-[0.85] origin-top">
              <SimplePreview inv={previewInvoice} settings={settings} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
