import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Flame,
} from 'lucide-react';
import { ownerProfile } from '../data/profile';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { audioService } from '../services/audioService';

const KINETIC_PHRASES = [
  'PROBLEMS INTO SOLUTIONS.',
  'IDEAS INTO REALITY.',
  'SYSTEMS THAT SHIP.',
];

const MATERIALS_SPEC = [
  'REACT.JS',
  'TYPESCRIPT',
  'THREE.JS / WEBGL',
  'PYTHON',
  'FASTAPI',
  'POSTGRESQL',
  'POSTGIS',
  'JAVA',
  'PHP',
  'SQL SERVER',
  'TAILWIND CSS',
  'VITE',
  'NLP & OCR',
  'GIT & GITHUB',
  'RENDER CLOUD',
];

export const Hero: React.FC = () => {
  const { reducedMotion, triggerEnergySurge, energySurge } = usePortfolio();
  const [phraseIndex, setPhraseIndex] = useState<number>(0);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % KINETIC_PHRASES.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const scrollTo = (id: string) => {
    audioService.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      aria-label="Hero Landing Section"
      className="relative min-h-screen pt-32 sm:pt-36 lg:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle Architectural Blueprint Grid Overlay on Hero */}
      <div className="absolute inset-0 bg-tactical-grid opacity-55 pointer-events-none" />

      {/* Center Symmetrical Blueprint Stage Flanking the 3D Deku Bust */}
      <div className="relative max-w-7xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-center z-10 py-2">
        {/* LEFT COLUMN: Identity, Condensed Display H1 & Studio CTAs */}
        <div className="row-start-2 md:col-start-1 md:col-span-1 md:row-start-2 lg:col-start-1 lg:col-span-4 lg:row-start-1 space-y-4 text-left bg-[#060b09]/84 lg:bg-transparent p-5 lg:p-0 rounded-[4px] border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none">
          <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase">
            FULL-STACK &amp; 3D WEB DEVELOPER
          </p>

          <h1 className="font-heading text-5xl sm:text-6xl xl:text-[66px] font-black tracking-tight text-[#F4F7F5] uppercase leading-[0.93]">
            ETHAN AREX
            <span className="block text-[#00E676] text-glow-emerald">
              V. ILUSTRE.
            </span>
          </h1>

          <p className="text-sm sm:text-[15px] text-[#C5D3CC] leading-relaxed max-w-sm">
            Third-year BSIT developer at{' '}
            <span className="text-white font-medium">UNO-R</span> building
            production web apps, 3D Three.js interfaces, and AI decision-support
            systems.
          </p>

          {/* Studio-Grade Primary Off-White CTA + Text Link (Inspired by ralfmangubos.com) */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => scrollTo('projects')}
              onMouseEnter={() => audioService.playHover()}
              className="hud-button-primary px-5 py-3 text-sm cursor-pointer"
            >
              <span>See the work</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={ownerProfile.resumePath}
              download="Ethan-Arex-Ilustre-Resume.pdf"
              onMouseEnter={() => audioService.playHover()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F4F7F5] hover:text-[#00E676] transition-colors"
            >
              <span>Resume PDF</span>
              <ArrowUpRight className="w-4 h-4 text-[#00E676]" />
            </a>
          </div>
        </div>

        {/* CENTER 3D STAGE: Row 1 on Mobile & Tablet/iPad, Center Columns 5-8 on Desktop */}
        <div className="row-start-1 md:col-start-1 md:col-span-2 md:row-start-1 lg:col-start-5 lg:col-span-4 lg:row-start-1 min-h-[240px] sm:min-h-[285px] md:min-h-[330px] lg:min-h-[450px] pointer-events-none flex items-end justify-center pb-2 lg:pb-0">
          <span className="lg:hidden px-3 py-1 rounded-[3px] bg-[#050807]/80 border border-[#00E676]/40 font-mono text-[10px] text-[#00E676] tracking-[0.18em] uppercase backdrop-blur-sm">
            {energySurge
              ? 'ONE-FOR-ALL 100% OVERDRIVE'
              : '3D DEKU STAGE • SWIPE OR TAP RAGE'}
          </span>
        </div>

        {/* RIGHT COLUMN: Kinetic Condensed Philosophy Headline + Interactive 100% Rage Mode */}
        <div className="row-start-3 md:col-start-2 md:col-span-1 md:row-start-2 lg:col-start-9 lg:col-span-4 lg:row-start-1 flex flex-col items-start md:items-end lg:items-end justify-between h-full space-y-5 bg-[#060b09]/84 lg:bg-transparent p-5 lg:p-0 rounded-[4px] border border-white/10 lg:border-none backdrop-blur-md lg:backdrop-blur-none">
          <div className="text-left md:text-right lg:text-right w-full">
            <p className="font-mono text-[11px] font-semibold text-[#8FA198] tracking-[0.22em] uppercase mb-2">
              BUILT TO TURN
            </p>
            <div className="min-h-[64px] sm:min-h-[84px] flex items-start md:justify-end">
              <p
                key={phraseIndex}
                className="font-heading text-3xl sm:text-4xl xl:text-[46px] font-black uppercase tracking-tight leading-[0.95] text-[#00E676] text-glow-emerald transition-all duration-300"
              >
                {KINETIC_PHRASES[phraseIndex]}
              </p>
            </div>
            <p className="font-mono text-[11px] text-[#8FA198] tracking-[0.14em] uppercase mt-2">
              WEB APPS &bull; AI &bull; CYBERSECURITY &bull; 3D WEB
            </p>
          </div>

          <div className="w-full flex flex-col items-start md:items-end gap-3">
            <button
              type="button"
              onClick={triggerEnergySurge}
              aria-pressed={energySurge}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[3px] font-mono text-xs font-bold uppercase tracking-[0.14em] border backdrop-blur-md transition-all cursor-pointer ${
                energySurge
                  ? 'bg-[#00E676] text-[#050807] border-white shadow-[0_0_32px_rgba(0,230,118,0.5)]'
                  : 'bg-[#0a100d]/92 text-[#00E676] border-[#00E676]/55 hover:border-[#00E676] hover:bg-[#00E676]/15 hover:text-white'
              }`}
            >
              <Flame
                className={`w-4 h-4 shrink-0 ${
                  energySurge ? 'text-[#050807] animate-bounce' : 'text-[#00E676]'
                }`}
              />
              <span>
                {energySurge
                  ? '100% RAGE MODE: ACTIVE'
                  : 'ACTIVATE 100% RAGE MODE'}
              </span>
            </button>

            {/* Minimalist Square Architectural Social Links */}
            <div className="flex items-center gap-2 text-[#8FA198]">
              <a
                href="https://github.com/ethanarexilustre1019-ui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-[3px] bg-[#0a100d]/90 border border-white/12 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-[3px] bg-[#0a100d]/90 border border-white/12 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${ownerProfile.email}`}
                aria-label="Email"
                className="p-2 rounded-[3px] bg-[#0a100d]/90 border border-white/12 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hairline Anchored "MATERIALS SPEC — TOOLS I BUILD WITH" Infinite Marquee */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-5 mt-4 border-t border-white/12">
        <p className="text-center font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#8FA198] mb-3.5">
          MATERIALS SPEC &mdash; TOOLS I BUILD WITH
        </p>

        <div className="marquee-mask overflow-hidden w-full">
          <div className="marquee-track flex items-center gap-8 sm:gap-12">
            {[...MATERIALS_SPEC, ...MATERIALS_SPEC].map((tool, idx) => (
              <span
                key={`${tool}-${idx}`}
                className="inline-flex items-center gap-3 font-mono text-xs sm:text-[13px] font-semibold tracking-[0.16em] text-[#8FA198] hover:text-[#00E676] transition-colors whitespace-nowrap select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]/60" />
                <span>{tool}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
