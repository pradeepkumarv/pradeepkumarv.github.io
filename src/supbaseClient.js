import { createClient } from '@supabase/supabase-js'

// replace with your Supabase project URL & anon key
const supabaseUrl = "https://mtznhdtcagviquutcmtu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10em5oZHRjYWd2aXF1dXRjbXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDg4MjUsImV4cCI6MjA3MTA4NDgyNX0.5gHLFO_bNPLrK_T1eFv3qw82zzjqoVOUh3m8-8Ho_6Q"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
