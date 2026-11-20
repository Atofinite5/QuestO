import React, { useState } from 'react';
import { Settings, X, Save, Check, Link as LinkIcon, Bot, RefreshCw } from 'lucide-react';
import { ApiService } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const currentConfig = ApiService.getSettings();
  
  const [gasUrl, setGasUrl] = useState(currentConfig.webAppUrl);
  const [n8nUrl, setN8nUrl] = useState(currentConfig.n8nWebhookUrl);
  const [useLive, setUseLive] = useState(currentConfig.webAppUrl ? (currentConfig.useLiveBackend !== false) : false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    ApiService.saveSettings({
      webAppUrl: gasUrl.trim(),
      n8nWebhookUrl: n8nUrl.trim(),
      useLiveBackend: gasUrl.trim() ? useLive : false
    });

    setSaved(true);
    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Backend Configuration Saved',
        description: 'Connector settings saved in this browser. Provider credentials stay server-side.'
      });
    }
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await ApiService.testBackendConnection(gasUrl.trim());
      if (res.success) {
        setUseLive(true);
        ApiService.saveSettings({
          webAppUrl: gasUrl.trim(),
          n8nWebhookUrl: n8nUrl.trim(),
          useLiveBackend: true
        });
        if (onShowToast) {
          onShowToast({
            type: 'success',
            title: 'Connection Successful',
            description: res.message
          });
        }
      } else {
        if (onShowToast) {
          onShowToast({
            type: 'error',
            title: 'Connection Failed',
            description: res.message
          });
        }
      }
    } catch (err: any) {
      if (onShowToast) {
        onShowToast({
          type: 'error',
          title: 'Connection Error',
          description: err.message
        });
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-in text-zinc-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Backend Integrations</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure Live Google Apps Script & Gemini Endpoints</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Google Apps Script Web App Deployment URL</span>
            </label>
            <input
              type="text"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={gasUrl}
              onChange={e => setGasUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              Your deployed Apps Script Web App handling doGet and doPost actions.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-500" />
              <span>n8n Webhook Trigger URL</span>
            </label>
            <input
              type="text"
              placeholder="https://your-n8n-instance.app/webhook/..."
              value={n8nUrl}
              onChange={e => setN8nUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              n8n workflow receiver for orchestrating Slack alerts and external dispatches.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="liveBackendToggle"
              checked={useLive}
              onChange={e => setUseLive(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700"
            />
            <label htmlFor="liveBackendToggle" className="text-xs text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer">
              Enable Live Apps Script Web App Traffic (instead of offline simulated mock)
            </label>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-2xl font-semibold text-xs transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              saved 
                ? 'bg-emerald-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
