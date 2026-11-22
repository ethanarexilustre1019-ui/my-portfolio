import React, { useEffect, useRef, useState } from 'react';
import {
  TOWN_BUILDINGS,
  drivableCars,
  educationTimeline,
  input,
  nav,
  npcTrafficCars,
  ownerProfile,
  playerState,
  portfolioProjects,
  skillCategories,
  useStore,
  walkToBuilding,
} from '../state';
import {
  submitContactMessage,
  validateContactForm,
} from '../../../src/services/contactService';
import { frameDataUrl, readImageFile } from '../textures';

const NAV_ITEMS = [
  { id: 'hero', label: 'HOME', sheet: '01', sheetTitle: '3D TOWN HUB' },
  { id: 'about', label: 'ABOUT', sheet: '02', sheetTitle: 'DEVELOPER PROFILE' },
  { id: 'skills', label: 'STACK', sheet: '03', sheetTitle: 'TECHNICAL ARSENAL' },
  { id: 'projects', label: 'WORK', sheet: '04', sheetTitle: 'SOFTWARE & CAPSTONE LAB' },
  { id: 'achievements', label: 'AWARDS', sheet: '05', sheetTitle: '3D HALL OF CERTIFICATES' },
  { id: 'education', label: 'JOURNEY', sheet: '06', sheetTitle: 'ENGINEERING JOURNEY' },
  { id: 'contact', label: 'CONTACT', sheet: '07', sheetTitle: 'COMMUNICATIONS HUB' },
];

