import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TOWN_BUILDINGS, cameraOrbit, useStore, walkToBuilding } from '../state';

// Shared PBR materials for the Flush-Mounted 3D Entrance Lobby & Sliding Doors
const exteriorPillarMat = new THREE.MeshStandardMaterial({
  color: '#1b2420',
  metalness: 0.72,
  roughness: 0.3,
});
const lobbyWallMat = new THREE.MeshStandardMaterial({
  color: '#222d28',
  metalness: 0.25,
  roughness: 0.55,
});
const wainscotMat = new THREE.MeshStandardMaterial({
  color: '#3b2b1e',
  metalness: 0.15,
  roughness: 0.45,
});
const marbleFloorMat = new THREE.MeshStandardMaterial({
  color: '#161e1a',
  metalness: 0.45,
  roughness: 0.2,
});
const carpetMat = new THREE.MeshStandardMaterial({
  color: '#0d261c',
  roughness: 0.85,
});
const deskBodyMat = new THREE.MeshStandardMaterial({
  color: '#18221e',
  metalness: 0.5,
  roughness: 0.35,
});
const deskTopMat = new THREE.MeshStandardMaterial({
  color: '#d8cfc2',
  metalness: 0.2,
  roughness: 0.25,
});
const doorFrameLeafMat = new THREE.MeshStandardMaterial({
  color: '#151d19',
  metalness: 0.82,
  roughness: 0.25,
});
const doorGlassPaneMat = new THREE.MeshStandardMaterial({
  color: '#1b352d',
  metalness: 0.9,
  roughness: 0.12,
  transparent: true,
  opacity: 0.72,
});
const warmLightMat = new THREE.MeshBasicMaterial({
  color: '#fff4dc',
});

/**
 * DoorSystem
 * Flush-mounted directly onto each building's actual GLB masonry wall plane (`b.door`).
 * The structural pillars and roof embed 0.45m into the building wall (`z = -0.45..+0.42`)
 * so there is never any gap between the doorway and the building wall.
 */
