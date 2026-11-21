import React, { useState } from 'react';
import {
  ArrowRight,
  FileText,
  Github,
  Linkedin,
  RefreshCw,
} from 'lucide-react';
import { ownerProfile } from '../data/profile';
import { SpotlightCard } from '../components/ui/SpotlightCard';
import { audioService } from '../services/audioService';

const VERIFIED_FACTS = [
  { value: '06', label: 'FEATURED SOFTWARE BUILDS' },
  { value: '02', label: 'LIVE PRODUCTION DEPLOYMENTS' },
  { value: 'TOP 2', label: 'REGIONAL LEVEL — NEGROS ISLAND' },
  { value: 'NASA', label: '2026 GALACTIC PROBLEM SOLVER' },
];

const CORE_CAPABILITIES = [
  {
    index: '01',
    title: 'FULL-STACK WEB APPLICATIONS',
    description:
      'End-to-end web systems with React, TypeScript, Python FastAPI, PHP, and PostgreSQL — built from real community and business workflows straight to live cloud deployment.',
  },
  {
    index: '02',
    title: '3D WEB & INTERACTIVE INTERFACES',
    description:
      'Real-time Three.js and WebGL scenes, geospatial globes, custom shaders, and responsive interfaces engineered for smooth desktop, tablet, and mobile performance.',
  },
  {
    index: '03',
    title: 'AI & CYBERSECURITY DECISION SUPPORT',
    description:
      'Applied NLP, OCR text extraction, and domain-verification pipelines — focused on helping everyday users make safer, clearer decisions online.',
  },
];

