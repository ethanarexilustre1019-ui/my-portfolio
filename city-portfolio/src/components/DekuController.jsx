import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  TOWN_BOUNDS,
  TOWN_BUILDINGS,
  cameraOrbit,
  drivableCars,
  input,
  nav,
  npcTrafficCars,
  playerState,
  townCollision,
  useStore,
} from '../state';

/**
 * Computes the 3D climbable hood / roof / trunk elevation when Deku walks or jumps OVER a car
 * instead of blocking Deku with an invisible wall.
 */
function getCarClimbSurfaceY(pos, car, hw = 0.66, hl = 1.28) {
  const dx = pos.x - car.x;
  const dz = pos.z - car.z;
  if (dx * dx + dz * dz > 3.6) return -1;

  const cos = Math.cos(car.heading);
  const sin = Math.sin(car.heading);

  const localR = Math.abs(dx * cos - dz * sin);
  const localF = dx * sin + dz * cos;
  const absF = Math.abs(localF);

  if (localR > hw || absF > hl) return -1;

  // Smooth lateral edge taper so stepping on from the side door or bumper ramps up cleanly
  const sideRamp = Math.min(1, (hw - localR) / 0.16);
  const baseCarY = car.y || 0.14;

  // Longitudinal car silhouette:
  // |localF| <= 0.42: Cabin roof (0.94m above car base)
  // |localF| in (0.42, 0.85]: Windshield / rear window slope (0.56m -> 0.94m)
  // |localF| in (0.85, 1.28]: Front hood / rear trunk & bumper ramp (0.18m -> 0.56m)
  let profileH = 0.94;
  if (absF > 0.85) {
    const t = Math.max(0, (hl - absF) / (hl - 0.85));
    profileH = 0.18 + t * 0.38;
  } else if (absF > 0.42) {
    const t = (0.85 - absF) / (0.85 - 0.42);
    profileH = 0.56 + t * 0.38;
  }

  return baseCarY + profileH * sideRamp;
}

const wrapAngle = (a) => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

const downRaycaster = new THREE.Raycaster();
const rayOrigin = new THREE.Vector3();
const rayDown = new THREE.Vector3(0, -1, 0);

const camRayOrigin = new THREE.Vector3();
const camRayDir = new THREE.Vector3();

const targetQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler(0, 0, 0, 'YXZ');
const armEuler = new THREE.Euler(0, 0, 0, 'ZXY');
const deltaQuat = new THREE.Quaternion();

const FINGER_NAMES = [
  'indexfinger',
  'middlefinger',
  'ringfinger',
  'littlefinger',
];

/**
 * DekuController (GTA-Style Third-Person Character & Chase Camera Controller)
 * - Calibrated 1.15m character height to align realistically with the town vehicles, benches, and doors
 * - Mathematically verified inverse-bind-matrix skeletal rig:
 *   - Knees (`L_knee`, `R_knee`) bend backward with `rx > 0` + sibling `L_knee_EX` / `R_knee_EX` harmony
 *   - Ankles (`L_ankle`, `R_ankle`) flex through heel-strike and toe-off
 *   - Arms (`L_arm`, `R_arm`) use `'ZXY'` Euler order so `rz` lowers arms cleanly and `rx` swings purely forward/back
 *   - Fingers (`L_*finger` with `rz < 0`, `R_*finger` with `rz > 0`, `rx = 0, ry = 0`) curl straight into the palms
 * - Supports On-Foot vs. Driving state machine (`playerState.isDriving`) with vehicle chase camera
 */
