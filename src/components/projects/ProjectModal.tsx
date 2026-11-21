import React, { useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Award,
  Layers,
} from 'lucide-react';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { animateModalOpen } from '../../animations/transitions';
import { LunarGlobePreview } from './LunarGlobePreview';

export const ProjectModal: React.FC = () => {
  const { selectedProject, setSelectedProject, reducedMotion } = usePortfolio();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedProject && modalRef.current) {
      animateModalOpen(modalRef.current, reducedMotion);
    }
  }, [selectedProject, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, setSelectedProject]);

  if (!selectedProject) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050807]/90 backdrop-blur-lg overflow-y-auto"
      onClick={() => setSelectedProject(null)}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto hud-panel border-[#00E676]/50 p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(0,230,118,0.18)]"
      >
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#00E676]/25 pb-5 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-hud text-xs text-[#00E676] tracking-wider">
                {selectedProject.indexCode}
              </span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-hud font-bold uppercase ${
                  selectedProject.status === 'DEVELOPMENT IN PROGRESS'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    : selectedProject.isAwardWinner
                    ? 'bg-[#72B8FF]/20 text-[#72B8FF] border border-[#72B8FF]/50'
                    : 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/50'
                }`}
              >
                {selectedProject.status}
              </span>
            </div>
            <h2
              id="project-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold text-white"
            >
              {selectedProject.name}
            </h2>
            <p className="text-xs font-hud text-[#72B8FF] mt-1">{selectedProject.category}</p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            aria-label="Close project case study"
            className="p-2 border border-[#00E676]/40 bg-[#101915] text-[#A7B8AE] hover:text-white hover:border-[#00E676] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Special Award Banner if applicable */}
        {selectedProject.isAwardWinner && selectedProject.awardTitle && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#72B8FF]/15 via-[#00E676]/15 to-transparent border border-[#72B8FF]/50 flex items-center gap-3">
            <Award className="w-6 h-6 text-[#00E676] shrink-0" />
            <div>
              <p className="font-hud text-xs text-[#00E676] font-bold tracking-wider">
                COMPETITIVE REGIONAL ACHIEVEMENT
              </p>
              <p className="font-display text-sm sm:text-base font-bold text-white">
                {selectedProject.awardTitle}
              </p>
            </div>
          </div>
        )}

        {/* Capstone Development Disclaimer if applicable */}
        {selectedProject.disclaimer && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-400/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              {selectedProject.disclaimer}
            </p>
          </div>
        )}

        {/* Interactive 3D Lunar Preview for NASA Challenge */}
        {selectedProject.has3DPreview && (
          <div className="mb-6">
            <LunarGlobePreview />
          </div>
        )}

        {/* Overview Description */}
        <p className="text-sm sm:text-base text-[#A7B8AE] leading-relaxed mb-6">
          {selectedProject.description}
        </p>

        {/* Problem Statement & Proposed Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#07110D]/90 border border-white/10">
            <h3 className="font-hud text-xs text-[#72B8FF] uppercase tracking-wider mb-2">
              01 // Problem Statement
            </h3>
            <p className="text-xs sm:text-sm text-[#A7B8AE] leading-relaxed">
              {selectedProject.problemStatement}
            </p>
          </div>
          <div className="p-4 bg-[#07110D]/90 border border-[#00E676]/25">
            <h3 className="font-hud text-xs text-[#00E676] uppercase tracking-wider mb-2">
              02 // Engineered Solution
            </h3>
            <p className="text-xs sm:text-sm text-[#A7B8AE] leading-relaxed">
              {selectedProject.proposedSolution}
            </p>
          </div>
        </div>

        {/* Verified Key Features */}
        <div className="mb-6">
          <h3 className="font-hud text-xs text-[#00E676] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>03 // Key Features &amp; Functional Scope</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedProject.keyFeatures.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 bg-[#101915]/75 border border-white/10 text-xs sm:text-sm text-white/90"
              >
                <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture Notes */}
        {selectedProject.architectureHighlights.length > 0 && (
          <div className="mb-6 p-4 bg-[#101915]/60 border border-[#72B8FF]/25">
            <h3 className="font-hud text-xs text-[#72B8FF] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>04 // System Architecture Notes</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#A7B8AE]">
              {selectedProject.architectureHighlights.map((note, idx) => (
                <li key={idx}>&bull; {note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies Used */}
        <div className="mb-6">
          <h3 className="font-hud text-xs text-[#00E676] uppercase tracking-wider mb-3">
            05 // Technologies Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedProject.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-hud bg-[#07110D] border border-[#00E676]/35 text-[#00E676]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Screenshots Gallery */}
        {selectedProject.screenshots.length > 0 && (
          <div className="mb-6">
            <h3 className="font-hud text-xs text-[#00E676] uppercase tracking-wider mb-3">
              06 // Verified Screenshots &amp; Evidence
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProject.screenshots.map((shot, idx) => (
                <figure
                  key={idx}
                  className="bg-[#07110D] border border-[#00E676]/25 overflow-hidden"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="w-full h-48 object-cover object-top"
                    loading="lazy"
                  />
                  <figcaption className="p-2.5 text-[11px] text-[#A7B8AE] border-t border-white/10">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Action Links Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#00E676]/25 pt-5">
          <div className="flex flex-wrap items-center gap-3">
            {selectedProject.liveUrl && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-button-primary px-5 py-2.5 text-xs font-hud uppercase"
              >
                <span>VISIT LIVE PROJECT</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {selectedProject.githubUrl && (
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hud-button-secondary px-5 py-2.5 text-xs font-hud uppercase"
              >
                <Github className="w-4 h-4 text-[#00E676]" />
                <span>GITHUB REPOSITORY</span>
              </a>
            )}
          </div>

          {selectedProject.githubNote && (
            <span className="text-[11px] font-hud text-[#A7B8AE]">
              * {selectedProject.githubNote}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
