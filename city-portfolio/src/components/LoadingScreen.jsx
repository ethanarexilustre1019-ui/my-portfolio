import React from 'react';
import { useProgress } from '@react-three/drei';

/**
 * LoadingScreen — progress bar + controls hint while 3D models stream in.
 */
export default function LoadingScreen() {
  const { active, progress } = useProgress();
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setDone(true), 350);
      return () => clearTimeout(t);
    }
  }, [active, progress]);

  if (done) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#050807] px-6 font-mono">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#00ff88]">LOADING 3D WORLD</p>
      <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-[#00ff88] transition-all duration-200"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#8FA198]">{Math.round(progress)}%</p>
      <p className="mt-5 text-center text-[11px] uppercase tracking-[0.14em] text-[#C5D3CC]">
        WASD / arrows to move · F to drive · click a building to enter
      </p>
    </div>
  );
}
