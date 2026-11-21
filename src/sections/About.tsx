import React, { useState } from 'react';
import {
  Cpu,
  GraduationCap,
  MapPin,
  Sparkles,
  UserCheck,
  Code2,
  Award,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { ownerProfile } from '../data/profile';

export const About: React.FC = () => {
  const [showAnimeAvatar, setShowAnimeAvatar] = useState<boolean>(false);

  return (
    <section
      id="about"
      aria-label="About Ethan Arex V. Ilustre"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-gsap-reveal className="mb-12">
          <p className="font-mono text-xs sm:text-sm font-semibold text-[#00E676] tracking-wider uppercase mb-2">
            02. ABOUT ME
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            About <span className="text-[#00E676]">Ethan Arex V. Ilustre</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Professional Studio Portrait & Academic / Leadership Profile (2-col side-by-side on Tablet/iPad) */}
          <div
            data-gsap-reveal
            className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 items-start"
          >
            <div className="hud-panel p-6">
              <div className="relative aspect-square w-full rounded-xl bg-[#07110D] border border-[#00E676]/40 overflow-hidden flex flex-col items-center justify-end shadow-[0_0_28px_rgba(0,230,118,0.14)]">
                <img
                  src={
                    showAnimeAvatar
                      ? '/images/profile/midoriya-portrait.png'
                      : ownerProfile.profileImagePath
                  }
                  alt={`${ownerProfile.fullName} - Professional Portrait`}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
                />

                {/* Top-Right Portrait Mode Switcher (Professional Photo vs. Hero Avatar) */}
                <button
                  type="button"
                  onClick={() => setShowAnimeAvatar((prev) => !prev)}
                  className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#050807]/85 border border-[#00E676]/45 text-[11px] font-display font-semibold text-[#00E676] hover:bg-[#00E676] hover:text-[#050807] transition-colors cursor-pointer backdrop-blur-md"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{showAnimeAvatar ? 'Studio Photo' : 'Hero Avatar'}</span>
                </button>

                <div className="relative z-10 w-full p-4 bg-gradient-to-t from-[#050807] via-[#050807]/90 to-transparent">
                  <p className="font-display text-lg font-bold text-white">
                    {ownerProfile.fullName}
                  </p>
                  <p className="text-xs sm:text-sm text-[#00E676] font-medium">
                    {ownerProfile.academicLevel} &bull; BSIT &bull; Software &amp; Web Developer
                  </p>
                </div>
              </div>

              {/* Personal Philosophy Quote */}
              <div className="mt-5 p-4 rounded-lg bg-[#050807]/90 border-l-4 border-[#00E676]">
                <p className="text-xs font-semibold text-[#00E676] uppercase tracking-wider mb-1">
                  Personal Philosophy
                </p>
                <p className="font-display text-base sm:text-lg font-semibold text-white italic">
                  &ldquo;{ownerProfile.personalPhilosophy}&rdquo;
                </p>
              </div>

              {/* Direct Resume PDF Download CTA */}
              <div className="mt-4">
                <a
                  href={ownerProfile.resumePath}
                  download="Ethan-Arex-Ilustre-Resume.pdf"
                  className="w-full hud-button-primary py-3 text-xs sm:text-sm justify-center"
                >
                  <FileText className="w-4 h-4" />
                  <span>DOWNLOAD OFFICIAL RESUME (PDF)</span>
                </a>
              </div>
            </div>

            {/* Academic, Leadership & Honor Credentials Card */}
            <div className="hud-panel overflow-hidden">
              <div className="p-6 space-y-4 text-sm sm:text-base">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <UserCheck className="w-5 h-5 text-[#72B8FF]" />
                  <span>Academic &amp; Leadership Credentials</span>
                </h3>
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">{ownerProfile.degree}</p>
                    <p className="text-[#D5E2DC] text-sm">
                      {ownerProfile.academicLevel} &bull; {ownerProfile.university}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">
                      Verified Competition &amp; Project Delivery
                    </p>
                    <p className="text-[#D5E2DC] text-sm">
                      NASA Space Apps 2026 Galactic Problem Solver &bull; IBM Bob 2.0 Hackathon &bull; Regional Top 2 Game Dev
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#72B8FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">{ownerProfile.location}</p>
                    <p className="text-[#D5E2DC] text-sm">
                      Open to software development collaborations, internships, and projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Expanded About Me Narrative */}
          <div data-gsap-reveal className="lg:col-span-7 space-y-6">
            <div className="hud-panel p-7 sm:p-9 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
                <Code2 className="w-5 h-5 text-[#00E676]" />
                <h3 className="font-display text-xl font-bold text-white">
                  My Approach to Software Development
                </h3>
              </div>

              <div className="space-y-4 text-base sm:text-[17px] text-[#D5E2DC] leading-[1.75]">
                {ownerProfile.expandedAbout.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0 || index === ownerProfile.expandedAbout.length - 1
                        ? 'text-white font-medium'
                        : ''
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Core Message Callout */}
              <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-[#00E676]/15 via-[#101915] to-transparent border border-[#00E676]/40">
                <p className="text-xs font-semibold text-[#00E676] uppercase tracking-wider mb-1">
                  Core Commitment
                </p>
                <p className="font-display text-lg sm:text-xl font-bold text-white">
                  &ldquo;{ownerProfile.coreMessage}&rdquo;
                </p>
              </div>
            </div>

            {/* Professional Identities & Technical Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="hud-panel p-6">
                <h3 className="font-display text-base font-bold text-white mb-3.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00E676]" />
                  <span>Professional Identity</span>
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-[#D5E2DC]">
                  {ownerProfile.professionalIdentities.map((role) => (
                    <li key={role} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hud-panel-blue p-6">
                <h3 className="font-display text-base font-bold text-white mb-3.5 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#72B8FF]" />
                  <span>Core Areas of Interest</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ownerProfile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[#07110D] border border-[#72B8FF]/35 text-[#72B8FF]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
