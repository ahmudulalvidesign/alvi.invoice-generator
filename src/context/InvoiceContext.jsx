import React, { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { storage, generateInvoiceNumber } from '../utils/storage'
import { calcTotals } from '../utils/calc'

const DEFAULT_SERVICES = [
  'Logo Design',
  'Brand Guideline',
  'Packaging Design',
  'Social Media Design',
  'Presentation Design',
]

const InvoiceContext = createContext(null)

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => storage.getInvoices())
  const [clients, setClients] = useState(() => storage.getClients())
  const [services, setServices] = useState(() => {
    const saved = storage.getServices()
    return saved.length ? saved : DEFAULT_SERVICES
  })

  useEffect(() => { storage.saveInvoices(invoices) }, [invoices])
  useEffect(() => { storage.saveClients(clients) }, [clients])
  useEffect(() => { storage.saveServices(services) }, [services])

  function upsertInvoice(draft) {
    const totals = calcTotals(draft.items, draft.financials)
    const record = { ...draft, totals, updatedAt: new Date().toISOString() }

    setInvoices((prev) => {
      const exists = prev.some((inv) => inv.id === record.id)
      if (exists) return prev.map((inv) => (inv.id === record.id ? record : inv))
      return [{ ...record, createdAt: new Date().toISOString() }, ...prev]
    })

    // Save client into client database if not already present
    if (draft.client?.name) {
      setClients((prev) => {
        const exists = prev.some((c) => c.name.toLowerCase() === draft.client.name.toLowerCase())
        if (exists) {
          return prev.map((c) =>
            c.name.toLowerCase() === draft.client.name.toLowerCase() ? { ...c, ...draft.client } : c
          )
        }
        return [...prev, { id: uuid(), ...draft.client }]
      })
    }

    return record
  }

  function deleteInvoice(id) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  function duplicateInvoice(id) {
    const original = invoices.find((inv) => inv.id === id)
    if (!original) return null
    const newNumber = generateInvoiceNumber()
    const copy = {
      ...original,
      id: uuid(),
      invoiceNumber: newNumber,
      invoiceDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setInvoices((prev) => [copy, ...prev])
    return copy
  }

  function addService(name) {
    if (!name?.trim()) return
    setServices((prev) => (prev.includes(name) ? prev : [...prev, name.trim()]))
  }

  function removeService(name) {
    setServices((prev) => prev.filter((s) => s !== name))
  }

  function removeClient(id) {
    setClients((prev) => prev.filter((c) => c.id !== id))
  }

  function updateInvoiceStatus(id, status) {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status } : inv))
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        clients,
        services,
        upsertInvoice,
        deleteInvoice,
        duplicateInvoice,
        updateInvoiceStatus,
        addService,
        removeService,
        removeClient,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const ctx = useContext(InvoiceContext)
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider')
  return ctx
}
