import React from 'react';
import { GraduationCap, Award, Code, Shield, CheckCircle2 } from 'lucide-react';
import { educationTimeline } from '../data/education';
import { JourneyMilestone } from '../types/portfolio';

function getMilestoneIcon(type: JourneyMilestone['type']) {
  switch (type) {
    case 'academic':
      return <GraduationCap className="w-5 h-5 text-[#00E676]" />;
    case 'competition':
      return <Award className="w-5 h-5 text-[#72B8FF]" />;
    case 'capstone':
      return <Shield className="w-5 h-5 text-[#00E676]" />;
    default:
      return <Code className="w-5 h-5 text-[#00E676]" />;
  }
}

export const Education: React.FC = () => {
  return (
    <section
      id="education"
      aria-label="Education and Development Journey"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-gsap-reveal className="mb-14">
          <p className="font-mono text-xs sm:text-sm font-semibold text-[#00E676] tracking-wider uppercase mb-2">
            06. EDUCATION &amp; JOURNEY
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Education &amp; <span className="text-[#00E676]">Development Journey</span>
          </h2>
          <p className="text-base text-[#D5E2DC] mt-2 max-w-2xl leading-relaxed">
            My academic progression as a Third-Year Bachelor of Science in Information Technology
            student at the University of Negros Occidental – Recoletos alongside real-world software
            deployments and hackathon milestones.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-[#00E676]/35 ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-10">
          {educationTimeline.map((item) => (
            <div key={item.id} data-gsap-reveal className="relative group">
              {/* Timeline Marker */}
              <div
                className={`absolute -left-[37px] sm:-left-[53px] top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  item.isCurrent
                    ? 'bg-[#00E676] border-[#00E676] shadow-[0_0_16px_#00E676]'
                    : 'bg-[#050807] border-[#00E676]/60'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.isCurrent ? 'bg-[#050807]' : 'bg-[#00E676]'
                  }`}
                />
              </div>

              {/* Milestone Panel */}
              <div className="hud-panel p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    {getMilestoneIcon(item.type)}
                    <span className="text-xs sm:text-sm font-semibold text-[#00E676]">
                      {item.organization}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-display font-bold bg-[#00E676] text-[#050807]">
                        Current
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-medium text-[#72B8FF]">
                      {item.period}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A7B8AE] mt-1 mb-3">{item.location}</p>

                <p className="text-base text-[#D5E2DC] leading-relaxed mb-4">{item.description}</p>

                <ul className="space-y-2.5">
                  {item.highlights.map((hl, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-white/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#00E676] shrink-0 mt-1" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
