import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
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
    const duration = reducedMotion ? 350 : 1250;

    let rafId = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
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
      {/* Background Grid & Bio-Electric Radial Glow */}
      <div className="absolute inset-0 bg-tactical-grid opacity-65 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,230,118,0.16),transparent_60%)] pointer-events-none" />

      {/* Floating Green Energy Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#00E676] opacity-50 animate-pulse"
            style={{
              left: `${(idx * 19 + 7) % 94}%`,
              top: `${(idx * 29 + 11) % 88}%`,
              boxShadow: '0 0 12px #00E676',
              animationDelay: `${(idx % 5) * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* Top HUD Bar */}
      <div
        data-intro-item
        className="relative z-10 w-full max-w-5xl flex flex-wrap items-center justify-between gap-4 border-b border-[#00E676]/20 pb-4"
      >
        <div className="flex items-center gap-2.5 text-xs font-hud tracking-widest text-[#00E676]">
          <Zap className="w-4 h-4 text-[#00E676]" />
          <span>SYS.INIT // EMERALD VANGUARD 3D ENGINE</span>
        </div>

        {/* Cinematic Sound Toggle (Disabled by Default) */}
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-hud tracking-wider border transition-all cursor-pointer ${
            soundEnabled
              ? 'border-[#00E676] bg-[#00E676]/15 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.25)]'
              : 'border-white/20 bg-[#101915]/80 text-[#A7B8AE] hover:border-[#00E676]/50 hover:text-white'
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#00E676]" />
              <span>MHA SOUNDTRACK &amp; FX: ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#A7B8AE]" />
              <span>MHA SOUNDTRACK &amp; FX: MUTED</span>
            </>
          )}
        </button>
      </div>

      {/* Center EAI Emblem & Loading Telemetry */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl my-auto py-6">
        {/* EAI Crest Logo */}
        <div
          data-intro-item
          className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mb-6"
        >
          <div className="absolute inset-0 rounded-full border border-[#00E676]/35 animate-ping opacity-20" />
          <div className="absolute inset-1 rounded-full border-2 border-dashed border-[#00E676]/45 animate-spin [animation-duration:14s]" />
          <div className="relative w-24 h-24 md:w-28 md:h-28 hud-panel flex flex-col items-center justify-center border-[#00E676]/60 shadow-[0_0_36px_rgba(0,230,118,0.28)]">
            <span className="font-hud text-3xl md:text-4xl font-extrabold tracking-wider text-white text-glow-emerald">
              {ownerProfile.initials}
            </span>
            <span className="font-hud text-[9px] tracking-[0.25em] text-[#00E676] mt-0.5">
              VANGUARD
            </span>
          </div>
        </div>

        <p
          data-intro-item
          className="font-hud text-xs tracking-[0.28em] text-[#00E676] uppercase mb-2"
        >
          {ownerProfile.fullName}
        </p>

        <h1
          data-intro-item
          className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white mb-3"
        >
          &ldquo;{ownerProfile.mainTagline}&rdquo;
        </h1>

        <p data-intro-item className="text-sm text-[#A7B8AE] max-w-md mb-8">
          {ownerProfile.alternativeHeroStatement}
        </p>

        {/* Animated Loading Progress Bar */}
        <div data-intro-item className="w-full max-w-md mb-7">
          <div className="flex items-center justify-between text-xs font-hud mb-2">
            <span className="text-[#A7B8AE]">
              {progress < 100 ? 'CALIBRATING 3D SHADERS & TELEMETRY...' : 'SYSTEM READY // 3D SCENE SYNCHRONIZED'}
            </span>
            <span className="text-[#00E676] font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#101915] border border-[#00E676]/30 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#00E676] to-[#72B8FF] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Portfolio CTA Button */}
        <div data-intro-item className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleEnter}
            className="hud-button-primary px-8 py-3.5 text-sm font-hud tracking-wider uppercase cursor-pointer"
          >
            <span>ENTER PORTFOLIO</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-hud text-[#A7B8AE]/80">
            CLICK ABOVE TO INITIALIZE INTERACTIVE 3D ENVIRONMENT
          </span>
        </div>
      </div>

      {/* Bottom Status Footer */}
      <div
        data-intro-item
        className="relative z-10 w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 border-t border-[#00E676]/20 pt-4 text-[11px] font-hud text-[#A7B8AE]"
      >
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
          UNO-R // BSIT THIRD-YEAR DEVELOPER PORTFOLIO
        </span>
        <span className="text-[#72B8FF]">NEGROS ISLAND REGION, PHILIPPINES</span>
      </div>
    </div>
  );
};
