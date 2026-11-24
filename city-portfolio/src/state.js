import { create } from 'zustand';
import * as THREE from 'three';
import { ownerProfile } from '../../src/data/profile';
import { skillCategories } from '../../src/data/skills';
import { featuredProjects } from '../../src/data/projects';
import { certificatesData } from '../../src/data/certificates';
import { educationTimeline } from '../../src/data/education';
import { audioService } from '../../src/services/audioService';

export {
  ownerProfile,
  skillCategories,
  certificatesData,
  educationTimeline,
  audioService,
};

// Include Project EAVI alongside existing verified projects from src/data/projects.ts
export const portfolioProjects = [
  ...featuredProjects,
  {
    id: 'project-eavi-3d-portfolio',
    indexCode: 'PRJ-07 // 3D WEBGL ARCHITECTURE',
    name: 'Project EAVI — Interactive 3D Developer Portfolio & WebGL Environment',
    shortName: 'Project EAVI (3D Portfolio)',
    category: '3D Web Development / React Three Fiber & Three.js',
    status: 'LIVE DEPLOYMENT',
    statusNote: 'Interactive 3D Third-Person & Smooth PBR Deku WebGL Portfolio',
    description:
      'An interactive 3D developer portfolio engineered for Ethan Arex V. Ilustre (EAVI) combining a playable third-person 3D town environment, skeletal-rigged Deku avatar with 100% Rage Mode bio-electric shaders, and an architectural drawing-set HUD.',
    problemStatement:
      'Standard static developer portfolios fail to demonstrate real-time 3D WebGL engineering, spatial collision systems, shader pipelines, and interactive state orchestration in a live playable context.',
    proposedSolution:
      'Built Project EAVI using React, Vite, Three.js, and React Three Fiber (@react-three/fiber, @react-three/drei) with raycast floor height detection, mouse-drag orbit camera controls, floating 3D HTML building triggers, and an interior 3D certificate gallery.',
    keyFeatures: [
      'Third-person 3D Town environment (.glb) with downward Raycaster floor height detection and building collision boxes',
      'Playable rigged 3D Deku character (/models/deku/source/fortnite_deku.glb) with camera-relative WASD movement, Spacebar jump, and 100% Rage Mode aura',
      'Mouse-drag 360° orbit camera with clamped vertical pitch and smooth scroll-wheel zoom',
      '5 interactive town buildings (ABOUT, STACK, WORK, AWARDS, CONTACT) with floating <Html> signs and auto-walk pathing',
      '3D Interior Hall of Certificates gallery with click-to-zoom frame inspection and live image upload/replace support',
    ],
    technologies: [
      'React 19',
      'Vite',
      'Three.js / WebGL',
      'React Three Fiber',
      '@react-three/drei',
      'TypeScript / ES6+',
      'Tailwind CSS',
    ],
    architectureHighlights: [
      'Raycast Floor Height & Collision Pipeline: Evaluates downward raycasts against walkable town meshes every frame so the avatar smoothly traverses curbs and plaza steps.',
      'Zero-Slop Factual Data Architecture: Directly reuses verified project, skill, certificate, and academic records without fabricated metrics.',
    ],
    githubUrl: 'https://github.com/ethanarexilustre1019-ui/my-portfolio',
    screenshots: [],
  },
];

