import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { User, UserRole } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  demoAccounts: { email: string; password: string; role: UserRole; name: string }[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_STYLE: Record<UserRole, string> = {
  CEO: 'from-amber-500 to-orange-600',
  CTO: 'from-indigo-500 to-violet-600',
  TEAM_LEAD: 'from-cyan-500 to-blue-600',
  ENGINEER: 'from-purple-500 to-pink-600',
  INTERN: 'from-blue-500 to-indigo-600',
};

// ---------------------------------------------------------------------------
// Demo accounts — only active when Supabase is NOT configured
// ---------------------------------------------------------------------------
const DEMO_ACCOUNTS: { email: string; password: string; role: UserRole; name: string }[] = [
  { email: 'ceo@questo.app',       password: 'demo', role: 'CEO',       name: 'Arjun Mehta'     },
  { email: 'cto@questo.app',       password: 'demo', role: 'CTO',       name: 'Priya Nair'      },
  { email: 'lead@questo.app',      password: 'demo', role: 'TEAM_LEAD', name: 'Rahul Sharma'    },
  { email: 'engineer@questo.app',  password: 'demo', role: 'ENGINEER',  name: 'Ananya Verma'    },
  { email: 'intern@questo.app',    password: 'demo', role: 'INTERN',    name: 'Rohan Kulkarni'  },
];

function makeDemoUser(account: typeof DEMO_ACCOUNTS[0]): User {
  return {
    id: `demo-${account.role.toLowerCase()}`,
    email: account.email,
    name: account.name,
    role: account.role,
    companyId: 'demo-company',
    companyName: 'Questo (Demo)',
    avatarColor: ROLE_STYLE[account.role],
    initials: account.name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase(),
  };
}

// ---------------------------------------------------------------------------
// Supabase user loader (only called when Supabase IS configured)
// ---------------------------------------------------------------------------
async function loadCompanyUser(session: Session): Promise<User> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, display_name, avatar_url')
    .eq('id', session.user.id)
    .single();
  if (profileError || !profile) throw new Error('Your profile is not provisioned. Ask your company administrator for access.');

  const { data: memberships, error: membershipError } = await supabase
    .from('company_memberships')
    .select('company_id, role, companies!inner(name)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: true })
    .limit(1);
  const membership = memberships?.[0];
  if (membershipError || !membership) throw new Error('Your account is not assigned to a company yet. Ask your company administrator for access.');

  const role = membership.role as UserRole;
  const name = profile.display_name || profile.email;
  return {
    id: profile.id,
    email: profile.email,
    name,
    role,
    companyId: membership.company_id,
    companyName: (membership.companies as unknown as { name: string }).name,
    avatarColor: ROLE_STYLE[role] || ROLE_STYLE.ENGINEER,
    initials: name.split(/\s+/).map((part: string) => part[0]).join('').slice(0, 2).toUpperCase(),
  };
}

const DEMO_USER_STORAGE_KEY = 'questo_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (!isSupabaseConfigured && typeof window !== 'undefined') {
      const saved = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const syncSession = async (session: Session | null) => {
      if (!active) return;
      if (!session) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const companyUser = await loadCompanyUser(session);
        if (active) setUser(companyUser);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return () => { active = false; };
    }
    supabase.auth.getSession().then(({ data }) => syncSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => { void syncSession(session); }, 0);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // ── DEMO MODE ──────────────────────────────────────────────────────────
    if (!isSupabaseConfigured) {
      const match = DEMO_ACCOUNTS.find(
        (a) => a.email === email.trim().toLowerCase() && a.password === password
      );
      if (!match) {
        return { success: false, message: 'Invalid email or password. Use a demo account below.' };
      }
      const demoUser = makeDemoUser(match);
      setUser(demoUser);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      return { success: true, message: 'Signed in (demo mode).' };
    }
    // ── SUPABASE MODE ───────────────────────────────────────────────────────

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error || !data.session) return { success: false, message: 'Invalid email or password.' };

      try {
        setUser(await loadCompanyUser(data.session));
        return { success: true, message: 'Signed in successfully.' };
      } catch (provisioningError) {
        await supabase.auth.signOut();
        return {
          success: false,
          message: provisioningError instanceof Error ? provisioningError.message : 'Your account is not provisioned for a company.',
        };
      }
    } catch {
      return {
        success: false,
        message: 'Could not reach the authentication service. Check your connection and try again.',
      };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, demoAccounts: DEMO_ACCOUNTS }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
