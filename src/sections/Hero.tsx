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
      className="relative min-h-screen pt-24 pb-12 px-4 sm:px-8 lg:px-12 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Spacer for Fixed Navbar */}
      <div className="h-4" />

      {/* Center Symmetrical Showcase Layout Flanking the 3D Midoriya Bust */}
      <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-10">
        {/* LEFT BLOCK (4 cols): "Hello! I'm" + Stacked Bold Name + Tagline & Action Buttons */}
        <div className="lg:col-span-4 space-y-4 text-left">
          <div>
            <p className="font-display text-base sm:text-lg font-medium text-[#00E676] tracking-wide mb-1">
              Hello! I&rsquo;m
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-[1.04]">
              ETHAN AREX
              <span className="block text-[#00E676] text-glow-emerald">V. ILUSTRE</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm font-medium text-[#D5E2DC]">
            Third-Year BSIT Student &bull; {ownerProfile.university}
          </p>

          {/* Main Tagline Pill */}
          <div className="p-3.5 rounded-xl bg-[#0b1410]/85 border-l-4 border-[#00E676] border border-white/10 max-w-sm backdrop-blur-md">
            <p className="font-display text-base sm:text-lg font-bold text-white">
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
              className="hud-button-primary px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>EXPLORE MY PROJECTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('about')}
              onMouseEnter={() => audioService.playHover()}
              className="hud-button-secondary px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
            >
              <User className="w-4 h-4 text-[#00E676]" />
              <span>ABOUT ME</span>
            </button>
          </div>
        </div>

        {/* CENTER BLOCK (4 cols): Open 3D Stage for the Sculpted Midoriya Character Bust */}
        <div className="lg:col-span-4 min-h-[320px] lg:min-h-[480px] pointer-events-none" />

        {/* RIGHT BLOCK (4 cols): Symmetrical Role Title + Interactive RAGE MODE Button */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end lg:text-right space-y-4">
          <div className="text-left">
            <p className="font-display text-base sm:text-lg font-medium text-[#00E676] tracking-wide mb-0.5">
              Aspiring Software &amp;
            </p>
            <div className="relative">
              <p className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold uppercase tracking-tight bg-gradient-to-b from-[#00E676] via-[#00E676]/45 to-transparent bg-clip-text text-transparent select-none leading-none">
                DEVELOPER
              </p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide -mt-2 sm:-mt-3">
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
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-display font-bold uppercase tracking-wider border backdrop-blur-md transition-all cursor-pointer ${
              energySurge
                ? 'bg-[#00E676] text-[#050807] border-white shadow-[0_0_32px_#00E676] scale-105'
                : 'bg-[#0b1410]/90 text-[#00E676] border-[#00E676]/55 hover:border-[#00E676] hover:bg-[#00E676]/15 hover:text-white shadow-[0_0_16px_rgba(0,230,118,0.18)]'
            }`}
          >
            <Flame className={`w-4 h-4 ${energySurge ? 'text-[#050807] animate-bounce' : 'text-[#00E676]'}`} />
            <span>
              {energySurge ? '100% RAGE MODE: ACTIVE' : 'ACTIVATE 100% RAGE MODE'}
            </span>
          </button>
        </div>
      </div>

      {/* Edge-Pinned Bottom Chrome: Vertical Social Stack (Bottom-Left) & RESUME Link (Bottom-Right) */}
      <div className="max-w-7xl mx-auto w-full flex items-end justify-between z-10 pt-6">
        {/* Bottom-Left Vertical Social Icon Stack */}
        <div className="flex sm:flex-col items-center gap-3.5 text-[#D5E2DC]">
          <a
            href="https://github.com/ethanarexilustre1019-ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub: ethanarexilustre1019-ui"
            className="p-2 rounded-lg bg-[#0b1410]/80 border border-white/10 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn: ethan-arex-ilustre-6501ba2bb"
            className="p-2 rounded-lg bg-[#0b1410]/80 border border-white/10 hover:border-[#72B8FF] hover:text-[#72B8FF] transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${ownerProfile.email}`}
            aria-label="Email"
            title={`Email: ${ownerProfile.email}`}
            className="p-2 rounded-lg bg-[#0b1410]/80 border border-white/10 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://mols-tyange-live.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live Web Project"
            title="Live Deployment: Mol's Tyangge"
            className="p-2 rounded-lg bg-[#0b1410]/80 border border-white/10 hover:border-[#00E676] hover:text-[#00E676] transition-colors"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom-Right RESUME Action Link */}
        <a
          href={ownerProfile.resumePath}
          download="Ethan-Arex-Ilustre-Resume.pdf"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0b1410]/80 border border-white/10 hover:border-[#00E676] text-xs font-display font-semibold tracking-[0.2em] text-[#D5E2DC] hover:text-[#00E676] uppercase transition-colors"
        >
          <span>RESUME</span>
          <FileText className="w-4 h-4 text-[#00E676]" />
        </a>
      </div>
    </section>
  );
};
