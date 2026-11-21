import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  AlertTriangle,
  Gamepad2,
  Network,
  ShieldAlert,
} from 'lucide-react';
import { featuredProjects } from '../data/projects';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { LunarGlobePreview } from '../components/projects/LunarGlobePreview';
import { audioService } from '../services/audioService';
import { ProjectItem } from '../types/portfolio';
import { TiltedFrame } from '../components/ui/TiltedFrame';

type FilterType = 'ALL' | 'LIVE' | 'VERIFIED' | 'CAPSTONE' | 'AWARD';

export const Projects: React.FC = () => {
  const { setSelectedProject } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // Proactively warm up Render free-tier live deployments in the background
  useEffect(() => {
    featuredProjects.forEach((project) => {
      if (project.liveUrl) {
        fetch(project.liveUrl, { mode: 'no-cors' }).catch(() => {});
      }
    });
  }, []);

  const openCaseStudy = (project: ProjectItem) => {
    audioService.playClick();
    setSelectedProject(project);
  };

  const filteredProjects = featuredProjects.filter((project) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'LIVE') return project.status === 'LIVE DEPLOYMENT';
    if (activeFilter === 'VERIFIED') return project.status === 'VERIFIED REPOSITORY';
    if (activeFilter === 'CAPSTONE') return project.status === 'DEVELOPMENT IN PROGRESS';
    if (activeFilter === 'AWARD') return Boolean(project.isAwardWinner);
    return true;
  });

  const filters: Array<{ id: FilterType; label: string; count: number }> = [
    { id: 'ALL', label: 'ALL', count: featuredProjects.length },
    {
      id: 'LIVE',
      label: 'LIVE',
      count: featuredProjects.filter((p) => p.status === 'LIVE DEPLOYMENT').length,
    },
    {
      id: 'VERIFIED',
      label: 'VERIFIED',
      count: featuredProjects.filter((p) => p.status === 'VERIFIED REPOSITORY').length,
    },
    {
      id: 'CAPSTONE',
      label: 'IN DEVELOPMENT',
      count: featuredProjects.filter((p) => p.status === 'DEVELOPMENT IN PROGRESS').length,
    },
    {
      id: 'AWARD',
      label: 'AWARD',
      count: featuredProjects.filter((p) => p.isAwardWinner).length,
    },
  ];

  return (
    <section
      id="projects"
      aria-label="Featured Projects Gallery"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Split Blueprint Header (Inspired by ralfmangubos.com /work) */}
        <div
          data-gsap-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-8 border-b border-white/10"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-2">
              04 / SELECTED WORK
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.94] text-[#F4F7F5]">
              RECENT <span className="text-[#00E676]">BUILDS</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
              Live production web apps, a 3D NASA lunar mission browser, AI
              cybersecurity capstone research, and a Regional Top 2 game build.
            </p>
          </div>
        </div>

        {/* Monospace Status Filter Bar */}
        <div
          data-gsap-reveal
          className="flex flex-wrap items-center gap-2 mb-10"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8FA198] mr-2">
            STATUS:
          </span>
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  audioService.playClick();
                  setActiveFilter(f.id);
                }}
                className={`px-3 py-1.5 rounded-[3px] font-mono text-[11px] tracking-[0.14em] uppercase border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00E676] text-[#050807] border-[#00E676] font-bold'
                    : 'bg-[#0a100d] text-[#8FA198] border-white/12 hover:border-[#00E676]/50 hover:text-white'
                }`}
              >
                {f.label}{' '}
                <span className={isActive ? 'opacity-80' : 'text-[#00E676]'}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editorial 2-Column Project Archive Grid with 3D Pointer-Tilt Covers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => {
            const isCapstone = project.status === 'DEVELOPMENT IN PROGRESS';
            const isRegionalAward = Boolean(project.isAwardWinner);
            const isLive = project.status === 'LIVE DEPLOYMENT';

            return (
              <article
                key={project.id}
                data-gsap-reveal
                className="group flex flex-col justify-between bg-[#070c0a]/84 border border-white/10 hover:border-[#00E676]/45 rounded-[4px] p-5 sm:p-6 backdrop-blur-md transition-all"
              >
                <div>
                  {/* 16:10 Showcase Frame with 3D Pointer-Tilt & Glare */}
                  {project.has3DPreview ? (
                    <div className="mb-5 rounded-[4px] overflow-hidden border border-white/12">
                      <LunarGlobePreview />
                    </div>
                  ) : project.screenshots.length > 0 ? (
                    <TiltedFrame
                      onClick={() => openCaseStudy(project)}
                      className="mb-5 aspect-[16/10] cursor-pointer"
                    >
                      <img
                        src={project.screenshots[0].src}
                        alt={project.screenshots[0].alt}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </TiltedFrame>
                  ) : isCapstone ? (
                    <TiltedFrame
                      onClick={() => openCaseStudy(project)}
                      className="mb-5 aspect-[16/10] cursor-pointer p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-[#080f0c] via-[#0c1411] to-[#171209]"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-amber-300">
                        <span>BSIT CAPSTONE ARCHITECTURE</span>
                        <span>MULTI-MODAL AI</span>
                      </div>
                      <div className="my-auto py-3 space-y-2.5">
                        <div className="flex items-center gap-3 p-3 bg-[#050807]/85 border border-amber-400/30 rounded-[3px]">
                          <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300">
                              INPUT PIPELINE
                            </p>
                            <p className="text-xs sm:text-sm text-white font-medium">
                              Text, URLs &amp; OCR Screenshot Extraction
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[#050807]/85 border border-[#00E676]/30 rounded-[3px]">
                          <AlertTriangle className="w-5 h-5 text-[#00E676] shrink-0" />
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#00E676]">
                              DECISION SUPPORT ENGINE
                            </p>
                            <p className="text-xs sm:text-sm text-white font-medium">
                              NLP Intent Analysis + Domain Mismatch Verification
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="font-mono text-[10px] text-amber-200/80 uppercase tracking-[0.12em]">
                        Advisory decision support — active development
                      </p>
                    </TiltedFrame>
                  ) : isRegionalAward ? (
                    <TiltedFrame
                      onClick={() => openCaseStudy(project)}
                      className="mb-5 aspect-[16/10] cursor-pointer p-6 flex flex-col justify-between bg-gradient-to-br from-[#07110D] via-[#0b1518] to-[#0a1d2a]"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#72B8FF]">
                        <span>REGIONAL COMPETITION BUILD</span>
                        <span>PHILIPPINES</span>
                      </div>
                      <div className="my-auto text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-[3px] bg-[#00E676]/12 border border-[#00E676] flex items-center justify-center">
                          <Gamepad2 className="w-7 h-7 text-[#00E676]" />
                        </div>
                        <p className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#00E676]">
                          TOP 2 — REGIONAL LEVEL
                        </p>
                        <p className="font-heading text-2xl font-black uppercase text-white mt-1">
                          NEGROS ISLAND REGION
                        </p>
                      </div>
                      <p className="font-mono text-[10px] text-center text-[#8FA198] uppercase tracking-[0.16em]">
                        Filipino Patintero Competitive Game Mechanics
                      </p>
                    </TiltedFrame>
                  ) : (
                    <TiltedFrame
                      onClick={() => openCaseStudy(project)}
                      className="mb-5 aspect-[16/10] cursor-pointer p-6 flex flex-col justify-between bg-gradient-to-br from-[#07110D] via-[#0b1511] to-[#071913]"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#00E676]">
                        <span>JAVA ALGORITHMIC SYSTEM</span>
                        <span>DSA &amp; GRAPHS</span>
                      </div>
                      <div className="my-auto text-center">
                        <div className="w-14 h-14 mx-auto mb-3 rounded-[3px] bg-[#00E676]/12 border border-[#00E676] flex items-center justify-center">
                          <Network className="w-7 h-7 text-[#00E676]" />
                        </div>
                        <p className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-[#00E676]">
                          DIJKSTRA&rsquo;S SHORTEST-PATH ENGINE
                        </p>
                        <p className="font-heading text-2xl font-black uppercase text-white mt-1">
                          HASHMAP &bull; LINKEDLIST &bull; PRIORITYQUEUE
                        </p>
                      </div>
                      <p className="font-mono text-[10px] text-center text-[#8FA198] uppercase tracking-[0.16em]">
                        Campus Event Scheduling &amp; Shortest-Path Routing
                      </p>
                    </TiltedFrame>
                  )}

                  {/* Monospace Category + Outlined Status Badges (Mirroring ralfmangubos.com) */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-[2px] border border-white/15 bg-[#050807] font-mono text-[10px] tracking-[0.14em] uppercase text-[#8FA198]">
                      {project.category}
                    </span>

                    {isCapstone ? (
                      <span className="px-2.5 py-1 rounded-[2px] border border-amber-400/60 bg-amber-500/12 font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-amber-300">
                        DEVELOPMENT IN PROGRESS
                      </span>
                    ) : isRegionalAward ? (
                      <span className="px-2.5 py-1 rounded-[2px] border border-[#00E676] bg-[#00E676]/15 font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#00E676]">
                        TOP 2 REGIONAL
                      </span>
                    ) : isLive ? (
                      <span className="px-2.5 py-1 rounded-[2px] border border-[#00E676]/70 bg-[#00E676]/10 font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#00E676]">
                        LIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-[2px] border border-[#72B8FF]/55 bg-[#72B8FF]/10 font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[#72B8FF]">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Condensed Uppercase Project Title */}
                  <h3
                    onClick={() => openCaseStudy(project)}
                    className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight leading-[1.02] text-[#F4F7F5] group-hover:text-[#00E676] transition-colors cursor-pointer mb-2.5"
                  >
                    {project.shortName}
                  </h3>

                  {/* Concise Problem/Value Summary */}
                  <p className="text-sm text-[#C5D3CC] leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Explicit Capstone Decision-Support Notice for PhishNot */}
                  {project.disclaimer && (
                    <p className="text-xs text-amber-200/90 bg-amber-500/10 border border-amber-400/35 rounded-[3px] p-3 mb-4 leading-relaxed">
                      Active BSIT Capstone Project &mdash; provides AI-assisted
                      decision support rather than an absolute guarantee of
                      security.
                    </p>
                  )}

                  {/* Compact Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-[2px] bg-[#050807] border border-white/10 font-mono text-[10px] text-[#8FA198]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Clean Editorial Inline Action Links (Matching ralfmangubos.com: "Read case study ->  Live site ↗") */}
                <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-white/10 text-sm">
                  <button
                    type="button"
                    onClick={() => openCaseStudy(project)}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#F4F7F5] hover:text-[#00E676] transition-colors cursor-pointer"
                  >
                    <span>Read case study</span>
                    <ArrowRight className="w-4 h-4 text-[#00E676]" />
                  </button>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#8FA198] hover:text-white transition-colors"
                    >
                      <span>Live site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#8FA198] hover:text-white transition-colors"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
