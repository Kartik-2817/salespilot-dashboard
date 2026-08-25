import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users2, Radio } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users2, end: false },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col bg-[var(--color-ink)] text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
          <Radio className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-display text-[15px] font-semibold leading-none text-white">
            SalesPilot
          </p>
          <p className="mt-1 text-[11px] leading-none text-slate-500">Lead automation</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] leading-relaxed text-slate-500">
          Qualification, outreach, and follow-ups run in n8n. This dashboard reviews and
          approves.
        </p>
      </div>
    </aside>
  )
}
