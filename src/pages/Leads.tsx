import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, Search, Users2 } from 'lucide-react'
import { useLeads } from '../hooks/useLeads'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScorePill } from '../components/ui/ScorePill'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { LEAD_STATUSES } from '../types/lead'
import type { LeadStatus } from '../types/lead'

type SortDirection = 'asc' | 'desc'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function Leads() {
  const { leads, isLoading, error, refetch } = useLeads()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()

    return leads
      .filter((lead) => {
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
        const matchesSearch =
          query.length === 0 ||
          lead.name.toLowerCase().includes(query) ||
          lead.company.toLowerCase().includes(query) ||
          lead.job_title.toLowerCase().includes(query)
        return matchesStatus && matchesSearch
      })
      .sort((a, b) => (sortDirection === 'asc' ? a.lead_score - b.lead_score : b.lead_score - a.lead_score))
  }, [leads, search, statusFilter, sortDirection])

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">Leads</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Every lead the AI has qualified, in one queue.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, or title"
            className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'All')}
            className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)]"
          >
            <option value="All">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-canvas)]"
          >
            Score
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {isLoading && <LoadingState label="Loading leads…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <Card className="overflow-hidden p-0">
          {filteredLeads.length === 0 ? (
            <EmptyState
              icon={<Users2 className="h-5 w-5" />}
              title={leads.length === 0 ? 'No leads yet' : 'No leads match your filters'}
              description={
                leads.length === 0
                  ? 'Leads scored by the AI qualification workflow will show up here.'
                  : 'Try a different search term or status filter.'
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-line)] bg-[var(--color-canvas)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      Job Title
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-muted)]">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="cursor-pointer border-b border-[var(--color-line)] last:border-0 hover:bg-[var(--color-canvas)]"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--color-ink)]">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">{lead.company}</td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">{lead.job_title}</td>
                      <td className="px-4 py-3">
                        <ScorePill score={lead.lead_score} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-[var(--color-muted)]">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
