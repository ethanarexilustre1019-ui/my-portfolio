import React, { useState } from 'react';
import { CheckCircle, Layers } from 'lucide-react';
import { skillCategories } from '../data/skills';
import { audioService } from '../services/audioService';

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
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-gsap-reveal className="mb-10">
          <p className="font-mono text-xs sm:text-sm font-semibold text-[#00E676] tracking-wider uppercase mb-2">
            03. TECHNICAL ARSENAL
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Technical <span className="text-[#00E676]">Skills &amp; Stack</span>
          </h2>
          <p className="text-base text-[#D5E2DC] mt-2 max-w-2xl leading-relaxed">
            Technologies and tools applied across my web applications, 3D geospatial dashboards,
            hackathon builds, and BSIT academic projects.
          </p>
        </div>

        {/* Readable Category Filter Tabs */}
        <div
          data-gsap-reveal
          className="flex flex-wrap items-center gap-2.5 mb-10 pb-5 border-b border-white/10"
        >
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setSelectedCategoryId('all');
            }}
            className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#00E676] text-[#050807] font-bold shadow-[0_0_16px_rgba(0,230,118,0.3)]'
                : 'bg-[#101915] text-[#D5E2DC] border border-white/15 hover:border-[#00E676] hover:text-white'
            }`}
          >
            All Categories (7)
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
                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#00E676] text-[#050807] font-bold shadow-[0_0_16px_rgba(0,230,118,0.3)]'
                    : 'bg-[#101915] text-[#D5E2DC] border border-white/15 hover:border-[#00E676]/60 hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Categories & Cards Grid */}
        <div className="space-y-10">
          {visibleCategories.map((category) => {
            const isBlue = category.accentColor === 'blue';
            return (
              <div
                key={category.id}
                data-gsap-reveal
                className={isBlue ? 'hud-panel-blue p-6 sm:p-8' : 'hud-panel p-6 sm:p-8'}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4 mb-6">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                    {category.title}
                  </h3>
                  <p className="text-sm text-[#D5E2DC] max-w-md">{category.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      onMouseEnter={() => audioService.playHover()}
                      className="p-5 rounded-xl bg-[#050807]/85 border border-white/10 hover:border-[#00E676]/60 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-[#00E676] transition-colors">
                            {skill.name}
                          </h4>
                          <Layers
                            className={`w-4 h-4 shrink-0 ${
                              isBlue ? 'text-[#72B8FF]' : 'text-[#00E676]'
                            }`}
                          />
                        </div>
                        <p className="text-sm text-[#D5E2DC] leading-relaxed mb-4">
                          {skill.context}
                        </p>
                      </div>

                      {skill.verifiedIn && (
                        <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs font-medium text-[#00E676]">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Used in: {skill.verifiedIn}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
