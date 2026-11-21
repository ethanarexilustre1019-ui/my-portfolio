import React, { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { animateModalOpen } from '../../animations/transitions';

export const CertificateModal: React.FC = () => {
  const { selectedCertificate, setSelectedCertificate, reducedMotion } = usePortfolio();
  const [zoomed, setZoomed] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setZoomed(false);
    if (selectedCertificate && modalRef.current) {
      animateModalOpen(modalRef.current, reducedMotion);
    }
  }, [selectedCertificate, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCertificate(null);
      }
    };
    if (selectedCertificate) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCertificate, setSelectedCertificate]);

  if (!selectedCertificate) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050807]/92 backdrop-blur-lg overflow-y-auto"
      onClick={() => setSelectedCertificate(null)}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto hud-panel border-[#00E676]/60 p-5 sm:p-7 text-white shadow-[0_0_60px_rgba(0,230,118,0.22)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#00E676]/25 pb-4 mb-5">
          <div>
            <p className="font-hud text-xs text-[#00E676] tracking-wider">
              {selectedCertificate.indexCode} // VERIFIED CREDENTIAL
            </p>
            <h2 id="cert-modal-title" className="font-display text-xl sm:text-2xl font-bold mt-1">
              {selectedCertificate.title} — {selectedCertificate.award}
            </h2>
            <p className="text-xs text-[#A7B8AE] mt-0.5">
              Issued by {selectedCertificate.issuer} &bull; {selectedCertificate.date}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedCertificate.imagePath && (
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? 'Zoom out certificate' : 'Zoom in certificate'}
                className="p-2 border border-[#00E676]/40 bg-[#101915] text-[#00E676] hover:bg-[#00E676] hover:text-[#050807] transition-colors cursor-pointer"
              >
                {zoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedCertificate(null)}
              aria-label="Close certificate viewer"
              className="p-2 border border-[#00E676]/40 bg-[#101915] text-[#A7B8AE] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Image Viewport */}
        {selectedCertificate.imagePath ? (
          <div className="bg-[#030504] border border-[#00E676]/30 p-3 mb-5 overflow-auto flex justify-center">
            <img
              src={selectedCertificate.imagePath}
              alt={`${selectedCertificate.title} - ${selectedCertificate.award} awarded to ${selectedCertificate.recipientDisplay}`}
              className={`transition-transform duration-300 object-contain ${
                zoomed ? 'scale-135 cursor-zoom-out' : 'max-h-[60vh] cursor-zoom-in'
              }`}
              onClick={() => setZoomed((z) => !z)}
            />
          </div>
        ) : (
          <div className="bg-[#07110D] border border-[#72B8FF]/40 p-8 mb-5 text-center">
            <Award className="w-14 h-14 text-[#00E676] mx-auto mb-3" />
            <p className="font-hud text-sm text-[#00E676] font-bold">
              {selectedCertificate.award}
            </p>
            <p className="text-xs text-[#A7B8AE] mt-1">{selectedCertificate.issuer}</p>
          </div>
        )}

        {/* Verification Telemetry & Recipient Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#07110D] border border-white/10 space-y-1.5">
            <p className="font-hud text-[11px] text-[#00E676] uppercase">
              Certificate Recipient Info
            </p>
            <p className="text-white font-semibold">
              Displayed Recipient: <span className="text-[#00E676]">{selectedCertificate.recipientDisplay}</span>
            </p>
            {selectedCertificate.recipientNote && (
              <p className="text-xs text-[#A7B8AE] leading-relaxed">
                {selectedCertificate.recipientNote}
              </p>
            )}
            {selectedCertificate.certificateId && (
              <p className="font-hud text-[11px] text-[#72B8FF] pt-1">
                CERTIFICATE ID: {selectedCertificate.certificateId}
              </p>
            )}
          </div>

          <div className="p-4 bg-[#07110D] border border-[#00E676]/25 space-y-1.5">
            <p className="font-hud text-[11px] text-[#00E676] uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Citation</span>
            </p>
            <p className="text-[#A7B8AE] leading-relaxed">{selectedCertificate.recognition}</p>
            {selectedCertificate.signatory && (
              <p className="text-xs text-white/80 pt-1">Signed: {selectedCertificate.signatory}</p>
            )}
          </div>
        </div>

        {/* Open Raw Image Action */}
        {selectedCertificate.imagePath && (
          <div className="mt-5 pt-4 border-t border-[#00E676]/20 flex justify-end">
            <a
              href={selectedCertificate.imagePath}
              target="_blank"
              rel="noopener noreferrer"
              className="hud-button-secondary px-4 py-2 text-xs font-hud"
            >
              <span>OPEN ORIGINAL CERTIFICATE FILE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
