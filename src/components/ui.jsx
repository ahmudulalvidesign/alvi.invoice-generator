import React from 'react'

export function Card({ children, className = '', ...rest }) {
  return (
    <div
      className={`bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl2 shadow-card p-6 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-primary dark:text-gray-100">{children}</h2>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
      {children}
    </label>
  )
}

export function Input({ label, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && <Label htmlFor={rest.id}>{label}</Label>}
      <input
        className={`w-full px-3.5 py-2.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-primary dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${className}`}
        {...rest}
      />
    </div>
  )
}

export function Textarea({ label, className = '', ...rest }) {
  return (
    <div className="w-full">
      {label && <Label htmlFor={rest.id}>{label}</Label>}
      <textarea
        className={`w-full px-3.5 py-2.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-primary dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none ${className}`}
        {...rest}
      />
    </div>
  )
}

export function Select({ label, className = '', children, ...rest }) {
  return (
    <div className="w-full">
      {label && <Label htmlFor={rest.id}>{label}</Label>}
      <select
        className={`w-full px-3.5 py-2.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-primary dark:text-gray-100 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...rest }) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-gray-800',
    accent: 'bg-accent text-white hover:bg-blue-700',
    outline: 'bg-transparent text-primary dark:text-gray-100 border border-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-white/5',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5',
    danger: 'bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10',
    success: 'bg-success text-white hover:bg-green-700',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <input type="checkbox" className="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  )
}

export function Badge({ children, tone = 'gray' }) {
  const tones = {
    gray: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
    success: 'bg-green-50 text-success dark:bg-green-500/10',
    accent: 'bg-blue-50 text-accent dark:bg-blue-500/10',
  }
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>
}
