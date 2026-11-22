import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import TownScene from './components/TownScene';
import DekuController from './components/DekuController';
import BuildingTriggers from './components/BuildingTriggers';
import InteriorGallery from './components/InteriorGallery';
import HUD from './components/HUD';
import { input, useStore } from './state';

const KEYMAP = {
  w: 'forward',
  keyw: 'forward',
  arrowup: 'forward',
  s: 'back',
  keys: 'back',
  arrowdown: 'back',
  a: 'left',
  keya: 'left',
  arrowleft: 'left',
  d: 'right',
  keyd: 'right',
  arrowright: 'right',
  shift: 'run',
  shiftleft: 'run',
  shiftright: 'run',
  ' ': 'jump',
  space: 'jump',
};

export default function App() {
  const sceneMode = useStore((s) => s.sceneMode);
  const quality = useStore((s) => s.quality);
  const portalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e, isDown) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const keyLower = (e.key || '').toLowerCase();
      const codeLower = (e.code || '').toLowerCase();

      // [F] key toggles On-Foot vs. Driving state machine
      if ((keyLower === 'f' || codeLower === 'keyf') && isDown && !e.repeat) {
        e.preventDefault();
        useStore.getState().toggleDrive();
        return;
      }

      const k = KEYMAP[keyLower] || KEYMAP[codeLower];
      if (!k) return;

      if (k === 'jump') {
        input.jump = isDown;
        e.preventDefault();
        return;
      }

      input[k] = isDown;
      if (
        (e.key && e.key.startsWith('Arrow')) ||
        (e.code && e.code.startsWith('Arrow'))
      ) {
        e.preventDefault();
      }
    };

    const onKeyDown = (e) => handleKey(e, true);
    const onKeyUp = (e) => handleKey(e, false);
    const onBlur = () => {
      Object.keys(input).forEach((k) => {
        input[k] = false;
      });
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0f0d]">
      {/* Dedicated DOM Portal outside <canvas> for @react-three/drei <Html> Building Signs */}
      <div
        ref={portalRef}
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
        style={{ display: sceneMode === 'town' ? 'block' : 'none' }}
      />

      <Canvas
        shadows={quality !== 'low'}
        dpr={quality === 'high' ? [1, 2] : quality === 'balanced' ? [1, 1.5] : [1, 1]}
        camera={{ fov: 52, near: 0.1, far: 280, position: [0, 4.0, 5.5] }}
        gl={{
          antialias: quality !== 'low',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <BuildingTriggers portalRef={portalRef} />
          {sceneMode === 'town' ? (
            <>
              <TownScene />
              <DekuController mode="town" />
            </>
          ) : (
            <InteriorGallery />
          )}
        </Suspense>
      </Canvas>

      <HUD />
    </div>
  );
}
