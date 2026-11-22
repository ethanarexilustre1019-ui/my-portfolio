import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  TOWN_BOUNDS,
  drivableCars,
  getSurfaceHeightAt,
  npcTrafficCars,
  playerState,
  useStore,
} from '../state';
import { ArticulatedWheel, stripBakedTiresFromEscuro } from './VehicleSystem';

const wrapAngle = (a) => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

const NPC_WHEEL_OFFSETS = [
  { key: 'fl', x: -0.45, y: 0.2, z: 0.62, isFront: true },
  { key: 'fr', x: 0.45, y: 0.2, z: 0.62, isFront: true },
  { key: 'rl', x: -0.45, y: 0.2, z: -0.62, isFront: false },
  { key: 'rr', x: 0.45, y: 0.2, z: -0.62, isFront: false },
];

function NpcCarMesh({ npcConfig, registerRef }) {
  const { scene } = useGLTF(npcConfig.modelPath);
  const groupRef = useRef();
  const wheelSpinRefs = useRef({});

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((ch) => {
      if (ch.isMesh) {
        const matName = (ch.material?.name || '').toLowerCase();
        if (matName === 'metal') {
          ch.visible = false;
          return;
        }
        if (matName === 'escuro') {
          stripBakedTiresFromEscuro(ch);
        }
        ch.castShadow = false;
        ch.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  useLayoutEffect(() => {
    registerRef(npcConfig.id, {
      group: groupRef.current,
      wheelSpin: wheelSpinRefs.current,
    });
  }, [npcConfig.id, registerRef]);

  return (
    <group
      ref={groupRef}
      position={[npcConfig.x, 0.14, npcConfig.z]}
      rotation={[0, npcConfig.heading, 0]}
    >
      {/* Rotate inner GLB by Math.PI so front headlights face +Z forward */}
      <primitive object={cloned} scale={2.35} rotation={[0, Math.PI, 0]} />
      {NPC_WHEEL_OFFSETS.map((w) => (
        <ArticulatedWheel
          key={w.key}
          offset={w}
          accent="#8FA198"
          setSteerRef={null}
          setSpinRef={(el) => (wheelSpinRefs.current[w.key] = el)}
        />
      ))}
    </group>
  );
}

/**
 * TrafficManager
 * Spawns autonomous NPC traffic cars along the town avenues with forward obstacle detection,
 * 4 spinning 3D wheels, suspension bounce, and collision knockback when bumped.
 */
export default function TrafficManager() {
  const npcRefs = useRef({});

  const registerRef = (id, refs) => {
    npcRefs.current[id] = refs;
  };

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    if (useStore.getState().quality === 'low') return;

    const px = playerState.pos.x;
    const pz = playerState.pos.z;

    for (let i = 0; i < npcTrafficCars.length; i++) {
      const npc = npcTrafficCars[i];
      const wps = npc.waypoints;
      const wp = wps[npc.wpIndex];

      const dx = wp.x - npc.x;
      const dz = wp.z - npc.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 1.2) {
        npc.wpIndex = (npc.wpIndex + 1) % wps.length;
        continue;
      }

      const desiredHeading = Math.atan2(dx, dz);
      const diff = wrapAngle(desiredHeading - npc.heading);
      npc.heading += diff * Math.min(1, dt * 6.5);

      const fwdX = Math.sin(npc.heading);
      const fwdZ = Math.cos(npc.heading);

      // Forward obstacle check against player, drivable cars, and other NPC cars
      let blocked = false;
      const checkObstacle = (ox, oz, minDist) => {
        const odx = ox - npc.x;
        const odz = oz - npc.z;
        const fwdDot = odx * fwdX + odz * fwdZ;
        if (fwdDot > 0.3 && fwdDot < minDist) {
          const latDist = Math.abs(odx * fwdZ - odz * fwdX);
          if (latDist < 1.95) return true;
        }
        return false;
      };

      if (checkObstacle(px, pz, 4.4)) {
        blocked = true;
      }
      if (!blocked) {
        for (let k = 0; k < drivableCars.length; k++) {
          if (checkObstacle(drivableCars[k].x, drivableCars[k].z, 4.6)) {
            blocked = true;
            break;
          }
        }
      }
      if (!blocked) {
        for (let k = 0; k < npcTrafficCars.length; k++) {
          if (k === i) continue;
          if (checkObstacle(npcTrafficCars[k].x, npcTrafficCars[k].z, 4.4)) {
            blocked = true;
            break;
          }
        }
      }

      const targetSpd = blocked ? 0 : npc.baseSpeed;
      npc.speed = THREE.MathUtils.lerp(
        npc.speed,
        targetSpd,
        dt * (blocked ? 10.0 : 3.5)
      );

      const prevX = npc.x;
      const prevZ = npc.z;

      npc.x += (fwdX * npc.speed + (npc.vx || 0)) * dt;
      npc.z += (fwdZ * npc.speed + (npc.vz || 0)) * dt;
      npc.vx = THREE.MathUtils.lerp(npc.vx || 0, 0, dt * 5.0);
      npc.vz = THREE.MathUtils.lerp(npc.vz || 0, 0, dt * 5.0);

      npc.x = Math.max(TOWN_BOUNDS.minX, Math.min(TOWN_BOUNDS.maxX, npc.x));
      npc.z = Math.max(TOWN_BOUNDS.minZ, Math.min(TOWN_BOUNDS.maxZ, npc.z));

      // Vertical suspension over curbs
      const groundH = getSurfaceHeightAt(npc.x, npc.z);
      npc.vy = (npc.vy || 0) + ((groundH - (npc.y || 0.14)) * 120 - (npc.vy || 0) * 12) * dt;
      npc.y = Math.max(0.12, (npc.y || 0.14) + npc.vy * dt);

      const moveDist = Math.hypot(npc.x - prevX, npc.z - prevZ);
      npc.wheelSpin = (npc.wheelSpin || 0) + moveDist / 0.2;

      const refs = npcRefs.current[npc.id];
      if (refs?.group) {
        refs.group.position.set(npc.x, npc.y, npc.z);
        refs.group.rotation.y = npc.heading;
      }
      if (refs?.wheelSpin) {
        for (let k = 0; k < NPC_WHEEL_OFFSETS.length; k++) {
          const wNode = refs.wheelSpin[NPC_WHEEL_OFFSETS[k].key];
          if (wNode) wNode.rotation.x = npc.wheelSpin;
        }
      }
    }
  });

  return (
    <group name="ambient-npc-traffic">
      {npcTrafficCars.map((npc) => (
        <NpcCarMesh key={npc.id} npcConfig={npc} registerRef={registerRef} />
      ))}
    </group>
  );
}
