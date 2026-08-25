import { useCallback, useEffect, useState } from 'react'
import { fetchLeadById } from '../lib/leadsApi'
import type { Lead } from '../types/lead'

interface UseLeadResult {
  lead: Lead | null
  isLoading: boolean
  error: string | null
  refetch: () => void
  setLead: (lead: Lead) => void
}

export function useLead(id: string | undefined): UseLeadResult {
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey((key) => key + 1), [])

  useEffect(() => {
    if (!id) return
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchLeadById(id as string)
        if (!cancelled) setLead(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load lead.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, refreshKey])

  return { lead, isLoading, error, refetch, setLead }
}