// 5 Interactive Town Buildings arranged around the expanded 1.6x town plaza & 8.0m wide avenues
// Door coordinates are anchored directly to each building's actual GLB masonry wall plane
export const TOWN_BUILDINGS = [
  {
    id: 'achievements',
    code: '01',
    sheet: '05',
    label: 'AWARDS',
    name: 'Hall of Certificates',
    subtitle: '3D Gallery: NASA Space Apps, IBM Hackathon & Regional Top 2',
    accent: '#ffd24a',
    position: [0, 0, -29.6],
    size: [17.6, 8.4, 17.0],
    door: [0, 0.2, -21.04],
    doorRotY: 0, // Door frame faces South (+Z) toward the avenue
    enterDir: [0, -1], // Deku walks North (-Z) into the building
    signPos: [0, 4.65, -20.4],
    actionType: 'interior',
  },
  {
    id: 'projects',
    code: '02',
    sheet: '04',
    label: 'WORK',
    name: 'Software & Capstone Lab',
    subtitle: 'PhishNot, Project EAVI, NASA CLPS & Live Apps',
    accent: '#72B8FF',
    position: [-25.44, 0, -5.6],
    size: [7.84, 11.0, 8.64],
    door: [-21.47, 0.2, -5.6],
    doorRotY: Math.PI / 2, // Door frame faces East (+X) toward the West avenue
    enterDir: [-1, 0], // Deku walks West (-X) into the building
    signPos: [-20.8, 4.65, -5.6],
    actionType: 'interior',
  },
  {
    id: 'about',
    code: '03',
    sheet: '02',
    label: 'ABOUT',
    name: 'UNO-R Developer Hall',
    subtitle: 'BSIT Profile, Story & Resume',
    accent: '#00ff88',
    position: [25.68, 0, -5.6],
    size: [8.16, 7.1, 8.48],
    door: [21.57, 0.2, -5.6],
    doorRotY: -Math.PI / 2, // Door frame faces West (-X) toward the East avenue
    enterDir: [1, 0], // Deku walks East (+X) into the building
    signPos: [20.9, 4.65, -5.6],
    actionType: 'interior',
  },
  {
    id: 'skills',
    code: '04',
    sheet: '03',
    label: 'STACK',
    name: 'Technical Arsenal Tower',
    subtitle: 'Languages, Frameworks, AI & Databases',
    accent: '#00ff88',
    position: [-26.24, 0, 24.8],
    size: [12.64, 6.5, 13.6],
    door: [-19.87, 0.2, 24.8],
    doorRotY: Math.PI / 2, // Door frame faces East (+X) toward the West avenue
    enterDir: [-1, 0], // Deku walks West (-X) into the building
    signPos: [-19.2, 4.65, 24.8],
    actionType: 'interior',
  },
  {
    id: 'contact',
    code: '05',
    sheet: '07',
    label: 'CONTACT',
    name: 'Communications Hub',
    subtitle: 'Direct Email, GitHub, LinkedIn & Inquiry Form',
    accent: '#00ff88',
    position: [25.92, 0, 24.8],
    size: [8.48, 5.75, 8.96],
    door: [21.68, 0.2, 24.8],
    doorRotY: -Math.PI / 2, // Door frame faces West (-X) toward the East avenue
    enterDir: [1, 0], // Deku walks East (+X) into the building
    signPos: [21.0, 4.65, 24.8],
    actionType: 'interior',
  },
];

export const TOWN_BOUNDS = {
  minX: -41,
  maxX: 41,
  minZ: -38,
  maxZ: 36,
};

export const IS_TOUCH_DEVICE =
  typeof window !== 'undefined' &&
  (Boolean(window.matchMedia?.('(pointer: coarse)')?.matches) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0));

// Shared mutable per-frame game state (no React re-renders on 60fps tick)
export const input = {
  forward: false,
  back: false,
  left: false,
  right: false,
  joyX: 0, // Analog horizontal (-1 left .. +1 right) from mobile virtual joystick
  joyY: 0, // Analog vertical (-1 down/back .. +1 up/forward) from mobile virtual joystick
  run: false,
  jump: false,
};

export const cameraOrbit = {
  yaw: 0, // horizontal camera angle around Deku (radians; 0 = camera at +Z looking toward -Z)
  pitch: 0.18, // vertical angle above Deku (clamped 0.08 .. 1.05)
  distance: 4.6,
  isDragging: false,
};

export const nav = {
  target: null, // { x, z, via?: [{x,z}], buildingId?: string }
};

export const playerState = {
  pos: new THREE.Vector3(0, 0.22, -9.2),
  vy: 0,
  grounded: true,
  heading: Math.PI, // facing North (-Z) toward Hall of Certificates & wide main boulevard
  speed: 0,
  exitCooldown: 0,
  isDriving: false,
  drivingCarId: null,
  nearCarId: null,
  carSpeedKmh: 0,
  carGear: 'N',
};

