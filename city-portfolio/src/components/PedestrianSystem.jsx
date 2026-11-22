import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { drivableCars, playerState, useStore } from '../state';

const wrapAngle = (a) => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

// Shared materials for zero GPU state duplication
const skinMat = new THREE.MeshStandardMaterial({
  color: '#f2c29b',
  roughness: 0.65,
});
const darkPantsMat = new THREE.MeshStandardMaterial({
  color: '#1e262b',
  roughness: 0.78,
});
const sneakerMat = new THREE.MeshStandardMaterial({
  color: '#f4f7f5',
  roughness: 0.5,
});
const coneOrangeMat = new THREE.MeshStandardMaterial({
  color: '#ff551a',
  roughness: 0.45,
});
const coneStripeMat = new THREE.MeshBasicMaterial({
  color: '#ffffff',
});

// 10 Active Town NPCs (Walkers & Joggers circulating around the expanded Central Park & Avenue Sidewalks)
const INITIAL_PEDESTRIANS = [
  // 1. Park Perimeter Joggers (inner park promenade loop: x = ±7.4, z = ±7.4)
  {
    id: 'ped-jogger-1',
    isJogger: true,
    shirtColor: '#00ff88',
    hairColor: '#1a201c',
    hasCap: true,
    hasBackpack: false,
    x: -7.4,
    z: -4.0,
    heading: 0,
    baseSpeed: 3.25,
    phase: 0.2,
    wpIndex: 1,
    waypoints: [
      { x: -7.4, z: -7.4 },
      { x: -7.4, z: 7.4 },
      { x: 7.4, z: 7.4 },
      { x: 7.4, z: -7.4 },
    ],
  },
  {
    id: 'ped-jogger-2',
    isJogger: true,
    shirtColor: '#ff4d6d',
    hairColor: '#3d2314',
    hasCap: true,
    hasBackpack: false,
    x: 7.4,
    z: 3.5,
    heading: Math.PI,
    baseSpeed: 3.4,
    phase: 1.7,
    wpIndex: 3,
    waypoints: [
      { x: -7.4, z: -7.4 },
      { x: -7.4, z: 7.4 },
      { x: 7.4, z: 7.4 },
      { x: 7.4, z: -7.4 },
    ],
  },
  // 2. Central Park Cross-Promenade Walkers
  {
    id: 'ped-walker-1',
    isJogger: false,
    shirtColor: '#72B8FF',
    hairColor: '#221a15',
    hasCap: false,
    hasBackpack: true,
    x: 0.6,
    z: -5.5,
    heading: 0,
    baseSpeed: 1.55,
    phase: 0.9,
    wpIndex: 1,
    waypoints: [
      { x: 0.6, z: -7.2 },
      { x: 0.6, z: 7.2 },
      { x: -7.2, z: 0.6 },
      { x: 7.2, z: 0.6 },
    ],
  },
  {
    id: 'ped-walker-2',
    isJogger: false,
    shirtColor: '#ffd24a',
    hairColor: '#181818',
    hasCap: false,
    hasBackpack: true,
    x: -3.5,
    z: -7.4,
    heading: Math.PI / 2,
    baseSpeed: 1.65,
    phase: 2.4,
    wpIndex: 3,
    waypoints: [
      { x: -7.4, z: -7.4 },
      { x: -7.4, z: 7.4 },
      { x: 7.4, z: 7.4 },
      { x: 7.4, z: -7.4 },
    ],
  },
  // 3. Outer Avenue Sidewalk Joggers & Citizens (x = ±17.4, z = ±17.4)
  {
    id: 'ped-jogger-3',
    isJogger: true,
    shirtColor: '#00e5ff',
    hairColor: '#151922',
    hasCap: true,
    hasBackpack: false,
    x: -17.4,
    z: -10.0,
    heading: 0,
    baseSpeed: 3.35,
    phase: 3.1,
    wpIndex: 1,
    waypoints: [
      { x: -17.4, z: -17.4 },
      { x: -17.4, z: 17.4 },
      { x: 17.4, z: 17.4 },
      { x: 17.4, z: -17.4 },
    ],
  },
  {
    id: 'ped-walker-3',
    isJogger: false,
    shirtColor: '#a855f7',
    hairColor: '#2a1b12',
    hasCap: false,
    hasBackpack: true,
    x: 17.4,
    z: -8.0,
    heading: 0,
    baseSpeed: 1.6,
    phase: 4.2,
    wpIndex: 2,
    waypoints: [
      { x: -17.4, z: -17.4 },
      { x: -17.4, z: 17.4 },
      { x: 17.4, z: 17.4 },
      { x: 17.4, z: -17.4 },
    ],
  },
  {
    id: 'ped-walker-4',
    isJogger: false,
    shirtColor: '#f97316',
    hairColor: '#1f1916',
    hasCap: false,
    hasBackpack: false,
    x: -8.0,
    z: -17.4,
    heading: Math.PI / 2,
    baseSpeed: 1.5,
    phase: 5.0,
    wpIndex: 3,
    waypoints: [
      { x: -17.4, z: -17.4 },
      { x: -17.4, z: 17.4 },
      { x: 17.4, z: 17.4 },
      { x: 17.4, z: -17.4 },
    ],
  },
  {
    id: 'ped-jogger-4',
    isJogger: true,
    shirtColor: '#38bdf8',
    hairColor: '#292018',
    hasCap: true,
    hasBackpack: false,
    x: 10.0,
    z: 17.4,
    heading: -Math.PI / 2,
    baseSpeed: 3.5,
    phase: 1.1,
    wpIndex: 1,
    waypoints: [
      { x: 17.4, z: 17.4 },
      { x: -17.4, z: 17.4 },
      { x: -17.4, z: -17.4 },
      { x: 17.4, z: -17.4 },
    ],
  },
];

