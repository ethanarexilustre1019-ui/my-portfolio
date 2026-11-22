import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  TOWN_BOUNDS,
  drivableCars,
  getSurfaceHeightAt,
  input,
  nav,
  npcTrafficCars,
  playerState,
  townCollision,
  useStore,
} from '../state';

// Shared materials for 3D articulated wheels & rims
const tireMat = new THREE.MeshStandardMaterial({
  color: '#161a18',
  roughness: 0.78,
  metalness: 0.15,
});
const rimMat = new THREE.MeshStandardMaterial({
  color: '#d8e2dc',
  roughness: 0.25,
  metalness: 0.85,
});
const spokeMat = new THREE.MeshStandardMaterial({
  color: '#222b26',
  roughness: 0.4,
  metalness: 0.7,
});

// 4 Wheel axle offsets flush inside the car fender arches (width = ±0.47m, wheelbase = ±0.64m, radius = 0.21m)
const WHEEL_OFFSETS = [
  { key: 'fl', x: -0.47, y: 0.21, z: 0.64, isFront: true },
  { key: 'fr', x: 0.47, y: 0.21, z: 0.64, isFront: true },
  { key: 'rl', x: -0.47, y: 0.21, z: -0.64, isFront: false },
  { key: 'rr', x: 0.47, y: 0.21, z: -0.64, isFront: false },
];

/**
 * Strips the 4 static baked octagonal rubber tires from the car's `escuro` underbody primitive
 * while preserving the front/rear bumpers (|z| >= 0.40) and upper window trim (y >= 0.18).
 */
export function stripBakedTiresFromEscuro(mesh) {
  const geom = mesh.geometry;
  if (!geom) return;
  const posAttr = geom.attributes?.position;
  const idxAttr = geom.index;
  if (!posAttr || !idxAttr) return;

  const clonedGeom = geom.clone();
  const srcIndices = idxAttr.array;
  const keptIndices = [];

  for (let i = 0; i < srcIndices.length; i += 3) {
    const i0 = srcIndices[i];
    const i1 = srcIndices[i + 1];
    const i2 = srcIndices[i + 2];

    const yAvg = (posAttr.getY(i0) + posAttr.getY(i1) + posAttr.getY(i2)) / 3;
    const zAvg = (posAttr.getZ(i0) + posAttr.getZ(i1) + posAttr.getZ(i2)) / 3;
    const absZ = Math.abs(zAvg);

    // Baked tires live at |z| in [0.15, 0.38] and y < 0.18; bumpers are at |z| >= 0.40
    const isBakedTire = absZ >= 0.15 && absZ <= 0.38 && yAvg < 0.18;
    if (!isBakedTire) {
      keptIndices.push(i0, i1, i2);
    }
  }

  clonedGeom.setIndex(keptIndices);
  mesh.geometry = clonedGeom;
}

/**
 * Articulated 3D Wheel with visible multi-spoke alloy rim so wheel rotation & steering are clearly visible
 */
