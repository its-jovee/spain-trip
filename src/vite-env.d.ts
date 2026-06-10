/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_JOAO_EMAIL: string
  readonly VITE_PAULA_EMAIL: string
  readonly VITE_APP_PASSCODE: string
  readonly VITE_CALENDAR_TOKEN: string
  readonly VITE_AI_PLAN_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
