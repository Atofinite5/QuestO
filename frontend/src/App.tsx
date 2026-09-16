import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveApp } from './components/InteractiveApp';
import { FeatureShowcase } from './components/FeatureShowcase';
import { ArchitectureSection } from './components/ArchitectureSection';
import { SettingsModal } from './components/SettingsModal';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eod' | 'roadmap' | 'applicants' | 'meetings' | 'analytics'>('eod');
  const [blockerCount, setBlockerCount] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Dispatcher
  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Global Keyboard Listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync theme with document class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-200">
      
      {/* Top Sticky Navigation */}
      <Navbar
        blockerCount={blockerCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onScrollToSection={scrollToSection}
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />

      <main>
        {/* Hero Section with Antigravity KPI Cards */}
        <Hero
          onLaunchSandbox={() => scrollToSection('command-center')}
          onSubmitEod={() => {
            setActiveTab('eod');
            scrollToSection('command-center');
          }}
        />

        {/* Live Interactive Command Center */}
        <InteractiveApp
          activeTab={activeTab}
          setActiveTab={(tab: string) => setActiveTab(tab as any)}
          onBlockerUpdate={(count: number) => setBlockerCount(count)}
          onShowToast={showToast}
        />

        {/* Bento Grid Feature Showcase */}
        <FeatureShowcase />

        {/* Cloud Topology & Architecture */}
        <ArchitectureSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab: string) => {
          setActiveTab(tab as any);
          scrollToSection('command-center');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        darkMode={darkMode}
      />

      {/* Settings / Backend Connector Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowToast={showToast}
      />

      {/* Floating Modern Toast Notification Queue */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
};

export default App;
