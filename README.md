# SalesPilot — Dashboard

Frontend dashboard for SalesPilot, an AI-assisted sales automation workflow. This app is the
human-review layer: it reads leads from Supabase, lets you approve or reject them, and leaves
everything else (qualification, email, reply detection, follow-ups) to n8n.

## Stack

React + TypeScript + Vite + Tailwind CSS v4 + Supabase JS client + React Router + Recharts.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project's URL and anon key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Only the anon key is used — never the service-role key. Run locally:

```bash
npm run dev
```

## Expected `leads` table

This app reads and writes the existing `leads` table as-is (no schema changes):

`id, lead_id, name, email, company, job_title, industry, score, ai_reason, status, outreach_message, contacted, created_at`

### `status` values the UI understands

```
Pending | Approved | Rejected | Contacted | Replied | Follow-up Sent
```

If your n8n workflow writes different string values for status, either align them to this list
or update `LeadStatus` / `LEAD_STATUSES` in `src/types/lead.ts` — that's the single source of
truth the whole app reads from.

### "Qualified Leads" metric

The schema has no dedicated qualification flag, so the dashboard treats any lead with
`score >= 60` as qualified. Adjust `QUALIFIED_SCORE_THRESHOLD` in `src/types/lead.ts` if your
AI scoring uses a different scale or cutoff.

## What React does — and doesn't — do

- Reads leads from Supabase (`src/lib/leadsApi.ts`)
- Writes `status` to `Approved` or `Rejected` when you click the buttons on a lead's detail page
- Does **not** send emails, detect replies, or run any automation — n8n owns all of that once it
  sees `status = Approved` in Supabase

## Project structure

```
src/
  types/lead.ts          Lead + LeadStatus types, single source of truth for status values
  lib/supabase.ts         Supabase client (env-based)
  lib/leadsApi.ts         All Supabase reads/writes for leads — no duplicated queries elsewhere
  hooks/useLeads.ts        Fetch all leads (loading/error state)
  hooks/useLead.ts         Fetch one lead by id (loading/error state)
  components/layout/       Sidebar + app shell
  components/ui/           StatusBadge, ScorePill, PipelineStrip, Card, loading/empty/error states
  pages/Dashboard.tsx       Metrics + pipeline chart + recent leads
  pages/Leads.tsx           Searchable/filterable/sortable leads table
  pages/LeadDetail.tsx       Lead info, AI reasoning, outreach message, Approve/Reject
```

## Build

```bash
npm run build
```
