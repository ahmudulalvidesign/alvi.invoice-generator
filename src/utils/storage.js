const KEYS = {
  INVOICES: 'invoiceapp_invoices',
  SETTINGS: 'invoiceapp_settings',
  CLIENTS: 'invoiceapp_clients',
  SERVICES: 'invoiceapp_services',
  COUNTER: 'invoiceapp_counter',
}

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error('Storage write failed', e)
    return false
  }
}

export const storage = {
  KEYS,

  // Invoices
  getInvoices: () => safeGet(KEYS.INVOICES, []),
  saveInvoices: (list) => safeSet(KEYS.INVOICES, list),

  // Settings
  getSettings: () => safeGet(KEYS.SETTINGS, null),
  saveSettings: (settings) => safeSet(KEYS.SETTINGS, settings),

  // Clients
  getClients: () => safeGet(KEYS.CLIENTS, []),
  saveClients: (list) => safeSet(KEYS.CLIENTS, list),

  // Frequently used services
  getServices: () => safeGet(KEYS.SERVICES, []),
  saveServices: (list) => safeSet(KEYS.SERVICES, list),

  // Invoice number counter, keyed by year
  getCounter: () => safeGet(KEYS.COUNTER, {}),
  saveCounter: (counter) => safeSet(KEYS.COUNTER, counter),

  exportAllAsJSON: () => {
    const payload = {
      invoices: storage.getInvoices(),
      settings: storage.getSettings(),
      clients: storage.getClients(),
      services: storage.getServices(),
      counter: storage.getCounter(),
      exportedAt: new Date().toISOString(),
    }
    return JSON.stringify(payload, null, 2)
  },

  importAllFromJSON: (jsonString) => {
    const data = JSON.parse(jsonString)
    if (data.invoices) safeSet(KEYS.INVOICES, data.invoices)
    if (data.settings) safeSet(KEYS.SETTINGS, data.settings)
    if (data.clients) safeSet(KEYS.CLIENTS, data.clients)
    if (data.services) safeSet(KEYS.SERVICES, data.services)
    if (data.counter) safeSet(KEYS.COUNTER, data.counter)
    return true
  },
}

export function generateInvoiceNumber() {
  const year = new Date().getFullYear()
  const counter = storage.getCounter()
  const next = (counter[year] || 0) + 1
  counter[year] = next
  storage.saveCounter(counter)
  return `INV-${year}-${String(next).padStart(3, '0')}`
}

// Peek without incrementing — used for live preview before first save
export function peekNextInvoiceNumber() {
  const year = new Date().getFullYear()
  const counter = storage.getCounter()
  const next = (counter[year] || 0) + 1
  return `INV-${year}-${String(next).padStart(3, '0')}`
}
