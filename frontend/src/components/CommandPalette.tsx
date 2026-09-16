import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Calendar, Award, Sparkles, Send, Users, 
  Settings, Sun, Moon, ArrowRight, X, ShieldAlert 
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  darkMode: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenSettings,
  onToggleTheme,
  darkMode
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = [
    {
      id: 'eod',
      title: 'Intern Daily EOD & Blocker Sentinel',
      subtitle: 'Submit daily standups, review challenges & CTO escalation',
      icon: Send,
      category: 'Navigation',
      action: () => { onSelectTab('eod'); onClose(); }
    },
    {
      id: 'roadmap',
      title: 'Founder ➔ CTO Milestone Decomposer',
      subtitle: 'Deconstruct vision into 4-week engineer roadmaps & XP bounties',
      icon: Sparkles,
      category: 'Navigation',
      action: () => { onSelectTab('roadmap'); onClose(); }
    },
    {
      id: 'applicants',
      title: 'Talent & Candidate Pipeline',
      subtitle: 'Review incoming applications and dispatch offer/rejection emails',
      icon: Users,
      category: 'Navigation',
      action: () => { onSelectTab('applicants'); onClose(); }
    },
    {
      id: 'meetings',
      title: 'Instant Google Meet Scheduler',
      subtitle: 'Generate native Meet link with AI-driven pre-meeting agenda',
      icon: Calendar,
      category: 'Navigation',
      action: () => { onSelectTab('meetings'); onClose(); }
    },
    {
      id: 'analytics',
      title: 'Team Velocity & Coaching Radar',
      subtitle: 'Inspect delivery reliability, MTTR, streaks, and AI coaching',
      icon: Award,
      category: 'Navigation',
      action: () => { onSelectTab('analytics'); onClose(); }
    },
    {
      id: 'settings',
      title: 'Configure Backend Connection',
      subtitle: 'Update Google Apps Script URL, Gemini Key & n8n webhook',
      icon: Settings,
      category: 'System',
      action: () => { onOpenSettings(); onClose(); }
    },
    {
      id: 'theme',
      title: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle between daytime clarity and dark mode aesthetic',
      icon: darkMode ? Sun : Moon,
      category: 'Preferences',
      action: () => { onToggleTheme(); onClose(); }
    }
  ];

  const filteredActions = actions.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredActions.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % (filteredActions.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-scale-in text-zinc-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search actions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus-visible:ring-0"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-transparent">
          {filteredActions.length === 0 ? (
            <div className="py-10 text-center text-xs text-zinc-400">
              No matching commands found for "{query}".
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-600/15 text-indigo-900 dark:text-white' 
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{item.title}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                    isSelected ? 'opacity-100 text-indigo-600 dark:text-indigo-400' : 'opacity-0'
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">↵</kbd>
          </div>
          <span>Questo v2.7.0</span>
        </div>

      </div>
    </div>
  );
};
