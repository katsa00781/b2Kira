import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Hiányzó Supabase konfiguráció. Másold le a .env.example fájlt .env néven, ' +
      'és töltsd ki az EXPO_PUBLIC_SUPABASE_URL és EXPO_PUBLIC_SUPABASE_ANON_KEY értékeket.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // A szülő session-je AsyncStorage-ban marad, így nem kell újra bejelentkeznie.
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    // Ez csak webes OAuth redirecthez kell, mobilon félreértelmezné az URL-t.
    detectSessionInUrl: false,
  },
});

// A token frissítése csak akkor fusson, ha az app előtérben van — háttérben
// felesleges hálózati hívás lenne, és a Supabase kliens is ezt javasolja.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
