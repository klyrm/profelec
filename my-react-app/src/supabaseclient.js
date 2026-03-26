import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hdqpbmnkoulbktkanvjs.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcXBibW5rb3VsYmt0a2FudmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0Mzg0MjUsImV4cCI6MjA5MDAxNDQyNX0.9X6VYP9pRTAfqdt7wDQK2rODwftwpNIcRaq1e18tz3M"

export const supabase = createClient(supabaseUrl, supabaseKey)