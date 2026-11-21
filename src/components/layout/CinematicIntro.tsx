import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { animateIntroExit } from '../../animations/intro';
import { ownerProfile } from '../../data/profile';

export const CinematicIntro: React.FC = () => {
  const { introComplete, completeIntro, soundEnabled, toggleSound, reducedMotion } = usePortfolio();
  const [progress, setProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (introComplete) return;

    const startTime = performance.now();
    const duration = reducedMotion ? 300 : 1100;

    let rafId = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [introComplete, reducedMotion]);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    animateIntroExit(
      overlayRef.current,
      () => {
        completeIntro();
      },
      reducedMotion
    );
  };

  if (introComplete) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Ethan Arex V. Ilustre Portfolio Introduction"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050807] text-white p-6 md:p-10 overflow-hidden select-none"
    >
      {/* Blueprint Grid & Subtle Emerald Vignette */}
      <div className="absolute inset-0 bg-tactical-grid opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,230,118,0.10),rgba(5,8,7,0.82)_72%)] pointer-events-none" />

      {/* Top Architectural Sheet Header */}
      <div
        data-intro-item
        className="relative z-10 w-full max-w-6xl flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4"
      >
        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase text-[#8FA198]">
          <span className="w-2 h-2 rounded-full bg-[#00E676]" />
          <span>SHEET 00 / 07 &mdash; LOADING 3D STUDIO</span>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[3px] font-mono text-[11px] tracking-[0.14em] uppercase border transition-all cursor-pointer ${
            soundEnabled
              ? 'border-[#00E676]/60 bg-[#00E676]/10 text-[#00E676]'
              : 'border-white/15 bg-[#0a100d] text-[#8FA198] hover:text-white'
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#00E676]" />
              <span>MHA SOUNDTRACK &amp; FX: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#8FA198]" />
              <span>MHA SOUNDTRACK &amp; FX: MUTED</span>
            </>
          )}
        </button>
      </div>

      {/* Center Architectural Monogram & Tabular Progress Readout */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl my-auto py-6">
        <div
          data-intro-item
          className="mb-6 px-5 py-3 border border-[#00E676]/45 bg-[#0a100d]/90 rounded-[3px] flex items-center gap-3"
        >
          <span className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#00E676] leading-none">
            {ownerProfile.initials}
          </span>
          <span className="h-6 w-[1px] bg-white/15" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#C5D3CC]">
            {ownerProfile.fullName}
          </span>
        </div>

        <h1
          data-intro-item
          className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-white mb-3"
        >
          PROBLEMS INTO{' '}
          <span className="text-[#00E676]">SOLUTIONS.</span>
        </h1>

        <p data-intro-item className="text-sm sm:text-base text-[#8FA198] max-w-md mb-8">
          Software &amp; web application engineering &mdash; paired with a real-time Three.js 3D environment.
        </p>

        {/* Tabular Blueprint Progress Bar */}
        <div data-intro-item className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.16em] uppercase mb-2">
            <span className="text-[#8FA198]">
              {progress < 100 ? 'CALIBRATING 3D STAGE' : 'SYSTEM READY // 3D SYNCHRONIZED'}
            </span>
            <span className="text-[#00E676] font-bold tabular-nums">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-[3px] bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#00E676] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* High-Contrast Off-White Primary CTA */}
        <div data-intro-item className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleEnter}
            className="hud-button-primary px-8 py-3.5 text-sm cursor-pointer"
          >
            <span>Enter portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#8FA198]">
            INITIALIZE 3D ENVIRONMENT &amp; AUDIO
          </span>
        </div>
      </div>

      {/* Bottom Sheet Metadata Footer */}
      <div
        data-intro-item
        className="relative z-10 w-full max-w-6xl flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-[#8FA198]"
      >
        <span>UNO-R // BSIT THIRD-YEAR DEVELOPER</span>
        <span className="text-[#00E676]">NEGROS ISLAND REGION, PHILIPPINES</span>
      </div>
    </div>
  );
};
