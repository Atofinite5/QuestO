import React, { useState, useEffect } from 'react';
import { X, Check, Globe, Key, Webhook, RefreshCw, AlertCircle } from 'lucide-react';
import { ApiService, BackendSettings } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved
}) => {
  const [settings, setSettings] = useState<BackendSettings>({
    webAppUrl: '',
    geminiKey: '',
    n8nWebhookUrl: '',
    useLiveBackend: false
  });
  const [testStatus, setTestStatus] = useState<{ testing: boolean; message: string; success?: boolean }>({
    testing: false,
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      setSettings(ApiService.getSettings());
      setTestStatus({ testing: false, message: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    ApiService.saveSettings(settings);
    if (onSettingsSaved) onSettingsSaved();
    onClose();
  };

  const handleTestConnection = async () => {
    if (!settings.webAppUrl) {
      setTestStatus({ testing: false, success: false, message: 'Please enter a Google Apps Script Web App URL first.' });
      return;
    }
    setTestStatus({ testing: true, message: 'Pinging Questo backend...' });
    const res = await ApiService.testBackendConnection(settings.webAppUrl);
    setTestStatus({
      testing: false,
      success: res.success,
      message: res.message
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.1] shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              Backend Connection & Secrets
            </h3>
            <p className="text-xs text-zinc-500 dark:text-slate-400 mt-0.5">
              Connect this frontend directly to your deployed Google Apps Script & n8n
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Backend Toggle */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-950 dark:text-white">Live Backend Mode</div>
            <div className="text-[11px] text-zinc-500 dark:text-slate-400">
              {settings.useLiveBackend 
                ? 'Posting directly to your Google Apps Script Web App' 
                : 'Running in rich local sandbox mode (with realistic offline simulation)'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useLiveBackend}
              onChange={e => setSettings({ ...settings, useLiveBackend: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Google Apps Script Web App URL (Exec Endpoint):</span>
            </label>
            <input
              type="url"
              value={settings.webAppUrl}
              onChange={e => setSettings({ ...settings, webAppUrl: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini API Key (Optional client override):</span>
            </label>
            <input
              type="password"
              value={settings.geminiKey}
              onChange={e => setSettings({ ...settings, geminiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Webhook className="w-3.5 h-3.5 text-cyan-500" />
              <span>n8n Webhook Endpoint URL:</span>
            </label>
            <input
              type="url"
              value={settings.n8nWebhookUrl}
              onChange={e => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/questo-events"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Test Connection Result */}
        {testStatus.message && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            testStatus.testing 
              ? 'bg-zinc-100 dark:bg-white/[0.05] text-zinc-700 dark:text-slate-300' 
              : testStatus.success 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30' 
              : 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
          }`}>
            {testStatus.testing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
            ) : testStatus.success ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{testStatus.message}</span>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus.testing}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-zinc-900 dark:text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testStatus.testing ? 'animate-spin' : ''}`} />
            <span>Test Connection Ping</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-slate-400 dark:hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
