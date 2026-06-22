# Invoice Generator

A complete, local-first invoice generator for freelancers, designers, and agencies. Built with React, Vite, Tailwind CSS, jsPDF, and html2canvas. No backend — everything is saved in your browser's LocalStorage.

Pre-filled with the business and payment details from your reference invoice (Ahmudul Kabir Alvi, Brand & Graphic Designer) — edit these anytime in **Settings**.

## Features

- Create, edit, duplicate, and delete invoices
- Auto-generated invoice numbers (`INV-2026-001`, `INV-2026-002`, ...)
- Live A4 invoice preview while you type
- Logo and signature upload
- Service table with quantity × rate calculation and frequently-used service suggestions
- VAT, Tax, and Discount toggles with automatic grand total
- High-resolution, multi-page PDF export
- Print-friendly layout
- Client database with autofill
- Dashboard stats (invoices created, total revenue, monthly revenue)
- Settings: currency (BDT/USD/EUR/GBP), default tax rates, default business & payment info, light/dark theme
- Auto-save while editing, plus JSON export/import for backups
- Fully responsive: desktop, tablet, mobile

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

## Build for production

```bash
npm run build
npm run preview   # optional, to test the production build locally
```

The static site is output to `dist/`.

## Deploying to GitHub Pages

1. Create a GitHub repository and push this project to it.
2. In `package.json`, update `"homepage"` to `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`.
3. Install the deploy helper (already in devDependencies) and run:

   ```bash
   npm run deploy
   ```

   This builds the app and pushes the `dist/` folder to a `gh-pages` branch.

4. In your repository settings, under **Pages**, set the source to the `gh-pages` branch.
5. Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`.

> The app uses `HashRouter`, so it works correctly on GitHub Pages without any extra server configuration — no 404 rewrites needed.

## Project structure

```
invoice-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   ├── SettingsContext.jsx     # currency, theme, default business/payment info
    │   └── InvoiceContext.jsx      # saved invoices, clients, frequently used services (CRUD)
    ├── utils/
    │   ├── storage.js              # LocalStorage read/write + invoice number generator
    │   ├── calc.js                 # totals, currency & date formatting
    │   └── pdf.js                  # jsPDF + html2canvas multi-page export
    ├── components/
    │   ├── ui.jsx                  # Card, Input, Select, Button, Toggle, Badge primitives
    │   ├── Sidebar.jsx
    │   ├── ServiceTable.jsx
    │   └── InvoicePreview.jsx      # the A4 invoice layout, used for screen, print & PDF
    └── pages/
        ├── CreateInvoice.jsx       # business/client/details/services/financials/signature + live preview
        ├── SavedInvoices.jsx       # search, sort, view, edit, duplicate, delete, dashboard stats
        └── Settings.jsx            # currency, theme, defaults, services, clients, JSON backup
```

## Notes

- All data (invoices, clients, settings, service templates) lives in your browser's LocalStorage under the `invoiceapp_*` keys. Use **Settings → Export JSON** regularly to back it up, since clearing browser data will erase it.
- Invoice numbers only become permanent once you click **Save** (or after 4 seconds of auto-save) — the number shown beforehand is a preview of the next available number.
