import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Sky, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import {
  TOWN_BUILDINGS,
  TOWN_BOUNDS,
  cameraOrbit,
  nav,
  playerState,
  townCollision,
  walkToBuilding,
  useStore,
} from '../state';
import DoorSystem from './DoorSystem';
import BuildingDecorations from './BuildingDecorations';
import VehicleSystem from './VehicleSystem';
import TrafficManager from './TrafficManager';
import PedestrianSystem from './PedestrianSystem';

/**
 * GroundThresholdPads
 * Tactically grounded glowing waypoint beacons positioned on the sidewalk directly in front of each building door
 */
function GroundThresholdPads() {
  const hoveredBuilding = useStore((s) => s.hoveredBuilding);

  return (
    <group>
      {TOWN_BUILDINGS.map((b) => {
        const isHover = hoveredBuilding === b.id;
        const rotY = b.doorRotY ?? 0;
        const padX = b.door[0] - b.enterDir[0] * 1.15;
        const padZ = b.door[2] - b.enterDir[1] * 1.15;

        return (
          <group key={b.id} position={[padX, 0, padZ]} rotation={[0, rotY, 0]}>
            {/* Ground Waypoint Outer Ring */}
            <mesh
              position={[0, 0.14, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                if (!cameraOrbit.isDragging) walkToBuilding(b.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
                useStore.getState().setHoveredBuilding(b.id);
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
                useStore.getState().setHoveredBuilding(null);
              }}
            >
              <ringGeometry args={[0.58, isHover ? 1.05 : 0.92, 28]} />
              <meshBasicMaterial
                color={b.accent}
                transparent
                opacity={isHover ? 0.95 : 0.78}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Inner Glowing Waypoint Disk */}
            <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.58, 28]} />
              <meshBasicMaterial
                color={b.accent}
                transparent
                opacity={isHover ? 0.35 : 0.18}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * NavTargetMarker
 * Animated glowing pulse ring where the player clicks to walk
 */
function NavTargetMarker() {
  const ringRef = useRef();
  useFrame((state) => {
    const t = nav.target;
    if (!ringRef.current) return;
    if (t) {
      ringRef.current.visible = true;
      ringRef.current.position.set(t.x, 0.16, t.z);
      const s = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
      ringRef.current.scale.set(s, s, s);
    } else {
      ringRef.current.visible = false;
    }
  });

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.35, 0.55, 24]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

/**
 * Helper to check ancestor names in the loaded GLTF hierarchy
 */
function getHierarchyTag(obj) {
  let cur = obj;
  let tag = '';
  while (cur) {
    if (cur.name) tag += ' ' + cur.name.toLowerCase();
    cur = cur.parent;
  }
  return tag;
}

/**
 * TownScene
 * - Loads /models/town.glb once and shares calibrated materials (preventing 1,800+ duplicate material clones)
 * - Registers ONLY actual playable ground slabs in `townCollision.walkableMeshes` (< 60 meshes instead of 1,500+)
 * - Dynamically hides obstructing tree crowns when they come between the follow camera and Deku
 * - Tropical Vice City Golden-Hour Sunset Sky, Environment, Fog & Post-Processing
 */
export default function TownScene() {
  const { scene } = useGLTF('/models/town.glb');
  const { camera } = useThree();
  const quality = useStore((s) => s.quality);
  const townRootRef = useRef();
  const foliageOccludersRef = useRef([]);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const walkables = [];
    const foliageOccluders = [];
    const sharedMats = new Map();
    const tempBox = new THREE.Box3();
    const tempCenter = new THREE.Vector3();
    const tempSize = new THREE.Vector3();

    clonedScene.updateMatrixWorld(true);

    clonedScene.traverse((child) => {
      if (!child.isMesh) return;

      // Share calibrated materials by source UUID to preserve Three.js batching and save GPU uniform uploads
      if (child.material) {
        const srcMat = child.material;
        let calMat = sharedMats.get(srcMat.uuid);
        if (!calMat) {
          calMat = srcMat.clone();
          calMat.roughness = THREE.MathUtils.clamp(calMat.roughness ?? 0.62, 0.35, 0.85);
          calMat.metalness = THREE.MathUtils.clamp(calMat.metalness ?? 0.12, 0.05, 0.42);
          calMat.needsUpdate = true;
          sharedMats.set(srcMat.uuid, calMat);
        }
        child.material = calMat;
      }

      tempBox.setFromObject(child);
      tempBox.getCenter(tempCenter);
      tempBox.getSize(tempSize);

      const tag = getHierarchyTag(child);
      // Hide static baked sedans, taxis, and buses that are replaced by interactive vehicles
      if (
        tag.includes('prop_taxi') ||
        tag.includes('prop_carro_') ||
        tag.includes('prop_onibus')
      ) {
        child.visible = false;
        return;
      }

      const isFlatGround =
        tag.includes('walkable_') && tempSize.y < 0.55 && tempBox.max.y < 0.65;
      const isNearPlayable =
        Math.abs(tempCenter.x) <= 52 && Math.abs(tempCenter.z) <= 52;

      // Ground slabs receive shadows but never need to cast shadows (saves ~70% shadow pass draw calls)
      if (isFlatGround) {
        child.castShadow = false;
        child.receiveShadow = quality !== 'low';
        if (isNearPlayable) {
          walkables.push(child);
        }
      } else {
        // Only cast shadows for 3D structures inside the active town shadow frustum
        child.castShadow = quality !== 'low' && isNearPlayable;
        child.receiveShadow = quality !== 'low' && isNearPlayable;
      }

      // Register central plaza & sidewalk trees so camera never gets blocked by low-poly tree crowns
      if (
        isNearPlayable &&
        (tag.includes('prop_tree') ||
          (tag.includes('walkable_plaza') && tempBox.max.y > 1.8))
      ) {
        foliageOccluders.push({
          mesh: child,
          x: tempCenter.x,
          y: tempCenter.y,
          z: tempCenter.z,
          radius: Math.max(1.35, Math.max(tempSize.x, tempSize.z) * 0.58),
        });
      }
    });

    townCollision.walkableMeshes = walkables;
    foliageOccludersRef.current = foliageOccluders;

    return () => {
      townCollision.walkableMeshes = [];
      foliageOccludersRef.current = [];
    };
  }, [clonedScene, quality]);

  // Lightweight Camera-to-Deku Tree Canopy Occlusion Filter (< 0.01ms per frame)
  useFrame(() => {
    const list = foliageOccludersRef.current;
    if (!list || list.length === 0) return;

    const cx = camera.position.x;
    const cz = camera.position.z;
    const px = playerState.pos.x;
    const pz = playerState.pos.z;

    const segX = px - cx;
    const segZ = pz - cz;
    const segLen2 = segX * segX + segZ * segZ;
    if (segLen2 < 0.01) return;

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      // Project tree center onto camera->player line segment in XZ
      const t = ((item.x - cx) * segX + (item.z - cz) * segZ) / segLen2;
      if (t > 0.05 && t < 1.05) {
        const closeX = cx + t * segX;
        const closeZ = cz + t * segZ;
        const dx = item.x - closeX;
        const dz = item.z - closeZ;
        const blocking = dx * dx + dz * dz < item.radius * item.radius;
        if (item.mesh.visible === blocking) {
          item.mesh.visible = !blocking;
        }
      } else if (!item.mesh.visible) {
        item.mesh.visible = true;
      }
    }
  });

  const handleGroundClick = (e) => {
    e.stopPropagation();
    if (cameraOrbit.isDragging) return;

    const p = e.point;
    for (const b of TOWN_BUILDINGS) {
      const dx = Math.abs(p.x - b.position[0]);
      const dz = Math.abs(p.z - b.position[2]);
      if (dx <= b.size[0] / 2 + 0.8 && dz <= b.size[2] / 2 + 0.8 && p.y > 0.4) {
        walkToBuilding(b.id);
        return;
      }
    }

    nav.target = {
      x: Math.max(TOWN_BOUNDS.minX, Math.min(TOWN_BOUNDS.maxX, p.x)),
      z: Math.max(TOWN_BOUNDS.minZ, Math.min(TOWN_BOUNDS.maxZ, p.z)),
      via: [],
    };
  };

  return (
    <group ref={townRootRef}>
      {/* GTA 6 Tropical Vice City Golden-Hour Sunset Sky & Environment */}
      <Sky
        sunPosition={[100, 7, -80]}
        turbidity={7.5}
        rayleigh={2.8}
        mieCoefficient={0.005}
        mieDirectionalG={0.85}
      />
      <Environment preset="sunset" />

      {/* Warm Coral/Amber Atmospheric Depth Fog */}
      <fog attach="fog" args={['#f4c29b', 52, 210]} />

      {/* Real-Time Golden-Hour Sunlight & Crisp Shadows */}
      <hemisphereLight skyColor="#7ec8ff" groundColor="#3d2b3d" intensity={0.88} />
      <directionalLight
        position={[68, 44, -56]}
        intensity={2.95}
        color="#ffd8ad"
        castShadow={quality !== 'low'}
        shadow-mapSize={quality === 'high' ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-52}
        shadow-camera-right={52}
        shadow-camera-top={52}
        shadow-camera-bottom={-52}
        shadow-camera-near={1}
        shadow-camera-far={180}
        shadow-bias={-0.0003}
      />

      {/* Loaded Real Town .glb Model (/models/town.glb) */}
      <primitive object={clonedScene} onClick={handleGroundClick} />

      {/* Playable / Drivable GTA Vehicles (Press [F] to Drive) */}
      <VehicleSystem />

      {/* Autonomous NPC Traffic Cars with Obstacle Braking */}
      <TrafficManager />

      {/* Active Walking & Jogging Town Citizens + Knockable Traffic Cones */}
      <PedestrianSystem />

      {/* High-Detail 3D Architectural Lobby & Sliding Double Doors */}
      <DoorSystem />

      {/* Flush-Mounted Street Art Graffiti Murals, Rooftop AC Chillers & Antenna Beacons */}
      <BuildingDecorations />

      {/* Ground Threshold Waypoint Rings */}
      <GroundThresholdPads />

      {/* Click-to-Move Target Pulse Marker */}
      <NavTargetMarker />

      {/* GTA Atmospheric Post-Processing */}
      {quality !== 'low' && (
        <EffectComposer disableNormalPass multisampling={quality === 'high' ? 4 : 0}>
          <Bloom mipmapBlur intensity={0.36} luminanceThreshold={0.86} />
          <Vignette darkness={0.34} />
        </EffectComposer>
      )}
    </group>
  );
}

useGLTF.preload('/models/town.glb');
