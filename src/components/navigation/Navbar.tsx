import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Flame,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { SectionId } from '../../types/portfolio';
import { audioService } from '../../services/audioService';

interface NavItem {
  id: SectionId;
  label: string;
  sheet: string;
  sheetTitle: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'HOME', sheet: '01', sheetTitle: 'STUDIO' },
  { id: 'about', label: 'ABOUT', sheet: '02', sheetTitle: 'ABOUT' },
  { id: 'skills', label: 'STACK', sheet: '03', sheetTitle: 'MATERIALS & STACK' },
  { id: 'projects', label: 'WORK', sheet: '04', sheetTitle: 'SELECTED WORK' },
  { id: 'achievements', label: 'AWARDS', sheet: '05', sheetTitle: 'CREDENTIALS' },
  { id: 'education', label: 'JOURNEY', sheet: '06', sheetTitle: 'JOURNEY' },
  { id: 'contact', label: 'CONTACT', sheet: '07', sheetTitle: 'CONTACT' },
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

  const currentSheet =
    NAV_ITEMS.find((item) => item.id === activeSection) || NAV_ITEMS[0];

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
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#050807]/90 backdrop-blur-md border-b border-white/10">
      {/* Main Sticky Architectural Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile & Tablet Minimalist Menu Trigger (<1024px) */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="lg:hidden inline-flex items-center gap-2.5 px-3 py-2 rounded-[3px] border border-white/15 bg-[#0a100d] text-white hover:border-[#00E676] transition-colors cursor-pointer"
        >
          {mobileOpen ? (
            <X className="w-4 h-4 text-[#00E676]" />
          ) : (
            <span className="flex flex-col gap-1.5 w-4">
              <span className="block h-[1.5px] w-full bg-white" />
              <span className="block h-[1.5px] w-3 bg-[#00E676]" />
            </span>
          )}
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C5D3CC]">
            MENU
          </span>
        </button>

        {/* Contained Segmented Monospace Pill Navigation Bar (Desktop & iPad Landscape 1024px+) */}
        <nav
          aria-label="Main portfolio navigation"
          className="hidden lg:flex items-center p-1 rounded-[4px] bg-[#0a100d]/95 border border-white/10"
        >
          {NAV_ITEMS.filter((item) => item.id !== 'contact').map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => audioService.playHover()}
                className={`px-3 xl:px-3.5 py-1.5 rounded-[3px] font-mono text-[11px] tracking-[0.14em] uppercase transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00E676] text-[#050807] font-bold shadow-[0_0_14px_rgba(0,230,118,0.28)]'
                    : 'text-[#8FA198] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Cluster: RAGE MODE, MHA AUDIO, Motion, and High-Contrast Off-White CONTACT -> */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={triggerEnergySurge}
            aria-pressed={energySurge}
            title="Toggle Deku 100% Full-Cowling / Super-Saiyan Rage Mode"
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-[3px] font-mono text-[11px] font-bold tracking-[0.12em] uppercase border transition-all cursor-pointer ${
              energySurge
                ? 'bg-[#00E676] text-[#050807] border-white shadow-[0_0_22px_rgba(0,230,118,0.5)]'
                : 'bg-[#0a100d] text-[#00E676] border-[#00E676]/45 hover:border-[#00E676] hover:bg-[#00E676]/10'
            }`}
          >
            <Flame
              className={`w-3.5 h-3.5 ${
                energySurge ? 'text-[#050807] animate-bounce' : 'text-[#00E676]'
              }`}
            />
            <span className="hidden sm:inline">
              {energySurge ? 'RAGE: 100%' : 'RAGE MODE'}
            </span>
            <span className="sm:hidden">{energySurge ? '100%' : 'RAGE'}</span>
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-[3px] font-mono text-[11px] tracking-[0.1em] uppercase border transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-[#00E676]/60 text-[#00E676] bg-[#00E676]/10'
                : 'border-white/15 text-[#8FA198] bg-[#0a100d] hover:text-white'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden xl:inline">
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
            className={`hidden sm:inline-flex p-2 rounded-[3px] border transition-colors cursor-pointer ${
              reducedMotion
                ? 'border-[#72B8FF] text-[#72B8FF] bg-[#72B8FF]/10'
                : 'border-white/15 text-[#8FA198] bg-[#0a100d] hover:text-white'
            }`}
          >
            {reducedMotion ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-[3px] bg-[#F4F7F5] text-[#050807] hover:bg-[#00E676] font-mono text-[11px] font-bold tracking-[0.12em] uppercase transition-colors cursor-pointer"
          >
            <span>CONTACT</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>

      {/* Architectural Drawing-Set Sub-Header Strip (SHEET XX / 07 — SECTION) */}
      <div className="border-t border-white/10 bg-[#050807]/92">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#8FA198]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            <span>
              SHEET {currentSheet.sheet} / 07 &mdash;{' '}
              <strong className="text-[#C5D3CC] font-semibold">
                {currentSheet.sheetTitle}
              </strong>
            </span>
          </span>
          <span className="hidden sm:inline">
            NEGROS ISLAND REGION &mdash; PHILIPPINES
          </span>
        </div>
      </div>

      {/* Mobile & Tablet Quick Horizontal Pill Bar (<1024px) */}
      <div
        aria-label="Quick section navigation strip"
        className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 border-t border-white/10 bg-[#060b09]/95"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`px-2.5 py-1 rounded-[3px] font-mono text-[10px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00E676] text-[#050807] font-bold'
                  : 'bg-[#0a100d] text-[#8FA198] border border-white/10 hover:text-white'
              }`}
            >
              {item.sheet} / {item.label}
            </button>
          );
        })}
      </div>

      {/* Expanded Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile portfolio navigation"
          className="lg:hidden bg-[#050807]/98 border-t border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-[3px] text-left font-mono text-xs tracking-[0.14em] uppercase border transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#00E676] bg-[#00E676]/12 text-[#00E676] font-bold'
                      : 'border-white/10 bg-[#0a100d] text-[#C5D3CC] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] text-[#00E676]">
                    SHEET {item.sheet}
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
            className="w-full mt-2 hud-button-emerald py-3 font-mono text-xs uppercase tracking-[0.14em] cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>
              {energySurge
                ? 'DEACTIVATE 100% RAGE MODE'
                : 'ACTIVATE 100% RAGE MODE'}
            </span>
          </button>
        </nav>
      )}
    </header>
  );
};
