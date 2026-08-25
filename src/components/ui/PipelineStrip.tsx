import { Check, X } from 'lucide-react'
import type { LeadStatus } from '../../types/lead'

// The lead lifecycle really is a fixed sequence, so a numbered/ordered
// strip is honest here rather than decorative. Rejected is modeled as
// an exit branch rather than a stage in the happy path.
const HAPPY_PATH: LeadStatus[] = [
  'Pending',
  'Approved',
  'Contacted',
  'Replied',
]

const STAGE_LABEL: Record<string, string> = {
  Pending: 'Review',
  Approved: 'Approved',
  Contacted: 'Contacted',
  Replied: 'Replied',
}

interface PipelineStripProps {
  status: LeadStatus
  compact?: boolean
}

export function PipelineStrip({ status, compact = false }: PipelineStripProps) {
  const isRejected = status === 'Rejected'
  // "Follow-up Sent" sits alongside "Contacted" in the timeline rather than
  // past "Replied" — it's an alternate outcome of the contacted stage.
  const effectiveStatus = status === 'Follow-up Sent' ? 'Contacted' : status
  const currentIndex = HAPPY_PATH.indexOf(effectiveStatus)

  return (
    <div className="flex w-full items-center">
      {HAPPY_PATH.map((stage, index) => {
        const isDone = !isRejected && index < currentIndex
        const isCurrent = !isRejected && index === currentIndex
        const isFollowUp = status === 'Follow-up Sent' && stage === 'Contacted'
        const isLast = index === HAPPY_PATH.length - 1

        return (
          <div key={stage} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'flex items-center justify-center rounded-full border-2 font-mono text-xs font-semibold transition-colors',
                  compact ? 'h-6 w-6' : 'h-8 w-8',
                  isDone
                    ? 'border-[var(--color-success)] bg-[var(--color-success)] text-white'
                    : isCurrent
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                      : 'border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-muted)]',
                ].join(' ')}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              {!compact && (
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    isDone || isCurrent ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'
                  }`}
                >
                  {STAGE_LABEL[stage]}
                  {isFollowUp && isCurrent ? ' · Follow-up' : ''}
                </span>
              )}
            </div>
            {!isLast && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded ${
                  isDone ? 'bg-[var(--color-success)]' : 'bg-[var(--color-line)]'
                }`}
              />
            )}
          </div>
        )
      })}

      {isRejected && (
        <div className="ml-3 flex flex-col items-center gap-1.5">
          <div
            className={`flex items-center justify-center rounded-full border-2 border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)] ${compact ? 'h-6 w-6' : 'h-8 w-8'}`}
          >
            <X className="h-3.5 w-3.5" />
          </div>
          {!compact && (
            <span className="text-[11px] font-medium text-[var(--color-danger)]">Rejected</span>
          )}
        </div>
      )}
    </div>
  )
}
