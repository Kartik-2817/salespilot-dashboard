interface ScorePillProps {
  score: number
}

function bandFor(score: number) {
  if (score >= 75) return 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
  if (score >= 60) return 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]'
  return 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
}

export function ScorePill({ score }: ScorePillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-semibold tabular-nums ${bandFor(score)}`}
    >
      {score}
    </span>
  )
}
