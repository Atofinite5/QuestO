import React, { useState, useEffect } from 'react';
import { 
  Settings, Database, RefreshCw, CheckCircle2,
  AlertCircle, LogOut, Shield, Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiService, BackendSettings } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';

export const AppSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState<BackendSettings>({
    webAppUrl: '',
    n8nWebhookUrl: '',
    useLiveBackend: false
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    const loaded = ApiService.getSettings();
    setSettings(loaded);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    ApiService.saveSettings(settings);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleTestConnection = async () => {
    if (!settings.webAppUrl) {
      setTestResult({ success: false, message: 'Please enter a Google Apps Script Web App URL first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await ApiService.testBackendConnection(settings.webAppUrl);
    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Settings & Cloud Gateway"
        subtitle="Manage your workspace connector and review where company data and AI credentials are stored."
      />

      {/* Account Info Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          <span>Active Session & Access Permissions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-0.5">Signed In As</span>
            <span className="font-bold text-zinc-900 dark:text-white text-sm">{user?.name}</span>
            <span className="text-zinc-500 block">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold block mb-0.5">Assigned Organizational Role</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{user?.role}</span>
            <span className="text-zinc-500 block">{user?.companyName}</span>
          </div>
        </div>
      </div>

      {/* Backend Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              <span>Operations Connector</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identity and company membership live in Supabase PostgreSQL. Google Sheets stays an optional operations connector.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useLiveBackend}
              onChange={(e) => setSettings({ ...settings, useLiveBackend: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700"
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Live Backend Mode
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase text-zinc-500">
                Google Apps Script Web App URL
              </label>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
            <input
              type="url"
              value={settings.webAppUrl}
              onChange={(e) => setSettings({ ...settings, webAppUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {testResult && (
              <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 text-xs text-zinc-600 dark:text-zinc-300">
            <span className="font-semibold text-zinc-900 dark:text-white">AI model:</span> DeepSeek V4.1 Flash. Configure its OpenRouter key in private Apps Script project properties; it is never saved in this browser or in the Sheet.
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">
              n8n Incident Webhook Dispatcher URL
            </label>
            <input
              type="url"
              value={settings.n8nWebhookUrl}
              onChange={(e) => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
              placeholder="https://n8n.company.com/webhook/questo-blocker"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            {savedNotification && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings Saved Successfully
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            Save Gateway Settings
          </button>
        </div>
      </form>

      {/* Setup Guide Card */}
      <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 space-y-3">
        <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Quick 3-Step Google Sheet Connection Guide</span>
        </h4>
        <ol className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 list-decimal list-inside pl-1">
          <li>Create a new spreadsheet at <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-indigo-600 underline">sheets.new</a></li>
          <li>Open <strong>Extensions $\rightarrow$ Apps Script</strong> and paste the contents of <code className="bg-white/80 dark:bg-zinc-900 px-1 py-0.5 rounded font-mono">questo/gas/QuestoBundle.js</code></li>
              <li>Store the OpenRouter API key in the Apps Script project properties. Never put it in a Sheet or browser setting.</li>
        </ol>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl bg-rose-50/30 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-500/10 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">Sign Out of Workspace</h4>
          <p className="text-xs text-rose-700/80 dark:text-rose-400">Terminates active session on this device.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

