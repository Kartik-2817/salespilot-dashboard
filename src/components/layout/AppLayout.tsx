import { NavLink, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)]">
      {/* Sidebar is fixed on desktop, hidden on small screens in favor of top bar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function MobileTopBar() {
  return (
    <header className="flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-ink)] px-5 py-3.5 md:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent)]">
          <span className="font-display text-xs font-bold text-white">S</span>
        </div>
        <span className="font-display text-sm font-semibold text-white">SalesPilot</span>
      </div>
      <nav className="flex items-center gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-md px-2.5 py-1 text-xs font-medium ${isActive ? 'bg-white/10 text-white' : 'text-slate-400'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `rounded-md px-2.5 py-1 text-xs font-medium ${isActive ? 'bg-white/10 text-white' : 'text-slate-400'}`
          }
        >
          Leads
        </NavLink>
      </nav>
    </header>
  )
}
