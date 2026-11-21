import React from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { certificatesData } from '../data/certificates';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { audioService } from '../services/audioService';
import { CertificateItem } from '../types/portfolio';

export const Achievements: React.FC = () => {
  const { setSelectedCertificate } = usePortfolio();

  const handleInspect = (cert: CertificateItem) => {
    audioService.playClick();
    setSelectedCertificate(cert);
  };

  return (
    <section
      id="achievements"
      aria-label="Achievements and Certifications"
      className="relative py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div data-gsap-reveal className="mb-12">
          <p className="font-mono text-xs sm:text-sm font-semibold text-[#00E676] tracking-wider uppercase mb-2">
            05. ACHIEVEMENTS &amp; CERTIFICATIONS
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Achievements &amp; <span className="text-[#00E676]">Certifications</span>
              </h2>
              <p className="text-base text-[#D5E2DC] mt-2 max-w-2xl leading-relaxed">
                Verified hackathon certificates and regional competitive recognitions. Click any
                certificate card to open the high-resolution interactive viewer.
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {certificatesData.map((cert) => {
            const isRegional = cert.badgeType === 'regional-award';
            return (
              <article
                key={cert.id}
                data-gsap-reveal
                className={`flex flex-col justify-between ${
                  isRegional ? 'hud-panel-blue p-6' : 'hud-panel p-6'
                }`}
              >
                <div>
                  {/* Date & Credential Type */}
                  <div className="flex items-center justify-between gap-2 text-xs font-medium mb-4">
                    <span className="text-[#00E676] font-semibold">{cert.award}</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#050807] border border-white/10 text-[#72B8FF]">
                      {cert.date}
                    </span>
                  </div>

                  {/* Certificate Image Preview */}
                  {cert.imagePath ? (
                    <div
                      onClick={() => handleInspect(cert)}
                      className="group relative mb-5 rounded-xl bg-[#030504] border border-[#00E676]/35 overflow-hidden aspect-[16/11] flex items-center justify-center p-2 cursor-pointer"
                    >
                      <img
                        src={cert.imagePath}
                        alt={`${cert.title} - ${cert.award} (${cert.recipientDisplay})`}
                        className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[#050807]/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="hud-button-primary px-4 py-2 text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleInspect(cert)}
                      className="mb-5 rounded-xl bg-gradient-to-br from-[#07110D] via-[#101915] to-[#0a2336] border border-[#72B8FF]/50 aspect-[16/11] flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-[#00E676] transition-colors"
                    >
                      <Sparkles className="w-10 h-10 text-[#00E676] mb-2" />
                      <p className="text-xs font-bold text-[#00E676] tracking-wider uppercase">
                        {cert.award}
                      </p>
                      <p className="font-display text-lg font-bold text-white mt-1">
                        Negros Island Region, Philippines
                      </p>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {cert.title}
                  </h3>

                  {/* Recipient Info */}
                  <div className="p-3.5 rounded-lg bg-[#050807]/85 border border-white/10 mb-3 text-xs sm:text-sm">
                    <p className="text-white">
                      <span className="text-[#A7B8AE]">Recipient:</span>{' '}
                      <strong className="text-[#00E676]">{cert.recipientDisplay}</strong>
                    </p>
                    {cert.recipientNote && (
                      <p className="text-xs text-[#D5E2DC] mt-1.5 leading-relaxed">
                        {cert.recipientNote}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-[#D5E2DC] leading-relaxed mb-5">
                    {cert.recognition}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {cert.verifiedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs bg-[#050807] border border-white/10 text-[#D5E2DC]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInspect(cert)}
                    className="w-full hud-button-secondary py-2.5 text-sm cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#00E676]" />
                    <span>{cert.imagePath ? 'View Certificate' : 'View Achievement Details'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