export function ArticulatedWheel({ offset, setSteerRef, setSpinRef, accent = '#00ff88' }) {
  return (
    <group
      ref={setSteerRef}
      position={[offset.x, offset.y, offset.z]}
    >
      <group ref={setSpinRef}>
        {/* Rubber Tire Cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={tireMat} castShadow>
          <cylinderGeometry args={[0.21, 0.21, 0.18, 18]} />
        </mesh>
        {/* Alloy Rim Hub */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={rimMat}>
          <cylinderGeometry args={[0.13, 0.13, 0.19, 14]} />
        </mesh>
        {/* Crossed Spokes (makes wheel rotation immediately visible!) */}
        <mesh material={spokeMat}>
          <boxGeometry args={[0.2, 0.23, 0.04]} />
        </mesh>
        <mesh material={spokeMat}>
          <boxGeometry args={[0.2, 0.04, 0.23]} />
        </mesh>
        {/* Center Cap Accent */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.205, 10]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
    </group>
  );
}

function DrivableCarMesh({ carConfig, registerRef }) {
  const { scene } = useGLTF(carConfig.modelPath);
  const groupRef = useRef();
  const bodyTiltRef = useRef();
  const boostLeftRef = useRef();
  const boostRightRef = useRef();
  const wheelSteerRefs = useRef({});
  const wheelSpinRefs = useRef({});
  const brakeMatsRef = useRef([]);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    const brakeMats = [];
    c.traverse((ch) => {
      if (ch.isMesh) {
        const matName = (ch.material?.name || '').toLowerCase();
        // Hide static baked hubcap primitive and strip baked octagonal rubber tires from `escuro`
        // so only our 4 articulated 3D spinning & steering wheels appear inside the wheel wells
        if (matName === 'metal') {
          ch.visible = false;
          return;
        }
        if (matName === 'escuro') {
          stripBakedTiresFromEscuro(ch);
        }
        ch.castShadow = true;
        ch.receiveShadow = true;
        if (ch.material) {
          ch.material = ch.material.clone();
          // Built-in headlights (flor_amarela) glow warmly
          if (matName === 'flor_amarela') {
            ch.material.emissive = new THREE.Color('#fff2b2');
            ch.material.emissiveIntensity = 1.4;
          }
          // Built-in rear brake lights (vermelho on taxi/EV)
          if (matName === 'vermelho' && !carConfig.modelPath.includes('carro.glb')) {
            ch.material.emissive = new THREE.Color('#ff1a35');
            ch.material.emissiveIntensity = 0.4;
            brakeMats.push(ch.material);
          }
        }
      }
    });
    brakeMatsRef.current = brakeMats;
    return c;
  }, [scene, carConfig.modelPath]);

  useLayoutEffect(() => {
    registerRef(carConfig.id, {
      group: groupRef.current,
      bodyTilt: bodyTiltRef.current,
      boostLeft: boostLeftRef.current,
      boostRight: boostRightRef.current,
      wheelSteer: wheelSteerRefs.current,
      wheelSpin: wheelSpinRefs.current,
      brakeMats: brakeMatsRef.current,
    });
  }, [carConfig.id, registerRef]);

  return (
    <group
      ref={groupRef}
      position={[carConfig.x, carConfig.y, carConfig.z]}
      rotation={[0, carConfig.heading, 0]}
      onClick={(e) => {
        e.stopPropagation();
        const d = Math.hypot(
          playerState.pos.x - carConfig.x,
          playerState.pos.z - carConfig.z
        );
        if (!playerState.isDriving) {
          if (d < 4.2) {
            useStore.getState().toggleDrive();
          } else {
            nav.target = { x: carConfig.x, z: carConfig.z, via: [] };
          }
        }
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Suspension Chassis Group (pitches & rolls over curbs/planters and on braking/turning) */}
      <group ref={bodyTiltRef}>
        {/* Rotate inner GLB by Math.PI so built-in front hood & headlights face +Z (forward movement direction) */}
        <primitive object={cloned} scale={2.45} rotation={[0, Math.PI, 0]} />

        {/* Subtle Neon Underglow */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.05, 2.15]} />
          <meshBasicMaterial
            color={carConfig.accent}
            transparent
            opacity={0.24}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Nitro Boost Exhaust Flames (at rear bumper z = -1.25) */}
        <mesh
          ref={boostLeftRef}
          position={[-0.32, 0.22, -1.32]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <coneGeometry args={[0.09, 0.55, 8]} />
          <meshBasicMaterial color="#00ffaa" transparent opacity={0.85} />
        </mesh>
        <mesh
          ref={boostRightRef}
          position={[0.32, 0.22, -1.32]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <coneGeometry args={[0.09, 0.55, 8]} />
          <meshBasicMaterial color="#00ffaa" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* 4 Articulated 3D Wheels (spin with movement & collision knockback, steer on front axle, track suspension) */}
      {WHEEL_OFFSETS.map((w) => (
        <ArticulatedWheel
          key={w.key}
          offset={w}
          accent={carConfig.accent}
          setSteerRef={(el) => (wheelSteerRefs.current[w.key] = el)}
          setSpinRef={(el) => (wheelSpinRefs.current[w.key] = el)}
        />
      ))}
    </group>
  );
}

