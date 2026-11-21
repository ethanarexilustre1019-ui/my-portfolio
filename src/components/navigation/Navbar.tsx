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
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050807]/90 backdrop-blur-md border-b border-[#00E676]/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Desktop & iPad Landscape Navigation Links (lg: 1024px+) */}
        <nav
          aria-label="Main portfolio navigation"
          className="hidden lg:flex items-center gap-1 xl:gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => audioService.playHover()}
                className={`relative px-2.5 xl:px-3.5 py-2 rounded-lg text-xs xl:text-[13px] font-display font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#00E676] bg-[#00E676]/12'
                    : 'text-[#D5E2DC] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="font-mono text-[10px] xl:text-[11px] text-[#00E676] mr-1">
                  {item.code}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#00E676] rounded-full shadow-[0_0_8px_#00E676]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile & Tablet Active Section Indicator (<1024px) */}
        <div className="lg:hidden flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse shrink-0" />
          <span className="font-mono text-[11px] text-[#00E676] font-bold shrink-0">
            {NAV_ITEMS.find((n) => n.id === activeSection)?.code || '01.'}
          </span>
          <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
            {NAV_ITEMS.find((n) => n.id === activeSection)?.label || 'HOME'}
          </span>
        </div>

        {/* Utility Controls (RAGE MODE, Audio, Motion) & Mobile/Tablet Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={triggerEnergySurge}
            aria-pressed={energySurge}
            title="Toggle Deku 100% Full-Cowling / Super-Saiyan Rage Mode"
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-xs font-display font-bold tracking-wider uppercase border transition-all cursor-pointer ${
              energySurge
                ? 'bg-[#00E676] text-[#050807] border-[#ffffff] shadow-[0_0_24px_#00E676]'
                : 'bg-[#101915] text-[#00E676] border-[#00E676]/45 hover:border-[#00E676] hover:bg-[#00E676]/12'
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                energySurge ? 'text-[#050807] animate-bounce' : 'text-[#00E676]'
              }`}
            />
            <span className="hidden xs:inline sm:inline">
              {energySurge ? 'RAGE: ON' : 'RAGE MODE'}
            </span>
            <span className="xs:hidden sm:hidden">
              {energySurge ? '100%' : 'RAGE'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={
              soundEnabled
                ? 'Mute My Hero Academia BGM & Sound Effects'
                : 'Enable My Hero Academia BGM & Sound Effects'
            }
            title={
              soundEnabled
                ? 'MHA Soundtrack & Mode Audio: ON'
                : 'MHA Soundtrack & Mode Audio: MUTED'
            }
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-display font-semibold border transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-[#00E676] text-[#00E676] bg-[#00E676]/12 shadow-[0_0_12px_rgba(0,230,118,0.2)]'
                : 'border-white/15 text-[#D5E2DC] bg-[#101915] hover:text-white hover:border-white/30'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden md:inline lg:hidden xl:inline">
              {soundEnabled ? 'MHA AUDIO' : 'MUTED'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleReducedMotion}
            aria-label={
              reducedMotion
                ? 'Enable full 3D animations'
                : 'Enable reduced motion mode'
            }
            title={reducedMotion ? 'Reduced Motion: ON' : '3D Animations: ON'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              reducedMotion
                ? 'border-[#72B8FF] text-[#72B8FF] bg-[#72B8FF]/12'
                : 'border-white/15 text-[#D5E2DC] bg-[#101915] hover:text-white hover:border-white/30'
            }`}
          >
            {reducedMotion ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>

          {/* Responsive Drawer Menu Button (shown on Mobile & Portrait Tablet/iPad below lg) */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="lg:hidden p-2 rounded-lg border border-[#00E676]/40 text-white bg-[#101915] hover:border-[#00E676] cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#00E676]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Quick One-Tap Horizontal Pill Bar for Mobile, Tablet & iPad (<1024px) */}
      <div
        aria-label="Quick section navigation strip"
        className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3 sm:px-6 py-2 border-t border-white/10 bg-[#050807]/95"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-display font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#00E676] text-[#050807] font-bold shadow-[0_0_12px_rgba(0,230,118,0.3)]'
                  : 'bg-[#101915] text-[#D5E2DC] border border-white/10 hover:border-[#00E676]/40'
              }`}
            >
              <span className="font-mono mr-1 opacity-80">{item.code}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile portfolio navigation"
          className="lg:hidden bg-[#050807]/98 border-b border-[#00E676]/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl"
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
                  <span className="font-mono text-xs text-[#00E676]">
                    {item.code}
                  </span>
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
            className="w-full mt-2 hud-button-primary py-3 text-sm cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>
              {energySurge ? 'Deactivate Rage Mode' : 'Activate 100% Rage Mode'}
            </span>
          </button>
        </nav>
      )}
    </header>
  );
};