// 3 Playable / Drivable GTA Sports & Street Cars (press [F] near car to drive, or walk/jump right over them!)
export const drivableCars = [
  {
    id: 'eavi-gt-ev',
    name: 'EAVI CYBER GT-EV',
    modelPath: '/models/city/carro_eletrico.glb',
    accent: '#00ff88',
    x: -5.4,
    y: 0.14,
    z: -10.2,
    heading: Math.PI / 2,
    speed: 0,
    steer: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    suspPitch: 0,
    suspRoll: 0,
    wheelSpin: 0,
    maxSpeed: 11.5,
  },
  {
    id: 'vice-turbo-cab',
    name: 'VICE CITY TURBO CAB',
    modelPath: '/models/city/taxi.glb',
    accent: '#ffd24a',
    x: 9.8,
    y: 0.14,
    z: -6.2,
    heading: 0,
    speed: 0,
    steer: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    suspPitch: 0,
    suspRoll: 0,
    wheelSpin: 0,
    maxSpeed: 10.8,
  },
  {
    id: 'apex-street-coupe',
    name: 'APEX NITRO COUPE',
    modelPath: '/models/city/carro.glb',
    accent: '#72B8FF',
    x: 5.4,
    y: 0.14,
    z: 10.2,
    heading: -Math.PI / 2,
    speed: 0,
    steer: 0,
    vx: 0,
    vz: 0,
    vy: 0,
    suspPitch: 0,
    suspRoll: 0,
    wheelSpin: 0,
    maxSpeed: 11.2,
  },
];

// 4 Autonomous Ambient NPC Traffic Cars cruising slowly & smoothly along the wide 8.0m avenue loops
export const npcTrafficCars = [
  {
    id: 'npc-1',
    modelPath: '/models/city/carro.glb',
    x: -13.2,
    y: 0.14,
    z: -22.0,
    heading: 0,
    speed: 3.1,
    baseSpeed: 3.1,
    vx: 0,
    vz: 0,
    vy: 0,
    wheelSpin: 0,
    wpIndex: 1,
    waypoints: [
      { x: -13.2, z: -28.5 },
      { x: -13.2, z: 28.5 },
      { x: 13.2, z: 28.5 },
      { x: 13.2, z: -28.5 },
    ],
  },
  {
    id: 'npc-2',
    modelPath: '/models/city/taxi.glb',
    x: 13.2,
    y: 0.14,
    z: 18.0,
    heading: Math.PI,
    speed: 3.2,
    baseSpeed: 3.2,
    vx: 0,
    vz: 0,
    vy: 0,
    wheelSpin: 0,
    wpIndex: 3,
    waypoints: [
      { x: -13.2, z: -28.5 },
      { x: -13.2, z: 28.5 },
      { x: 13.2, z: 28.5 },
      { x: 13.2, z: -28.5 },
    ],
  },
  {
    id: 'npc-3',
    modelPath: '/models/city/carro_eletrico.glb',
    x: -24.0,
    y: 0.14,
    z: -13.2,
    heading: Math.PI / 2,
    speed: 3.0,
    baseSpeed: 3.0,
    vx: 0,
    vz: 0,
    vy: 0,
    wheelSpin: 0,
    wpIndex: 1,
    waypoints: [
      { x: -33.0, z: -13.2 },
      { x: 33.0, z: -13.2 },
      { x: 33.0, z: 13.2 },
      { x: -33.0, z: 13.2 },
    ],
  },
  {
    id: 'npc-4',
    modelPath: '/models/city/carro.glb',
    x: 24.0,
    y: 0.14,
    z: 13.2,
    heading: -Math.PI / 2,
    speed: 2.9,
    baseSpeed: 2.9,
    vx: 0,
    vz: 0,
    vy: 0,
    wheelSpin: 0,
    wpIndex: 3,
    waypoints: [
      { x: -33.0, z: -13.2 },
      { x: 33.0, z: -13.2 },
      { x: 33.0, z: 13.2 },
      { x: -33.0, z: 13.2 },
    ],
  },
];

/**
 * Evaluates terrain/curb/planter elevation at world (x, z) for 4-wheel vehicle suspension.
 * - Expanded Asphalt Boulevards (|x| or |z| in [8.0, 16.0]): 0.12m
 * - Expanded Central Park & Sidewalks ([-8.0, 8.0] x [-8.0, 8.0]): 0.20m
 * - Central Park 4 Raised Green Planter Beds (|x| in [1.2, 7.25], |z| in [1.2, 7.25]): 0.20m -> 0.44m smooth ramp
 */
