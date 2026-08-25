import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useLeads } from '../hooks/useLeads'
import { Card } from '../components/ui/Card'
import { ErrorState, LoadingState } from '../components/ui/States'
import { QUALIFIED_SCORE_THRESHOLD } from '../types/lead'
import type { Lead, LeadStatus } from '../types/lead'

interface MetricDef {
  label: string
  value: number
  hint?: string
  accent?: 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'ink'
}

const ACCENT_CLASSES: Record<NonNullable<MetricDef['accent']>, string> = {
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  danger: 'text-[var(--color-danger)]',
  info: 'text-[var(--color-info)]',
  accent: 'text-[var(--color-accent)]',
  ink: 'text-[var(--color-ink)]',
}

function computeMetrics(leads: Lead[]): MetricDef[] {
  const countByStatus = (status: LeadStatus) => leads.filter((l) => l.status === status).length
  const qualified = leads.filter((l) => l.lead_score >= QUALIFIED_SCORE_THRESHOLD).length

  return [
    { label: 'Total Leads', value: leads.length, accent: 'ink' },
    {
      label: 'Qualified Leads',
      value: qualified,
      hint: `Score ≥ ${QUALIFIED_SCORE_THRESHOLD}`,
      accent: 'accent',
    },
    { label: 'Awaiting Approval', value: countByStatus('Pending'), accent: 'warning' },
    { label: 'Approved', value: countByStatus('Approved'), accent: 'success' },
    { label: 'Contacted', value: countByStatus('Contacted'), accent: 'info' },
    { label: 'Replied', value: countByStatus('Replied'), accent: 'accent' },
    { label: 'Follow-up Sent', value: countByStatus('Follow-up Sent'), accent: 'ink' },
    { label: 'Rejected', value: countByStatus('Rejected'), accent: 'danger' },
  ]
}

const CHART_ORDER: LeadStatus[] = [
  'Pending',
  'Approved',
  'Contacted',
  'Replied',
  'Follow-up Sent',
  'Rejected',
]

export function Dashboard() {
  const { leads, isLoading, error, refetch } = useLeads()

  const metrics = useMemo(() => computeMetrics(leads), [leads])
  const chartData = useMemo(
    () =>
      CHART_ORDER.map((status) => ({
        status,
        count: leads.filter((l) => l.status === status).length,
      })),
    [leads]
  )
  const recentLeads = useMemo(() => leads.slice(0, 5), [leads])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Overview of leads moving through AI qualification and human review.
        </p>
      </div>

      {isLoading && <LoadingState label="Loading dashboard…" />}
      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-4">
                <p className="text-xs font-medium text-[var(--color-muted)]">{metric.label}</p>
                <p
                  className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${ACCENT_CLASSES[metric.accent ?? 'ink']}`}
                >
                  {metric.value}
                </p>
                {metric.hint && (
                  <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">{metric.hint}</p>
                )}
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                  Leads by pipeline stage
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Where every lead currently sits in the workflow.
                </p>
              </div>
            </div>

            {leads.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--color-muted)]">
                No leads yet — data will appear here once n8n starts sending them in.
              </p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                      tickLine={false}
                      axisLine={{ stroke: 'var(--color-line)' }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--color-canvas)' }}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: '1px solid var(--color-line)',
                      }}
                    />
                    <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">Recent leads</h2>
              <Link
                to="/leads"
                className="text-xs font-medium text-[var(--color-accent)] hover:underline"
              >
                View all
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--color-muted)]">No leads yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-[var(--color-line)]">
                {recentLeads.map((lead) => (
                  <li key={lead.id}>
                    <Link
                      to={`/leads/${lead.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:bg-[var(--color-canvas)] -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                          {lead.name}
                        </p>
                        <p className="truncate text-xs text-[var(--color-muted)]">
                          {lead.company}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-[var(--color-muted)]">
                        {lead.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