/**
 * Updates 4-wheel terrain suspension, knockback momentum, and wheel rotation for any drivable car
 */
function updateCarSuspensionAndWheels(car, refs, dt, accelPitch = 0, steerRoll = 0, isBraking = false) {
  const cos = Math.cos(car.heading);
  const sin = Math.sin(car.heading);

  // Sample terrain / curb / planter elevation under each of the 4 wheels
  const wheelHeights = {};
  for (let i = 0; i < WHEEL_OFFSETS.length; i++) {
    const w = WHEEL_OFFSETS[i];
    const wx = car.x + w.x * cos + w.z * sin;
    const wz = car.z - w.x * sin + w.z * cos;
    wheelHeights[w.key] = getSurfaceHeightAt(wx, wz);
  }

  const hFL = wheelHeights.fl;
  const hFR = wheelHeights.fr;
  const hRL = wheelHeights.rl;
  const hRR = wheelHeights.rr;

  const avgH = (hFL + hFR + hRL + hRR) * 0.25;
  const frontH = (hFL + hFR) * 0.5;
  const rearH = (hRL + hRR) * 0.5;
  const leftH = (hFL + hRL) * 0.5;
  const rightH = (hFR + hRR) * 0.5;

  // Spring-damper vertical suspension (lifts & bounces when climbing planter beds or curbs)
  const springForce = (avgH - car.y) * 145.0;
  const dampingForce = -car.vy * 14.0;
  car.vy += (springForce + dampingForce) * dt;
  car.y += car.vy * dt;
  if (car.y < 0.11) {
    car.y = 0.11;
    car.vy = Math.max(0, car.vy);
  }

  // Terrain pitch (nose up when front wheels climb a planter/curb) + acceleration/braking pitch
  const terrainPitch = -Math.atan2(frontH - rearH, 1.4);
  const terrainRoll = Math.atan2(rightH - leftH, 1.12);

  car.suspPitch = THREE.MathUtils.lerp(
    car.suspPitch || 0,
    terrainPitch + accelPitch,
    Math.min(1, dt * 12)
  );
  car.suspRoll = THREE.MathUtils.lerp(
    car.suspRoll || 0,
    terrainRoll + steerRoll,
    Math.min(1, dt * 12)
  );

  if (refs?.group) {
    refs.group.position.set(car.x, car.y, car.z);
    refs.group.rotation.y = car.heading;
  }
  if (refs?.bodyTilt) {
    refs.bodyTilt.rotation.x = car.suspPitch;
    refs.bodyTilt.rotation.z = car.suspRoll;
  }

  // Update all 4 wheels: spin angle, front steering yaw, and per-wheel vertical suspension travel
  if (refs?.wheelSteer && refs?.wheelSpin) {
    for (let i = 0; i < WHEEL_OFFSETS.length; i++) {
      const w = WHEEL_OFFSETS[i];
      const steerNode = refs.wheelSteer[w.key];
      const spinNode = refs.wheelSpin[w.key];
      if (steerNode) {
        if (w.isFront) {
          steerNode.rotation.y = (car.steer || 0) * 0.45;
        }
        // Individual wheel suspension travel relative to car.y
        const wheelLocalY = w.y + THREE.MathUtils.clamp(wheelHeights[w.key] - car.y, -0.08, 0.14);
        steerNode.position.y = THREE.MathUtils.lerp(steerNode.position.y, wheelLocalY, Math.min(1, dt * 18));
      }
      if (spinNode) {
        spinNode.rotation.x = car.wheelSpin || 0;
      }
    }
  }

  if (refs?.brakeMats) {
    for (let i = 0; i < refs.brakeMats.length; i++) {
      refs.brakeMats[i].emissiveIntensity = isBraking ? 2.4 : 0.35;
    }
  }
}

