  const supabaseUrl = process.env.SUPABASE_URL || 'https://zvqsqntqoyksranhodfh.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2cXNxbnRxb3lrc3JhbmhvZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNjQ3NzMsImV4cCI6MjA3Mzc0MDc3M30.8A7kdHZmMFFNZMBLEhaAegkQOu4fVJ2-RwlMVN7dYSU';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);