export function getSurfaceHeightAt(x, z) {
  const ax = Math.abs(x);
  const az = Math.abs(z);

  // Expanded Central Park ([-8.0, 8.0] x [-8.0, 8.0] = 16.0m x 16.0m)
  if (ax <= 8.05 && az <= 8.05) {
    // 4 Raised grass planter beds in quadrants (|x| in [1.2, 7.25], |z| in [1.2, 7.25])
    if (ax >= 1.2 && ax <= 7.25 && az >= 1.2 && az <= 7.25) {
      const edgeDist = Math.min(
        ax - 1.2,
        7.25 - ax,
        az - 1.2,
        7.25 - az
      );
      const curbRamp = Math.min(1, Math.max(0, edgeDist / 0.45));
      const mound = Math.sin(curbRamp * Math.PI * 0.5) * 0.22;
      return 0.2 + mound;
    }
    return 0.2;
  }

  // Sidewalks & building aprons outside the 8.0m wide main avenues
  const onNSRoad = (ax >= 8.0 && ax <= 16.0) || (ax >= 32.0 && ax <= 40.0);
  const onEWRoad = (az >= 8.0 && az <= 16.0) || (az >= 32.0 && az <= 40.0);
  if (!onNSRoad && !onEWRoad) {
    return 0.2;
  }

  return 0.12;
}

// Solid vertical obstacle boxes (5 showcase buildings + baked plaza benches + corner tree trunks)
// Note: Static bus removed completely; raised grass planter beds are NOT blocked so cars drive over them with suspension!
export const townCollision = {
  walkableMeshes: [],
  occluderMeshes: [],
  buildingBoxes: [
    ...TOWN_BUILDINGS.map((b) => ({
      id: b.id,
      x: b.position[0],
      z: b.position[2],
      hw: b.size[0] / 2 + 0.2,
      hd: b.size[2] / 2 + 0.2,
    })),
    // Surrounding neighborhood buildings (scaled 1.6x)
    { id: 'city_hotel_nw', x: -35.2, z: -29.6, hw: 7.0, hd: 7.0 },
    { id: 'city_shopping_ne', x: 35.2, z: -29.6, hw: 7.0, hd: 7.0 },
    { id: 'city_office_w', x: -41.6, z: -5.6, hw: 6.2, hd: 6.2 },
    { id: 'city_market_e', x: 41.6, z: -5.6, hw: 6.2, hd: 6.2 },
    // 4 Corner Park Tree Trunks inside praca.glb (at 1.6x expanded coordinates)
    { id: 'tree_nw', x: -6.4, z: -6.4, hw: 0.45, hd: 0.45 },
    { id: 'tree_ne', x: 6.4, z: -6.4, hw: 0.45, hd: 0.45 },
    { id: 'tree_sw', x: -6.4, z: 6.4, hw: 0.45, hd: 0.45 },
    { id: 'tree_se', x: 6.4, z: 6.4, hw: 0.45, hd: 0.45 },
  ],
};

const STORAGE_KEY = 'eavi-town-certificate-images';

function loadSavedImages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveImages(images) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch {
    /* ignore quota errors */
  }
}

function clearInputs() {
  input.forward = false;
  input.back = false;
  input.left = false;
  input.right = false;
  input.joyX = 0;
  input.joyY = 0;
  input.run = false;
  input.jump = false;
}

