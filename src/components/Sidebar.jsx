import React from 'react'
import { NavLink } from 'react-router-dom'
import { FilePlus2, Files, Settings as SettingsIcon, Moon, Sun } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

const navItems = [
  { to: '/', label: 'Create Invoice', icon: FilePlus2 },
  { to: '/saved', label: 'Saved Invoices', icon: Files },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar() {
  const { settings, toggleTheme } = useSettings()

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 border-r border-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3">
        <img src="./logo.png" alt="logo" className="w-9 h-9 rounded-lg object-cover" />
        <div>
          <p className="font-semibold text-primary dark:text-gray-100 text-sm leading-tight">Invoice</p>
          <p className="text-xs text-gray-400 leading-tight">Generator</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border dark:border-dark-border">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition"
        >
          {settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {settings.theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </aside>
  )
}
