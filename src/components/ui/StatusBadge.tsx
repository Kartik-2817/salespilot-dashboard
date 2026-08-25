import type { LeadStatus } from '../../types/lead'

interface StatusBadgeProps {
  status: LeadStatus
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  Pending: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
  Approved: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  Rejected: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  Contacted: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  Replied: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]',
  'Follow-up Sent': 'bg-slate-100 text-slate-600',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
