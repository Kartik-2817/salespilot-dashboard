import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, Check, Mail, Sparkles, X } from 'lucide-react'
import { useLead } from '../hooks/useLead'
import { updateLeadStatus } from '../lib/leadsApi'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ScorePill } from '../components/ui/ScorePill'
import { ErrorState, LoadingState } from '../components/ui/States'
import { PipelineStrip } from '../components/ui/PipelineStrip'

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const { lead, isLoading, error, refetch, setLead } = useLead(id)

  const [isUpdating, setIsUpdating] = useState<'Approved' | 'Rejected' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<string | null>(null)

  async function handleDecision(status: 'Approved' | 'Rejected') {
    if (!lead) return
    setIsUpdating(status)
    setActionError(null)
    setConfirmation(null)
    try {
      const updated = await updateLeadStatus(lead.id, status)
      setLead(updated)
      setConfirmation(
        status === 'Approved'
          ? 'Lead approved. n8n will pick this up and send outreach.'
          : 'Lead rejected.'
      )
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Failed to mark lead as ${status}.`)
    } finally {
      setIsUpdating(null)
    }
  }

  if (isLoading) return <LoadingState label="Loading lead…" />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!lead) return <ErrorState message="This lead could not be found." />

  const isDecided = lead.status !== 'Pending'

  return (
    <div className="flex flex-col gap-5">
      <Link
        to="/leads"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
              {lead.name}
            </h1>
            <StatusBadge status={lead.status} />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
            <Building2 className="h-3.5 w-3.5" />
            {lead.job_title} at {lead.company}
          </p>
        </div>
        <ScorePill score={lead.lead_score} />
      </div>

      <Card className="p-5">
        <p className="mb-4 text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
          Pipeline progress
        </p>
        <PipelineStrip status={lead.status} />
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="mb-3 text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
            Lead information
          </p>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email">
              <a
                href={`mailto:${lead.email}`}
                className="text-[var(--color-accent)] hover:underline"
              >
                {lead.email}
              </a>
            </Field>
            <Field label="Company">{lead.company}</Field>
            <Field label="Job title">{lead.job_title}</Field>
            <Field label="Industry">{lead.industry}</Field>            
            <Field label="Created">{formatDateTime(lead.created_at)}</Field>
          </dl>
        </Card>

        <Card className="flex flex-col p-5">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            AI reasoning
          </p>
          <p className="flex-1 text-sm leading-relaxed text-[var(--color-ink)]">
            {lead.reason || 'No reasoning provided by the qualification workflow.'}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-[var(--color-muted)] uppercase">
          <Mail className="h-3.5 w-3.5" />
          Outreach message
        </p>
        {lead.outreach_message ? (
          <p className="rounded-lg bg-[var(--color-canvas)] p-4 text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-ink)]">
            {lead.outreach_message}
          </p>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">
            No outreach message has been generated yet. n8n drafts this once the lead is
            approved.
          </p>
        )}
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <div>
          <p className="text-sm font-semibold text-[var(--color-ink)]">Review decision</p>
          <p className="text-sm text-[var(--color-muted)]">
            {isDecided
              ? `This lead has already been ${lead.status.toLowerCase()}. n8n owns everything past this point.`
              : 'Approving sends this lead to n8n for outreach. Rejecting removes it from the active queue.'}
          </p>
        </div>

        {actionError && (
          <p className="rounded-lg bg-[var(--color-danger-soft)] px-3 py-2 text-sm text-[var(--color-danger)]">
            {actionError}
          </p>
        )}
        {confirmation && (
          <p className="rounded-lg bg-[var(--color-success-soft)] px-3 py-2 text-sm text-[var(--color-success)]">
            {confirmation}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => handleDecision('Approved')}
            disabled={isDecided || isUpdating !== null}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-4 w-4" />
            {isUpdating === 'Approved' ? 'Approving…' : 'Approve'}
          </button>
          <button
            onClick={() => handleDecision('Rejected')}
            disabled={isDecided || isUpdating !== null}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-danger)] px-4 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-4 w-4" />
            {isUpdating === 'Rejected' ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      </Card>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[var(--color-ink)]">{children}</dd>
    </div>
  )
}
