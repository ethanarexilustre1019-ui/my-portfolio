import React, { useEffect } from 'react';
import {
  ExternalLink,
  Github,
  Layers,
  Award,
  AlertTriangle,
  Eye,
  ShieldAlert,
  Gamepad2,
  Network,
} from 'lucide-react';
import { featuredProjects } from '../data/projects';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { LunarGlobePreview } from '../components/projects/LunarGlobePreview';
import { audioService } from '../services/audioService';
import { ProjectItem } from '../types/portfolio';

export const Projects: React.FC = () => {
  const { setSelectedProject } = usePortfolio();

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

  return (
    <section
      id="projects"
      aria-label="Featured Projects Gallery"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-gsap-reveal className="mb-12">
          <p className="font-mono text-xs sm:text-sm font-semibold text-[#00E676] tracking-wider uppercase mb-2">
            04. FEATURED PROJECTS
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Featured <span className="text-[#00E676]">Projects &amp; Case Studies</span>
              </h2>
              <p className="text-base text-[#D5E2DC] mt-2 max-w-2xl leading-relaxed">
                Real applications built to solve concrete problems—spanning 3D lunar geospatial
                telemetry, AI-assisted phishing decision support, transparent community store
                bookkeeping, local automotive commerce, and award-winning regional game development.
              </p>
            </div>
          </div>
        </div>

        {/* Projects Stack */}
        <div className="space-y-10">
          {featuredProjects.map((project, index) => {
            const isCapstone = project.status === 'DEVELOPMENT IN PROGRESS';
            const isRegionalAward = project.isAwardWinner;

            return (
              <article
                key={project.id}
                data-gsap-reveal
                className={
                  isRegionalAward
                    ? 'hud-panel-blue p-6 sm:p-8 border-2 border-[#72B8FF]/55'
                    : 'hud-panel p-6 sm:p-8'
                }
              >
                {/* Top Status & Category Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#00E676]">
                      PROJECT 0{index + 1}
                    </span>
                    <span className="text-white/25">&bull;</span>
                    <span className="text-xs sm:text-sm font-medium text-[#72B8FF]">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isCapstone && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-display font-bold bg-amber-500/20 text-amber-300 border border-amber-400/50">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        DEVELOPMENT IN PROGRESS
                      </span>
                    )}
                    {isRegionalAward && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-md text-xs font-display font-bold bg-[#00E676] text-[#050807]">
                        <Award className="w-3.5 h-3.5" />
                        REGIONAL TOP 2 — NEGROS ISLAND REGION
                      </span>
                    )}
                    {!isCapstone && !isRegionalAward && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-display font-semibold bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/40">
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Two-Column Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Visual Preview Area (5 cols) */}
                  <div className="lg:col-span-5">
                    {project.has3DPreview ? (
                      <div className="rounded-xl overflow-hidden">
                        <LunarGlobePreview />
                      </div>
                    ) : project.screenshots.length > 0 ? (
                      <div
                        onClick={() => openCaseStudy(project)}
                        className="group relative rounded-xl bg-[#050807] border border-[#00E676]/30 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={project.screenshots[0].src}
                          alt={project.screenshots[0].alt}
                          className="w-full h-64 object-cover object-top group-hover:scale-103 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="p-3.5 bg-[#07110D]/95 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-[#D5E2DC] truncate">
                            {project.screenshots[0].caption}
                          </span>
                          <span className="text-xs font-semibold text-[#00E676] shrink-0 ml-2">
                            {project.screenshots.length} Screenshot(s)
                          </span>
                        </div>
                      </div>
                    ) : isCapstone ? (
                      <div
                        onClick={() => openCaseStudy(project)}
                        className="p-6 rounded-xl bg-[#050807] border border-amber-400/35 min-h-[260px] flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                          <span>BSIT Capstone Architecture</span>
                          <span>In Development</span>
                        </div>
                        <div className="my-4 space-y-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#101915] border border-white/10 text-sm">
                            <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-amber-300">
                                Multi-Modal Input Pipeline
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                Text, URL &amp; OCR Screenshot Extraction
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#101915] border border-[#00E676]/25 text-sm">
                            <Layers className="w-5 h-5 text-[#00E676] shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-[#00E676]">
                                Detection &amp; Explanation Layer
                              </p>
                              <p className="text-white text-xs sm:text-sm">
                                NLP Intent + Domain/Entity Mismatch Checks
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-amber-200/90">
                          Decision-Support Advisory System (Not an absolute guarantee of security)
                        </p>
                      </div>
                    ) : isRegionalAward ? (
                      <div
                        onClick={() => openCaseStudy(project)}
                        className="p-6 rounded-xl bg-gradient-to-br from-[#07110D] via-[#101915] to-[#0b1f2e] border border-[#72B8FF]/50 min-h-[260px] flex flex-col justify-between cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-[#72B8FF]">
                          <span>Regional Competition Award</span>
                          <span>Philippines</span>
                        </div>
                        <div className="my-auto py-4 text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#00E676]/15 border-2 border-[#00E676] flex items-center justify-center shadow-[0_0_25px_rgba(0,230,118,0.25)]">
                            <Gamepad2 className="w-8 h-8 text-[#00E676]" />
                          </div>
                          <p className="text-xs font-bold text-[#00E676] tracking-wider uppercase">
                            REGIONAL TOP 2 ACHIEVEMENT
                          </p>
                          <h4 className="font-display text-xl font-bold text-white mt-1">
                            Negros Island Region
                          </h4>
                          <p className="text-sm text-[#D5E2DC] mt-1">
                            Competitive Game Development Project
                          </p>
                        </div>
                        <div className="text-xs font-medium text-[#72B8FF] text-center border-t border-white/10 pt-2.5">
                          Click to view full project case study
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => openCaseStudy(project)}
                        className="p-6 rounded-xl bg-gradient-to-br from-[#07110D] via-[#101915] to-[#081b14] border border-[#00E676]/45 min-h-[260px] flex flex-col justify-between cursor-pointer hover:border-[#00E676] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-[#00E676]">
                          <span>Java Algorithmic Architecture</span>
                          <span>Graph &amp; PriorityQueue</span>
                        </div>
                        <div className="my-auto py-4 text-center">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#00E676]/15 border-2 border-[#00E676] flex items-center justify-center shadow-[0_0_25px_rgba(0,230,118,0.22)]">
                            <Network className="w-8 h-8 text-[#00E676]" />
                          </div>
                          <p className="text-xs font-bold text-[#00E676] tracking-wider uppercase">
                            DIJKSTRA&rsquo;S SHORTEST-PATH ENGINE
                          </p>
                          <h4 className="font-display text-xl font-bold text-white mt-1">
                            HashMap &bull; LinkedList &bull; PriorityQueue
                          </h4>
                          <p className="text-sm text-[#D5E2DC] mt-1">
                            Event Visualization, Scheduling &amp; Campus Routing
                          </p>
                        </div>
                        <div className="text-xs font-medium text-[#00E676] text-center border-t border-white/10 pt-2.5">
                          Click to view full algorithmic case study
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Case Study Details Area (7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                        {project.name}
                      </h3>
                      {project.statusNote && (
                        <p className="text-sm font-medium text-[#00E676] mt-1">
                          {project.statusNote}
                        </p>
                      )}
                    </div>

                    <p className="text-base text-[#D5E2DC] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Problem & Solution Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[#050807]/80 border border-white/10">
                        <p className="text-xs font-bold text-[#72B8FF] uppercase tracking-wider mb-1.5">
                          Problem Statement
                        </p>
                        <p className="text-sm text-[#D5E2DC] leading-relaxed">
                          {project.problemStatement}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#050807]/80 border border-[#00E676]/25">
                        <p className="text-xs font-bold text-[#00E676] uppercase tracking-wider mb-1.5">
                          Proposed Solution
                        </p>
                        <p className="text-sm text-[#D5E2DC] leading-relaxed">
                          {project.proposedSolution}
                        </p>
                      </div>
                    </div>

                    {/* Capstone Disclaimer Box */}
                    {project.disclaimer && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/40 text-xs sm:text-sm text-amber-100 leading-relaxed">
                        {project.disclaimer}
                      </div>
                    )}

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-[#050807] border border-[#00E676]/30 text-[#00E676]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => openCaseStudy(project)}
                        className="hud-button-primary px-5 py-2.5 text-sm cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Case Study</span>
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hud-button-secondary px-5 py-2.5 text-sm"
                        >
                          <span>
                            {project.id === 'south-bacolod-auto-trading'
                              ? 'VISIT LIVE WEBSITE'
                              : 'VISIT LIVE PROJECT'}
                          </span>
                          <ExternalLink className="w-4 h-4 text-[#00E676]" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hud-button-secondary px-4 py-2.5 text-sm"
                        >
                          <Github className="w-4 h-4 text-[#72B8FF]" />
                          <span>GitHub Repository</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
