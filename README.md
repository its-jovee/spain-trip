# Spain Trip PWA

A premium, lightweight trip organizer for João & Paula — itinerary, calendar, documents, and shared checklists. Installable as a PWA on iOS and Android.

## Features

- **Today** — countdown and up-next view
- **Itinerary** — day-by-day timeline with progressive disclosure
- **Calendar** — month and week views, drag-to-reorder in week view
- **Add & move plans** — with participant tags (João & Paula / individual)
- **Documents** — PDF vault (Supabase Storage)
- **Checklists** — luggage, pre-boarding, before-leaving-home (live sync)
- **Calendar feed** — subscribe via `.ics` URL in Google/Apple Calendar
- **AI quick-add** — stubbed, ready to wire when you add an API key

## Local development

```bash
npm install
npm run dev
```

**Sign in:** pick João or Paula, each with their own Supabase account.

Local mode (no Supabase): shared password `spain2026` — set `VITE_APP_PASSCODE` to change.

Profile photos: add `public/avatars/joao.jpg` and `public/avatars/paula.jpg`.

## Supabase setup

1. Create a free [Supabase](https://supabase.com) project
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor
3. Create two auth users (João + Paula) with emails matching `VITE_JOAO_EMAIL` / `VITE_PAULA_EMAIL`
4. If upgrading an existing DB, run [`supabase/migrations/002_joao_users.sql`](supabase/migrations/002_joao_users.sql)
5. Copy `.env.example` → `.env` and fill in URL, anon key, and user emails

## PDF ingestion

1. Drop PDFs in `pdfs/`
2. Populate `pdfs/manifest.json` with extracted metadata
3. Run: `npx tsx scripts/ingest-pdfs.ts`

## Deploy to Vercel

```bash
npx vercel
```

Set these env vars in Vercel:

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_PASSCODE`, `VITE_CALENDAR_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`, `CALENDAR_TOKEN` (for ICS feed)

Then install on your phones: Safari/Chrome → Add to Home Screen.

## Design

Serif typography (Fraunces + Newsreader), warm paper texture, generous whitespace, tasteful Framer Motion animations.
