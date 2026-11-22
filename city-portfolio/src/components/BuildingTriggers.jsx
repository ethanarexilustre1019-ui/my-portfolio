import React from 'react';
import { Html } from '@react-three/drei';
import { TOWN_BUILDINGS, useStore, walkToBuilding } from '../state';

/**
 * BuildingTriggers
 * Places floating 3D HTML signs (<Html> from @react-three/drei) styled in
 * the dark tactical/neon-emerald monospace theme above the 5 distinct buildings
 * in the town model: ABOUT, STACK, WORK, AWARDS, and CONTACT.
 */
export default function BuildingTriggers({ portalRef }) {
  const sceneMode = useStore((s) => s.sceneMode);
  const activePanel = useStore((s) => s.activePanel);
  const cinematicActive = useStore((s) => Boolean(s.cinematic?.active));
  const hoveredBuilding = useStore((s) => s.hoveredBuilding);
  const setHoveredBuilding = useStore((s) => s.setHoveredBuilding);

  const visibleOnTown = sceneMode === 'town' && !activePanel && !cinematicActive;

  return (
    <group>
      {TOWN_BUILDINGS.map((b) => {
        const isHover = hoveredBuilding === b.id;
        return (
          <Html
            key={b.id}
            portal={portalRef}
            position={b.signPos}
            center
            zIndexRange={[15, 0]}
          >
            <div
              data-building-label={b.id}
              style={{
                display: visibleOnTown ? 'block' : 'none',
                pointerEvents: visibleOnTown ? 'auto' : 'none',
              }}
              onPointerEnter={() => setHoveredBuilding(b.id)}
              onPointerLeave={() => setHoveredBuilding(null)}
              onClick={(e) => {
                e.stopPropagation();
                walkToBuilding(b.id);
              }}
              className="cursor-pointer select-none text-center font-mono"
            >
              <div
                className="rounded-[3px] border bg-[#0a0f0d]/90 px-3.5 py-2 shadow-2xl backdrop-blur-md transition-all"
                style={{
                  borderColor: isHover ? b.accent : 'rgba(0, 255, 136, 0.35)',
                  boxShadow: isHover ? `0 0 20px ${b.accent}44` : '0 8px 24px rgba(0,0,0,0.65)',
                }}
              >
                <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#00ff88]">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: b.accent }}
                  />
                  <span>SHEET {b.sheet} // {b.label}</span>
                </div>
                <div className="mt-0.5 whitespace-nowrap text-xs sm:text-sm font-bold tracking-wider uppercase text-white">
                  {b.name}
                </div>
                <div className="whitespace-nowrap text-[10px] text-[#8FA198]">
                  {b.subtitle}
                </div>
              </div>

              <div
                data-enter-pill={b.id}
                className={`mt-1 inline-block rounded-[2px] px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase text-[#050807] shadow-lg transition-all duration-150 ${
                  isHover ? 'translate-y-0 opacity-100 scale-105' : 'translate-y-0.5 opacity-90'
                }`}
                style={{ background: b.accent }}
              >
                ▶ CLICK TO ENTER
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}
