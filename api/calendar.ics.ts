import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

function formatIcsDate(iso: string): string {
  return iso.replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.query.token as string
  const expected = process.env.CALENDAR_TOKEN

  if (!expected || token !== expected) {
    return res.status(401).send('Unauthorized')
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).send('Calendar feed not configured')
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const { data: events, error } = await supabase.from('events').select('*').order('start_at')

  if (error) {
    return res.status(500).send('Failed to load events')
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Spain Trip//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Spain Trip',
  ]

  for (const event of events ?? []) {
    const uid = `${event.id}@spain-trip`
    const dtstart = formatIcsDate(event.start_at)
    const summary = escapeIcs(event.title)
    const location = event.location ? escapeIcs(event.location) : ''
    const description = [
      event.confirmation_code ? `Confirmation: ${event.confirmation_code}` : '',
      event.notes ?? '',
      `Participants: ${event.participants}`,
    ]
      .filter(Boolean)
      .join('\\n')

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${uid}`)
    lines.push(`DTSTART:${dtstart}`)
    if (event.end_at) {
      lines.push(`DTEND:${formatIcsDate(event.end_at)}`)
    }
    lines.push(`SUMMARY:${summary}`)
    if (location) lines.push(`LOCATION:${location}`)
    if (description) lines.push(`DESCRIPTION:${escapeIcs(description)}`)
    lines.push(`DTSTAMP:${formatIcsDate(new Date().toISOString())}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  return res.status(200).send(lines.join('\r\n'))
}
