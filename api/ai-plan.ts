import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const enabled = process.env.AI_PLAN_ENABLED === 'true'
  const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.OPENAI_API_KEY

  if (!enabled || !apiKey) {
    return res.status(200).json({
      enabled: false,
      message: 'AI quick-add coming soon. Use the form below for now.',
    })
  }

  const { text } = req.body as { text?: string }
  if (!text?.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }

  // Stub response shape — wire to Anthropic/OpenAI when API key is provided
  return res.status(200).json({
    enabled: true,
    message: 'AI parsing is configured but not yet implemented. Use the form below.',
    event: null,
  })
}
