import type { AuthSession } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

type AuthSessionState = {
  session: AuthSession | null;
  /** `false`, amíg a tárolt session be nem töltődött — addig ne irányítsunk sehova. */
  ready: boolean;
};

/**
 * A szülő bejelentkezett állapota. A session AsyncStorage-ban perzisztálódik
 * (lásd `lib/supabase.ts`), ezért app indításkor előbb be kell tölteni, és csak
 * utána szabad az auth guardnak lépnie.
 */
export function useAuthSession(): AuthSessionState {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setReady(true);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { session, ready };
}