export const useStore = create((set, get) => ({
  sceneMode: 'town', // 'town' | 'interior' (3D Walkable Interior Exhibition Hall for all 5 buildings)
  interiorBuildingId: 'achievements', // 'achievements' | 'projects' | 'about' | 'skills' | 'contact'
  activeSection: 'hero', // 'hero' | 'about' | 'skills' | 'projects' | 'achievements' | 'education' | 'contact'
  activePanel: null, // null | 'about' | 'skills' | 'projects' | 'education' | 'contact'
  selectedProject: null,
  hoveredBuilding: null,
  focusFrame: null,
  modalFrame: null,
  fade: 0,
  transitioning: false,
  rageMode: false,
  soundEnabled: true,
  quality: 'balanced', // 'low' | 'balanced' | 'high'
  deviceMode: null, // null (welcome screen) | 'mobile' (phone/tablet/iPad) | 'desktop' (PC/Mac)
  classicView: false, // true = fast recruiter-friendly plain page (no 3D interaction)
  setClassicView(v) {
    clearInputs();
    set({ classicView: v });
  },
  isDriving: false,
  activeCarName: '',
  nearCarPrompt: null, // null | { id, name, accent }
  cinematic: {
    active: false,
    buildingId: null,
    phase: 'idle', // 'idle' | 'opening' | 'walking' | 'transition'
  },
  images: loadSavedImages(),

  setNearCarPrompt(prompt) {
    const cur = get().nearCarPrompt;
    if ((cur?.id || null) === (prompt?.id || null)) return;
    set({ nearCarPrompt: prompt });
  },

  toggleDrive() {
    const s = get();
    if (s.sceneMode !== 'town' || s.activePanel || s.cinematic?.active || s.transitioning) return;

    if (s.isDriving) {
      // Exit vehicle cleanly 1.65m beside the driver-side door
      const car = drivableCars.find((c) => c.id === playerState.drivingCarId);
      if (car) {
        car.speed = 0;
        const sideX = Math.cos(car.heading) * 1.65;
        const sideZ = -Math.sin(car.heading) * 1.65;
        playerState.pos.set(
          Math.max(TOWN_BOUNDS.minX, Math.min(TOWN_BOUNDS.maxX, car.x - sideX)),
          0.18,
          Math.max(TOWN_BOUNDS.minZ, Math.min(TOWN_BOUNDS.maxZ, car.z - sideZ))
        );
        playerState.heading = car.heading;
      }
      playerState.isDriving = false;
      playerState.drivingCarId = null;
      playerState.speed = 0;
      playerState.carSpeedKmh = 0;
      playerState.exitCooldown = 1.5;
      clearInputs();
      audioService.playClick();
      set({ isDriving: false, activeCarName: '' });
      return;
    }

    // Enter nearest drivable car within 4.2m
    let bestCar = null;
    let bestDist = 4.2;
    for (let i = 0; i < drivableCars.length; i++) {
      const c = drivableCars[i];
      const d = Math.hypot(playerState.pos.x - c.x, playerState.pos.z - c.z);
      if (d < bestDist) {
        bestDist = d;
        bestCar = c;
      }
    }
    if (!bestCar) return;

    nav.target = null;
    clearInputs();
    playerState.isDriving = true;
    playerState.drivingCarId = bestCar.id;
    playerState.pos.set(bestCar.x, 0.18, bestCar.z);
    playerState.heading = bestCar.heading;
    audioService.playSurgeChime();
    set({
      isDriving: true,
      activeCarName: bestCar.name,
      nearCarPrompt: null,
    });
  },

  selectDeviceMode(mode) {
    clearInputs();
    if (get().soundEnabled) {
      audioService.setEnabled(true);
    }
    audioService.playSurgeChime();
    set({ deviceMode: mode });
  },

  setQuality(quality) {
    audioService.playClick();
    set({ quality });
  },

  setHoveredBuilding(id) {
    set({ hoveredBuilding: id });
  },

  setSelectedProject(project) {
    set({ selectedProject: project });
  },

  openPanel(panelId) {
    nav.target = null;
    clearInputs();
    audioService.playClick();
    set({
      activePanel: panelId,
      activeSection: panelId || 'hero',
      selectedProject: null,
    });
  },

  closePanel() {
    const prevPanel = get().activePanel;
    if (!prevPanel) return;
    const b = TOWN_BUILDINGS.find((x) => x.id === prevPanel);
    nav.target = null;
    clearInputs();
    playerState.speed = 0;
    playerState.exitCooldown = 2.8;
    if (b) {
      // Place Deku 3.6m outside the building door on the main sidewalk/avenue facing away from the door
      playerState.pos.set(
        b.door[0] - b.enterDir[0] * 3.6,
        0.18,
        b.door[2] - b.enterDir[1] * 3.6
      );
      const outHeading = Math.atan2(-b.enterDir[0], -b.enterDir[1]);
      playerState.heading = outHeading;
      cameraOrbit.yaw = outHeading + Math.PI;
    }
    audioService.playClick();
    set({ activePanel: null, selectedProject: null, activeSection: 'hero' });
  },

  enterAwardsGallery(skipFade = false, buildingId = 'achievements') {
    const s = get();
    nav.target = null;
    clearInputs();
    audioService.playClick();

    if (skipFade) {
      cameraOrbit.yaw = 0;
      cameraOrbit.pitch = 0.14;
      set({
        sceneMode: 'interior',
        interiorBuildingId: buildingId,
        activeSection: buildingId,
        activePanel: null,
        focusFrame: null,
        modalFrame: null,
        hoveredBuilding: null,
      });
      return;
    }

    if (s.transitioning) return;
    set({ transitioning: true, fade: 1, activePanel: null, selectedProject: null });
    setTimeout(() => {
      cameraOrbit.yaw = 0;
      cameraOrbit.pitch = 0.14;
      set({
        sceneMode: 'interior',
        interiorBuildingId: buildingId,
        activeSection: buildingId,
        focusFrame: null,
        modalFrame: null,
        hoveredBuilding: null,
      });
      setTimeout(() => set({ fade: 0, transitioning: false }), 180);
    }, 420);
  },

  exitAwardsGallery() {
    const s = get();
    if (s.transitioning || s.sceneMode !== 'interior') return;
    const bldId = s.interiorBuildingId || 'achievements';
    nav.target = null;
    clearInputs();
    playerState.speed = 0;
    playerState.exitCooldown = 2.8;
    audioService.playClick();
    set({ transitioning: true, fade: 1, focusFrame: null, modalFrame: null });
    setTimeout(() => {
      // Respawn Deku 3.6m outside the exited building's door on the sidewalk facing the avenue
      const exitedBld =
        TOWN_BUILDINGS.find((b) => b.id === bldId) ||
        TOWN_BUILDINGS.find((b) => b.id === 'achievements');
      if (exitedBld) {
        playerState.pos.set(
          exitedBld.door[0] - exitedBld.enterDir[0] * 3.6,
          0.18,
          exitedBld.door[2] - exitedBld.enterDir[1] * 3.6
        );
        const outHeading = Math.atan2(-exitedBld.enterDir[0], -exitedBld.enterDir[1]);
        playerState.heading = outHeading;
        cameraOrbit.yaw = outHeading + Math.PI;
      }
      set({ sceneMode: 'town', activeSection: 'hero', hoveredBuilding: null });
      setTimeout(() => set({ fade: 0, transitioning: false }), 180);
    }, 420);
  },

  triggerBuildingArrival(buildingId) {
    const s = get();
    if (s.cinematic?.active || s.transitioning || playerState.exitCooldown > 0) return;
    const b = TOWN_BUILDINGS.find((x) => x.id === buildingId);
    if (!b) return;

    // Exit car first if arriving while driving
    if (s.isDriving) {
      get().toggleDrive();
    }

    nav.target = null;
    clearInputs();
    playerState.speed = 0;
    playerState.exitCooldown = 2.8;

    // Align Deku 1.3m directly in front of the flush doorway facing straight into the 3D entrance lobby
    playerState.pos.set(
      b.door[0] - b.enterDir[0] * 1.3,
      playerState.pos.y,
      b.door[2] - b.enterDir[1] * 1.3
    );
    playerState.heading = Math.atan2(b.enterDir[0], b.enterDir[1]);

    // Start cinematic door-opening cutscene
    set({
      hoveredBuilding: null,
      cinematic: {
        active: true,
        buildingId,
        phase: 'opening',
      },
    });

    audioService.playDoorOpen();

    // Stage 1: Door slides open (0.0s - 0.6s)
    // Stage 2: Deku walks forward into the 3D lit entrance lobby (0.6s - 1.4s)
    setTimeout(() => {
      set((state) => ({
        cinematic: { ...state.cinematic, phase: 'walking' },
      }));
    }, 600);

    // Stage 3: Smooth transition fade into the building's 3D Walkable Interior Exhibition Hall
    setTimeout(() => {
      set({ fade: 1, transitioning: true });
      setTimeout(() => {
        playerState.speed = 0;
        playerState.exitCooldown = 2.8;
        set({
          cinematic: { active: false, buildingId: null, phase: 'idle' },
        });
        // Every building transitions into its dedicated 3D Interior Exhibition Hall with giant engraved 3D Wall Portraits!
        get().enterAwardsGallery(true, b.id);
        setTimeout(() => set({ fade: 0, transitioning: false }), 220);
      }, 340);
    }, 1400);
  },

  openFrame(frame) {
    nav.target = null;
    clearInputs();
    audioService.playClick();
    set({ focusFrame: frame, modalFrame: frame });
  },

  closeFrameModal() {
    audioService.playClick();
    set({ focusFrame: null, modalFrame: null });
  },

  toggleRageMode() {
    const next = !get().rageMode;
    set({ rageMode: next });
    if (!get().soundEnabled) {
      set({ soundEnabled: true });
      audioService.setEnabled(true);
    }
    if (next) {
      audioService.playRageModeSound();
    } else {
      audioService.playNormalModeSound();
    }
  },

  toggleSound() {
    const next = !get().soundEnabled;
    set({ soundEnabled: next });
    audioService.setEnabled(next);
  },

  setImage(id, dataUrl) {
    const images = { ...get().images, [id]: dataUrl };
    saveImages(images);
    set({ images });
  },

  clearImage(id) {
    const images = { ...get().images };
    delete images[id];
    saveImages(images);
    set({ images });
  },
}));

