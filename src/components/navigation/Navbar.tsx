import React, { useState } from 'react';
import {
  Menu,
  X,
  Volume2,
  VolumeX,
  Flame,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { SectionId } from '../../types/portfolio';
import { audioService } from '../../services/audioService';

interface NavItem {
  id: SectionId;
  label: string;
  code: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'HOME', code: '01.' },
  { id: 'about', label: 'ABOUT', code: '02.' },
  { id: 'skills', label: 'ARSENAL', code: '03.' },
  { id: 'projects', label: 'PROJECTS', code: '04.' },
  { id: 'achievements', label: 'CERTIFICATES', code: '05.' },
  { id: 'education', label: 'JOURNEY', code: '06.' },
  { id: 'contact', label: 'CONTACT', code: '07.' },
];

export const Navbar: React.FC = () => {
  const {
    activeSection,
    setActiveSection,
    soundEnabled,
    toggleSound,
    reducedMotion,
    toggleReducedMotion,
    triggerEnergySurge,
    energySurge,
  } = usePortfolio();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const scrollToSection = (id: SectionId) => {
    audioService.playClick();
    setActiveSection(id);
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050807]/88 backdrop-blur-md border-b border-[#00E676]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Desktop Navigation Links (Cleanly aligned without redundant top-left branding block) */}
        <nav
          aria-label="Main portfolio navigation"
          className="hidden lg:flex items-center gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => audioService.playHover()}
                className={`relative px-3.5 py-2 rounded-lg text-[13px] font-display font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#00E676] bg-[#00E676]/12'
                    : 'text-[#D5E2DC] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-mono text-[11px] text-[#00E676] mr-1">{item.code}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#00E676] rounded-full shadow-[0_0_8px_#00E676]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Quick Active Section Indicator */}
        <div className="lg:hidden flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[#00E676]">
            {NAV_ITEMS.find((n) => n.id === activeSection)?.label || 'HOME'}
          </span>
        </div>

        {/* Utility Controls (RAGE MODE, Audio, Motion) & Mobile Toggle */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={triggerEnergySurge}
            aria-pressed={energySurge}
            title="Toggle Deku 100% Full-Cowling / Super-Saiyan Rage Mode"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-display font-bold tracking-wider uppercase border transition-all cursor-pointer ${
              energySurge
                ? 'bg-[#00E676] text-[#050807] border-[#ffffff] shadow-[0_0_24px_#00E676]'
                : 'bg-[#101915] text-[#00E676] border-[#00E676]/45 hover:border-[#00E676] hover:bg-[#00E676]/12'
            }`}
          >
            <Flame className={`w-4 h-4 ${energySurge ? 'text-[#050807] animate-bounce' : 'text-[#00E676]'}`} />
            <span>{energySurge ? 'RAGE MODE: ON' : 'RAGE MODE'}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute My Hero Academia BGM & Sound Effects' : 'Enable My Hero Academia BGM & Sound Effects'}
            title={soundEnabled ? 'MHA Soundtrack & Mode Audio: ON' : 'MHA Soundtrack & Mode Audio: MUTED'}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display font-semibold border transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-[#00E676] text-[#00E676] bg-[#00E676]/12 shadow-[0_0_12px_rgba(0,230,118,0.2)]'
                : 'border-white/15 text-[#D5E2DC] bg-[#101915] hover:text-white hover:border-white/30'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'MHA AUDIO' : 'MUTED'}</span>
          </button>

          <button
            type="button"
            onClick={toggleReducedMotion}
            aria-label={reducedMotion ? 'Enable full 3D animations' : 'Enable reduced motion mode'}
            title={reducedMotion ? 'Reduced Motion: ON' : '3D Animations: ON'}
            className={`p-2 sm:p-2.5 rounded-lg border transition-colors cursor-pointer ${
              reducedMotion
                ? 'border-[#72B8FF] text-[#72B8FF] bg-[#72B8FF]/12'
                : 'border-white/15 text-[#D5E2DC] bg-[#101915] hover:text-white hover:border-white/30'
            }`}
          >
            {reducedMotion ? <EyeOff className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </button>

          {/* Responsive Menu Button (shown below lg) */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 sm:p-2.5 rounded-lg border border-[#00E676]/40 text-white bg-[#101915] hover:border-[#00E676] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5 text-[#00E676]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Menu */}
      {mobileOpen && (
        <nav
          aria-label="Mobile portfolio navigation"
          className="lg:hidden bg-[#050807]/98 border-b border-[#00E676]/30 px-4 pt-3 pb-6 space-y-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left font-display font-semibold text-sm border transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#00E676] bg-[#00E676]/15 text-[#00E676]'
                      : 'border-white/10 bg-[#101915]/70 text-[#D5E2DC] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-[#00E676]">{item.code}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              triggerEnergySurge();
              setMobileOpen(false);
            }}
            className="w-full mt-2 hud-button-primary py-3 text-sm"
          >
            <Flame className="w-4 h-4" />
            <span>{energySurge ? 'Deactivate Rage Mode' : 'Activate 100% Rage Mode'}</span>
          </button>
        </nav>
      )}
    </header>
  );
};