export default function DekuController({
  mode = 'town',
  spawn = { x: 0, z: -9.2, heading: Math.PI },
  bounds = TOWN_BOUNDS,
  colliders = null,
  onDoorThreshold = null,
}) {
  const { camera, gl, size } = useThree();
  const rootRef = useRef();
  const bodyBounceRef = useRef();
  const auraRingsRef = useRef([]);

  const { scene, animations } = useGLTF('/models/deku/source/fortnite_deku.glb');
  useAnimations(animations, rootRef);

  const bonesRef = useRef({});
  const matsRef = useRef({ eyes: [], hair: [], suit: [] });
  const animRef = useRef({
    walkPhase: 0,
    walkWeight: 0,
    currentSpeed: 0,
    turnRate: 0,
    landingRecovery: 0,
    arrivalCooldown: 0,
    wasInAir: false,
    lastRayX: 9999,
    lastRayZ: 9999,
    cachedFloorY: 0.12,
  });
  const camTargetRef = useRef({
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    currentLook: new THREE.Vector3(),
    initialized: false,
  });

  // Realistic 1.15m height proportioned to the town cars (~0.98m taxi roof) & doors (2.2m)
  const modelInfo = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const targetHeight = 1.15;
    const scale = size.y > 0.01 ? targetHeight / size.y : 1.0;
    const offsetY = -box.min.y * scale;
    return { scale, offsetY };
  }, [scene]);

  useLayoutEffect(() => {
    const bones = {};
    const restQuats = {};
    const eyes = [];
    const hair = [];
    const suit = [];

    scene.traverse((child) => {
      if (child.name) {
        const baseName = child.name.replace(/_0?\d+_\d+$/, '');
        if (!child.userData.restQuat) {
          child.userData.restQuat = child.quaternion.clone();
        }
        bones[child.name] = child;
        bones[baseName] = child;
        restQuats[child.name] = child.userData.restQuat.clone();
        restQuats[baseName] = child.userData.restQuat.clone();
      }

      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;

        if (child.geometry && !child.geometry.userData.normalsComputed) {
          child.geometry.computeVertexNormals();
          child.geometry.userData.normalsComputed = true;
        }

        const oldMat = Array.isArray(child.material) ? child.material[0] : child.material;
        if (oldMat && !oldMat.userData?.upgradedForTown) {
          const matName = oldMat.name || '';
          const map = oldMat.map || null;
          if (map) {
            map.colorSpace = THREE.SRGBColorSpace;
          }

          const isEye = matName === 'dummy_material_3' || matName === 'dummy_material_5';
          const isHair = matName === 'dummy_material_2';
          const isOutline =
            matName.toLowerCase().includes('outline') || oldMat.side === THREE.BackSide;

          if (isOutline) {
            child.visible = false;
          } else {
            const newMat = new THREE.MeshStandardMaterial({
              name: matName,
              map,
              color: oldMat.color ? oldMat.color.clone() : new THREE.Color(0xffffff),
              roughness: isEye ? 0.15 : isHair ? 0.42 : 0.44,
              metalness: isEye ? 0.02 : 0.1,
              emissive: new THREE.Color(isEye ? 0xffffff : 0x00ff88),
              emissiveMap: isEye ? map : null,
              emissiveIntensity: isEye ? 0.35 : 0.0,
            });
            newMat.userData.upgradedForTown = true;
            child.material = newMat;

            if (isEye) eyes.push(newMat);
            else if (isHair) hair.push(newMat);
            else suit.push(newMat);
          }
        }
      }
    });

    bonesRef.current = { bones, restQuats };
    matsRef.current = { eyes, hair, suit };
  }, [scene]);

  useLayoutEffect(() => {
    if (mode === 'interior') {
      playerState.pos.set(spawn.x, 0.08, spawn.z);
      playerState.heading = spawn.heading;
    } else if (playerState.pos.lengthSq() < 0.01) {
      playerState.pos.set(spawn.x, 0.18, spawn.z);
      playerState.heading = spawn.heading;
    }
    playerState.vy = 0;
    playerState.grounded = true;
    animRef.current.lastRayX = 9999;
    if (rootRef.current) {
      rootRef.current.position.copy(playerState.pos);
      rootRef.current.rotation.y = playerState.heading;
    }
    camTargetRef.current.initialized = false;
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Multi-Touch & Mouse Orbit Camera (tracks per-pointerId so left-thumb joystick + right-thumb camera look work simultaneously!) + Pinch / Scroll Zoom
  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const activePointers = new Map();
    let prevPinchDist = null;
    let movedMax = 0;

    const getPinchDistance = () => {
      if (activePointers.size < 2) return null;
      const pts = Array.from(activePointers.values());
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    };

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) return;
      activePointers.set(e.pointerId, {
        x: e.clientX,
        y: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
      });
      if (activePointers.size === 2) {
        prevPinchDist = getPinchDistance();
        cameraOrbit.isDragging = true;
      } else if (activePointers.size === 1) {
        movedMax = 0;
        cameraOrbit.isDragging = false;
      }
    };

    const onPointerMove = (e) => {
      const entry = activePointers.get(e.pointerId);
      if (!entry) return;

      const dx = e.clientX - entry.x;
      const dy = e.clientY - entry.y;
      entry.x = e.clientX;
      entry.y = e.clientY;

      if (activePointers.size === 2) {
        const curPinch = getPinchDistance();
        if (curPinch !== null && prevPinchDist !== null) {
          const delta = prevPinchDist - curPinch;
          cameraOrbit.distance = THREE.MathUtils.clamp(
            cameraOrbit.distance + delta * 0.018,
            2.6,
            11.5
          );
        }
        prevPinchDist = curPinch;
        cameraOrbit.isDragging = true;
        return;
      }

      movedMax = Math.max(
        movedMax,
        Math.hypot(e.clientX - entry.startX, e.clientY - entry.startY)
      );
      if (movedMax > 6) {
        cameraOrbit.isDragging = true;
      }

      const sensitivity = e.pointerType === 'touch' ? 0.008 : 0.0065;
      cameraOrbit.yaw -= dx * sensitivity;
      cameraOrbit.pitch = THREE.MathUtils.clamp(
        cameraOrbit.pitch + dy * (sensitivity * 0.8),
        0.08,
        1.05
      );
    };

    const onPointerUp = (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        prevPinchDist = null;
      }
      if (activePointers.size === 0) {
        setTimeout(() => {
          cameraOrbit.isDragging = false;
        }, 45);
      }
    };

    const onWheel = (e) => {
      cameraOrbit.distance = THREE.MathUtils.clamp(
        cameraOrbit.distance + e.deltaY * 0.004,
        2.6,
        11.5
      );
    };

    const onContextMenu = (e) => e.preventDefault();

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: true });
    dom.addEventListener('contextmenu', onContextMenu);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
    };
  }, [gl]);

  useFrame((state, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1);
    const store = useStore.getState();
    const cinematic = store.cinematic;
    const locked =
      !store.deviceMode ||
      store.transitioning ||
      Boolean(store.activePanel) ||
      Boolean(store.focusFrame) ||
      cinematic?.active;
    const st = playerState;
    const anim = animRef.current;

    if (st.exitCooldown > 0 && !locked) {
      st.exitCooldown = Math.max(0, st.exitCooldown - dt);
    }
    if (anim.arrivalCooldown > 0 && !locked) {
      anim.arrivalCooldown = Math.max(0, anim.arrivalCooldown - dt);
    }
    if (anim.landingRecovery > 0) {
      anim.landingRecovery = Math.max(0, anim.landingRecovery - dt);
    }

    // Hide Deku avatar mesh while inside a drivable vehicle cockpit
    if (rootRef.current) {
      rootRef.current.visible = !st.isDriving;
    }

    let targetSpeed = 0;
    let targetHeading = st.heading;
    let activeMoveDirX = 0;
    let activeMoveDirZ = 0;
    let isManualMoving = false;

    if (!st.isDriving) {
      if (cinematic?.active) {
        const b = TOWN_BUILDINGS.find((x) => x.id === cinematic.buildingId);
        if (b) {
          const [dirX, dirZ] = b.enterDir;
          targetHeading = Math.atan2(dirX, dirZ);

          if (cinematic.phase === 'opening') {
            targetSpeed = 0;
            anim.currentSpeed = 0;
          } else if (cinematic.phase === 'walking') {
            targetSpeed = 0.85;
            anim.currentSpeed = 0.85;
            st.pos.x += dirX * targetSpeed * dt;
            st.pos.z += dirZ * targetSpeed * dt;
          }
        }
      } else if (!locked) {
        const keyFwd = (input.forward ? 1 : 0) - (input.back ? 1 : 0);
        const keyStrafe = (input.right ? 1 : 0) - (input.left ? 1 : 0);
        const fwdInput = Math.abs(input.joyY) > 0.08 ? input.joyY : keyFwd;
        const strafeInput = Math.abs(input.joyX) > 0.08 ? input.joyX : keyStrafe;
        const inputMag = Math.min(1, Math.hypot(fwdInput, strafeInput));

        if (inputMag > 0.08) {
          nav.target = null;
          isManualMoving = true;
        }

        if (input.jump && st.grounded && anim.landingRecovery <= 0.05) {
          st.vy = 8.2;
          st.grounded = false;
          anim.wasInAir = true;
          input.jump = false;
        }

        if (nav.target) {
          const t = nav.target;
          const wp = t.via && t.via.length > 0 ? t.via[0] : t;
          const dx = wp.x - st.pos.x;
          const dz = wp.z - st.pos.z;
          const dist = Math.hypot(dx, dz);

          if (t.via && t.via.length > 0 && dist < 0.75) {
            t.via.shift();
          } else if (dist < 0.55) {
            const finished = nav.target;
            nav.target = null;
            anim.currentSpeed = 0;
            st.speed = 0;
            if (finished.buildingId) {
              anim.arrivalCooldown = 2.4;
              store.triggerBuildingArrival(finished.buildingId);
            } else if (finished.exit) {
              store.exitAwardsGallery();
            }
          } else {
            targetHeading = Math.atan2(dx, dz);
            targetSpeed = input.run || store.rageMode ? 9.4 : 6.2;
            const step = Math.min(dist, targetSpeed * dt);
            st.pos.x += (dx / dist) * step;
            st.pos.z += (dz / dist) * step;
            anim.currentSpeed = targetSpeed;
          }
        } else if (isManualMoving) {
          const camYaw = cameraOrbit.yaw;
          const rawX = -Math.sin(camYaw) * fwdInput + Math.cos(camYaw) * strafeInput;
          const rawZ = -Math.cos(camYaw) * fwdInput - Math.sin(camYaw) * strafeInput;
          const len = Math.hypot(rawX, rawZ) || 1;
          activeMoveDirX = rawX / len;
          activeMoveDirZ = rawZ / len;

          targetHeading = Math.atan2(activeMoveDirX, activeMoveDirZ);
          const baseMoveSpeed = input.run || store.rageMode ? 9.0 : 5.8;
          targetSpeed = baseMoveSpeed * Math.max(0.35, inputMag);

          anim.currentSpeed = THREE.MathUtils.lerp(anim.currentSpeed, targetSpeed, dt * 9.5);
          st.pos.x += activeMoveDirX * anim.currentSpeed * dt;
          st.pos.z += activeMoveDirZ * anim.currentSpeed * dt;
        } else {
          anim.currentSpeed = THREE.MathUtils.lerp(anim.currentSpeed, 0, dt * 15.0);
          if (anim.currentSpeed < 0.05) anim.currentSpeed = 0;
        }
      } else {
        anim.currentSpeed = 0;
      }

      const horizSpeed = Math.max(
        targetSpeed > 0 ? anim.currentSpeed || targetSpeed : anim.currentSpeed,
        0
      );
      st.speed = horizSpeed;

      // Smooth turn banking & heading interpolation
      let headingDiff = 0;
      if (horizSpeed > 0.1 || cinematic?.active) {
        headingDiff = wrapAngle(targetHeading - st.heading);
        st.heading += headingDiff * Math.min(1, dt * 14.0);
      }
      anim.turnRate = THREE.MathUtils.lerp(anim.turnRate, headingDiff, dt * 10.0);

      tempEuler.set(0, st.heading, 0);
      targetQuat.setFromEuler(tempEuler);
      if (rootRef.current) {
        rootRef.current.quaternion.slerp(targetQuat, Math.min(1, dt * 16.0));
      }

      // Building, Vehicle & Plaza Planter Collision Resolution
      if (!cinematic?.active) {
        const activeBoxes =
          colliders !== null ? colliders : townCollision.buildingBoxes;
        const radius = 0.42;
        for (let i = 0; i < activeBoxes.length; i++) {
          const c = activeBoxes[i];
          const cx = Math.max(c.x - c.hw, Math.min(st.pos.x, c.x + c.hw));
          const cz = Math.max(c.z - c.hd, Math.min(st.pos.z, c.z + c.hd));
          const dx = st.pos.x - cx;
          const dz = st.pos.z - cz;
          const d2 = dx * dx + dz * dz;
          if (d2 < radius * radius) {
            if (d2 > 1e-6) {
              const d = Math.sqrt(d2);
              st.pos.x = cx + (dx / d) * radius;
              st.pos.z = cz + (dz / d) * radius;
            } else {
              const px = c.hw - Math.abs(st.pos.x - c.x);
              const pz = c.hd - Math.abs(st.pos.z - c.z);
              if (px < pz) {
                st.pos.x = c.x + (Math.sign(st.pos.x - c.x) || 1) * (c.hw + radius);
              } else {
                st.pos.z = c.z + (Math.sign(st.pos.z - c.z) || 1) * (c.hd + radius);
              }
            }
          }
        }
      }

      // Clamp to Town / Room Bounds
      st.pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, st.pos.x));
      st.pos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, st.pos.z));

      // Throttled Downward Raycaster Floor Height Detection
      let floorY = mode === 'interior' ? 0.02 : anim.cachedFloorY;
      if (mode === 'town' && townCollision.walkableMeshes.length > 0) {
        const moved2 =
          (st.pos.x - anim.lastRayX) * (st.pos.x - anim.lastRayX) +
          (st.pos.z - anim.lastRayZ) * (st.pos.z - anim.lastRayZ);
        if (moved2 > 0.032) {
          anim.lastRayX = st.pos.x;
          anim.lastRayZ = st.pos.z;
          rayOrigin.set(st.pos.x, st.pos.y + 2.5, st.pos.z);
          downRaycaster.set(rayOrigin, rayDown);
          downRaycaster.far = 6.0;
          const hits = downRaycaster.intersectObjects(
            townCollision.walkableMeshes,
            false
          );
          if (hits.length > 0) {
            for (let i = 0; i < hits.length; i++) {
              const hy = hits[i].point.y;
              if (hy <= 0.65) {
                floorY = hy;
                anim.cachedFloorY = hy;
                break;
              }
            }
          }
        }
      }

      // Allow Deku to walk, climb, or jump directly OVER any parked or moving car (hood -> roof -> trunk)
      if (mode === 'town') {
        for (let i = 0; i < drivableCars.length; i++) {
          const carTopY = getCarClimbSurfaceY(st.pos, drivableCars[i], 0.66, 1.28);
          if (carTopY > floorY) floorY = carTopY;
        }
        for (let i = 0; i < npcTrafficCars.length; i++) {
          const npcTopY = getCarClimbSurfaceY(st.pos, npcTrafficCars[i], 0.64, 1.24);
          if (npcTopY > floorY) floorY = npcTopY;
        }
      }

      // Gravity, Vertical Jump, Car-Roof Climbing & Landing Impact Recovery
      if (!st.grounded || st.pos.y > floorY + 0.04) {
        st.vy -= 22.0 * dt;
        st.pos.y += st.vy * dt;
        anim.wasInAir = true;
        if (st.pos.y <= floorY) {
          st.pos.y = floorY;
          st.vy = 0;
          st.grounded = true;
          if (anim.wasInAir) {
            anim.landingRecovery = 0.22;
            anim.wasInAir = false;
          }
        }
      } else {
        st.pos.y = THREE.MathUtils.lerp(st.pos.y, floorY, Math.min(1, dt * 18.0));
        st.vy = 0;
        st.grounded = true;
      }

      // Manual WASD Doorway Trigger: ONLY fires when actively pressing WASD toward the doorway & exitCooldown === 0
      if (
        mode === 'town' &&
        !locked &&
        !nav.target &&
        isManualMoving &&
        st.exitCooldown <= 0 &&
        anim.arrivalCooldown <= 0
      ) {
        for (let i = 0; i < TOWN_BUILDINGS.length; i++) {
          const b = TOWN_BUILDINGS[i];
          const padX = b.door[0] - b.enterDir[0] * 1.45;
          const padZ = b.door[2] - b.enterDir[1] * 1.45;
          const dDoor = Math.hypot(st.pos.x - padX, st.pos.z - padZ);
          const dotTowardDoor =
            activeMoveDirX * b.enterDir[0] + activeMoveDirZ * b.enterDir[1];
          if (dDoor < 1.15 && dotTowardDoor > 0.25) {
            anim.arrivalCooldown = 2.5;
            store.triggerBuildingArrival(b.id);
            break;
          }
        }
      }

      if (mode === 'interior' && !locked && onDoorThreshold && isManualMoving) {
        onDoorThreshold(st.pos);
      }

      // -----------------------------------------------------------------------
      // Mathematically Verified Skeletal Animation Rig (Hands, Arms, Legs, Knees, Ankles)
      // -----------------------------------------------------------------------
      const isMoving = horizSpeed > 0.12;
      const isSprinting =
        (input.run && horizSpeed > 0.5) || (store.rageMode && horizSpeed > 0.5);
      anim.walkWeight += ((isMoving ? 1 : 0) - anim.walkWeight) * Math.min(1, dt * 11);
      const strideFreq = isSprinting ? 3.2 : 2.6;
      anim.walkPhase += horizSpeed * dt * strideFreq;

      const w = anim.walkWeight;
      const p = anim.walkPhase;
      const t = state.clock.elapsedTime;
      const isRage = store.rageMode;
      const airFactor = st.grounded ? 0 : 1;
      const landingCompression = Math.max(0, anim.landingRecovery / 0.22);
      const idleWeight = 1.0 - w;

      const { bones, restQuats } = bonesRef.current;
      if (bones && restQuats) {
        const applyBoneRot = (name, rx, ry, rz) => {
          const b = bones[name];
          const rq = restQuats[name];
          if (!b || !rq) return;
          tempEuler.set(rx, ry, rz, 'XYZ');
          deltaQuat.setFromEuler(tempEuler);
          b.quaternion.copy(rq).multiply(deltaQuat);
        };

        // 1. Thighs (`L_leg`, `R_leg`) & Hip Volume Helpers (`L_leg_EX`, `R_leg_EX`)
        const strideAmp = isSprinting ? 0.68 : 0.52;
        const lThigh = Math.sin(p) * strideAmp * w - airFactor * 0.38;
        const rThigh = -Math.sin(p) * strideAmp * w - airFactor * 0.2;
        applyBoneRot('L_leg', lThigh, 0, 0);
        applyBoneRot('R_leg', rThigh, 0, 0);

        // 2. Knees (`L_knee`, `R_knee` have +Local Z = BACKWARD, so POSITIVE rx > 0 bends knee backward!)
        const kneeAmp = isSprinting ? 1.05 : 0.78;
        const lKneeBend =
          Math.max(0, -Math.sin(p - 0.5)) * kneeAmp * w +
          (1 - Math.cos(p)) * 0.1 * w +
          airFactor * 0.55 +
          landingCompression * 0.35;
        const rKneeBend =
          Math.max(0, Math.sin(p - 0.5)) * kneeAmp * w +
          (1 + Math.cos(p)) * 0.1 * w +
          airFactor * 0.35 +
          landingCompression * 0.35;
        applyBoneRot('L_knee', lKneeBend, 0, 0);
        applyBoneRot('R_knee', rKneeBend, 0, 0);
        // Sibling knee volume helpers (`L_knee_EX`, `R_knee_EX` have unflipped Z, so negative rx matches backward bend)
        applyBoneRot('L_knee_EX', -lKneeBend * 0.45, 0, 0);
        applyBoneRot('R_knee_EX', -rKneeBend * 0.45, 0, 0);

        // 3. Ankles & Feet (`L_ankle`, `R_ankle`) heel-strike and toe-off flexion
        const lAnkle = -lKneeBend * 0.32 + Math.cos(p) * 0.22 * w;
        const rAnkle = -rKneeBend * 0.32 - Math.cos(p) * 0.22 * w;
        applyBoneRot('L_ankle', lAnkle, 0, 0);
        applyBoneRot('R_ankle', rAnkle, 0, 0);

        // 4. GTA 5/6 Lifelike Idle Breathing, Hip Weight Shift & Natural Walk Counter-Rotation
        const breath =
          Math.sin(t * 1.6) * 0.055 * idleWeight +
          (isSprinting ? Math.sin(t * 3.5) * 0.04 : 0);
        const weightShift = Math.sin(t * 0.55);
        const hipSway = weightShift * 0.06 * idleWeight;

        const sprintLean = isSprinting ? 0.2 : 0.08;
        applyBoneRot(
          'chest',
          breath + w * sprintLean + landingCompression * 0.14,
          -Math.sin(p) * 0.08 * w - hipSway * 0.35,
          Math.cos(p) * 0.04 * w - hipSway * 0.4
        );
        applyBoneRot(
          'waist',
          w * 0.04,
          Math.sin(p) * 0.07 * w + hipSway * 0.65,
          -Math.cos(p) * 0.035 * w + hipSway * 0.75
        );

        const idleGlanceYaw = Math.sin(t * 0.38) * 0.18 * idleWeight;
        const idleGlancePitch = Math.sin(t * 0.75) * 0.05 * idleWeight;
        applyBoneRot(
          'head',
          -w * 0.06 + idleGlancePitch + Math.sin(t * 1.5) * 0.018,
          idleGlanceYaw,
          0
        );
        applyBoneRot('jaw_A', isRage ? 0.35 + Math.sin(t * 24) * 0.04 : 0, 0, 0);
        applyBoneRot('AC_goggles', breath * 0.18, 0, 0);

        // 5. Shoulders, Arms (`'ZXY'` Euler Order so `rz` lowers arm first, then `rx` swings purely forward/back!)
        const armSwingAmp = isSprinting ? 0.68 : 0.46;
        // When Left Leg swings forward (sin(p) > 0), Left Arm swings backward (-sin(p)) and Right Arm swings forward (+sin(p))
        const lArmForward = -Math.sin(p) * armSwingAmp * w;
        const rArmForward = Math.sin(p) * armSwingAmp * w;
        const jumpLift = airFactor * 0.32;
        const idleArmBreath = Math.sin(t * 1.6) * 0.03 * idleWeight;

        if (bones['L_collar']) {
          bones['L_collar'].rotation.set(0, 0, -Math.PI * 0.56 + jumpLift * 0.18);
        }
        if (bones['R_collar']) {
          bones['R_collar'].rotation.set(0, 0, Math.PI * 0.56 - jumpLift * 0.18);
        }

        if (bones['L_arm']) {
          armEuler.set(
            0.05 + lArmForward + jumpLift * 0.35,
            0,
            -0.84 - idleArmBreath,
            'ZXY'
          );
          bones['L_arm'].quaternion.setFromEuler(armEuler);
        }
        if (bones['R_arm']) {
          armEuler.set(
            0.05 + rArmForward + jumpLift * 0.35,
            0,
            0.84 + idleArmBreath,
            'ZXY'
          );
          bones['R_arm'].quaternion.setFromEuler(armEuler);
        }

        if (bones['L_arm_EX']) {
          bones['L_arm_EX'].rotation.set(0.03, 0, -0.56);
        }
        if (bones['R_arm_EX']) {
          bones['R_arm_EX'].rotation.set(0.03, 0, 0.56);
        }

        // Elbows (`rx > 0` bends both Left and Right forearms purely forward toward +Local Z!)
        const lElbowBend =
          0.22 +
          Math.max(0, lArmForward) * 0.55 +
          (isSprinting ? 0.38 : 0) +
          jumpLift * 0.35;
        const rElbowBend =
          0.22 +
          Math.max(0, rArmForward) * 0.55 +
          (isSprinting ? 0.38 : 0) +
          jumpLift * 0.35;
        if (bones['L_elbow']) {
          bones['L_elbow'].rotation.set(lElbowBend, 0, 0);
        }
        if (bones['R_elbow']) {
          bones['R_elbow'].rotation.set(rElbowBend, 0, 0);
        }
        if (bones['L_elbow_EX']) {
          bones['L_elbow_EX'].rotation.set(lElbowBend * 0.5, 0, 0);
        }
        if (bones['R_elbow_EX']) {
          bones['R_elbow_EX'].rotation.set(rElbowBend * 0.5, 0, 0);
        }

        // 6. Wrists & All 30 Finger Phalanges (`L_*finger` curls into palm with `rz < 0`; `R_*finger` curls into palm with `rz > 0`)
        applyBoneRot('L_hand', 0, 0, -0.08);
        applyBoneRot('R_hand', 0, 0, 0.08);

        const fingerCurl =
          0.52 + (isSprinting || isRage ? 0.35 : 0) + Math.sin(t * 1.6) * 0.04 * idleWeight;

        for (let i = 0; i < FINGER_NAMES.length; i++) {
          const fname = FINGER_NAMES[i];
          const cascade = 1.0 + i * 0.06;
          const cA = fingerCurl * cascade;
          const cB = fingerCurl * 0.85 * cascade;
          const cC = fingerCurl * 0.65 * cascade;

          // Left fingers: rz < 0 curls +Local Y into +Local X (Left Palm), rx=0, ry=0 prevents sideways splaying!
          applyBoneRot(`L_${fname}_A`, 0, 0, -cA);
          applyBoneRot(`L_${fname}_B`, 0, 0, -cB);
          applyBoneRot(`L_${fname}_C`, 0, 0, -cC);

          // Right fingers: rz > 0 curls +Local Y into -Local X (Right Palm), rx=0, ry=0 prevents sideways splaying!
          applyBoneRot(`R_${fname}_A`, 0, 0, cA);
          applyBoneRot(`R_${fname}_B`, 0, 0, cB);
          applyBoneRot(`R_${fname}_C`, 0, 0, cC);
        }

        // Thumbs relaxed alongside index finger
        applyBoneRot('L_thumbfinger_A', 0.18, -0.25, -0.28);
        applyBoneRot('L_thumbfinger_B', 0, 0, -0.25);
        applyBoneRot('L_thumbfinger_C', 0, 0, -0.18);

        applyBoneRot('R_thumbfinger_A', 0.18, 0.25, 0.28);
        applyBoneRot('R_thumbfinger_B', 0, 0, 0.25);
        applyBoneRot('R_thumbfinger_C', 0, 0, 0.18);
      }

      // Material glow for 100% RAGE MODE
      const pulse = 0.8 + 0.2 * Math.sin(t * 20);
      matsRef.current.eyes.forEach((m) => {
        m.emissive.setHex(isRage ? 0x00ffaa : 0xffffff);
        m.emissiveIntensity = isRage ? 2.6 * pulse : 0.35;
      });
      matsRef.current.hair.forEach((m) => {
        m.emissiveIntensity = isRage ? 0.6 * pulse : 0.0;
      });
      matsRef.current.suit.forEach((m) => {
        m.emissiveIntensity = isRage ? 0.2 * pulse : 0.0;
      });

      // Vertical stride bounce, landing compression & directional turn banking
      if (bodyBounceRef.current) {
        const strideBounce = Math.abs(Math.cos(p)) * 0.048 * w;
        const landDip = landingCompression * 0.12;
        bodyBounceRef.current.position.y = modelInfo.offsetY + strideBounce - landDip;
        bodyBounceRef.current.rotation.x = w * (isSprinting ? 0.1 : 0.045);
        bodyBounceRef.current.rotation.z = THREE.MathUtils.clamp(
          -anim.turnRate * 0.28 * w,
          -0.14,
          0.14
        );
      }

      // Rage Mode Aura Rings
      for (let idx = 0; idx < auraRingsRef.current.length; idx++) {
        const ring = auraRingsRef.current[idx];
        if (!ring) continue;
        ring.visible = isRage;
        if (isRage) {
          const cycle = (t * 1.8 + idx * 0.33) % 1;
          ring.position.y = 0.15 + cycle * 1.15;
          const sc = 0.42 + Math.sin(cycle * Math.PI) * 0.38;
          ring.scale.set(sc, sc, sc);
          ring.rotation.z = t * (idx % 2 === 0 ? 4 : -4);
          ring.material.opacity = (1 - cycle) * 0.75;
        }
      }

      if (rootRef.current) {
        rootRef.current.position.copy(st.pos);
      }
    }

    // -------------------------------------------------------------------------
    // Dynamic GTA Camera (Responsive to Mobile Portrait, Tablet Landscape & Desktop)
    // -------------------------------------------------------------------------
    const isPortrait = size.width / Math.max(1, size.height) < 0.85;
    const isHighSpeed =
      st.isDriving ? st.speed > 7.5 : (input.run || store.rageMode) && st.speed > 0.5;
    const portraitFovBoost = isPortrait ? 8 : 0;
    const targetFov =
      (st.isDriving
        ? 54 + Math.min(12, st.speed * 0.55)
        : isHighSpeed
        ? 62
        : 52) + portraitFovBoost;
    if (camera.fov !== undefined && Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 6.0);
      camera.updateProjectionMatrix();
    }

    const camState = camTargetRef.current;
    const focus = store.focusFrame;

    if (focus) {
      const [fx, fy, fz] = focus.position;
      const nx = Math.sin(focus.rotY);
      const nz = Math.cos(focus.rotY);
      const focusDist = isPortrait ? 4.9 : 3.7;
      camState.pos.set(fx + nx * focusDist, fy + 0.05, fz + nz * focusDist);
      camState.look.set(fx, fy, fz);
    } else if (cinematic?.active) {
      const b = TOWN_BUILDINGS.find((x) => x.id === cinematic.buildingId);
      if (b) {
        const [dirX, dirZ] = b.enterDir;
        const rightX = -dirZ;
        const rightZ = dirX;
        camState.pos.set(
          b.door[0] - dirX * (isPortrait ? 4.2 : 3.5) + rightX * (isPortrait ? 0.3 : 0.65),
          1.32,
          b.door[2] - dirZ * (isPortrait ? 4.2 : 3.5) + rightZ * (isPortrait ? 0.3 : 0.65)
        );
        camState.look.set(
          b.door[0] + dirX * 0.45,
          1.18,
          b.door[2] + dirZ * 0.45
        );
      }
    } else if (st.isDriving) {
      // Auto-follow vehicle heading smoothly when not dragging mouse orbit
      if (!cameraOrbit.isDragging && st.speed > 0.6) {
        const desiredYaw = wrapAngle(st.heading + Math.PI);
        const yawDiff = wrapAngle(desiredYaw - cameraOrbit.yaw);
        cameraOrbit.yaw += yawDiff * Math.min(1, dt * 3.8);
      }
      const dist =
        Math.max(isPortrait ? 6.6 : 5.8, cameraOrbit.distance * 1.32) + st.speed * 0.08;
      const pitch = Math.max(0.22, cameraOrbit.pitch);
      const yaw = cameraOrbit.yaw;
      const horizDist = dist * Math.cos(pitch);
      const vertDist = dist * Math.sin(pitch) + 1.15;

      camState.pos.set(
        st.pos.x + Math.sin(yaw) * horizDist,
        Math.max(1.1, st.pos.y + vertDist),
        st.pos.z + Math.cos(yaw) * horizDist
      );
      camState.look.set(st.pos.x, st.pos.y + 0.85, st.pos.z);
    } else {
      const baseDist =
        mode === 'interior'
          ? Math.min(cameraOrbit.distance, isPortrait ? 4.4 : 3.8)
          : Math.min(cameraOrbit.distance, isPortrait ? 4.7 : 4.1);
      const dist = isHighSpeed ? baseDist * 1.12 : baseDist;
      const pitch = cameraOrbit.pitch;
      const yaw = cameraOrbit.yaw;

      const horizDist = dist * Math.cos(pitch);
      const vertDist = dist * Math.sin(pitch) + 0.92;

      const shoulderOffset = isPortrait ? 0.08 : mode === 'interior' ? 0.16 : 0.28;
      const shoulderX = Math.cos(yaw) * shoulderOffset;
      const shoulderZ = -Math.sin(yaw) * shoulderOffset;

      const headBob = Math.sin(anim.walkPhase * 2) * 0.025 * anim.walkWeight;
      const landingImpulse = Math.max(0, anim.landingRecovery / 0.22) * 0.09;

      let targetCamX = st.pos.x + Math.sin(yaw) * horizDist + shoulderX;
      let targetCamY = Math.max(0.55, st.pos.y + vertDist + headBob);
      let targetCamZ = st.pos.z + Math.cos(yaw) * horizDist + shoulderZ;

      // Camera Wall Occlusion: pull camera forward if it would clip inside a building AABB
      camRayOrigin.set(st.pos.x, st.pos.y + 0.95, st.pos.z);
      camRayDir.set(
        targetCamX - camRayOrigin.x,
        targetCamY - camRayOrigin.y,
        targetCamZ - camRayOrigin.z
      );
      const fullCamDist = camRayDir.length();
      if (fullCamDist > 0.01) {
        camRayDir.normalize();
        const activeBoxes =
          colliders !== null ? colliders : townCollision.buildingBoxes;
        let closestHit = fullCamDist;
        for (let i = 0; i < activeBoxes.length; i++) {
          const b = activeBoxes[i];
          if (b.hw < 2.2) continue;
          const minX = b.x - b.hw;
          const maxX = b.x + b.hw;
          const minZ = b.z - b.hd;
          const maxZ = b.z + b.hd;
          if (
            targetCamX >= minX &&
            targetCamX <= maxX &&
            targetCamZ >= minZ &&
            targetCamZ <= maxZ
          ) {
            closestHit = Math.min(closestHit, fullCamDist * 0.58);
          }
        }
        if (closestHit < fullCamDist) {
          targetCamX = camRayOrigin.x + camRayDir.x * (closestHit - 0.2);
          targetCamY = camRayOrigin.y + camRayDir.y * (closestHit - 0.2);
          targetCamZ = camRayOrigin.z + camRayDir.z * (closestHit - 0.2);
        }
      }

      camState.pos.set(targetCamX, targetCamY, targetCamZ);
      camState.look.set(
        st.pos.x + shoulderX * 0.35,
        st.pos.y + 0.88 - landingImpulse,
        st.pos.z + shoulderZ * 0.35
      );
    }

    if (!camState.initialized) {
      camera.position.copy(camState.pos);
      camState.currentLook.copy(camState.look);
      camState.initialized = true;
    } else {
      const springDamping = 1 - Math.exp(-dt * (focus || cinematic?.active ? 7.5 : 9.5));
      camera.position.lerp(camState.pos, springDamping);
      camState.currentLook.lerp(camState.look, springDamping);
    }
    camera.lookAt(camState.currentLook);
  });

  return (
    <group ref={rootRef}>
      <group ref={bodyBounceRef} scale={modelInfo.scale}>
        <primitive object={scene} />
      </group>

      {/* Proportional Emerald Foot Ring & 100% Rage Mode Bio-Electric Aura Rings */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.34, 24]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {[0, 1, 2].map((idx) => (
        <mesh
          key={idx}
          ref={(el) => (auraRingsRef.current[idx] = el)}
          rotation={[Math.PI / 2, 0, 0]}
          visible={false}
        >
          <torusGeometry args={[0.48, 0.02, 8, 20]} />
          <meshBasicMaterial color="#00ffaa" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

useGLTF.preload('/models/deku/source/fortnite_deku.glb');
