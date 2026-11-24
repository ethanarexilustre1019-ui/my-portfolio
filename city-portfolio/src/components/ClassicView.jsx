import React from 'react';
import { ownerProfile, portfolioProjects, skillCategories, useStore } from '../state';

const RESUME_URL = '/resume/Ethan-Arex-Ilustre-Resume.pdf';

/**
 * ClassicView — fast, plain, recruiter-friendly page with projects, skills, resume and contact.
 */
export default function ClassicView() {
  const classicView = useStore((s) => s.classicView);
  const setClassicView = useStore((s) => s.setClassicView);
  if (!classicView) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60] overflow-y-auto bg-[#0a0f0d] text-[#F4F7F5]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 font-sans">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00ff88]">
            CLASSIC VIEW
          </span>
          <button
            type="button"
            onClick={() => setClassicView(false)}
            className="rounded-[3px] bg-[#00ff88] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050807] cursor-pointer"
          >
            ENTER 3D WORLD →
          </button>
        </div>

        <h1 className="font-heading mt-5 text-4xl sm:text-5xl font-black uppercase leading-none">
          {ownerProfile.fullName}
        </h1>
        <p className="mt-2 text-sm text-[#C5D3CC]">
          {ownerProfile.university} · {ownerProfile.location}
        </p>
        {ownerProfile.bio && (
          <p className="mt-3 text-sm leading-relaxed text-[#C5D3CC]">{ownerProfile.bio}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs font-bold uppercase">
          <a href={RESUME_URL} download className="rounded-[3px] bg-[#F4F7F5] px-4 py-2 text-[#050807]">
            Download Resume
          </a>
          <a href={`mailto:${ownerProfile.email}`} className="rounded-[3px] border border-[#00ff88]/60 px-4 py-2 text-[#00ff88]">
            Email
          </a>
          <a href="https://github.com/ethanarexilustre1019-ui" target="_blank" rel="noopener noreferrer" className="rounded-[3px] border border-white/20 px-4 py-2">
            GitHub ↗
          </a>
          <a href="https://www.linkedin.com/in/ethan-arex-ilustre-6501ba2bb/" target="_blank" rel="noopener noreferrer" className="rounded-[3px] border border-white/20 px-4 py-2">
            LinkedIn ↗
          </a>
        </div>

        <h2 className="font-heading mt-8 text-2xl font-black uppercase text-[#00ff88]">Projects</h2>
        <div className="mt-3 space-y-3">
          {portfolioProjects.map((p) => (
            <article key={p.id} className="rounded-[4px] border border-white/12 bg-[#060b09] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-white">{p.shortName || p.name}</h3>
                {p.status && (
                  <span className="rounded-[2px] border border-[#00ff88]/40 px-1.5 py-0.5 font-mono text-[10px] uppercase text-[#00ff88]">
                    {p.status}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[#C5D3CC]">{p.description}</p>
              {p.technologies && (
                <p className="mt-2 font-mono text-[11px] text-[#8FA198]">{p.technologies.join(' · ')}</p>
              )}
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-mono text-xs text-[#00ff88] hover:underline">
                  GitHub ↗
                </a>
              )}
            </article>
          ))}
        </div>

        <h2 className="font-heading mt-8 text-2xl font-black uppercase text-[#00ff88]">Skills</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {skillCategories.map((c) => (
            <div key={c.title} className="rounded-[4px] border border-white/12 bg-[#060b09] p-4">
              <h3 className="font-mono text-xs font-bold uppercase text-white">{c.title}</h3>
              <p className="mt-1.5 text-sm text-[#C5D3CC]">
                {(c.skills || []).map((s) => s.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
        <div className="h-10" />
      </div>
    </div>
  );
}