/**
 * VehicleSystem (State Machine: On-Foot vs. Driving + 4-Wheel Suspension + Collision Knockback)
 */
export default function VehicleSystem() {
  const carRefs = useRef({});

  const registerRef = (id, refs) => {
    carRefs.current[id] = refs;
  };

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const store = useStore.getState();

    // 1. Update any non-driven cars that have residual collision knockback momentum or suspension bounce
    for (let i = 0; i < drivableCars.length; i++) {
      const c = drivableCars[i];
      if (playerState.isDriving && c.id === playerState.drivingCarId) continue;

      const refs = carRefs.current[c.id];
      const hasKnockback =
        Math.abs(c.vx || 0) > 0.01 ||
        Math.abs(c.vz || 0) > 0.01 ||
        Math.abs(c.vy || 0) > 0.01;

      // If Deku on foot bumps into this parked car, apply a subtle push & suspension jolt
      if (!playerState.isDriving) {
        const dx = c.x - playerState.pos.x;
        const dz = c.z - playerState.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 1.38 && playerState.speed > 2.5 && d > 1e-4) {
          c.vx = (c.vx || 0) + (dx / d) * 1.35;
          c.vz = (c.vz || 0) + (dz / d) * 1.35;
          c.vy = Math.max(c.vy || 0, 0.65);
        }
      }

      if (hasKnockback) {
        const prevX = c.x;
        const prevZ = c.z;
        c.x += (c.vx || 0) * dt;
        c.z += (c.vz || 0) * dt;
        c.vx = THREE.MathUtils.lerp(c.vx || 0, 0, dt * 4.5);
        c.vz = THREE.MathUtils.lerp(c.vz || 0, 0, dt * 4.5);
        if (Math.abs(c.vx) < 0.02) c.vx = 0;
        if (Math.abs(c.vz) < 0.02) c.vz = 0;

        c.x = Math.max(TOWN_BOUNDS.minX, Math.min(TOWN_BOUNDS.maxX, c.x));
        c.z = Math.max(TOWN_BOUNDS.minZ, Math.min(TOWN_BOUNDS.maxZ, c.z));

        // Spin wheels proportional to actual knockback roll distance
        const fwdX = Math.sin(c.heading);
        const fwdZ = Math.cos(c.heading);
        const signedMove = (c.x - prevX) * fwdX + (c.z - prevZ) * fwdZ;
        const totalMove = Math.hypot(c.x - prevX, c.z - prevZ);
        const rollDir = Math.abs(signedMove) > 0.001 ? Math.sign(signedMove) : 1;
        c.wheelSpin = (c.wheelSpin || 0) + (totalMove * rollDir) / 0.21;
      }

      updateCarSuspensionAndWheels(c, refs, dt, 0, 0, false);
    }

    // 2. On-Foot Proximity Check for "Press [F] to Drive" prompt
    if (!playerState.isDriving) {
      let nearest = null;
      let bestDist = 3.8;
      for (let i = 0; i < drivableCars.length; i++) {
        const c = drivableCars[i];
        const d = Math.hypot(playerState.pos.x - c.x, playerState.pos.z - c.z);
        if (d < bestDist) {
          bestDist = d;
          nearest = c;
        }
      }
      playerState.nearCarId = nearest ? nearest.id : null;
      store.setNearCarPrompt(
        nearest
          ? { id: nearest.id, name: nearest.name, accent: nearest.accent }
          : null
      );
      return;
    }

    // 3. Driving Mode: Arcade Vehicle Physics, 4-Wheel Suspension & Elastic Knockback Collisions
    const car = drivableCars.find((c) => c.id === playerState.drivingCarId);
    if (!car) return;

    const refs = carRefs.current[car.id];
    const locked =
      !store.deviceMode ||
      store.transitioning ||
      Boolean(store.activePanel) ||
      store.cinematic?.active;

    const throttle =
      !locked && (input.forward || input.joyY > 0.15)
        ? Math.max(input.forward ? 1 : 0, input.joyY)
        : 0;
    const brakeRev =
      !locked && (input.back || input.joyY < -0.18)
        ? Math.max(input.back ? 1 : 0, -input.joyY)
        : 0;
    const keySteer = (input.left ? 1 : 0) - (input.right ? 1 : 0);
    const steerInput = !locked
      ? Math.abs(input.joyX) > 0.08
        ? -input.joyX
        : keySteer
      : 0;
    const handbrake = !locked && input.jump;
    const boost = !locked && (input.run || store.rageMode);

    const topSpeed = car.maxSpeed * (boost ? 1.4 : 1.0);
    const accelRate = boost ? 18.0 : 12.0;

    if (handbrake) {
      car.speed = THREE.MathUtils.lerp(car.speed, 0, dt * 5.2);
    } else if (throttle > 0) {
      car.speed = THREE.MathUtils.lerp(
        car.speed,
        topSpeed,
        dt * (car.speed < 0 ? 8.0 : accelRate / topSpeed)
      );
    } else if (brakeRev > 0) {
      car.speed = THREE.MathUtils.lerp(
        car.speed,
        -car.maxSpeed * 0.5,
        dt * (car.speed > 0 ? 9.0 : 3.8)
      );
    } else {
      car.speed = THREE.MathUtils.lerp(car.speed, 0, dt * 2.8);
      if (Math.abs(car.speed) < 0.05) car.speed = 0;
    }

    // Speed-dependent steering & drift yaw rate
    car.steer = THREE.MathUtils.lerp(car.steer, steerInput, dt * 10.0);
    const speedFactor = Math.min(1, Math.abs(car.speed) / 1.8);
    const dirSign = car.speed >= -0.05 ? 1 : -1;
    const driftMultiplier = handbrake ? 1.45 : 1.0;
    const turnRate =
      car.steer *
      speedFactor *
      dirSign *
      driftMultiplier *
      (2.45 - Math.min(0.85, Math.abs(car.speed) / 26));

    car.heading += turnRate * dt;

    const prevX = car.x;
    const prevZ = car.z;
    const fwdX = Math.sin(car.heading);
    const fwdZ = Math.cos(car.heading);

    car.x += (fwdX * car.speed + (car.vx || 0)) * dt;
    car.z += (fwdZ * car.speed + (car.vz || 0)) * dt;
    car.vx = THREE.MathUtils.lerp(car.vx || 0, 0, dt * 6.0);
    car.vz = THREE.MathUtils.lerp(car.vz || 0, 0, dt * 6.0);

    // Building, Bench & Tree Trunk Obstacle Collision (slides smoothly along tangent so wheels keep turning!)
    const carRadius = 1.05;
    const boxes = townCollision.buildingBoxes;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      const cx = Math.max(b.x - b.hw, Math.min(car.x, b.x + b.hw));
      const cz = Math.max(b.z - b.hd, Math.min(car.z, b.z + b.hd));
      const dx = car.x - cx;
      const dz = car.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < carRadius * carRadius && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const nz = dz / d;
        car.x = cx + nx * carRadius;
        car.z = cz + nz * carRadius;
        // Project speed onto wall tangent instead of freezing so wheels keep rolling along the obstacle
        const normalDot = Math.abs(fwdX * nx + fwdZ * nz);
        car.speed *= Math.max(0.35, 1 - normalDot * 0.55);
        car.vy = Math.max(car.vy, 0.75);
      }
    }

    // Car-to-Car Dynamic Momentum & Knockback Collision (Bumping a parked car or NPC car physically pushes it!)
    const minCarSeparation = 2.05;
    for (let i = 0; i < drivableCars.length; i++) {
      const other = drivableCars[i];
      if (other.id === car.id) continue;
      const dx = car.x - other.x;
      const dz = car.z - other.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < minCarSeparation * minCarSeparation && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const overlap = minCarSeparation - d;
        const nx = dx / d;
        const nz = dz / d;
        car.x += nx * overlap * 0.55;
        car.z += nz * overlap * 0.55;
        other.x -= nx * overlap * 0.45;
        other.z -= nz * overlap * 0.45;

        // Transfer momentum impulse to the bumped car so it rolls forward and its wheels spin!
        const impactSpeed = Math.max(3.5, Math.abs(car.speed));
        other.vx = (other.vx || 0) - nx * impactSpeed * 0.9;
        other.vz = (other.vz || 0) - nz * impactSpeed * 0.9;
        other.vy = 1.45;
        car.vy = 1.05;
        car.speed *= 0.55;
      }
    }

    for (let i = 0; i < npcTrafficCars.length; i++) {
      const npc = npcTrafficCars[i];
      const dx = car.x - npc.x;
      const dz = car.z - npc.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < minCarSeparation * minCarSeparation && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        const overlap = minCarSeparation - d;
        const nx = dx / d;
        const nz = dz / d;
        car.x += nx * overlap * 0.55;
        car.z += nz * overlap * 0.55;
        npc.x -= nx * overlap * 0.45;
        npc.z -= nz * overlap * 0.45;

        const impactSpeed = Math.max(3.5, Math.abs(car.speed));
        npc.vx = (npc.vx || 0) - nx * impactSpeed * 0.95;
        npc.vz = (npc.vz || 0) - nz * impactSpeed * 0.95;
        npc.vy = 1.45;
        car.vy = 1.05;
        car.speed *= 0.55;
      }
    }

    car.x = Math.max(TOWN_BOUNDS.minX, Math.min(TOWN_BOUNDS.maxX, car.x));
    car.z = Math.max(TOWN_BOUNDS.minZ, Math.min(TOWN_BOUNDS.maxZ, car.z));

    // Wheel rotation computed from both actual displacement AND engine drive torque (wheels spin even when pushing against a wall!)
    const actualMove = Math.hypot(car.x - prevX, car.z - prevZ);
    const engineWheelSpeed = Math.abs(car.speed) * dt;
    const effectiveSpinDist = Math.max(actualMove, engineWheelSpeed * 0.75);
    car.wheelSpin = (car.wheelSpin || 0) + (effectiveSpinDist * dirSign) / 0.21;

    // Sync playerState to vehicle position for camera & minimap tracking
    playerState.pos.set(car.x, car.y, car.z);
    playerState.heading = car.heading;
    playerState.speed = Math.abs(car.speed);
    playerState.carSpeedKmh = Math.round(Math.abs(car.speed) * 6.5);
    playerState.carGear =
      car.speed < -0.35
        ? 'R'
        : Math.abs(car.speed) < 0.35
        ? 'N'
        : String(Math.min(6, Math.ceil(Math.abs(car.speed) / 2.2)));

    const accelPitch =
      (brakeRev > 0 && car.speed > 0.5 ? 0.045 : 0) - (throttle > 0 ? 0.038 : 0);
    const steerRoll = -car.steer * speedFactor * (handbrake ? 0.11 : 0.06);
    const isBraking = brakeRev > 0 || handbrake;

    updateCarSuspensionAndWheels(car, refs, dt, accelPitch, steerRoll, isBraking);

    const showBoost = boost && throttle > 0 && car.speed > 3.5;
    if (refs?.boostLeft) refs.boostLeft.visible = showBoost;
    if (refs?.boostRight) refs.boostRight.visible = showBoost;
  });

  return (
    <group name="drivable-vehicle-system">
      {drivableCars.map((c) => (
        <DrivableCarMesh key={c.id} carConfig={c} registerRef={registerRef} />
      ))}
    </group>
  );
}

useGLTF.preload('/models/city/carro_eletrico.glb');
useGLTF.preload('/models/city/taxi.glb');
useGLTF.preload('/models/city/carro.glb');
