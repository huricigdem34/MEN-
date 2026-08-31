import { createClient } from '@supabase/supabase-js'
import { supabase as mockSupabase } from './supabaseMock'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[TEMP] No Supabase .env found — using an in-memory MOCK backend. ' +
    'Any email/password logs you in, and data resets on page refresh. ' +
    'Set up real Supabase credentials in .env when you\'re ready to persist data.'
  )
  client = mockSupabase
} else {
  client = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = client
