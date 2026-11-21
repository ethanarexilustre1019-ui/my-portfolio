import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { educationTimeline } from '../data/education';
import { SpotlightCard } from '../components/ui/SpotlightCard';

export const Education: React.FC = () => {
  const totalSteps = String(educationTimeline.length).padStart(2, '0');

  return (
    <section
      id="education"
      aria-label="Education and Development Journey"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Split Blueprint Header */}
        <div
          data-gsap-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-12 border-b border-white/10"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-2">
              06 / ENGINEERING JOURNEY
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.94] text-[#F4F7F5]">
              EDUCATION &amp; <span className="text-[#00E676]">MILESTONES</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
              Academic foundations as a third-year BSIT student at UNO-R paired
              with live web deployments, regional awards, and global hackathons.
            </p>
          </div>
        </div>

        {/* Stacked Architectural Step Cards with Giant Emerald Numbers (Inspired by ralfmangubos.com /process) */}
        <div className="space-y-5">
          {educationTimeline.map((item, idx) => {
            const stepNum = String(idx + 1).padStart(2, '0');
            return (
              <div key={item.id} data-gsap-reveal>
                <SpotlightCard className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Giant Architectural Step Number Column */}
                    <div className="lg:col-span-2 flex lg:flex-col items-baseline lg:items-start justify-between gap-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-3 lg:pb-0 lg:pr-6">
                      <span className="font-heading text-5xl sm:text-6xl font-black text-[#00E676] leading-none tracking-tight">
                        {stepNum}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#8FA198]">
                        STAGE {stepNum} OF {totalSteps}
                      </span>
                    </div>

                    {/* Milestone Content Column */}
                    <div className="lg:col-span-10 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#00E676]">
                          {item.organization}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.isCurrent && (
                            <span className="px-2 py-0.5 rounded-[2px] bg-[#00E676] text-[#050807] font-mono text-[10px] font-bold tracking-[0.14em] uppercase">
                              ACTIVE
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-[#8FA198]">
                            {item.period}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                          {item.title}
                        </h3>
                        <p className="font-mono text-[11px] text-[#8FA198] mt-1">
                          {item.location}
                        </p>
                      </div>

                      <p className="text-sm sm:text-[15px] text-[#C5D3CC] leading-relaxed">
                        {item.description}
                      </p>

                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                        {item.highlights.map((hl, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F4F7F5]/90"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