export default function DoorSystem() {
  const doorsRef = useRef({});

  const getDoorData = (id) => {
    if (!doorsRef.current[id]) {
      doorsRef.current[id] = {
        currentOpen: 0,
        leftLeaf: null,
        rightLeaf: null,
        light: null,
      };
    }
    return doorsRef.current[id];
  };

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const cinematic = useStore.getState().cinematic;
    const activeBuildingId = cinematic?.active ? cinematic.buildingId : null;

    for (let i = 0; i < TOWN_BUILDINGS.length; i++) {
      const b = TOWN_BUILDINGS[i];
      const doorData = getDoorData(b.id);
      const isTarget = activeBuildingId === b.id;
      const targetOpen = isTarget ? 1.0 : 0.0;

      if (!isTarget && doorData.currentOpen < 0.001) {
        if (doorData.currentOpen !== 0) {
          doorData.currentOpen = 0;
          if (doorData.leftLeaf) doorData.leftLeaf.position.x = -0.48;
          if (doorData.rightLeaf) doorData.rightLeaf.position.x = 0.48;
          if (doorData.light) doorData.light.visible = false;
        }
        continue;
      }

      doorData.currentOpen = THREE.MathUtils.lerp(
        doorData.currentOpen,
        targetOpen,
        Math.min(1, dt * 7.5)
      );

      const open = doorData.currentOpen;

      if (doorData.leftLeaf) {
        doorData.leftLeaf.position.x = -0.48 - open * 0.94;
      }
      if (doorData.rightLeaf) {
        doorData.rightLeaf.position.x = 0.48 + open * 0.94;
      }
      if (doorData.light) {
        doorData.light.visible = open > 0.02;
        doorData.light.intensity = open * 12.0;
      }
    }
  });

  return (
    <group name="town-door-system">
      {TOWN_BUILDINGS.map((b) => {
        const rotY = b.doorRotY ?? 0;

        return (
          <group
            key={`door-${b.id}`}
            position={[b.door[0], 0, b.door[2]]}
            rotation={[0, rotY, 0]}
            onClick={(e) => {
              e.stopPropagation();
              if (!cameraOrbit.isDragging) walkToBuilding(b.id);
            }}
          >
            {/* =============================================================== */}
            {/* 1. FLUSH-EMBEDDED 3D LOBBY VESTIBULE (z = -0.45 to z = +0.42)   */}
            {/* =============================================================== */}
            {/* 3D Polished Marble Lobby Floor */}
            <mesh position={[0, 0.14, 0.05]} material={marbleFloorMat} receiveShadow>
              <boxGeometry args={[2.52, 0.08, 0.96]} />
            </mesh>
            {/* 3D Welcome Carpet Runner */}
            <mesh position={[0, 0.185, 0.22]} material={carpetMat} receiveShadow>
              <boxGeometry args={[1.35, 0.015, 0.56]} />
            </mesh>

            {/* 3D Coffered Canopy Roof (embeds -0.45m into building wall, projects +0.48m) */}
            <mesh position={[0, 2.36, 0.02]} material={exteriorPillarMat} castShadow>
              <boxGeometry args={[2.58, 0.18, 0.96]} />
            </mesh>
            {/* 3D Recessed Warm Ceiling Light Fixture */}
            <mesh position={[0, 2.26, 0.22]} material={warmLightMat}>
              <boxGeometry args={[1.35, 0.03, 0.18]} />
            </mesh>

            {/* 3D Left & Right Structural Side Walls (embed -0.45m into building wall so zero gap ever shows) */}
            <mesh position={[-1.18, 1.22, 0.0]} material={lobbyWallMat} castShadow>
              <boxGeometry args={[0.2, 2.15, 0.9]} />
            </mesh>
            <mesh position={[1.18, 1.22, 0.0]} material={lobbyWallMat} castShadow>
              <boxGeometry args={[0.2, 2.15, 0.9]} />
            </mesh>
            {/* Wood Wainscoting Trim */}
            <mesh position={[-1.07, 0.55, 0.2]} material={wainscotMat}>
              <boxGeometry args={[0.03, 0.72, 0.42]} />
            </mesh>
            <mesh position={[1.07, 0.55, 0.2]} material={wainscotMat}>
              <boxGeometry args={[0.03, 0.72, 0.42]} />
            </mesh>

            {/* 3D Back Lobby Wall & Inner Elevator / Archive Double Doors (at z = +0.03, right on the wall surface) */}
            <mesh position={[0, 1.22, 0.03]} material={lobbyWallMat}>
              <boxGeometry args={[2.24, 2.12, 0.04]} />
            </mesh>
            {/* Inner Archive Elevator Doors */}
            <mesh position={[-0.36, 1.12, 0.06]} material={exteriorPillarMat}>
              <boxGeometry args={[0.66, 1.82, 0.03]} />
            </mesh>
            <mesh position={[0.36, 1.12, 0.06]} material={exteriorPillarMat}>
              <boxGeometry args={[0.66, 1.82, 0.03]} />
            </mesh>
            {/* Warm 3D Sconce Lights flanking the inner elevator doors */}
            <mesh position={[-0.88, 1.52, 0.07]} material={warmLightMat}>
              <boxGeometry args={[0.08, 0.38, 0.04]} />
            </mesh>
            <mesh position={[0.88, 1.52, 0.07]} material={warmLightMat}>
              <boxGeometry args={[0.08, 0.38, 0.04]} />
            </mesh>

            {/* 3D Reception Counter & Desktop Monitor Inside the Vestibule (at z = +0.20) */}
            <group position={[0.56, 0.18, 0.2]}>
              <mesh position={[0, 0.34, 0]} material={deskBodyMat}>
                <boxGeometry args={[0.74, 0.68, 0.24]} />
              </mesh>
              <mesh position={[0, 0.7, 0.01]} material={deskTopMat}>
                <boxGeometry args={[0.8, 0.04, 0.28]} />
              </mesh>
              <mesh position={[0, 0.58, 0.13]}>
                <boxGeometry args={[0.68, 0.025, 0.015]} />
                <meshBasicMaterial color={b.accent} />
              </mesh>
              <mesh position={[-0.1, 0.86, 0]} material={exteriorPillarMat}>
                <boxGeometry args={[0.3, 0.2, 0.025]} />
              </mesh>
              <mesh position={[-0.1, 0.86, 0.016]}>
                <planeGeometry args={[0.26, 0.16]} />
                <meshBasicMaterial color={b.accent} />
              </mesh>
            </group>

            {/* =============================================================== */}
            {/* 2. FRONT PORTICO FRAME & 3D SLIDING GLASS DOORS (at z = +0.40)  */}
            {/* =============================================================== */}
            <group position={[0, 1.22, 0.4]}>
              {/* Left Front Pillar */}
              <mesh position={[-1.12, 0, -0.15]} material={exteriorPillarMat} castShadow>
                <boxGeometry args={[0.24, 2.18, 0.48]} />
              </mesh>
              {/* Right Front Pillar */}
              <mesh position={[1.12, 0, -0.15]} material={exteriorPillarMat} castShadow>
                <boxGeometry args={[0.24, 2.18, 0.48]} />
              </mesh>
              {/* Top Lintel Accent Bar */}
              <mesh position={[0, 1.14, 0.09]}>
                <boxGeometry args={[2.36, 0.07, 0.03]} />
                <meshBasicMaterial color={b.accent} />
              </mesh>

              {/* Left Sliding Glass & Steel Door Leaf */}
              <group
                ref={(el) => {
                  getDoorData(b.id).leftLeaf = el;
                }}
                position={[-0.48, -0.04, 0]}
              >
                <mesh material={doorGlassPaneMat}>
                  <boxGeometry args={[0.88, 1.94, 0.04]} />
                </mesh>
                <mesh position={[0, 0.94, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.94, 0.12, 0.06]} />
                </mesh>
                <mesh position={[0, -0.94, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.94, 0.14, 0.06]} />
                </mesh>
                <mesh position={[-0.44, 0, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.07, 1.94, 0.06]} />
                </mesh>
                <mesh position={[0.44, 0, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.07, 1.94, 0.06]} />
                </mesh>
                <mesh position={[0.35, -0.05, 0.05]}>
                  <boxGeometry args={[0.03, 0.52, 0.03]} />
                  <meshBasicMaterial color={b.accent} />
                </mesh>
              </group>

              {/* Right Sliding Glass & Steel Door Leaf */}
              <group
                ref={(el) => {
                  getDoorData(b.id).rightLeaf = el;
                }}
                position={[0.48, -0.04, 0]}
              >
                <mesh material={doorGlassPaneMat}>
                  <boxGeometry args={[0.88, 1.94, 0.04]} />
                </mesh>
                <mesh position={[0, 0.94, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.94, 0.12, 0.06]} />
                </mesh>
                <mesh position={[0, -0.94, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.94, 0.14, 0.06]} />
                </mesh>
                <mesh position={[-0.44, 0, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.07, 1.94, 0.06]} />
                </mesh>
                <mesh position={[0.44, 0, 0]} material={doorFrameLeafMat}>
                  <boxGeometry args={[0.07, 1.94, 0.06]} />
                </mesh>
                <mesh position={[-0.35, -0.05, 0.05]}>
                  <boxGeometry args={[0.03, 0.52, 0.03]} />
                  <meshBasicMaterial color={b.accent} />
                </mesh>
              </group>
            </group>

            {/* Warm 3D Interior Ceiling Light (active while doors open) */}
            <pointLight
              ref={(el) => {
                getDoorData(b.id).light = el;
              }}
              position={[0, 2.0, 0.24]}
              color="#fff2d6"
              intensity={0}
              distance={5.5}
              decay={2}
              visible={false}
            />
          </group>
        );
      })}
    </group>
  );
}
