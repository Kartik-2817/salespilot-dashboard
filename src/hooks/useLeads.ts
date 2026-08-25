import { useCallback, useEffect, useState } from 'react'
import { fetchLeads } from '../lib/leadsApi'
import type { Lead } from '../types/lead'

interface UseLeadsResult {
  leads: Lead[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useLeads(): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const refetch = useCallback(() => setRefreshKey((key) => key + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchLeads()
        if (!cancelled) setLeads(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load leads.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return { leads, isLoading, error, refetch }
}
