import React from 'react';
import {
  ArrowRight,
  User,
  Github,
  Linkedin,
  Mail,
  Globe,
  FileText,
  Flame,
} from 'lucide-react';
import { ownerProfile } from '../data/profile';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { audioService } from '../services/audioService';

export const Hero: React.FC = () => {
  const { reducedMotion, triggerEnergySurge, energySurge } = usePortfolio();

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
      className="relative min-h-screen pt-24 sm:pt-28 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Spacer for Fixed Navbar */}
      <div className="hidden lg:block h-4" />

      {/*
        3-Tier Responsive Showcase Layout:
        - Mobile (<768px): Upper 3D Deku Stage (order-1) + Stacked Glass Identity & Role Card below (order-2 & order-3)
        - Tablet & iPad Portrait (768px-1023px): Upper 3D Deku Stage (md:col-span-2) + Symmetrical 2-Column Split below (md:grid-cols-2)
        - Desktop & iPad Landscape (1024px+): 12-Column Symmetrical 3-Column Flanking Showcase (Left 4 | Center 4 3D Deku | Right 4)
      */}
      <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 items-center z-10">
        {/* CENTER 3D STAGE: First on Mobile & Tablet/iPad so Deku's face & shoulders are never covered by text */}
        <div className="order-1 lg:order-2 md:col-span-2 lg:col-span-4 min-h-[250px] sm:min-h-[295px] md:min-h-[340px] lg:min-h-[480px] pointer-events-none flex items-end justify-center pb-2 lg:pb-0">
          <span className="lg:hidden px-3 py-1 rounded-full bg-[#050807]/75 border border-[#00E676]/35 text-[10px] sm:text-xs font-mono text-[#00E676] tracking-wider uppercase backdrop-blur-sm">
            {energySurge
              ? '⚡ ONE-FOR-ALL 100% OVERDRIVE ACTIVE'
              : '3D INTERACTIVE DEKU • SWIPE OR TAP RAGE MODE'}
          </span>
        </div>

        {/* LEFT BLOCK: Name, University, Tagline & Action Buttons */}
        <div className="order-2 lg:order-1 md:col-span-1 lg:col-span-4 space-y-3.5 sm:space-y-4 text-left bg-[#060d0a]/82 md:bg-[#060d0a]/75 lg:bg-transparent p-4 sm:p-5 lg:p-0 rounded-2xl border border-[#00E676]/25 lg:border-none backdrop-blur-md lg:backdrop-blur-none">
          <div>
            <p className="font-display text-sm sm:text-base lg:text-lg font-medium text-[#00E676] tracking-wide mb-0.5 sm:mb-1">
              Hello! I&rsquo;m
            </p>
            <h1 className="font-display text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white uppercase leading-[1.05]">
              ETHAN AREX
              <span className="block text-[#00E676] text-glow-emerald">
                V. ILUSTRE
              </span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-medium text-[#D5E2DC]">
            Third-Year BSIT Student &bull; {ownerProfile.university}
          </p>

          {/* Main Tagline Pill */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#0b1410]/90 border-l-4 border-[#00E676] border border-white/10 lg:max-w-sm backdrop-blur-md">
            <p className="font-display text-sm sm:text-base lg:text-lg font-bold text-white">
              &ldquo;{ownerProfile.mainTagline}&rdquo;
            </p>
            <p className="text-xs text-[#D5E2DC] mt-0.5">
              {ownerProfile.alternativeHeroStatement}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => scrollTo('projects')}
              onMouseEnter={() => audioService.playHover()}
              className="hud-button-primary flex-1 sm:flex-initial px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>EXPLORE MY PROJECTS</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('about')}
              onMouseEnter={() => audioService.playHover()}
              className="hud-button-secondary flex-1 sm:flex-initial px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
            >
              <User className="w-4 h-4 text-[#00E676] shrink-0" />
              <span>ABOUT ME</span>
            </button>
          </div>
        </div>

        {/* RIGHT BLOCK: Role Title + Interactive RAGE MODE Button */}
        <div className="order-3 lg:order-3 md:col-span-1 lg:col-span-4 flex flex-col items-start md:items-end lg:items-end justify-between h-full space-y-4 bg-[#060d0a]/82 md:bg-[#060d0a]/75 lg:bg-transparent p-4 sm:p-5 lg:p-0 rounded-2xl border border-[#00E676]/25 lg:border-none backdrop-blur-md lg:backdrop-blur-none">
          <div className="text-left md:text-right lg:text-right w-full lg:w-auto">
            <p className="font-display text-sm sm:text-base lg:text-lg font-medium text-[#00E676] tracking-wide mb-0.5">
              Aspiring Software &amp;
            </p>
            <div className="relative">
              <p className="font-display text-3xl sm:text-4xl xl:text-6xl font-extrabold uppercase tracking-tight bg-gradient-to-b from-[#00E676] via-[#00E676]/45 to-transparent bg-clip-text text-transparent select-none leading-none">
                DEVELOPER
              </p>
              <p className="font-display text-xl sm:text-2xl xl:text-3xl font-bold text-white uppercase tracking-wide -mt-1.5 sm:-mt-2.5">
                PROBLEM SOLVER
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#A7B8AE] mt-2">
              Web Applications &bull; AI &bull; Cybersecurity &bull; 3D Web
            </p>
          </div>

          <button
            type="button"
            onClick={triggerEnergySurge}
            aria-pressed={energySurge}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 lg:py-2.5 rounded-full text-xs sm:text-sm font-display font-bold uppercase tracking-wider border backdrop-blur-md transition-all cursor-pointer ${
              energySurge
                ? 'bg-[#00E676] text-[#050807] border-white shadow-[0_0_32px_#00E676] scale-[1.02]'
                : 'bg-[#0b1410]/90 text-[#00E676] border-[#00E676]/55 hover:border-[#00E676] hover:bg-[#00E676]/15 hover:text-white shadow-[0_0_16px_rgba(0,230,118,0.18)]'
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
        </div>
      </div>

      {/* Edge-Pinned Bottom Chrome: Social Stack (Bottom-Left) & RESUME Link (Bottom-Right) */}
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center sm:items-end justify-between gap-3 z-10 pt-5 sm:pt-6">
        {/* Social Icon Stack (Horizontal on Mobile/Tablet, Vertical on Desktop) */}
        <div className="flex lg:flex-col items-center gap-2.5 sm:gap-3.5 text-[#D5E2DC]">
          <a
            href="https://github.com/ethanarexilustre1019-ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub: ethanarexilustre1019-ui"
            className="p-2.5 sm:p-2 rounded-lg bg-[#0b1410]/85 border border-white/10 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn: ethan-arex-ilustre-6501ba2bb"
            className="p-2.5 sm:p-2 rounded-lg bg-[#0b1410]/85 border border-white/10 hover:border-[#72B8FF] hover:text-[#72B8FF] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${ownerProfile.email}`}
            aria-label="Email"
            title={`Email: ${ownerProfile.email}`}
            className="p-2.5 sm:p-2 rounded-lg bg-[#0b1410]/85 border border-white/10 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://mols-tyange-live.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live Web Project"
            title="Live Deployment: Mol's Tyangge"
            className="p-2.5 sm:p-2 rounded-lg bg-[#0b1410]/85 border border-white/10 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom-Right RESUME Action Link */}
        <a
          href={ownerProfile.resumePath}
          download="Ethan-Arex-Ilustre-Resume.pdf"
          className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#0b1410]/85 border border-[#00E676]/35 hover:border-[#00E676] text-xs font-display font-semibold tracking-[0.2em] text-[#D5E2DC] hover:text-[#00E676] uppercase transition-colors"
        >
          <span>RESUME</span>
          <FileText className="w-4 h-4 text-[#00E676]" />
        </a>
      </div>
    </section>
  );
};
