import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { ownerProfile } from '../../data/profile';
import { SectionId } from '../../types/portfolio';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { audioService } from '../../services/audioService';

const FOOTER_LINKS: Array<{ id: SectionId; label: string }> = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Technical Stack' },
  { id: 'projects', label: 'Selected Work' },
  { id: 'achievements', label: 'Awards & Credentials' },
  { id: 'education', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export const Footer: React.FC = () => {
  const { activeSection, reducedMotion } = usePortfolio();

  const jumpTo = (id: SectionId) => {
    audioService.playClick();
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/12 bg-[#050807]/96 pt-14 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 3-Column Studio Footer Grid (Inspired by ralfmangubos.com) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Statement & Socials */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="font-heading text-2xl font-black text-[#00E676] tracking-tight">
                {ownerProfile.initials}
              </span>
              <span className="h-4 w-[1px] bg-white/20" />
              <span className="font-heading text-xl font-black uppercase tracking-tight text-white">
                {ownerProfile.fullName}
              </span>
            </div>
            <p className="text-sm text-[#8FA198] leading-relaxed max-w-sm">
              {ownerProfile.coreMessage} Third-year BSIT developer at{' '}
              {ownerProfile.university}.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://github.com/ethanarexilustre1019-ui"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full border border-white/15 bg-[#0a100d] flex items-center justify-center text-[#C5D3CC] hover:border-[#00E676] hover:text-[#00E676] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-white/15 bg-[#0a100d] flex items-center justify-center text-[#C5D3CC] hover:border-[#00E676] hover:text-[#00E676] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${ownerProfile.email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-full border border-white/15 bg-[#0a100d] flex items-center justify-center text-[#C5D3CC] hover:border-[#00E676] hover:text-[#00E676] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8FA198] mb-4">
              NAVIGATION
            </p>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(link.id)}
                    className={`cursor-pointer transition-colors ${
                      activeSection === link.id
                        ? 'text-[#00E676] font-semibold'
                        : 'text-[#C5D3CC] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Focus Areas & Direct Links */}
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#8FA198] mb-4">
              FOCUS AREAS &amp; DELIVERABLES
            </p>
            <ul className="space-y-2.5 text-sm text-[#C5D3CC]">
              <li>Full-Stack Web Applications</li>
              <li>Interactive 3D WebGL &amp; Three.js</li>
              <li>REST APIs &amp; PostgreSQL / PostGIS</li>
              <li>AI &amp; Cybersecurity Decision Support</li>
              <li>
                <a
                  href={ownerProfile.resumePath}
                  download="Ethan-Arex-Ilustre-Resume.pdf"
                  className="text-[#00E676] hover:underline font-medium"
                >
                  Download Official Resume (PDF) &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Architectural Legal & Sheet-Set Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[#8FA198]">
          <span>
            &copy; {new Date().getFullYear()} {ownerProfile.fullName}. ALL RIGHTS
            RESERVED.
          </span>
          <span className="text-[#C5D3CC]">END OF SET &mdash; 07 SHEETS</span>
        </div>
      </div>
    </footer>
  );
};
