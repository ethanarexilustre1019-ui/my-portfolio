import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { skillCategories } from '../data/skills';
import { audioService } from '../services/audioService';
import { SpotlightCard } from '../components/ui/SpotlightCard';

export const Skills: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const visibleCategories =
    selectedCategoryId === 'all'
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === selectedCategoryId);

  return (
    <section
      id="skills"
      aria-label="Technical Skills Arsenal"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Split Blueprint Header */}
        <div
          data-gsap-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-8 border-b border-white/10"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-2">
              03 / MATERIALS &amp; STACK
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.94] text-[#F4F7F5]">
              TECHNICAL <span className="text-[#00E676]">ARSENAL</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
              Every language, framework, and database listed below is mapped to
              real software builds, deployed web applications, and hackathon
              deliverables.
            </p>
          </div>
        </div>

        {/* Crisp Monospace Filter Bar (Scrollable on Mobile, Wrapped on Tablet/Desktop) */}
        <div
          data-gsap-reveal
          className="flex sm:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-10 pb-2"
        >
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setSelectedCategoryId('all');
            }}
            className={`px-3.5 py-2 rounded-[3px] font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#00E676] text-[#050807] border-[#00E676] font-bold'
                : 'bg-[#0a100d] text-[#8FA198] border-white/12 hover:border-[#00E676]/50 hover:text-white'
            }`}
          >
            ALL {skillCategories.length}
          </button>

          {skillCategories.map((cat) => {
            const active = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  audioService.playClick();
                  setSelectedCategoryId(cat.id);
                }}
                className={`px-3.5 py-2 rounded-[3px] font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#00E676] text-[#050807] border-[#00E676] font-bold'
                    : 'bg-[#0a100d] text-[#8FA198] border-white/12 hover:border-[#00E676]/50 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Architectural Category Bands & Spotlight Cards */}
        <div className="space-y-10">
          {visibleCategories.map((category) => (
            <div key={category.id} data-gsap-reveal className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#00E676] tracking-[0.18em]">
                    {category.code}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                    {category.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#8FA198]">
                  {category.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.skills.map((skill, idx) => (
                  <SpotlightCard
                    key={skill.name}
                    onMouseEnter={() => audioService.playHover()}
                    className="p-5 sm:p-6 flex flex-col justify-between min-h-[155px]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <h4 className="font-heading text-xl font-black uppercase tracking-tight text-white">
                          {skill.name}
                        </h4>
                        <span className="font-mono text-[10px] text-[#8FA198] tracking-[0.16em]">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="text-sm text-[#C5D3CC] leading-relaxed mb-4">
                        {skill.context}
                      </p>
                    </div>

                    {skill.verifiedIn && (
                      <div className="pt-3 border-t border-white/10 flex items-center gap-2 font-mono text-[10px] tracking-[0.06em] text-[#00E676]">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{skill.verifiedIn}</span>
                      </div>
                    )}
                  </SpotlightCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
