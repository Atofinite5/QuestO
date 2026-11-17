import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
  localStorage.removeItem('questo_auth_user');
  const oldSettings = localStorage.getItem('questo_backend_settings');
  if (oldSettings) {
    try {
      const settings = JSON.parse(oldSettings);
      if (settings.geminiKey) {
        delete settings.geminiKey;
        localStorage.setItem('questo_backend_settings', JSON.stringify(settings));
      }
    } catch {
      localStorage.removeItem('questo_backend_settings');
    }
  }
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://not-configured.supabase.co',
  supabaseAnonKey || 'not-configured',
  { auth: { autoRefreshToken: true, persistSession: false, detectSessionInUrl: true } },
);
