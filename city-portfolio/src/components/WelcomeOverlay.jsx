import React from 'react';
import { IS_TOUCH_DEVICE, ownerProfile, useStore } from '../state';

/**
 * WelcomeOverlay
 * Pre-entry welcome & device calibration screen displayed over the live 3D town.
 * Lets visitors pick Phone / Tablet / iPad Touch Controls or PC / Desktop Keyboard + Mouse
 * before stepping into the 3D portfolio.
 */
export default function WelcomeOverlay() {
  const deviceMode = useStore((s) => s.deviceMode);
  const selectDeviceMode = useStore((s) => s.selectDeviceMode);

  if (deviceMode !== null) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-[#050807]/75 p-3 sm:p-6 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-[6px] border border-[#00ff88]/45 bg-[#0a0f0d]/95 p-5 sm:p-8 shadow-[0_0_60px_rgba(0,255,136,0.2)]">
        {/* Top Architectural Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#00ff88]">
            <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span>SHEET 00 / 07 // DEVICE &amp; CONTROL CALIBRATION</span>
          </div>
          <span className="rounded-[2px] border border-white/15 bg-[#060b09] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8FA198]">
            BACOLOD &bull; PHILIPPINES
          </span>
        </div>

        {/* Hero Intro */}
        <div className="mt-4 sm:mt-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#72B8FF]">
            INTERACTIVE 3D OPEN-WORLD DEVELOPER PORTFOLIO
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {ownerProfile.fullName}
            </h1>
            <button
              type="button"
              onClick={() => useStore.getState().setClassicView(true)}
              className="shrink-0 rounded-[3px] bg-[#F4F7F5] px-2.5 py-2 sm:px-3.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-[#050807] hover:bg-[#00ff88] transition-colors cursor-pointer"
            >
              📄 In a hurry?
              <span className="block text-[9px] font-semibold opacity-75">Classic View</span>
            </button>
          </div>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#C5D3CC]">
            Third-Year BSIT Student at{' '}
            <strong className="text-white">{ownerProfile.university}</strong>. Explore 5
            walkable 3D exhibition buildings, drive open-world vehicles, and inspect my
            software projects and hackathon awards. Select your device below to calibrate
            controls:
          </p>
        </div>

        {/* Device Selection Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Option 1: Mobile / Android / iPhone / Tablet / iPad */}
          <button
            type="button"
            onClick={() => selectDeviceMode('mobile')}
            className={`group relative flex flex-col justify-between rounded-[4px] border p-4 sm:p-5 text-left transition-all cursor-pointer ${
              IS_TOUCH_DEVICE
                ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_28px_rgba(0,255,136,0.2)]'
                : 'border-white/15 bg-[#060b09] hover:border-[#00ff88]/70 hover:bg-[#00ff88]/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#00ff88]">
                  📱 PHONE / TABLET / iPAD
                </span>
                {IS_TOUCH_DEVICE && (
                  <span className="rounded-[2px] bg-[#00ff88] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#050807]">
                    DETECTED
                  </span>
                )}
              </div>
              <h2 className="font-heading mt-2 text-2xl font-black uppercase text-white">
                Touchscreen Mode
              </h2>
              <ul className="mt-2.5 space-y-1.5 font-mono text-[11px] text-[#C5D3CC]">
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff88]">▸</span>
                  <span>360° Virtual Analog Thumbstick (Left)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff88]">▸</span>
                  <span>Jump, Nitro, Drift &amp; Drive Buttons (Right)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff88]">▸</span>
                  <span>Swipe to Look &bull; Two-Finger Pinch Zoom</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff88]">▸</span>
                  <span>Android, iPhone, iPad &amp; Tablet Optimized</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 w-full rounded-[3px] bg-[#00ff88] py-2.5 text-center font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#050807] group-hover:bg-[#33ffa0] transition-colors">
              PLAY ON PHONE / TABLET →
            </div>
          </button>

          {/* Option 2: PC / Mac / Laptop Desktop */}
          <button
            type="button"
            onClick={() => selectDeviceMode('desktop')}
            className={`group relative flex flex-col justify-between rounded-[4px] border p-4 sm:p-5 text-left transition-all cursor-pointer ${
              !IS_TOUCH_DEVICE
                ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_28px_rgba(0,255,136,0.2)]'
                : 'border-white/15 bg-[#060b09] hover:border-[#72B8FF]/70 hover:bg-[#72B8FF]/5'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#72B8FF]">
                  🖥️ PC / MAC / LAPTOP
                </span>
                {!IS_TOUCH_DEVICE && (
                  <span className="rounded-[2px] bg-[#00ff88] px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#050807]">
                    DETECTED
                  </span>
                )}
              </div>
              <h2 className="font-heading mt-2 text-2xl font-black uppercase text-white">
                Keyboard &amp; Mouse Mode
              </h2>
              <ul className="mt-2.5 space-y-1.5 font-mono text-[11px] text-[#C5D3CC]">
                <li className="flex items-center gap-2">
                  <span className="text-[#72B8FF]">▸</span>
                  <span>WASD / Arrows Move &amp; Steer Cars</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#72B8FF]">▸</span>
                  <span>SHIFT Sprint / Nitro &bull; SPACE Jump / Drift</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#72B8FF]">▸</span>
                  <span>Press [F] Near Cars to Drive &amp; Cruise</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#72B8FF]">▸</span>
                  <span>Mouse Drag 360° Orbit &amp; Full Post-FX</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 w-full rounded-[3px] border border-[#00ff88]/60 bg-[#050807] py-2.5 text-center font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#00ff88] group-hover:bg-[#00ff88] group-hover:text-[#050807] transition-colors">
              PLAY ON PC / DESKTOP →
            </div>
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8FA198]">
            TIP: YOU CAN SWITCH BETWEEN TOUCH &amp; PC MODES ANYTIME FROM THE TOP BAR
          </p>
        </div>
      </div>
    </div>
  );
}