/**
 * Auto-walk Deku to a building's entrance door along the actual town avenues and crosswalks
 * (x = ±7.5, z = ±7.5) so Deku never cuts through central plaza trees, benches, or building corners.
 */
export function walkToBuilding(buildingId, immediateOpen = false) {
  const store = useStore.getState();

  if (buildingId === 'hero') {
    if (store.sceneMode === 'interior') {
      store.exitAwardsGallery();
    }
    store.closePanel();
    useStore.setState({ activeSection: 'hero' });
    nav.target = { x: 0, z: -9.2, via: [] };
    return;
  }

  const resolvedId = buildingId === 'education' ? 'about' : buildingId;
  const b = TOWN_BUILDINGS.find((x) => x.id === resolvedId);
  if (!b) return;

  if (store.sceneMode === 'interior') {
    if (store.interiorBuildingId === b.id) return;
    store.enterAwardsGallery(false, b.id);
    return;
  }

  if (store.activePanel) {
    store.closePanel();
  }
  playerState.exitCooldown = 0;
  useStore.setState({ activeSection: b.id });

  if (immediateOpen) {
    store.triggerBuildingArrival(b.id);
    return;
  }

  // Destination approach point 1.3m directly in front of the flush building door
  const destX = b.door[0] - b.enterDir[0] * 1.3;
  const destZ = b.door[2] - b.enterDir[1] * 1.3;

  const p = playerState.pos;
  const via = [];

  // Route cleanly along the expanded 8.0m main avenues (z = -12.0 North avenue, x = ±12.0 West/East avenues)
  if (b.id === 'achievements') {
    if (p.z > -8.5) {
      const laneX = p.x < -3 ? -12.0 : p.x > 3 ? 12.0 : 0;
      if (laneX !== 0) {
        via.push({ x: laneX, z: p.z });
        via.push({ x: laneX, z: -12.0 });
      }
      via.push({ x: 0, z: -12.0 });
    }
  } else {
    const sideAveX = b.position[0] < 0 ? -12.0 : 12.0;
    if (Math.sign(p.x) !== Math.sign(sideAveX) || Math.abs(p.x) < 8.2) {
      const crossZ = p.z > 6 ? 12.0 : -12.0;
      via.push({ x: p.x, z: crossZ });
      via.push({ x: sideAveX, z: crossZ });
    }
    if (Math.abs(p.z - destZ) > 3.5) {
      via.push({ x: sideAveX, z: destZ });
    }
  }

  nav.target = {
    x: destX,
    z: destZ,
    via,
    buildingId: b.id,
  };
}