function TownMinimap() {
  const dotRef = useRef();
  const drivableRefs = useRef([]);
  const npcRefs = useRef([]);

  useEffect(() => {
    let raf;
    const tick = () => {
      if (dotRef.current) {
        const { x, z } = playerState.pos;
        const deg = (-playerState.heading * 180) / Math.PI;
        dotRef.current.setAttribute(
          'transform',
          `translate(${x.toFixed(2)} ${z.toFixed(2)}) rotate(${deg.toFixed(1)})`
        );
      }
      for (let i = 0; i < drivableCars.length; i++) {
        const el = drivableRefs.current[i];
        const c = drivableCars[i];
        if (el && c) {
          el.setAttribute('transform', `translate(${c.x.toFixed(2)} ${c.z.toFixed(2)})`);
        }
      }
      for (let i = 0; i < npcTrafficCars.length; i++) {
        const el = npcRefs.current[i];
        const n = npcTrafficCars[i];
        if (el && n) {
          el.setAttribute('cx', n.x.toFixed(2));
          el.setAttribute('cy', n.z.toFixed(2));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-auto absolute bottom-12 left-4 hidden sm:flex flex-col items-center font-mono">
      <div className="relative h-44 w-44 rounded-full border-2 border-[#00ff88]/50 bg-[#060b09]/92 p-1.5 shadow-[0_0_28px_rgba(0,255,136,0.22)] backdrop-blur-md">
        {/* North Compass Badge */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-[2px] border border-[#00ff88]/60 bg-[#050807] px-1.5 py-0.2 text-[9px] font-bold tracking-widest text-[#00ff88]">
          N
        </div>
        <svg
          viewBox="-44 -44 88 88"
          className="h-full w-full rounded-full bg-[#050907]"
        >
          {/* Radar Grid Rings */}
          <circle cx="0" cy="0" r="29" fill="none" stroke="#00ff88" strokeWidth="0.3" strokeOpacity="0.25" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#00ff88" strokeWidth="0.3" strokeOpacity="0.25" />

          {/* Expanded 8.0m Main Town Avenues */}
          <rect x="-44" y="-16" width="88" height="8" fill="#131c18" />
          <rect x="-44" y="8" width="88" height="8" fill="#131c18" />
          <rect x="-16" y="-44" width="8" height="88" fill="#131c18" />
          <rect x="8" y="-44" width="8" height="88" fill="#131c18" />

          {/* 5 Interactive Town Buildings */}
          {TOWN_BUILDINGS.map((b) => (
            <g
              key={b.id}
              onClick={() => walkToBuilding(b.id)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={b.position[0] - b.size[0] / 2}
                y={b.position[2] - b.size[2] / 2}
                width={b.size[0]}
                height={b.size[2]}
                fill="#0d1914"
                stroke={b.accent}
                strokeWidth="0.75"
                rx="0.7"
              />
              <circle
                cx={b.door[0] - b.enterDir[0] * 1.6}
                cy={b.door[2] - b.enterDir[1] * 1.6}
                r="1.3"
                fill={b.accent}
              />
              <text
                x={b.position[0]}
                y={b.position[2] + 1.1}
                textAnchor="middle"
                fill="#F4F7F5"
                fontSize="3.2"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {b.label}
              </text>
            </g>
          ))}

          {/* Ambient NPC Traffic Dots */}
          {npcTrafficCars.map((n, idx) => (
            <circle
              key={n.id}
              ref={(el) => (npcRefs.current[idx] = el)}
              cx={n.x}
              cy={n.z}
              r="1.3"
              fill="#8FA198"
              fillOpacity="0.75"
            />
          ))}

          {/* Drivable GTA Cars */}
          {drivableCars.map((c, idx) => (
            <g
              key={c.id}
              ref={(el) => (drivableRefs.current[idx] = el)}
              transform={`translate(${c.x} ${c.z})`}
            >
              <rect
                x="-1.5"
                y="-1.5"
                width="3.0"
                height="3.0"
                rx="0.6"
                fill={c.accent}
                stroke="#050807"
                strokeWidth="0.4"
              />
            </g>
          ))}

          {/* Playable Deku / Active Vehicle Position & Facing Arrow */}
          <g ref={dotRef}>
            <circle cx="0" cy="0" r="2.6" fill="#00ff88" fillOpacity="0.28" />
            <polygon
              points="0,2.8 -1.9,-1.9 1.9,-1.9"
              fill="#00ff88"
              stroke="#050807"
              strokeWidth="0.4"
            />
          </g>
        </svg>
      </div>
      <div className="mt-1 rounded-[2px] border border-white/10 bg-[#0a0f0d]/90 px-2.5 py-0.5 text-[9px] tracking-[0.18em] uppercase text-[#8FA198]">
        GTA RADAR &bull; CLICK BLDG
      </div>
    </div>
  );
}

function DigitalSpeedometer() {
  const isDriving = useStore((s) => s.isDriving);
  const activeCarName = useStore((s) => s.activeCarName);
  const toggleDrive = useStore((s) => s.toggleDrive);
  const speedRef = useRef(null);
  const gearRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!isDriving) return;
    let raf;
    const tick = () => {
      const kmh = playerState.carSpeedKmh || 0;
      const gear = playerState.carGear || 'N';
      if (speedRef.current) speedRef.current.textContent = String(kmh).padStart(3, '0');
      if (gearRef.current) gearRef.current.textContent = gear;
      if (barRef.current) {
        const pct = Math.min(100, Math.round((kmh / 130) * 100));
        barRef.current.style.width = `${pct}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [isDriving]);

  if (!isDriving) return null;

  return (
    <div className="pointer-events-auto absolute bottom-12 right-4 rounded-[4px] border border-[#00ff88]/50 bg-[#0a0f0d]/92 p-3.5 shadow-2xl backdrop-blur-md font-mono w-56">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#00ff88]">
        <span>{activeCarName || 'GTA VEHICLE'}</span>
        <span className="rounded-[2px] bg-[#00ff88]/15 px-1.5 py-0.5 text-[#00ff88]">
          GEAR <strong ref={gearRef}>N</strong>
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between">
        <span
          ref={speedRef}
          className="font-heading text-4xl font-black tracking-wider text-white"
        >
          000
        </span>
        <span className="text-xs font-bold tracking-[0.2em] text-[#8FA198]">
          KM/H
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          ref={barRef}
          className="h-full bg-[#00ff88] transition-all duration-75"
          style={{ width: '0%' }}
        />
      </div>
      <button
        type="button"
        onClick={toggleDrive}
        className="mt-3 w-full rounded-[3px] border border-[#00ff88]/50 bg-[#00ff88]/15 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#050807] transition-colors cursor-pointer"
      >
        [F] EXIT VEHICLE
      </button>
    </div>
  );
}

function TouchControls() {
  const press = (key, val) => (e) => {
    e.preventDefault();
    input[key] = val;
  };

  const btn = (key, label) => (
    <button
      type="button"
      onPointerDown={press(key, true)}
      onPointerUp={press(key, false)}
      onPointerLeave={press(key, false)}
      onPointerCancel={press(key, false)}
      onContextMenu={(e) => e.preventDefault()}
      className="pointer-events-auto flex h-11 w-11 select-none items-center justify-center rounded-[3px] border border-[#00ff88]/40 bg-[#0a0f0d]/85 font-mono text-base font-bold text-[#00ff88] backdrop-blur-md active:bg-[#00ff88] active:text-[#050807]"
    >
      {label}
    </button>
  );

  return (
    <div className="absolute bottom-14 left-4 flex items-end gap-3 md:hidden [@media(pointer:coarse)]:flex">
      <div className="grid grid-cols-3 gap-1.5">
        <span />
        {btn('forward', 'W')}
        <span />
        {btn('left', 'A')}
        {btn('back', 'S')}
        {btn('right', 'D')}
      </div>
      <button
        type="button"
        onPointerDown={() => {
          input.jump = true;
        }}
        className="pointer-events-auto h-11 px-3 rounded-[3px] border border-[#00ff88]/50 bg-[#0a0f0d]/85 font-mono text-xs font-bold uppercase tracking-wider text-[#00ff88] active:bg-[#00ff88] active:text-[#050807]"
      >
        JUMP
      </button>
    </div>
  );
}

function CertificateDetailModal() {
  const frame = useStore((s) => s.modalFrame);
  const uploaded = useStore((s) =>
    s.modalFrame ? s.images[s.modalFrame.id] : null
  );
  const closeFrameModal = useStore((s) => s.closeFrameModal);
  const setImage = useStore((s) => s.setImage);
  const clearImage = useStore((s) => s.clearImage);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitRes, setSubmitRes] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeFrameModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeFrameModal]);

  if (!frame) return null;
  const preview = uploaded || frame.imagePath || frameDataUrl(frame);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await readImageFile(file);
    setImage(frame.id, url);
    e.target.value = '';
  };

  const handleInlineContactSubmit = async (e) => {
    e.preventDefault();
    const errs = validateContactForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitRes(null);
    const res = await submitContactMessage(form);
    setSubmitting(false);
    setSubmitRes(res);
    if (res.success) {
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-4 max-h-[72vh] overflow-y-auto rounded-[4px] border border-[#00ff88]/50 bg-[#0a0f0d]/95 p-5 text-white shadow-2xl backdrop-blur-2xl md:inset-x-auto md:bottom-auto md:right-6 md:top-28 md:max-h-[80vh] md:w-[450px] font-sans">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#00ff88]">
            {frame.award || 'ENGRAVED 3D PORTRAIT'}
          </div>
          <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
            {frame.title}
          </h2>
          <p className="font-mono text-xs text-[#8FA198]">{frame.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={closeFrameModal}
          aria-label="Close"
          className="rounded-[3px] border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-xs font-bold text-[#C5D3CC] hover:border-[#00ff88] hover:text-[#00ff88] cursor-pointer"
        >
          ✕
        </button>
      </div>

      <img
        src={preview}
        alt={frame.title}
        className="mb-3 max-h-56 w-full rounded-[3px] border border-white/15 bg-[#050807] object-contain p-1"
      />

      {!frame.boardType && (
        <div className="mb-3 rounded-[3px] border border-white/10 bg-[#060b09] p-3 text-xs">
          <p className="text-[#C5D3CC]">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8FA198]">
              RECIPIENT:{' '}
            </span>
            <strong className="text-[#00ff88]">{frame.recipientDisplay}</strong>
          </p>
          {frame.certificateId && (
            <p className="mt-1 font-mono text-[10px] text-[#72B8FF]">
              CERTIFICATE ID: {frame.certificateId}
            </p>
          )}
          {frame.signatory && (
            <p className="mt-1 text-[11px] text-[#8FA198]">
              Signed: {frame.signatory}
            </p>
          )}
        </div>
      )}

      <p className="mb-3 text-sm leading-relaxed text-[#C5D3CC]">
        {frame.description}
      </p>

      {frame.bullets && frame.bullets.length > 0 && (
        <ul className="mb-3 space-y-1.5 rounded-[3px] border border-white/10 bg-[#060b09] p-3 text-xs text-[#C5D3CC]">
          {frame.bullets.map((bText, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-[#00ff88]">▸</span>
              <span>{bText}</span>
            </li>
          ))}
        </ul>
      )}

      {frame.verifiedTags && frame.verifiedTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {frame.verifiedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-[2px] border border-[#00ff88]/30 bg-[#00ff88]/10 px-2 py-0.5 font-mono text-[10px] text-[#00ff88]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Contact Form inside 3D Communications Hub Portrait Inspector */}
      {frame.contactAction && (
        <form
          onSubmit={handleInlineContactSubmit}
          noValidate
          className="mb-4 space-y-2.5 rounded-[3px] border border-[#00ff88]/30 bg-[#060b09] p-3.5"
        >
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00ff88]">
            DIRECT DISPATCH TERMINAL
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your Name *"
                className="w-full rounded-[2px] border border-white/15 bg-[#050807] px-2.5 py-1.5 text-xs text-white focus:border-[#00ff88] focus:outline-none"
              />
              {errors.name && <p className="mt-0.5 text-[10px] text-red-400">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Your Email *"
                className="w-full rounded-[2px] border border-white/15 bg-[#050807] px-2.5 py-1.5 text-xs text-white focus:border-[#00ff88] focus:outline-none"
              />
              {errors.email && <p className="mt-0.5 text-[10px] text-red-400">{errors.email}</p>}
            </div>
          </div>
          <div>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject (Collaboration / Internship) *"
              className="w-full rounded-[2px] border border-white/15 bg-[#050807] px-2.5 py-1.5 text-xs text-white focus:border-[#00ff88] focus:outline-none"
            />
            {errors.subject && <p className="mt-0.5 text-[10px] text-red-400">{errors.subject}</p>}
          </div>
          <div>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your message to Ethan Arex V. Ilustre... *"
              className="w-full rounded-[2px] border border-white/15 bg-[#050807] px-2.5 py-1.5 text-xs text-white focus:border-[#00ff88] focus:outline-none"
            />
            {errors.message && <p className="mt-0.5 text-[10px] text-red-400">{errors.message}</p>}
          </div>
          {submitRes && (
            <div className="rounded-[2px] border border-[#00ff88]/50 bg-[#00ff88]/10 p-2 text-[11px] text-white">
              {submitRes.message}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[2px] bg-[#00ff88] py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#050807] hover:bg-[#33ffa0] cursor-pointer"
          >
            {submitting ? 'TRANSMITTING...' : 'SEND MESSAGE →'}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {frame.githubUrl && (
          <a
            href={frame.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[3px] bg-[#00ff88] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#050807] hover:bg-[#33ffa0]"
          >
            GITHUB REPO ↗
          </a>
        )}
        {frame.linkedinUrl && (
          <a
            href={frame.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[3px] border border-[#00ff88]/50 bg-[#00ff88]/15 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#050807]"
          >
            LINKEDIN ↗
          </a>
        )}
        {!frame.boardType && (
          <label className="cursor-pointer rounded-[3px] bg-[#00ff88] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#050807] hover:bg-[#33ffa0]">
            📤 {uploaded ? 'Replace Image' : 'Upload / Replace Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
          </label>
        )}
        {uploaded && (
          <button
            type="button"
            onClick={() => clearImage(frame.id)}
            className="rounded-[3px] border border-white/20 px-3 py-2 font-mono text-xs uppercase text-[#C5D3CC] hover:border-[#00ff88] cursor-pointer"
          >
            Reset
          </button>
        )}
        <button
          type="button"
          onClick={closeFrameModal}
          className="rounded-[3px] border border-white/20 px-3 py-2 font-mono text-xs uppercase text-[#C5D3CC] hover:border-[#00ff88] cursor-pointer"
        >
          Back to 3D Room
        </button>
      </div>
    </div>
  );
}

function BuildingPanelModal() {
  const activePanel = useStore((s) => s.activePanel);
  const closePanel = useStore((s) => s.closePanel);
  const selectedProject = useStore((s) => s.selectedProject);
  const setSelectedProject = useStore((s) => s.setSelectedProject);
  const enterAwardsGallery = useStore((s) => s.enterAwardsGallery);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [showAnimeAvatar, setShowAnimeAvatar] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitRes, setSubmitRes] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (selectedProject) setSelectedProject(null);
        else if (activePanel) closePanel();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePanel, selectedProject, setSelectedProject, closePanel]);

  if (!activePanel) return null;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const v = validateContactForm(form);
    if (!v.valid) {
      setErrors(v.errors);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const res = await submitContactMessage(form, ownerProfile.email);
      setSubmitRes(res);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitRes({
        ok: false,
        message: `Email Ethan directly at ${ownerProfile.email}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-[#050807]/80 p-3 sm:p-6 backdrop-blur-md"
      onClick={closePanel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[86vh] w-full max-w-5xl overflow-y-auto rounded-[4px] border border-[#00ff88]/45 bg-[#0a0f0d]/96 p-5 sm:p-8 text-[#F4F7F5] shadow-[0_0_50px_rgba(0,255,136,0.16)]"
      >
        {/* Sticky Tactical Modal Header */}
        <div className="sticky -top-5 sm:-top-8 z-20 -mx-5 sm:-mx-8 mb-6 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0a0f0d]/95 px-5 sm:px-8 py-4 backdrop-blur-md">
          <div>
            <p className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00ff88]">
              {activePanel === 'about' && 'SHEET 02 / 07 — ABOUT & DEVELOPER PROFILE'}
              {activePanel === 'skills' && 'SHEET 03 / 07 — TECHNICAL ARSENAL & STACK'}
              {activePanel === 'projects' && 'SHEET 04 / 07 — SOFTWARE & CAPSTONE WORK'}
              {activePanel === 'education' && 'SHEET 06 / 07 — ENGINEERING JOURNEY'}
              {activePanel === 'contact' && 'SHEET 07 / 07 — COMMUNICATIONS HUB'}
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              {activePanel === 'about' && `MEET ${ownerProfile.fullName}`}
              {activePanel === 'skills' && 'MATERIALS SPEC — TECHNICAL STACK'}
              {activePanel === 'projects' && (selectedProject ? selectedProject.shortName : 'FEATURED SOFTWARE BUILDS')}
              {activePanel === 'education' && 'EDUCATION & HACKATHON MILESTONES'}
              {activePanel === 'contact' && "LET'S BUILD A SOLUTION."}
            </h2>
          </div>

          <button
            type="button"
            onClick={closePanel}
            className="rounded-[3px] border border-[#00ff88]/50 bg-[#00ff88]/10 px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#050807] transition-colors cursor-pointer shrink-0"
          >
            ⬅ Return to Town
          </button>
        </div>

        {/* 1. ABOUT BUILDING CONTENT */}
        {activePanel === 'about' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 rounded-[4px] border border-white/12 bg-[#060b09] p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-[#00ff88] bg-[#050807] shrink-0">
                    <img
                      src={
                        showAnimeAvatar
                          ? '/images/profile/midoriya-portrait.png'
                          : ownerProfile.profileImagePath
                      }
                      alt={ownerProfile.fullName}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAnimeAvatar((p) => !p)}
                    className="rounded-[3px] border border-white/15 bg-[#0a0f0d] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#C5D3CC] hover:border-[#00ff88] hover:text-[#00ff88] cursor-pointer"
                  >
                    {showAnimeAvatar ? 'Studio Photo' : 'Hero Avatar'}
                  </button>
                </div>

                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#00ff88]">
                    SOFTWARE &amp; WEB DEVELOPER
                  </p>
                  <h3 className="font-heading text-3xl font-black uppercase text-white">
                    {ownerProfile.fullName}
                  </h3>
                  <p className="text-xs text-[#8FA198] mt-1">
                    {ownerProfile.academicLevel} &bull; {ownerProfile.degree}
                  </p>
                  <p className="text-xs text-[#C5D3CC] mt-0.5">
                    {ownerProfile.university} ({ownerProfile.location})
                  </p>
                </div>

                <div className="grid grid-cols-3 border-y border-white/10 py-3 text-center">
                  <div>
                    <p className="font-heading text-2xl font-black text-white">07</p>
                    <p className="font-mono text-[10px] text-[#8FA198]">BUILDS</p>
                  </div>
                  <div className="border-x border-white/10">
                    <p className="font-heading text-2xl font-black text-white">BSIT-3</p>
                    <p className="font-mono text-[10px] text-[#8FA198]">UNO-R</p>
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-black text-[#00ff88]">TOP 2</p>
                    <p className="font-mono text-[10px] text-[#8FA198]">REGIONAL</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={ownerProfile.resumePath}
                    download="Ethan-Arex-Ilustre-Resume.pdf"
                    className="flex-1 rounded-[3px] bg-[#00ff88] py-2.5 text-center font-mono text-xs font-bold uppercase tracking-[0.12em] text-[#050807] hover:bg-[#33ffa0]"
                  >
                    Download Resume (PDF)
                  </a>
                  <button
                    type="button"
                    onClick={() => useStore.getState().openPanel('education')}
                    className="rounded-[3px] border border-white/20 px-3.5 py-2.5 font-mono text-xs uppercase text-[#C5D3CC] hover:border-[#00ff88] hover:text-[#00ff88] cursor-pointer"
                  >
                    View Journey &rarr;
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-heading text-2xl font-black uppercase text-[#00ff88]">
                  MY STORY &amp; APPROACH
                </h3>
                {ownerProfile.expandedAbout.map((p, idx) => (
                  <p key={idx} className="text-sm sm:text-[15px] leading-relaxed text-[#C5D3CC]">
                    {p}
                  </p>
                ))}
                <div className="rounded-[3px] border-l-2 border-[#00ff88] border border-white/10 bg-[#060b09] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00ff88]">
                    ENGINEERING PHILOSOPHY
                  </p>
                  <p className="mt-1 font-medium text-white">
                    &ldquo;{ownerProfile.coreMessage}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STACK BUILDING CONTENT */}
        {activePanel === 'skills' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`rounded-[3px] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#00ff88] text-[#050807] border-[#00ff88] font-bold'
                    : 'bg-[#060b09] text-[#8FA198] border-white/12 hover:text-white'
                }`}
              >
                ALL ({skillCategories.length})
              </button>
              {skillCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-[3px] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#00ff88] text-[#050807] border-[#00ff88] font-bold'
                      : 'bg-[#060b09] text-[#8FA198] border-white/12 hover:text-white'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <div className="space-y-7">
              {(selectedCategory === 'all'
                ? skillCategories
                : skillCategories.filter((c) => c.id === selectedCategory)
              ).map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-2">
                    <h3 className="font-heading text-2xl font-black uppercase text-white">
                      <span className="font-mono text-xs text-[#00ff88] mr-2">
                        {cat.code}
                      </span>
                      {cat.title}
                    </h3>
                    <span className="text-xs text-[#8FA198] hidden sm:inline">
                      {cat.subtitle}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {cat.skills.map((sk) => (
                      <div
                        key={sk.name}
                        className="rounded-[3px] border border-white/10 bg-[#060b09] p-4 flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="font-heading text-xl font-bold uppercase text-white">
                            {sk.name}
                          </h4>
                          <p className="mt-1 text-xs sm:text-sm text-[#C5D3CC] leading-relaxed">
                            {sk.context}
                          </p>
                        </div>
                        {sk.verifiedIn && (
                          <p className="mt-3 border-t border-white/10 pt-2 font-mono text-[10px] text-[#00ff88]">
                            ✓ {sk.verifiedIn}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. WORK BUILDING CONTENT */}
        {activePanel === 'projects' && !selectedProject && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {['ALL', 'LIVE', 'VERIFIED', 'CAPSTONE', 'AWARD'].map((flt) => (
                <button
                  key={flt}
                  type="button"
                  onClick={() => setProjectFilter(flt)}
                  className={`rounded-[3px] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] border cursor-pointer ${
                    projectFilter === flt
                      ? 'bg-[#00ff88] text-[#050807] border-[#00ff88] font-bold'
                      : 'bg-[#060b09] text-[#8FA198] border-white/12 hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolioProjects
                .filter((p) => {
                  if (projectFilter === 'ALL') return true;
                  if (projectFilter === 'LIVE') return p.status === 'LIVE DEPLOYMENT';
                  if (projectFilter === 'VERIFIED') return p.status === 'VERIFIED REPOSITORY';
                  if (projectFilter === 'CAPSTONE') return p.status === 'DEVELOPMENT IN PROGRESS';
                  if (projectFilter === 'AWARD') return Boolean(p.isAwardWinner);
                  return true;
                })
                .map((proj) => {
                  const isCap = proj.status === 'DEVELOPMENT IN PROGRESS';
                  return (
                    <div
                      key={proj.id}
                      className="rounded-[4px] border border-white/12 bg-[#060b09] p-5 flex flex-col justify-between hover:border-[#00ff88]/50 transition-colors"
                    >
                      <div>
                        {proj.screenshots?.length > 0 && (
                          <img
                            src={proj.screenshots[0].src}
                            alt={proj.screenshots[0].alt}
                            className="mb-4 h-44 w-full rounded-[3px] border border-white/10 object-cover object-top"
                          />
                        )}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="rounded-[2px] border border-white/15 bg-[#050807] px-2 py-0.5 font-mono text-[10px] uppercase text-[#8FA198]">
                            {proj.category}
                          </span>
                          <span
                            className={`rounded-[2px] px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                              isCap
                                ? 'border border-amber-400/60 bg-amber-500/15 text-amber-300'
                                : 'border border-[#00ff88]/60 bg-[#00ff88]/12 text-[#00ff88]'
                            }`}
                          >
                            {proj.status}
                          </span>
                        </div>

                        <h3 className="font-heading text-2xl font-black uppercase text-white">
                          {proj.name}
                        </h3>
                        <p className="mt-2 text-sm text-[#C5D3CC] leading-relaxed">
                          {proj.description}
                        </p>

                        {proj.disclaimer && (
                          <p className="mt-3 rounded-[3px] border border-amber-400/35 bg-amber-500/10 p-2.5 text-xs text-amber-200">
                            {proj.disclaimer}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {proj.technologies.map((t) => (
                            <span
                              key={t}
                              className="rounded-[2px] border border-white/10 bg-[#0a0f0d] px-2 py-0.5 font-mono text-[10px] text-[#00ff88]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/10 pt-3.5 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedProject(proj)}
                          className="font-bold text-[#00ff88] hover:underline cursor-pointer"
                        >
                          Read Case Study &rarr;
                        </button>
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C5D3CC] hover:text-white"
                          >
                            Live Site ↗
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C5D3CC] hover:text-white"
                          >
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Detailed Project Case Study Sub-View */}
        {activePanel === 'projects' && selectedProject && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="rounded-[3px] border border-white/20 bg-[#060b09] px-3 py-1.5 font-mono text-xs text-[#00ff88] hover:border-[#00ff88] cursor-pointer"
            >
              &larr; Back to All Projects
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[#00ff88]">
                {selectedProject.indexCode}
              </span>
              <span
                className={`rounded-[2px] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                  selectedProject.status === 'DEVELOPMENT IN PROGRESS'
                    ? 'border border-amber-400/60 bg-amber-500/15 text-amber-300'
                    : 'border border-[#00ff88]/60 bg-[#00ff88]/12 text-[#00ff88]'
                }`}
              >
                {selectedProject.status}
              </span>
            </div>

            <p className="text-base text-[#C5D3CC] leading-relaxed">
              {selectedProject.description}
            </p>

            {selectedProject.disclaimer && (
              <div className="rounded-[3px] border border-amber-400/40 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-200">
                {selectedProject.disclaimer}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[3px] border border-white/10 bg-[#060b09] p-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-[#72B8FF] mb-2">
                  01 // PROBLEM STATEMENT
                </h4>
                <p className="text-sm text-[#C5D3CC] leading-relaxed">
                  {selectedProject.problemStatement}
                </p>
              </div>
              <div className="rounded-[3px] border border-[#00ff88]/25 bg-[#060b09] p-4">
                <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-[#00ff88] mb-2">
                  02 // ENGINEERED SOLUTION
                </h4>
                <p className="text-sm text-[#C5D3CC] leading-relaxed">
                  {selectedProject.proposedSolution}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-[#00ff88] mb-3">
                03 // KEY FEATURES &amp; ARCHITECTURE
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {selectedProject.keyFeatures.map((feat, i) => (
                  <li
                    key={i}
                    className="rounded-[3px] border border-white/10 bg-[#060b09] p-3 text-xs sm:text-sm text-[#F4F7F5]"
                  >
                    <span className="text-[#00ff88] mr-2">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 4. JOURNEY / EDUCATION PANEL */}
        {activePanel === 'education' && (
          <div className="space-y-4">
            {educationTimeline.map((item, idx) => (
              <div
                key={item.id}
                className="rounded-[4px] border border-white/12 bg-[#060b09] p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
              >
                <div className="lg:col-span-2">
                  <span className="font-heading text-5xl font-black text-[#00ff88] leading-none">
                    0{idx + 1}
                  </span>
                  <p className="font-mono text-[10px] text-[#8FA198] mt-1">
                    {item.period}
                  </p>
                </div>
                <div className="lg:col-span-10 space-y-2">
                  <p className="font-mono text-xs text-[#00ff88] uppercase">
                    {item.organization} &bull; {item.location}
                  </p>
                  <h3 className="font-heading text-2xl font-black uppercase text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#C5D3CC] leading-relaxed">
                    {item.description}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                    {item.highlights.map((hl, i) => (
                      <li key={i} className="text-xs text-white/90">
                        <span className="text-[#00ff88] mr-1.5">✓</span>
                        {hl}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. CONTACT BUILDING CONTENT */}
        {activePanel === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-sm sm:text-base text-[#C5D3CC] leading-relaxed">
                Open to software development collaborations, internships, web
                application projects, and technical problem solving.
              </p>

              <div className="rounded-[3px] border border-white/12 bg-[#060b09] divide-y divide-white/10 font-mono text-xs">
                <div className="p-3.5 flex justify-between gap-2">
                  <span className="text-[#8FA198]">EMAIL</span>
                  <a
                    href={`mailto:${ownerProfile.email}`}
                    className="text-[#00ff88] hover:underline"
                  >
                    {ownerProfile.email}
                  </a>
                </div>
                <div className="p-3.5 flex justify-between gap-2">
                  <span className="text-[#8FA198]">GITHUB</span>
                  <a
                    href="https://github.com/ethanarexilustre1019-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00ff88]"
                  >
                    ethanarexilustre1019-ui ↗
                  </a>
                </div>
                <div className="p-3.5 flex justify-between gap-2">
                  <span className="text-[#8FA198]">LINKEDIN</span>
                  <a
                    href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#00ff88]"
                  >
                    ethan-arex-ilustre ↗
                  </a>
                </div>
                <div className="p-3.5 flex justify-between gap-2">
                  <span className="text-[#8FA198]">LOCATION</span>
                  <span className="text-white">
                    {ownerProfile.location}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={enterAwardsGallery}
                className="w-full rounded-[3px] border border-[#00ff88]/45 bg-[#00ff88]/10 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#050807] cursor-pointer"
              >
                Visit 3D Hall of Certificates &rarr;
              </button>
            </div>

            <form
              onSubmit={handleContactSubmit}
              noValidate
              className="lg:col-span-7 rounded-[4px] border border-white/12 bg-[#060b09] p-5 sm:p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#C5D3CC] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full rounded-[3px] border border-white/15 bg-[#050807] px-3 py-2 text-sm text-white focus:border-[#00ff88] focus:outline-none"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#C5D3CC] mb-1.5">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full rounded-[3px] border border-white/15 bg-[#050807] px-3 py-2 text-sm text-white focus:border-[#00ff88] focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#C5D3CC] mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Project Collaboration / Internship Inquiry"
                  className="w-full rounded-[3px] border border-white/15 bg-[#050807] px-3 py-2 text-sm text-white focus:border-[#00ff88] focus:outline-none"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#C5D3CC] mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your project or inquiry..."
                  className="w-full rounded-[3px] border border-white/15 bg-[#050807] px-3 py-2 text-sm text-white focus:border-[#00ff88] focus:outline-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                )}
              </div>

              {submitRes && (
                <div className="rounded-[3px] border border-[#00ff88]/50 bg-[#00ff88]/10 p-3 text-xs text-white">
                  {submitRes.message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-[3px] bg-[#00ff88] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#050807] hover:bg-[#33ffa0] cursor-pointer"
              >
                {submitting ? 'SENDING...' : 'SEND MESSAGE →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function FrameProfilerBadge() {
  const badgeRef = useRef(null);

  useEffect(() => {
    let raf;
    let frames = 0;
    let lastTime = performance.now();

    const loop = (now) => {
      frames++;
      const elapsed = now - lastTime;
      if (elapsed >= 500) {
        const fps = Math.min(120, Math.round((frames * 1000) / elapsed));
        const ms = (elapsed / frames).toFixed(1);
        if (badgeRef.current) {
          badgeRef.current.textContent = `${fps} FPS · ${ms}ms`;
        }
        frames = 0;
        lastTime = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span
      ref={badgeRef}
      title="Real-time Frame Budget Profiler (60 FPS = 16.7ms target budget)"
      className="rounded-[2px] border border-[#00ff88]/30 bg-[#00ff88]/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-[#00ff88]"
    >
      60 FPS · 16.6ms
    </span>
  );
}

export default function HUD() {
  const sceneMode = useStore((s) => s.sceneMode);
  const activeSection = useStore((s) => s.activeSection);
  const activePanel = useStore((s) => s.activePanel);
  const rageMode = useStore((s) => s.rageMode);
  const soundEnabled = useStore((s) => s.soundEnabled);
  const quality = useStore((s) => s.quality);
  const isDriving = useStore((s) => s.isDriving);
  const nearCarPrompt = useStore((s) => s.nearCarPrompt);
  const cinematic = useStore((s) => s.cinematic);
  const fade = useStore((s) => s.fade);
  const toggleRageMode = useStore((s) => s.toggleRageMode);
  const toggleSound = useStore((s) => s.toggleSound);
  const setQuality = useStore((s) => s.setQuality);
  const toggleDrive = useStore((s) => s.toggleDrive);
  const exitAwardsGallery = useStore((s) => s.exitAwardsGallery);

  const isCinematic = Boolean(cinematic?.active);
  const currentSheet =
    NAV_ITEMS.find((n) => n.id === activeSection) || NAV_ITEMS[0];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 select-none text-[#F4F7F5]">
      {/* Top Dark Tactical / Neon-Emerald Architectural Navbar (hidden during cinematic doorway cutscenes) */}
      {!isCinematic && (
        <header className="pointer-events-auto border-b border-white/10 bg-[#0a0f0d]/92 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
            {/* Segmented Monospace Pill Navigation Bar */}
            <nav
              aria-label="Main portfolio navigation"
              className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-[4px] border border-white/10 bg-[#060b09] p-1"
            >
              {NAV_ITEMS.filter((item) => item.id !== 'contact').map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => walkToBuilding(item.id)}
                    className={`rounded-[3px] px-2.5 sm:px-3.5 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#00ff88] text-[#050807] font-bold shadow-[0_0_14px_rgba(0,255,136,0.35)]'
                        : 'text-[#8FA198] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Tactical Controls: GRAPHICS TIER, RAGE MODE, MHA AUDIO & CONTACT -> */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const next = quality === 'high' ? 'low' : quality === 'low' ? 'balanced' : 'high';
                  setQuality(next);
                }}
                title="Toggle Graphics Performance Quality (Ultra / Balanced / Low-End)"
                className="rounded-[3px] border border-white/20 bg-[#060b09] px-2 sm:px-2.5 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#C5D3CC] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors cursor-pointer"
              >
                ⚡ {quality.toUpperCase()}
              </button>

              <button
                type="button"
                onClick={toggleRageMode}
                aria-pressed={rageMode}
                title="Toggle Deku 100% One-For-All Rage Mode"
                className={`rounded-[3px] border px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer ${
                  rageMode
                    ? 'border-white bg-[#00ff88] text-[#050807] shadow-[0_0_22px_rgba(0,255,136,0.55)]'
                    : 'border-[#00ff88]/45 bg-[#060b09] text-[#00ff88] hover:border-[#00ff88] hover:bg-[#00ff88]/10'
                }`}
              >
                ⚡ {rageMode ? 'RAGE: 100%' : 'RAGE MODE'}
              </button>

              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundEnabled}
                title="Toggle My Hero Academia Soundtrack & Sound Effects"
                className={`hidden md:inline-flex rounded-[3px] border px-2.5 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'border-[#00ff88]/60 bg-[#00ff88]/10 text-[#00ff88]'
                    : 'border-white/15 bg-[#060b09] text-[#8FA198] hover:text-white'
                }`}
              >
                {soundEnabled ? '🔊 MHA AUDIO' : '🔇 MUTED'}
              </button>

              <button
                type="button"
                onClick={() => walkToBuilding('contact')}
                className="rounded-[3px] bg-[#F4F7F5] px-3 sm:px-4 py-1.5 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] text-[#050807] hover:bg-[#00ff88] transition-colors cursor-pointer"
              >
                CONTACT &rarr;
              </button>
            </div>
          </div>

          {/* Sub-Header Blueprint Strip: SHEET XX / 07 + Frame Profiler + NEGROS ISLAND REGION — PHILIPPINES */}
          <div className="border-t border-white/10 bg-[#050807]/95">
            <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-3 sm:px-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8FA198]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                <span>
                  SHEET {currentSheet.sheet} / 07 &mdash;{' '}
                  <strong className="text-[#F4F7F5] font-semibold">
                    {currentSheet.sheetTitle}
                  </strong>
                </span>
              </span>
              <div className="flex items-center gap-3">
                <FrameProfilerBadge />
                <span className="hidden sm:inline">
                  NEGROS ISLAND REGION &mdash; PHILIPPINES
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Top-Left Identity Badge / Quick Open Button on Town View */}
      {sceneMode === 'town' && !activePanel && !isCinematic && (
        <div className="pointer-events-auto absolute left-4 top-28 hidden lg:block rounded-[4px] border border-[#00ff88]/30 bg-[#0a0f0d]/88 p-3.5 backdrop-blur-md max-w-xs">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#00ff88]">
            3D THIRD-PERSON PORTFOLIO
          </p>
          <p className="font-heading text-2xl font-black uppercase tracking-tight text-white leading-none mt-1">
            {ownerProfile.fullName}
          </p>
          <p className="font-mono text-[10px] text-[#8FA198] mt-1">
            BSIT-3 &bull; {ownerProfile.university}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {TOWN_BUILDINGS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => walkToBuilding(b.id, true)}
                className="rounded-[2px] border border-white/12 bg-[#060b09] px-2 py-1 font-mono text-[10px] uppercase text-[#C5D3CC] hover:border-[#00ff88] hover:text-[#00ff88] cursor-pointer"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prominent "Exit to Town" Button inside 3D AWARDS Interior Gallery (placed at bottom-left so it never overlaps certificate frames) */}
      {sceneMode === 'interior' && !isCinematic && (
        <button
          type="button"
          onClick={exitAwardsGallery}
          className="pointer-events-auto absolute left-4 bottom-14 rounded-[3px] border border-white bg-[#00ff88] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#050807] shadow-[0_0_24px_rgba(0,255,136,0.45)] hover:bg-[#33ffa0] cursor-pointer"
        >
          ⬅ EXIT TO TOWN
        </button>
      )}

      {/* "Press [F] to Drive" Floating Vehicle Entry Prompt */}
      {sceneMode === 'town' && !activePanel && !isCinematic && !isDriving && nearCarPrompt && (
        <button
          type="button"
          onClick={toggleDrive}
          className="pointer-events-auto absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 rounded-[4px] border border-[#00ff88] bg-[#0a0f0d]/95 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_24px_rgba(0,255,136,0.4)] hover:bg-[#00ff88] hover:text-[#050807] transition-all cursor-pointer"
        >
          <span className="rounded-[2px] bg-[#00ff88] px-1.5 py-0.5 text-[11px] font-black text-[#050807]">
            [F]
          </span>
          <span>PRESS [F] TO DRIVE &mdash; {nearCarPrompt.name}</span>
        </button>
      )}

      {/* Town Circular GTA Minimap, Digital Speedometer & Mobile Touch Controls */}
      {sceneMode === 'town' && !activePanel && !isCinematic && <TownMinimap />}
      {sceneMode === 'town' && !activePanel && !isCinematic && <DigitalSpeedometer />}
      {!activePanel && !isCinematic && <TouchControls />}

      {/* Bottom Controls Hint Bar */}
      {!activePanel && !isCinematic && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-[3px] border border-white/15 bg-[#0a0f0d]/90 px-4 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.1em] text-[#C5D3CC] backdrop-blur-md whitespace-nowrap">
          <strong className="text-[#00ff88]">WASD</strong> {isDriving ? 'Drive / Steer' : 'Move'} &bull;{' '}
          <strong className="text-[#00ff88]">SPACE</strong> {isDriving ? 'Handbrake Drift' : 'Jump'} &bull;{' '}
          <strong className="text-[#00ff88]">SHIFT</strong> {isDriving ? 'Nitro Boost' : 'Sprint'} &bull;{' '}
          <strong className="text-[#00ff88]">F</strong> {isDriving ? 'Exit Vehicle' : 'Drive Car'} &bull;{' '}
          <strong className="text-[#00ff88]">DRAG</strong> Orbit Camera
        </div>
      )}

      {/* Cinematic Door-Opening Cutscene Letterbox Bars */}
      {cinematic?.active && (
        <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between transition-all duration-300">
          {/* Top Letterbox Bar */}
          <div className="h-16 sm:h-20 w-full bg-[#050807]/95 border-b border-[#00ff88]/40 px-6 flex items-center justify-between font-mono backdrop-blur-md">
            <div className="flex items-center gap-2.5 text-xs text-[#00ff88] tracking-[0.2em] uppercase">
              <span className="h-2.5 w-2.5 rounded-full bg-[#00ff88] animate-ping" />
              <span>DOORWAY ACCESS &bull; {cinematic.phase.toUpperCase()}</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {TOWN_BUILDINGS.find((b) => b.id === cinematic.buildingId)?.name || 'BUILDING ACCESS'}
            </div>
          </div>

          {/* Bottom Letterbox Bar */}
          <div className="h-16 sm:h-20 w-full bg-[#050807]/95 border-t border-[#00ff88]/40 px-6 flex items-center justify-between font-mono backdrop-blur-md">
            <div className="text-xs text-white uppercase tracking-wider font-bold">
              ENTERING INTERIOR ARCHIVE...
            </div>
            <div className="text-[10px] text-[#00ff88] tracking-[0.2em] uppercase">
              STREAMING SPATIAL ASSETS
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <BuildingPanelModal />
      <CertificateDetailModal />

      {/* Smooth Scene Transition Fade Overlay */}
      <div
        className="fixed inset-0 z-50 bg-[#050807] transition-opacity duration-400"
        style={{
          opacity: fade,
          pointerEvents: fade > 0.05 ? 'auto' : 'none',
        }}
      />
    </div>
  );
}
