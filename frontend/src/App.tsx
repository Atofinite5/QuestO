import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveApp } from './components/InteractiveApp';
import { FeatureShowcase } from './components/FeatureShowcase';
import { ArchitectureSection } from './components/ArchitectureSection';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eod' | 'roadmap' | 'applicants' | 'meetings' | 'analytics'>('eod');
  const [blockerCount, setBlockerCount] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#07080c] text-zinc-900 dark:text-[#f8fafc] selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-200">
      
      {/* Top Sticky Navigation */}
      <Navbar
        blockerCount={blockerCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
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
        />

        {/* 60/40 Bento Grid Feature Showcase */}
        <FeatureShowcase />

        {/* Cloud Topology & Architecture */}
        <ArchitectureSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Settings / Backend Connector Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
};

export default App;
