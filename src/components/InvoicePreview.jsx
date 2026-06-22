import React from 'react'
import { formatCurrency, formatDate } from '../utils/calc'
import SIGNATURE from '../utils/signature'

// Section label: bold, #1a1a1a, small caps
const lbl = {
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: 700,
  color: '#1a1a1a',
  marginBottom: '8px',
  display: 'block',
}

const InvoicePreview = React.forwardRef(function InvoicePreview({ draft, settings, totals, id }, ref) {
  const { business, payment } = settings
  const currency = settings.currency

  const noFinancials =
    !draft.financials?.vatEnabled &&
    !draft.financials?.taxEnabled &&
    !draft.financials?.discountEnabled

  // Embedded signature is always used; user-uploaded one overrides it
  const signatureSrc = draft.signature || SIGNATURE

  return (
    <div
      ref={ref}
      id={id}
      style={{
        width: '210mm',
        background: '#ffffff',
        color: '#374151',
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontSize: '12.5px',
        lineHeight: '1.6',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '44px 48px' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '22px',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '0',
        }}>
          {/* Logo + name/designation — inline-block with vertical-align:middle.
              Parent font-size:0 kills ghost whitespace between inline-block siblings. */}
          <div style={{ fontSize: 0, lineHeight: 0, whiteSpace: 'nowrap' }}>
            <img
              src={business.logo || './logo.png'}
              alt="logo"
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                width: '44px',
                height: '44px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <div style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              marginLeft: '12px',
              fontSize: '12.5px',
              lineHeight: 1.25,
              whiteSpace: 'normal',
            }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                {business.name || 'Your Business Name'}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '3px' }}>
                {business.designerName}
              </div>
            </div>
          </div>

          {/* INVOICE + number */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: '#111827', lineHeight: 1 }}>
              INVOICE
            </div>
            <div style={{ fontFamily: 'monospace', color: '#2563EB', fontWeight: 600, fontSize: '13px', marginTop: '5px' }}>
              {draft.invoiceNumber}
            </div>
          </div>
        </div>

        {/* ── From / Bill To / Details ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px',
          padding: '22px 0',
          borderBottom: '1px solid #F3F4F6',
        }}>
          {/* From */}
          <div>
            <span style={lbl}>FROM</span>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: '12.5px', marginBottom: '4px' }}>
              {business.name}
            </div>
            {business.address  && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{business.address}</div>}
            {business.phone    && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{business.phone}</div>}
            {business.email    && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{business.email}</div>}
            {business.website  && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{business.website}</div>}
          </div>

          {/* Bill To */}
          <div>
            <span style={lbl}>BILL TO</span>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: '12.5px', marginBottom: '4px' }}>
              {draft.client?.name || 'Client name'}
            </div>
            {draft.client?.company && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{draft.client.company}</div>}
            {draft.client?.address && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{draft.client.address}</div>}
            {draft.client?.email   && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{draft.client.email}</div>}
            {draft.client?.phone   && <div style={{ color: '#6B7280', fontSize: '11.5px' }}>{draft.client.phone}</div>}
          </div>

          {/* Details */}
          <div>
            <span style={lbl}>DETAILS</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
              <span style={{ color: '#6B7280' }}>Invoice Date</span>
              <span style={{ fontWeight: 500, color: '#111827' }}>{formatDate(draft.invoiceDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
              <span style={{ color: '#6B7280' }}>Due Date</span>
              <span style={{ fontWeight: 500, color: '#111827' }}>{formatDate(draft.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* ── Service table ── */}
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: '18px' }}>
          <colgroup>
            <col style={{ width: '28px' }} />
            <col style={{ width: '16%' }} />
            <col />
            <col style={{ width: '44px' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '13%' }} />
          </colgroup>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {[
                { label: '#',           align: 'center', w: '30px' },
                { label: 'Category',    align: 'left',   w: '18%'  },
                { label: 'Description', align: 'left',   w: 'auto' },
                { label: 'Qty',         align: 'center', w: '46px' },
                { label: 'Rate',        align: 'right',  w: '13%'  },
                { label: 'Total',       align: 'right',  w: '13%'  },
              ].map(({ label, align, w }, i) => (
                <th key={i} style={{
                  padding: '8px 10px',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: '#6B7280',
                  fontWeight: 600,
                  textAlign: align,
                  width: w,
                  borderRadius: i === 0 ? '6px 0 0 6px' : i === 5 ? '0 6px 6px 0' : undefined,
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(draft.items || []).map((item, i) => (
              <tr key={item.id || i} style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '10px', color: '#9CA3AF', fontSize: '11.5px', textAlign: 'center' }}>{i + 1}</td>
                <td style={{ padding: '10px', color: '#374151', fontSize: '11.5px', wordBreak: 'break-word' }}>{item.category || ''}</td>
                <td style={{ padding: '10px', color: '#111827', fontSize: '11.5px', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{item.description || ''}</td>
                <td style={{ padding: '10px', color: '#374151', fontSize: '11.5px', textAlign: 'center' }}>{item.quantity || 0}</td>
                <td style={{ padding: '10px', color: '#374151', fontSize: '11.5px', textAlign: 'right' }}>
                  {formatCurrency(item.rate, currency)}
                </td>
                <td style={{ padding: '10px', color: '#111827', fontWeight: 500, fontSize: '11.5px', textAlign: 'right' }}>
                  {formatCurrency((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Totals row ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
          {/* Left: "Without VAT, Tax & Discount" note */}
          {noFinancials ? (
            <p style={{ fontSize: '11px', color: '#9CA3AF', fontStyle: 'italic', margin: 0 }}>
              (Without VAT, Tax &amp; Discount)
            </p>
          ) : <div />}

          {/* Right: totals stack */}
          <div style={{ width: '240px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '3px 0' }}>
              <span style={{ color: '#6B7280' }}>Subtotal</span>
              <span style={{ fontWeight: 500, color: '#111827' }}>{formatCurrency(totals.subtotal, currency)}</span>
            </div>
            {draft.financials?.vatEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '3px 0' }}>
                <span style={{ color: '#6B7280' }}>VAT ({draft.financials.vatPercent || 0}%)</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>{formatCurrency(totals.vatAmount, currency)}</span>
              </div>
            )}
            {draft.financials?.taxEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '3px 0' }}>
                <span style={{ color: '#6B7280' }}>Tax ({draft.financials.taxPercent || 0}%)</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>{formatCurrency(totals.taxAmount, currency)}</span>
              </div>
            )}
            {draft.financials?.discountEnabled && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', padding: '3px 0' }}>
                <span style={{ color: '#6B7280' }}>Discount</span>
                <span style={{ fontWeight: 500, color: '#EF4444' }}>-{formatCurrency(totals.discountAmount, currency)}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1.5px solid #111827',
              marginTop: '4px',
            }}>
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '13px' }}>Grand Total</span>
              <span style={{ fontWeight: 700, color: '#2563EB', fontSize: '14px' }}>
                {formatCurrency(totals.grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Payment + Signature ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB',
        }}>
          {/* Payment info — left */}
          <div>
            <span style={lbl}>PAYMENT INFORMATION</span>
            <div style={{ fontSize: '11.5px', color: '#4B5563', lineHeight: '1.8' }}>
              {payment.bankName      && <div><span style={{ color: '#9CA3AF' }}>Bank: </span>{payment.bankName}</div>}
              {payment.accountHolder && <div><span style={{ color: '#9CA3AF' }}>Account Holder: </span>{payment.accountHolder}</div>}
              {payment.accountNumber && <div><span style={{ color: '#9CA3AF' }}>Account No: </span>{payment.accountNumber}</div>}
              {payment.branch        && <div><span style={{ color: '#9CA3AF' }}>Branch: </span>{payment.branch}</div>}
              {payment.mobileBanking && <div><span style={{ color: '#9CA3AF' }}>Mobile Banking: </span>{payment.mobileBanking}</div>}
              {payment.notes         && <div style={{ color: '#9CA3AF', fontStyle: 'italic', marginTop: '6px' }}>{payment.notes}</div>}
            </div>
          </div>

          {/* Signature block — right-aligned to the page edge */}
          <div style={{ textAlign: 'right' }}>
            <img
              src={signatureSrc}
              alt="signature"
              style={{
                height: '56px',
                maxWidth: '160px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                marginLeft: 'auto',
                marginBottom: '8px',
              }}
            />
            <div style={{
              borderTop: '1px solid #E5E7EB',
              paddingTop: '6px',
            }}>
              <div style={{ fontWeight: 600, color: '#111827', fontSize: '12.5px' }}>{business.name}</div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>{business.designerName}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
})

export default InvoicePreview
