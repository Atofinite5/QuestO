import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, ShieldCheck, Zap, Lock, 
  ArrowRight, Sun, Moon, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoAccounts } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setErrorMessage('');
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res.success) navigate('/app');
    else setErrorMessage(res.message);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/app');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
      {/* Top Bar with Back Link & Theme Toggle */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Questo Website</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Column: Brand & Security Guarantee */}
          <div className="hidden lg:flex flex-col space-y-6 pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-mono font-medium self-start">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Company Workspace</span>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-lg mb-4">
                Q
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Questo Enterprise 2.0
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Autonomous engineering leadership, blocker sentinel, and performance intelligence for your core team.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">Company-Scoped Accounts</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Only invited members assigned to a Questo company can open the workspace.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">DeepSeek V4.1 Flash</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">AI analysis runs with a server-managed provider key.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">CWE-1236 Hardened</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Sign-in and company access are verified by Supabase.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Card & Demo Quick-Login */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  Sign in to Workspace
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Sign in with an account invited by your company administrator.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Password
                    </label>
                    <span className="text-[11px] text-zinc-400">Invite-only access</span>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-2 text-rose-700 dark:text-rose-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
                Access is invite-only. Your password is verified by Supabase Auth; Questo never stores it in the browser or Google Sheets.
              </div>

              {/* Demo accounts — only shown when Supabase is not configured */}
              {!isSupabaseConfigured && (
                <div className="mt-5 pt-5 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Demo Mode — click to sign in
                  </p>
                  <div className="space-y-1.5">
                    {demoAccounts.map((a) => (
                      <button
                        key={a.email}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleQuickLogin(a.email, a.password)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${a.role === 'CEO' ? 'from-amber-500 to-orange-600' : a.role === 'CTO' ? 'from-indigo-500 to-violet-600' : a.role === 'TEAM_LEAD' ? 'from-cyan-500 to-blue-600' : a.role === 'ENGINEER' ? 'from-purple-500 to-pink-600' : 'from-blue-500 to-indigo-600'} flex items-center justify-center text-white text-[9px] font-bold`}>
                            {a.name.split(' ').map(p => p[0]).join('').slice(0,2)}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{a.name}</p>
                            <p className="text-[10px] text-zinc-400">{a.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 transition-colors">{a.role.replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
        Questo Enterprise 2.0 • Authorized Personnel Only
      </div>
    </div>
  );
};

