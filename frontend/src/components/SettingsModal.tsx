import React, { useState, useEffect } from 'react';
import { X, Check, Globe, Key, Webhook, RefreshCw, AlertCircle } from 'lucide-react';
import { ApiService, BackendSettings } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
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
    onSettingsSaved();
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
      message: res.success ? `Connected! Server Version: ${res.version}` : res.message
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#0e111a] border border-white/[0.1] shadow-2xl p-6 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Backend Connection Settings</h3>
              <p className="text-xs text-slate-400">Configure your deployed Google Apps Script & n8n URLs</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Mode Switch Toggle */}
          <div className="p-4 rounded-xl bg-[#07090e] border border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Live Backend Connection</div>
              <div className="text-[11px] text-slate-400">
                {settings.useLiveBackend 
                  ? 'Active: Forwarding requests to Google Apps Script Web App' 
                  : 'Simulation: Running local high-fidelity sandbox with localStorage persistence'}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.useLiveBackend}
                onChange={e => setSettings({ ...settings, useLiveBackend: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Apps Script Web App URL (`doGet` / `doPost`):
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={settings.webAppUrl}
              onChange={e => setSettings({ ...settings, webAppUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#07090e] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Gemini API Key (Optional Override):
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={settings.geminiKey}
              onChange={e => setSettings({ ...settings, geminiKey: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#07090e] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              n8n Webhook Ingestion URL (Optional):
            </label>
            <input
              type="url"
              placeholder="https://your-n8n.instance/webhook/questo-events"
              value={settings.n8nWebhookUrl}
              onChange={e => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-[#07090e] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Test Status Callout */}
          {testStatus.message && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              testStatus.success 
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              {testStatus.testing ? (
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
              ) : testStatus.success ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}

        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus.testing || !settings.webAppUrl}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors disabled:opacity-40"
          >
            {testStatus.testing ? 'Testing...' : 'Test Connection'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
