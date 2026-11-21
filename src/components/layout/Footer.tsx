import React from 'react';
import { Github, Linkedin, Mail, Terminal } from 'lucide-react';
import { ownerProfile } from '../../data/profile';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-[#00E676]/20 bg-[#050807]/95 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5 text-xs font-hud text-[#00E676] mb-2">
            <Terminal className="w-4 h-4" />
            <span>{ownerProfile.fullName} // DEVELOPER PORTFOLIO</span>
          </div>
          <p className="font-display text-lg md:text-xl font-bold text-white mb-2">
            &ldquo;{ownerProfile.coreMessage}&rdquo;
          </p>
          <p className="text-xs text-[#A7B8AE]">
            {ownerProfile.academicLevel} ({ownerProfile.degree}) &bull; {ownerProfile.university} &bull;{' '}
            {ownerProfile.location}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-3">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/ethanarexilustre1019-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ethan Arex V. Ilustre GitHub Profile"
              className="hud-button-secondary px-3.5 py-2 text-xs font-hud"
            >
              <Github className="w-4 h-4 text-[#00E676]" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ethan Arex V. Ilustre LinkedIn Profile"
              className="hud-button-secondary px-3.5 py-2 text-xs font-hud"
            >
              <Linkedin className="w-4 h-4 text-[#72B8FF]" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${ownerProfile.email}`}
              aria-label="Send email to Ethan Arex V. Ilustre"
              className="hud-button-secondary px-3.5 py-2 text-xs font-hud"
            >
              <Mail className="w-4 h-4 text-[#00E676]" />
              <span>Email</span>
            </a>
          </div>
          <p className="text-[11px] font-hud text-[#A7B8AE]">
            &copy; {new Date().getFullYear()} {ownerProfile.fullName}. ENGINEERED WITH REACT, THREE.JS &amp; GSAP.
          </p>
        </div>
      </div>
    </footer>
  );
};