export const About: React.FC = () => {
  const [showAnimeAvatar, setShowAnimeAvatar] = useState<boolean>(false);

  const scrollToContact = () => {
    audioService.playClick();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="about"
      aria-label="About Ethan Arex V. Ilustre"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* 4-Column Architectural Hairline Fact Strip (Inspired by ralfmangubos.com) */}
        <div
          data-gsap-reveal
          className="grid grid-cols-2 lg:grid-cols-4 border-y border-white/12 bg-[#070c0a]/80 backdrop-blur-md mb-20"
        >
          {VERIFIED_FACTS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`p-6 sm:p-8 ${
                idx % 2 === 1 ? 'border-l border-white/12' : ''
              } ${idx >= 2 ? 'border-t lg:border-t-0 lg:border-l border-white/12' : ''}`}
            >
              <p className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-[#F4F7F5] leading-none">
                {stat.value}
              </p>
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[#8FA198] mt-2.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Asymmetrical Split Blueprint Section Header */}
        <div
          data-gsap-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-10 mb-12 border-b border-white/10"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-2">
              02 / ABOUT
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.94] text-[#F4F7F5]">
              MEET <span className="text-[#00E676]">ETHAN</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
              Third-year BSIT software &amp; web application developer at the{' '}
              <span className="text-white font-medium">{ownerProfile.university}</span>{' '}
              — turning practical problems into live, working software.
            </p>
          </div>
        </div>

        {/* 2-Column Editorial Story (Left) + Architectural Profile Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20">
          {/* Left: MY STORY */}
          <div data-gsap-reveal className="lg:col-span-7 space-y-5">
            <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              MY STORY
            </h3>

            <div className="space-y-4 text-[15px] sm:text-base text-[#C5D3CC] leading-[1.78]">
              <p className="text-[#F4F7F5] font-medium">
                {ownerProfile.expandedAbout[0]}
              </p>
              <p>{ownerProfile.expandedAbout[1]}</p>
              <p>{ownerProfile.expandedAbout[2]}</p>
              <p>{ownerProfile.expandedAbout[5]}</p>
            </div>

            {/* Philosophy Callout Bar */}
            <div className="p-4 bg-[#080e0c]/90 border-l-2 border-[#00E676] border border-white/10 rounded-[3px]">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#00E676] mb-1">
                ENGINEERING PRINCIPLE
              </p>
              <p className="text-sm sm:text-base font-medium text-white">
                &ldquo;{ownerProfile.coreMessage}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToContact}
                className="hud-button-primary px-6 py-3 text-sm cursor-pointer"
              >
                <span>Work with me</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={ownerProfile.resumePath}
                download="Ethan-Arex-Ilustre-Resume.pdf"
                className="hud-button-secondary px-5 py-3 text-xs uppercase"
              >
                <FileText className="w-4 h-4 text-[#00E676]" />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </div>

          {/* Right: Sleek Dark Hairline Profile Card (Mirroring ralfmangubos.com /about) */}
          <div data-gsap-reveal className="lg:col-span-5">
            <div className="hud-panel p-6 sm:p-7 space-y-6">
              {/* Top Row: Circular Studio Portrait + Swap Avatar Button */}
              <div className="flex items-start justify-between gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#00E676]/55 bg-[#050807] shrink-0">
                  <img
                    src={
                      showAnimeAvatar
                        ? '/images/profile/midoriya-portrait.png'
                        : ownerProfile.profileImagePath
                    }
                    alt={`${ownerProfile.fullName} - Studio Portrait`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setShowAnimeAvatar((prev) => !prev);
                  }}
                  title="Switch between Studio Portrait and Hero Avatar"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-[#050807] border border-white/15 hover:border-[#00E676] font-mono text-[10px] tracking-[0.14em] uppercase text-[#C5D3CC] hover:text-[#00E676] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{showAnimeAvatar ? 'Studio Photo' : 'Hero Avatar'}</span>
                </button>
              </div>

              {/* Identity Readout */}
              <div>
                <p className="font-mono text-[11px] font-semibold tracking-[0.2em] uppercase text-[#00E676] mb-1">
                  SOFTWARE &amp; WEB DEVELOPER
                </p>
                <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white">
                  {ownerProfile.fullName}
                </h3>
                <p className="text-xs sm:text-sm text-[#8FA198] mt-2">
                  {ownerProfile.academicLevel} &bull; {ownerProfile.university}
                </p>
              </div>

              {/* 3-Column Mini Verified Fact Row */}
              <div className="grid grid-cols-3 border-y border-white/10 py-4 text-center">
                <div>
                  <p className="font-heading text-2xl font-black text-white leading-none">
                    06
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#8FA198] mt-1">
                    PROJECTS
                  </p>
                </div>
                <div className="border-x border-white/10">
                  <p className="font-heading text-2xl font-black text-white leading-none">
                    BSIT-3
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#8FA198] mt-1">
                    UNO-R
                  </p>
                </div>
                <div>
                  <p className="font-heading text-2xl font-black text-[#00E676] leading-none">
                    TOP 2
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#8FA198] mt-1">
                    REGIONAL
                  </p>
                </div>
              </div>

              {/* Card Bottom CTA Bar */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={scrollToContact}
                  className="hud-button-primary flex-1 py-3 text-sm cursor-pointer"
                >
                  <span>Get in touch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://github.com/ethanarexilustre1019-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="p-3 rounded-[3px] bg-[#050807] border border-white/15 hover:border-[#00E676] text-[#C5D3CC] hover:text-[#00E676] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="p-3 rounded-[3px] bg-[#050807] border border-white/15 hover:border-[#00E676] text-[#C5D3CC] hover:text-[#00E676] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 02.B // WHAT I DO — 3 Numbered Spotlight Cards (Inspired by ralfmangubos.com) */}
        <div data-gsap-reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-1.5">
                CAPABILITIES
              </p>
              <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                WHAT I BUILD
              </h3>
            </div>
            <p className="text-sm text-[#8FA198] max-w-md">
              Design, code, and deployment in one place — built around real user problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CORE_CAPABILITIES.map((cap) => (
              <SpotlightCard
                key={cap.index}
                onMouseEnter={() => audioService.playHover()}
                className="p-6 sm:p-7 flex flex-col justify-between min-h-[210px]"
              >
                <span className="font-mono text-xs text-[#00E676] tracking-[0.2em]">
                  {cap.index}
                </span>
                <div className="mt-6">
                  <h4 className="font-heading text-2xl font-black uppercase tracking-tight text-white mb-2.5">
                    {cap.title}
                  </h4>
                  <p className="text-sm text-[#C5D3CC] leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
