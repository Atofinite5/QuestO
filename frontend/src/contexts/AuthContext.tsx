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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_STYLE: Record<UserRole, string> = {
  CEO: 'from-amber-500 to-orange-600',
  CTO: 'from-indigo-500 to-violet-600',
  TEAM_LEAD: 'from-cyan-500 to-blue-600',
  ENGINEER: 'from-purple-500 to-pink-600',
  INTERN: 'from-blue-500 to-indigo-600',
};

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Authentication is not configured. Set the Supabase URL and public key in the deployment environment.' };
    }

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
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
