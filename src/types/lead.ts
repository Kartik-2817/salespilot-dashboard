// Mirrors the `leads` table in Supabase. Do not add fields here that
// don't exist in the database — this type is a direct reflection of the schema.

export type LeadStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Contacted'
  | 'Replied'
  | 'Follow-up Sent'

export interface Lead {
  id: number

  name: string
  email: string
  company: string
  job_title: string
  industry: string
  lead_score: number
  reason: string
  status: LeadStatus
  outreach_message: string | null
  contacted: boolean
  created_at: string
}

// A lead is treated as "qualified" once the AI score clears this bar.
// This is derived from `score`, not a separate DB field, since the schema
// has no dedicated qualification flag.
export const QUALIFIED_SCORE_THRESHOLD = 70

export const LEAD_STATUSES: LeadStatus[] = [
  'Pending',
  'Approved',
  'Rejected',
  'Contacted',
  'Replied',
  'Follow-up Sent',
]
