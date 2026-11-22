import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { graffitiTexture } from '../textures';
import { playerState, useStore } from '../state';

// Shared materials & geometries for zero per-instance allocation overhead
const acHousingMat = new THREE.MeshStandardMaterial({
  color: '#3a4440',
  roughness: 0.6,
  metalness: 0.5,
});
const acGrillMat = new THREE.MeshBasicMaterial({ color: '#1a201c' });
const acBladeMat = new THREE.MeshBasicMaterial({ color: '#708278' });
const mastMat = new THREE.MeshStandardMaterial({
  color: '#505a54',
  metalness: 0.8,
  roughness: 0.3,
});
const crossbarMat = new THREE.MeshStandardMaterial({
  color: '#707a74',
  metalness: 0.8,
});

/**
 * BuildingDecorations
 * Enriches the town buildings with:
 * - Proportionally scaled street graffiti murals flush-mounted to each building's actual wall panels
 * - Distance-culled animated rooftop AC condenser units
 * - Rooftop antenna masts with aviation warning beacons
 */
export default function BuildingDecorations() {
  const fansRef = useRef([]);

  // Properly proportioned murals flush against the 5 expanded building walls (exact GLB wall coordinates * 1.6)
  const murals = useMemo(() => {
    return [
      // 1. Hall of Certificates (AWARDS) - Left & Right South Facade Wings (wall z = -20.99)
      {
        bldId: 'achievements-left',
        pos: [-5.28, 2.95, -20.96],
        rot: [0, 0, 0],
        size: [4.6, 2.0],
        tex: graffitiTexture({
          title: 'PATINTERO RUSH',
          subtitle: 'TOP 2 REGIONAL // NASA SPACE APPS',
          tag: 'CHAMPION',
          theme: 'gold',
          w: 768,
          h: 384,
        }),
      },
      {
        bldId: 'achievements-right',
        pos: [5.28, 2.95, -20.96],
        rot: [0, 0, 0],
        size: [4.6, 2.0],
        tex: graffitiTexture({
          title: 'ONE FOR ALL // 100%',
          subtitle: 'PLUS ULTRA OVERDRIVE // EAVI',
          tag: 'DEKU HERO',
          theme: 'emerald',
          w: 768,
          h: 384,
        }),
      },
      // 2. Tech & Capstone Lab (WORK) - East Front Upper Facade (wall x = -21.41) & South Side Wall (z = -1.15)
      {
        bldId: 'projects-front',
        pos: [-21.38, 5.15, -5.6],
        rot: [0, Math.PI / 2, 0],
        size: [5.2, 1.95],
        tex: graffitiTexture({
          title: 'PHISHNOT // ZERO-TRUST',
          subtitle: 'BSIT CAPSTONE // AI PHISHING DEFENSE',
          tag: 'CYBERSEC',
          theme: 'cyan',
          w: 768,
          h: 384,
        }),
      },
      {
        bldId: 'projects-side',
        pos: [-25.28, 4.1, -1.12],
        rot: [0, 0, 0],
        size: [5.0, 2.0],
        tex: graffitiTexture({
          title: 'PROJECT EAVI // 3D',
          subtitle: 'REACT THREE FIBER · WEBGL ENGINE',
          tag: 'LIVE BUILD',
          theme: 'cyan',
          w: 768,
          h: 384,
        }),
      },
      // 3. UNO-R Developer Hall (ABOUT) - West Front Upper Facade (wall x = 21.52)
      {
        bldId: 'about-front',
        pos: [21.49, 4.05, -5.6],
        rot: [0, -Math.PI / 2, 0],
        size: [4.8, 1.65],
        tex: graffitiTexture({
          title: 'UNOR BSIT // ETHAN AREX',
          subtitle: 'FULL-STACK SOFTWARE ENGINEER',
          tag: 'BACOLOD',
          theme: 'emerald',
          w: 768,
          h: 384,
        }),
      },
      // 4. Technical Arsenal Tower (STACK) - East Front Upper Facade (wall x = -20.88)
      {
        bldId: 'skills-front',
        pos: [-20.85, 4.45, 24.8],
        rot: [0, Math.PI / 2, 0],
        size: [5.2, 1.85],
        tex: graffitiTexture({
          title: 'ARSENAL // FULL STACK',
          subtitle: 'REACT · THREE.JS · PYTHON · FASTAPI',
          tag: 'CORE STACK',
          theme: 'emerald',
          w: 768,
          h: 384,
        }),
      },
      // 5. Communications Hub (CONTACT) - West Front Upper Facade (wall x = 21.65)
      {
        bldId: 'contact-front',
        pos: [21.62, 3.45, 24.8],
        rot: [0, -Math.PI / 2, 0],
        size: [4.5, 1.45],
        tex: graffitiTexture({
          title: 'TRANSMIT // CONNECT',
          subtitle: 'DIRECT INQUIRIES & COLLABORATION',
          tag: 'ONLINE 24/7',
          theme: 'cyan',
          w: 768,
          h: 384,
        }),
      },
    ];
  }, []);

  const acUnits = useMemo(
    () => [
      { pos: [-24.8, 11.0, -7.2] },
      { pos: [-28.0, 11.0, -4.0] },
      { pos: [24.8, 8.5, -6.4] },
      { pos: [-28.8, 9.75, 23.2] },
      { pos: [-24.0, 9.75, 26.4] },
      { pos: [24.8, 8.0, 23.2] },
      { pos: [-8.8, 10.5, -29.6] },
      { pos: [8.8, 10.5, -29.6] },
    ],
    []
  );

  const antennas = useMemo(
    () => [
      { pos: [-28.0, 10.6, -6.4], height: 5.5, color: '#ff2244' },
      { pos: [28.0, 8.1, -6.4], height: 5.0, color: '#00ff88' },
      { pos: [-29.6, 9.4, 28.0], height: 6.0, color: '#ff0055' },
      { pos: [0, 10.25, -36.0], height: 6.8, color: '#00e5ff' },
      { pos: [28.0, 7.75, 28.0], height: 4.8, color: '#ffd24a' },
    ],
    []
  );

  useFrame((_, dt) => {
    // Limit active simulation on low-end quality mode or when far away
    if (useStore.getState().quality === 'low') return;
    const px = playerState.pos.x;
    const pz = playerState.pos.z;
    const step = Math.min(dt, 0.1) * 10.0;

    for (let i = 0; i < acUnits.length; i++) {
      const fan = fansRef.current[i];
      if (!fan) continue;
      const ac = acUnits[i].pos;
      const d2 = (px - ac[0]) * (px - ac[0]) + (pz - ac[2]) * (pz - ac[2]);
      if (d2 < 750) {
        fan.rotation.z += step;
      }
    }
  });

  return (
    <group name="building-decorations">
      {/* 1. Flush-Mounted Wall Graffiti Murals */}
      {murals.map((m) => (
        <mesh key={m.bldId} position={m.pos} rotation={m.rot}>
          <planeGeometry args={m.size} />
          <meshStandardMaterial
            map={m.tex}
            roughness={0.62}
            metalness={0.08}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      ))}

      {/* 2. Rooftop AC Chiller Units (no shadow casting to save shadow-map draw calls) */}
      {acUnits.map((ac, idx) => (
        <group key={`ac-${idx}`} position={ac.pos}>
          <mesh position={[0, 0.45, 0]} material={acHousingMat}>
            <boxGeometry args={[1.2, 0.9, 0.9]} />
          </mesh>
          <mesh
            position={[0, 0.91, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={acGrillMat}
          >
            <ringGeometry args={[0.1, 0.38, 14]} />
          </mesh>
          <group
            ref={(el) => (fansRef.current[idx] = el)}
            position={[0, 0.92, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <mesh material={acBladeMat}>
              <boxGeometry args={[0.7, 0.08, 0.02]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={acBladeMat}>
              <boxGeometry args={[0.7, 0.08, 0.02]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 3. Rooftop Antenna Masts & Aviation Beacons */}
      {antennas.map((ant, idx) => (
        <group key={`ant-${idx}`} position={ant.pos}>
          <mesh position={[0, ant.height / 2, 0]} material={mastMat}>
            <cylinderGeometry args={[0.05, 0.11, ant.height, 6]} />
          </mesh>
          <mesh position={[0, ant.height * 0.75, 0]} material={crossbarMat}>
            <boxGeometry args={[0.75, 0.04, 0.04]} />
          </mesh>
          <mesh position={[0, ant.height * 0.5, 0]} material={crossbarMat}>
            <boxGeometry args={[1.1, 0.04, 0.04]} />
          </mesh>
          <mesh position={[0, ant.height + 0.1, 0]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshBasicMaterial color={ant.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
