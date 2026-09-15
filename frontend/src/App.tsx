import React, { useState } from 'react';
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Sticky Navigation */}
      <Navbar
        blockerCount={blockerCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToSection={scrollToSection}
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
      />

      <main>
        {/* Hero Section */}
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

      {/* Backend Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsSaved={() => {
          // Trigger refresh if needed
        }}
      />

    </div>
  );
};

export default App;