// Bruno Simon–inspired Physics-Reactive 3D Roadside Traffic Cones (knockable with cars or on foot!)
const INITIAL_CONES = [
  { id: 'cone-1', x: -7.2, z: -9.8, homeX: -7.2, homeZ: -9.8 },
  { id: 'cone-2', x: -3.6, z: -9.8, homeX: -3.6, homeZ: -9.8 },
  { id: 'cone-3', x: 9.4, z: -8.0, homeX: 9.4, homeZ: -8.0 },
  { id: 'cone-4', x: 9.4, z: -4.4, homeX: 9.4, homeZ: -4.4 },
  { id: 'cone-5', x: 3.6, z: 9.8, homeX: 3.6, homeZ: 9.8 },
  { id: 'cone-6', x: 7.2, z: 9.8, homeX: 7.2, homeZ: 9.8 },
];

function PedestrianAvatar({ config, registerRef }) {
  const rootRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const lArmRef = useRef();
  const rArmRef = useRef();
  const lForearmRef = useRef();
  const rForearmRef = useRef();
  const lLegRef = useRef();
  const rLegRef = useRef();
  const lShinRef = useRef();
  const rShinRef = useRef();

  const shirtMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.shirtColor,
        roughness: 0.55,
        metalness: 0.1,
      }),
    [config.shirtColor]
  );

  const hairMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: config.hairColor,
        roughness: 0.7,
      }),
    [config.hairColor]
  );

  useLayoutEffect(() => {
    registerRef(config.id, {
      root: rootRef.current,
      body: bodyRef.current,
      head: headRef.current,
      lArm: lArmRef.current,
      rArm: rArmRef.current,
      lForearm: lForearmRef.current,
      rForearm: rForearmRef.current,
      lLeg: lLegRef.current,
      rLeg: rLegRef.current,
      lShin: lShinRef.current,
      rShin: rShinRef.current,
    });
  }, [config.id, registerRef]);

  return (
    <group ref={rootRef} position={[config.x, 0.2, config.z]} rotation={[0, config.heading, 0]}>
      {/* Ground Soft Shadow Disk */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.26, 14]} />
        <meshBasicMaterial color="#050807" transparent opacity={0.35} />
      </mesh>

      {/* Articulated Humanoid Body Root ( ~1.08m tall ) */}
      <group ref={bodyRef}>
        {/* Torso / Jacket */}
        <mesh position={[0, 0.66, 0]} material={shirtMat} castShadow>
          <boxGeometry args={[0.3, 0.38, 0.18]} />
        </mesh>

        {/* Optional Student/Dev Backpack */}
        {config.hasBackpack && (
          <mesh position={[0, 0.67, -0.13]} material={darkPantsMat}>
            <boxGeometry args={[0.23, 0.28, 0.1]} />
          </mesh>
        )}

        {/* Head & Hair / Jogger Visor Cap */}
        <group ref={headRef} position={[0, 0.96, 0]}>
          <mesh material={skinMat} castShadow>
            <boxGeometry args={[0.21, 0.22, 0.21]} />
          </mesh>
          {/* Hair Crown */}
          <mesh position={[0, 0.09, -0.01]} material={hairMat}>
            <boxGeometry args={[0.225, 0.08, 0.225]} />
          </mesh>
          {/* Sport Visor Cap for Joggers */}
          {config.hasCap && (
            <mesh position={[0, 0.07, 0.07]} material={shirtMat}>
              <boxGeometry args={[0.22, 0.04, 0.18]} />
            </mesh>
          )}
        </group>

        {/* Left Arm & Forearm */}
        <group ref={lArmRef} position={[-0.2, 0.81, 0]}>
          <mesh position={[0, -0.11, 0]} material={shirtMat}>
            <boxGeometry args={[0.09, 0.22, 0.09]} />
          </mesh>
          <group ref={lForearmRef} position={[0, -0.21, 0]}>
            <mesh position={[0, -0.1, 0]} material={skinMat}>
              <boxGeometry args={[0.078, 0.2, 0.078]} />
            </mesh>
          </group>
        </group>

        {/* Right Arm & Forearm */}
        <group ref={rArmRef} position={[0.2, 0.81, 0]}>
          <mesh position={[0, -0.11, 0]} material={shirtMat}>
            <boxGeometry args={[0.09, 0.22, 0.09]} />
          </mesh>
          <group ref={rForearmRef} position={[0, -0.21, 0]}>
            <mesh position={[0, -0.1, 0]} material={skinMat}>
              <boxGeometry args={[0.078, 0.2, 0.078]} />
            </mesh>
          </group>
        </group>

        {/* Left Thigh, Knee & Sneaker */}
        <group ref={lLegRef} position={[-0.085, 0.47, 0]}>
          <mesh position={[0, -0.12, 0]} material={darkPantsMat}>
            <boxGeometry args={[0.11, 0.24, 0.11]} />
          </mesh>
          <group ref={lShinRef} position={[0, -0.23, 0]}>
            <mesh position={[0, -0.11, 0]} material={darkPantsMat}>
              <boxGeometry args={[0.095, 0.22, 0.095]} />
            </mesh>
            <mesh position={[0, -0.21, 0.025]} material={sneakerMat}>
              <boxGeometry args={[0.1, 0.06, 0.15]} />
            </mesh>
          </group>
        </group>

        {/* Right Thigh, Knee & Sneaker */}
        <group ref={rLegRef} position={[0.085, 0.47, 0]}>
          <mesh position={[0, -0.12, 0]} material={darkPantsMat}>
            <boxGeometry args={[0.11, 0.24, 0.11]} />
          </mesh>
          <group ref={rShinRef} position={[0, -0.23, 0]}>
            <mesh position={[0, -0.11, 0]} material={darkPantsMat}>
              <boxGeometry args={[0.095, 0.22, 0.095]} />
            </mesh>
            <mesh position={[0, -0.21, 0.025]} material={sneakerMat}>
              <boxGeometry args={[0.1, 0.06, 0.15]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/**
 * PedestrianSystem
 * - Populates the active town sidewalks & expanded Central Park with walking citizens and energetic joggers
 * - Includes Bruno Simon-inspired knockable 3D roadside traffic cones that fly and tumble on impact
 */
export default function PedestrianSystem() {
  const pedRefs = useRef({});
  const coneRefs = useRef({});

  const pedState = useMemo(
    () =>
      INITIAL_PEDESTRIANS.map((p) => ({
        ...p,
        speed: p.baseSpeed,
      })),
    []
  );

  const coneState = useMemo(
    () =>
      INITIAL_CONES.map((c) => ({
        ...c,
        y: 0.16,
        vx: 0,
        vy: 0,
        vz: 0,
        rotX: 0,
        rotZ: 0,
        vRotX: 0,
        vRotZ: 0,
      })),
    []
  );

  const registerPedRef = (id, refs) => {
    pedRefs.current[id] = refs;
  };

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const quality = useStore.getState().quality;
    const px = playerState.pos.x;
    const pz = playerState.pos.z;
    const t = state.clock.elapsedTime;

    // 1. Update Active Walking & Jogging NPCs
    const activeCount = quality === 'low' ? 4 : pedState.length;
    for (let i = 0; i < pedState.length; i++) {
      const ped = pedState[i];
      const refs = pedRefs.current[ped.id];
      if (!refs?.root) continue;

      if (i >= activeCount) {
        refs.root.visible = false;
        continue;
      }
      refs.root.visible = true;

      const wp = ped.waypoints[ped.wpIndex];
      const dx = wp.x - ped.x;
      const dz = wp.z - ped.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.65) {
        ped.wpIndex = (ped.wpIndex + 1) % ped.waypoints.length;
        continue;
      }

      const desiredHeading = Math.atan2(dx, dz);
      const diff = wrapAngle(desiredHeading - ped.heading);
      ped.heading += diff * Math.min(1, dt * 8.0);

      // Pause & look toward Deku if player stands right in front of the pedestrian
      const pdx = px - ped.x;
      const pdz = pz - ped.z;
      const pDist = Math.hypot(pdx, pdz);
      const fwdX = Math.sin(ped.heading);
      const fwdZ = Math.cos(ped.heading);
      const playerInFront = pDist < 1.85 && pdx * fwdX + pdz * fwdZ > 0.25;

      const targetSpeed = playerInFront ? 0 : ped.baseSpeed;
      ped.speed = THREE.MathUtils.lerp(ped.speed, targetSpeed, dt * 7.5);

      ped.x += fwdX * ped.speed * dt;
      ped.z += fwdZ * ped.speed * dt;

      refs.root.position.set(ped.x, 0.2, ped.z);
      refs.root.rotation.y = ped.heading;

      // Biomechanical Walk vs. Jog Limb Animation
      const strideFreq = ped.isJogger ? 3.5 : 2.8;
      ped.phase += ped.speed * dt * strideFreq;
      const p = ped.phase;
      const moveWeight = Math.min(1, ped.speed / Math.max(0.1, ped.baseSpeed));

      const legAmp = (ped.isJogger ? 0.72 : 0.46) * moveWeight;
      const lThigh = Math.sin(p) * legAmp;
      const rThigh = -Math.sin(p) * legAmp;

      const kneeAmp = (ped.isJogger ? 0.95 : 0.55) * moveWeight;
      const lKnee = Math.max(0, -Math.sin(p - 0.45)) * kneeAmp;
      const rKnee = Math.max(0, Math.sin(p - 0.45)) * kneeAmp;

      if (refs.lLeg) refs.lLeg.rotation.x = -lThigh;
      if (refs.rLeg) refs.rLeg.rotation.x = -rThigh;
      if (refs.lShin) refs.lShin.rotation.x = lKnee;
      if (refs.rShin) refs.rShin.rotation.x = rKnee;

      const armAmp = (ped.isJogger ? 0.68 : 0.42) * moveWeight;
      const lArmSwing = -Math.sin(p) * armAmp;
      const rArmSwing = Math.sin(p) * armAmp;
      const baseElbow = ped.isJogger ? -1.15 : -0.25;

      if (refs.lArm) refs.lArm.rotation.x = -lArmSwing;
      if (refs.rArm) refs.rArm.rotation.x = -rArmSwing;
      if (refs.lForearm) refs.lForearm.rotation.x = baseElbow - Math.max(0, lArmSwing) * 0.35;
      if (refs.rForearm) refs.rForearm.rotation.x = baseElbow - Math.max(0, rArmSwing) * 0.35;

      if (refs.body) {
        const bounce = Math.abs(Math.cos(p)) * (ped.isJogger ? 0.055 : 0.028) * moveWeight;
        refs.body.position.y = bounce;
        refs.body.rotation.x = (ped.isJogger ? 0.14 : 0.04) * moveWeight;
        refs.body.rotation.y = -Math.sin(p) * 0.07 * moveWeight;
      }

      if (refs.head) {
        if (playerInFront) {
          const lookAngle = wrapAngle(Math.atan2(pdx, pdz) - ped.heading);
          refs.head.rotation.y = THREE.MathUtils.clamp(lookAngle, -0.65, 0.65);
        } else {
          refs.head.rotation.y = Math.sin(t * 0.8 + i) * 0.12;
        }
      }
    }

    // 2. Update Knockable 3D Traffic Cones (Bruno Simon-style interactive world props)
    for (let i = 0; i < coneState.length; i++) {
      const c = coneState[i];
      const mesh = coneRefs.current[c.id];
      if (!mesh) continue;

      // Check impact against Deku or any drivable car
      const hitSources = [{ x: px, z: pz, r: playerState.isDriving ? 1.25 : 0.55, spd: Math.max(3.5, playerState.speed) }];
      for (let k = 0; k < drivableCars.length; k++) {
        const dc = drivableCars[k];
        if (Math.abs(dc.vx || 0) + Math.abs(dc.vz || 0) > 0.2) {
          hitSources.push({ x: dc.x, z: dc.z, r: 1.2, spd: 5.0 });
        }
      }

      for (let s = 0; s < hitSources.length; s++) {
        const src = hitSources[s];
        const cdx = c.x - src.x;
        const cdz = c.z - src.z;
        const cDist = Math.hypot(cdx, cdz);
        if (cDist < src.r && cDist > 1e-4) {
          c.vx = (cdx / cDist) * src.spd * 1.15;
          c.vz = (cdz / cDist) * src.spd * 1.15;
          c.vy = 3.2;
          c.vRotX = (Math.random() - 0.5) * 14;
          c.vRotZ = (Math.random() - 0.5) * 14;
        }
      }

      if (Math.abs(c.vx) > 0.01 || Math.abs(c.vz) > 0.01 || c.y > 0.165 || Math.abs(c.vy) > 0.01) {
        c.x += c.vx * dt;
        c.z += c.vz * dt;
        c.vy -= 14.0 * dt;
        c.y += c.vy * dt;
        c.rotX += c.vRotX * dt;
        c.rotZ += c.vRotZ * dt;

        if (c.y <= 0.16) {
          c.y = 0.16;
          c.vy = Math.abs(c.vy) > 0.8 ? -c.vy * 0.35 : 0;
          c.vx *= 0.86;
          c.vz *= 0.86;
          c.vRotX *= 0.82;
          c.vRotZ *= 0.82;
        }

        mesh.position.set(c.x, c.y, c.z);
        mesh.rotation.set(c.rotX, 0, c.rotZ);
      }
    }
  });

  return (
    <group name="active-town-pedestrians-and-props">
      {pedState.map((ped) => (
        <PedestrianAvatar
          key={ped.id}
          config={ped}
          registerRef={registerPedRef}
        />
      ))}

      {/* Physics-Knockable 3D Traffic Cones */}
      {coneState.map((c) => (
        <group
          key={c.id}
          ref={(el) => (coneRefs.current[c.id] = el)}
          position={[c.x, c.y, c.z]}
        >
          <mesh position={[0, 0.02, 0]} material={darkPantsMat}>
            <boxGeometry args={[0.32, 0.04, 0.32]} />
          </mesh>
          <mesh position={[0, 0.24, 0]} material={coneOrangeMat} castShadow>
            <coneGeometry args={[0.13, 0.44, 10]} />
          </mesh>
          <mesh position={[0, 0.26, 0]} material={coneStripeMat}>
            <cylinderGeometry args={[0.06, 0.09, 0.1, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
