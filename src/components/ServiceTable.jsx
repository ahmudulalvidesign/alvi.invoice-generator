import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '../utils/calc'
import { useInvoices } from '../context/InvoiceContext'

export default function ServiceTable({ items, onChange, currency }) {
  const { services } = useInvoices()

  function updateItem(id, patch) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function addRow() {
    onChange([...items, { id: crypto.randomUUID(), category: '', description: '', quantity: 1, rate: 0 }])
  }

  function removeRow(id) {
    if (items.length === 1) return
    onChange(items.filter((it) => it.id !== id))
  }

  const inputCls = 'w-full px-2.5 py-2 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent text-primary dark:text-gray-100'

  return (
    <div>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm" style={{ minWidth: '720px' }}>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="font-semibold py-2 px-1" style={{ width: '32px' }}>#</th>
              <th className="font-semibold py-2 px-1" style={{ width: '20%' }}>Category</th>
              <th className="font-semibold py-2 px-1">Description</th>
              <th className="font-semibold py-2 px-1 text-center" style={{ width: '60px' }}>Qty</th>
              <th className="font-semibold py-2 px-1 text-right" style={{ width: '14%' }}>Rate</th>
              <th className="font-semibold py-2 px-1 text-right" style={{ width: '14%' }}>Total</th>
              <th style={{ width: '28px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="border-t border-border dark:border-dark-border">
                {/* # */}
                <td className="py-2 px-1 text-center text-gray-400 text-xs font-medium">{i + 1}</td>

                {/* Category dropdown */}
                <td className="py-2 px-1">
                  <select
                    value={item.category || ''}
                    onChange={(e) => updateItem(item.id, { category: e.target.value })}
                    className={inputCls}
                  >
                    <option value="">Select category</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>

                {/* Description — textarea so Enter key breaks lines */}
                <td className="py-2 px-1">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="e.g. Jamspace Logo Design"
                    rows={2}
                    className={inputCls}
                    style={{ resize: 'vertical', minHeight: '38px', lineHeight: '1.4' }}
                  />
                </td>

                {/* Qty */}
                <td className="py-2 px-1">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                    className={inputCls + ' text-center'}
                  />
                </td>

                {/* Rate */}
                <td className="py-2 px-1">
                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, { rate: e.target.value })}
                    className={inputCls + ' text-right'}
                  />
                </td>

                {/* Total */}
                <td className="py-2 px-1 text-right text-sm font-medium text-primary dark:text-gray-100 font-mono-num">
                  {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), currency)}
                </td>

                {/* Delete */}
                <td className="py-2 px-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(item.id)}
                    disabled={items.length === 1}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition"
                    title="Delete row"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-blue-700 transition"
      >
        <Plus size={15} /> Add Row
      </button>
    </div>
  )
}
