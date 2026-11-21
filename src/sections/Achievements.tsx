import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { certificatesData } from '../data/certificates';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { audioService } from '../services/audioService';
import { CertificateItem } from '../types/portfolio';
import { TiltedFrame } from '../components/ui/TiltedFrame';

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
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Split Blueprint Header */}
        <div
          data-gsap-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end pb-8 mb-10 border-b border-white/10"
        >
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] font-semibold text-[#00E676] tracking-[0.22em] uppercase mb-2">
              05 / VERIFIED CREDENTIALS
            </p>
            <h2 className="font-heading text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.94] text-[#F4F7F5]">
              HACKATHONS &amp; <span className="text-[#00E676]">AWARDS</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
              Verified international hackathon completions and regional
              engineering awards. Click any credential to open the
              high-resolution interactive viewer.
            </p>
          </div>
        </div>

        {/* Certificate Cards Grid (1-col Mobile, 2-col Tablet/iPad, 3-col Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {certificatesData.map((cert, idx) => (
            <article
              key={cert.id}
              data-gsap-reveal
              className="group flex flex-col justify-between bg-[#070c0a]/84 border border-white/10 hover:border-[#00E676]/45 rounded-[4px] p-5 sm:p-6 backdrop-blur-md transition-all"
            >
              <div>
                {/* Top Index & Date Row */}
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.16em] uppercase mb-4">
                  <span className="text-[#00E676] font-bold">
                    0{idx + 1} / {cert.award}
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#050807] border border-white/12 text-[#8FA198]">
                    {cert.date}
                  </span>
                </div>

                {/* Certificate Image Preview with 3D Pointer Tilt */}
                {cert.imagePath ? (
                  <TiltedFrame
                    onClick={() => handleInspect(cert)}
                    className="mb-5 aspect-[16/11] bg-[#030504] p-2 cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={cert.imagePath}
                      alt={`${cert.title} - ${cert.award} (${cert.recipientDisplay})`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </TiltedFrame>
                ) : (
                  <TiltedFrame
                    onClick={() => handleInspect(cert)}
                    className="mb-5 aspect-[16/11] bg-gradient-to-br from-[#07110D] via-[#0b1518] to-[#0a1d2a] p-6 flex flex-col items-center justify-center text-center cursor-pointer"
                  >
                    <Sparkles className="w-9 h-9 text-[#00E676] mb-2" />
                    <p className="font-mono text-[11px] font-bold text-[#00E676] tracking-[0.18em] uppercase">
                      {cert.award}
                    </p>
                    <p className="font-heading text-xl font-black uppercase text-white mt-1">
                      NEGROS ISLAND REGION
                    </p>
                  </TiltedFrame>
                )}

                {/* Title */}
                <h3 className="font-heading text-2xl font-black uppercase tracking-tight leading-tight text-white group-hover:text-[#00E676] transition-colors mb-3">
                  {cert.title}
                </h3>

                {/* Recipient Info */}
                <div className="p-3 rounded-[3px] bg-[#050807]/90 border border-white/10 mb-3 text-xs">
                  <p className="text-[#C5D3CC]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8FA198]">
                      RECIPIENT:{' '}
                    </span>
                    <strong className="text-[#00E676]">
                      {cert.recipientDisplay}
                    </strong>
                  </p>
                  {cert.recipientNote && (
                    <p className="text-[11px] text-[#8FA198] mt-1.5 leading-relaxed">
                      {cert.recipientNote}
                    </p>
                  )}
                </div>

                <p className="text-sm text-[#C5D3CC] leading-relaxed mb-5">
                  {cert.recognition}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {cert.verifiedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] bg-[#050807] border border-white/10 text-[#8FA198]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleInspect(cert)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F4F7F5] hover:text-[#00E676] transition-colors cursor-pointer pt-1"
                >
                  <span>
                    {cert.imagePath
                      ? 'Inspect certificate'
                      : 'Read achievement details'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#00E676]" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
