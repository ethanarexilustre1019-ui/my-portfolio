import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import DekuController from './DekuController';
import {
  cameraOrbit,
  certificatesData,
  educationTimeline,
  nav,
  ownerProfile,
  portfolioProjects,
  skillCategories,
  useStore,
} from '../state';
import {
  createFrameTexture,
  exitTexture,
  loadFrameImage,
  loadImageFromSrc,
  redrawFrameTexture,
  signTexture,
  woodTexture,
} from '../textures';

const GALLERY_ROOM = {
  halfW: 10.5,
  halfD: 6.5,
  height: 6.2,
  bounds: { minX: -9.6, maxX: 9.6, minZ: -5.5, maxZ: 5.7 },
  spawn: { x: 0, z: 3.6, heading: Math.PI },
};

const BACK_Z = -6.42;
const LEFT_X = -10.42;
const RIGHT_X = 10.42;

/**
 * 1. AWARDS (Hall of Certificates) — 3D Framed Certificates & Hackathon Awards
 */
export const AWARDS_FRAMES = [
  {
    id: 'nasa-space-apps-2026',
    title: certificatesData[0]?.title || 'NASA Space Apps Challenge 2026',
    award: certificatesData[0]?.award || 'GALACTIC PROBLEM SOLVER',
    subtitle: 'Team moneymakerspy • November 14–15, 2026',
    recipientDisplay: certificatesData[0]?.recipientDisplay || 'Ethan Arex Ilustre',
    description:
      certificatesData[0]?.recognition ||
      'Outstanding participation and efforts to address challenges we face on Earth and in space with the 3D NASA CLPS Lunar Mission Browser.',
    signatory: certificatesData[0]?.signatory,
    imagePath: '/images/achievements/nasa-space-apps-2026.jpg',
    verifiedTags: ['NASA Space Apps 2026', 'Galactic Problem Solver', 'Team moneymakerspy'],
    accent: '#00ff88',
    position: [-5.9, 2.15, BACK_Z],
    rotY: 0,
    size: [4.2, 2.8],
  },
  {
    id: 'ibm-bob-hackathon-2026',
    title: certificatesData[1]?.title || 'IBM Bob 2.0 Hackathon 2026',
    award: certificatesData[1]?.award || 'CERTIFICATE OF COMPLETION',
    subtitle: 'lablab.ai / NativelyAI • September 25–27, 2026',
    recipientDisplay: 'Ethan Arex V. Ilustre (Handle: Deku Tzy)',
    recipientNote: certificatesData[1]?.recipientNote,
    certificateId: certificatesData[1]?.certificateId || 'CMULAQW2Y0213S6010KYL0U19',
    description:
      certificatesData[1]?.recognition ||
      'For outstanding performance, attendance, successfully completing and submitting an AI solution based on Codex and Antigravity in the IBM Bob 2.0 Hackathon.',
    signatory: certificatesData[1]?.signatory,
    imagePath: '/images/achievements/ibm-bob-hackathon-2026.jpg',
    verifiedTags: ['IBM Bob 2.0', 'Codex & Antigravity', 'lablab.ai'],
    accent: '#72B8FF',
    position: [0, 2.15, BACK_Z],
    rotY: 0,
    size: [4.2, 2.8],
  },
  {
    id: 'patintero-rush-regional-top2',
    title: certificatesData[2]?.title || 'Patintero Rush — Regional Competition',
    award: certificatesData[2]?.award || 'TOP 2 — REGIONAL LEVEL',
    subtitle: 'Negros Island Region, Philippines',
    recipientDisplay: 'Ethan Arex V. Ilustre & Team',
    description:
      certificatesData[2]?.recognition ||
      'Secured Top 2 at the Regional Level in the Negros Island Region, Philippines with the competitive game development project Patintero Rush.',
    verifiedTags: ['Regional Top 2', 'Negros Island Region', 'Game Development'],
    accent: '#ffd24a',
    position: [5.9, 2.15, BACK_Z],
    rotY: 0,
    size: [4.2, 2.8],
  },
  {
    id: 'unor-bsit-milestones',
    boardType: 'engraved',
    title: 'UNO-R BSIT Academic & Hackathon Milestones',
    award: 'COLLEGE OF INFORMATION TECHNOLOGY',
    statusBadge: 'VERIFIED RECORD',
    subtitle: 'University of Negros Occidental – Recoletos (Bacolod City)',
    recipientDisplay: 'Ethan Arex V. Ilustre',
    description:
      'Academic and software engineering milestones as a Third-Year Bachelor of Science in Information Technology student at UNO-R, spanning full-stack web deployments, 3D WebGL systems, and AI cybersecurity capstone development.',
    bullets: [
      'NASA International Space Apps Challenge 2026 — Galactic Problem Solver',
      'IBM Bob 2.0 Hackathon 2026 — Verified AI Solution Completion',
      'Patintero Rush — Top 2 Regional Level Placement (Negros Island Region)',
    ],
    verifiedTags: ['UNO-R BSIT', 'Bacolod / Negros Island Region', 'Software Engineering'],
    accent: '#00ff88',
    position: [LEFT_X, 2.15, -0.5],
    rotY: Math.PI / 2,
    size: [4.3, 2.85],
  },
];

/**
 * Builds the 3D Engraved Wall Portraits for all 5 buildings from real portfolio data
 */
function buildBuildingFrames(buildingId) {
  if (buildingId === 'achievements') return AWARDS_FRAMES;

  if (buildingId === 'projects') {
    const p0 = portfolioProjects[0] || {}; // PhishNot
    const pEavi =
      portfolioProjects.find((p) => p.id === 'project-eavi-3d-portfolio') ||
      portfolioProjects[1] ||
      {};
    const pLunar =
      portfolioProjects.find((p) => p.id.includes('nasa') || p.id.includes('clps')) ||
      portfolioProjects[2] ||
      {};
    const pPatintero =
      portfolioProjects.find((p) => p.id.includes('patintero')) ||
      portfolioProjects[3] ||
      {};
    const pMols =
      portfolioProjects.find((p) => p.id.includes('mols') || p.id.includes('sbat')) ||
      portfolioProjects[4] ||
      {};

    return [
      {
        id: 'work-phishnot',
        boardType: 'engraved',
        award: p0.indexCode || 'PRJ-01 // BSIT CAPSTONE PROJECT',
        statusBadge: 'DEVELOPMENT IN PROGRESS',
        title: p0.shortName || 'PhishNot — AI Zero-Trust Phishing Defense',
        subtitle: p0.category || 'Cybersecurity & AI Decision-Support System',
        description:
          p0.description ||
          'An active BSIT Capstone Project providing AI-assisted phishing detection and zero-trust decision support to help users evaluate suspicious URLs and messages.',
        bullets: (p0.keyFeatures || []).slice(0, 4),
        verifiedTags: (p0.technologies || ['Python', 'FastAPI', 'React', 'Zero-Trust AI']).slice(
          0,
          5
        ),
        githubUrl: p0.githubUrl,
        accent: '#72B8FF',
        position: [-5.9, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'work-eavi-3d',
        boardType: 'engraved',
        award: pEavi.indexCode || 'PRJ-07 // 3D WEBGL ARCHITECTURE',
        statusBadge: 'LIVE DEPLOYMENT',
        title: pEavi.shortName || 'Project EAVI — 3D Open-World Portfolio',
        subtitle: pEavi.category || 'React Three Fiber, Three.js & GLSL Shaders',
        description:
          pEavi.description ||
          'Interactive 3D third-person open-world developer portfolio featuring a playable rigged Deku avatar, 4-wheel suspension drivable vehicles, and 3D interior exhibition halls.',
        bullets: (pEavi.keyFeatures || []).slice(0, 4),
        verifiedTags: (
          pEavi.technologies || ['React 19', 'Three.js', 'React Three Fiber', 'Vite']
        ).slice(0, 5),
        githubUrl: pEavi.githubUrl,
        accent: '#00ff88',
        position: [0, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'work-nasa-clps',
        boardType: 'engraved',
        award: pLunar.indexCode || 'PRJ-02 // NASA SPACE APPS 2026',
        statusBadge: pLunar.status || 'HACKATHON BUILD',
        title: pLunar.shortName || '3D NASA CLPS Lunar Mission Browser',
        subtitle: pLunar.category || '3D Geospatial & Space Telemetry Visualization',
        description:
          pLunar.description ||
          'Interactive 3D lunar globe visualizing NASA Commercial Lunar Payload Services (CLPS) landing sites, payload manifests, and mission telemetry.',
        bullets: (pLunar.keyFeatures || []).slice(0, 4),
        verifiedTags: (
          pLunar.technologies || ['Three.js', 'React', 'NASA Open Data', 'WebGL']
        ).slice(0, 5),
        githubUrl: pLunar.githubUrl,
        accent: '#ffd24a',
        position: [5.9, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'work-patintero-rush',
        boardType: 'engraved',
        award: pPatintero.indexCode || 'PRJ-03 // REGIONAL TOP 2 AWARD',
        statusBadge: 'REGIONAL TOP 2',
        title: pPatintero.shortName || 'Patintero Rush — Regional Game Build',
        subtitle: pPatintero.category || 'Game Development / Competition Project',
        description:
          pPatintero.description ||
          'Competitive game development project inspired by the traditional Filipino street game Patintero, awarded Top 2 at the Regional Level in the Negros Island Region.',
        bullets: (pPatintero.keyFeatures || []).slice(0, 4),
        verifiedTags: (
          pPatintero.technologies || ['Game Architecture', 'Grid Collision', 'State Machine']
        ).slice(0, 5),
        githubUrl: pPatintero.githubUrl,
        accent: '#00ff88',
        position: [LEFT_X, 2.15, -0.5],
        rotY: Math.PI / 2,
        size: [4.35, 2.9],
      },
      {
        id: 'work-mols-sbat',
        boardType: 'engraved',
        award: pMols.indexCode || 'PRJ-04 // FULL-STACK SYSTEMS',
        statusBadge: pMols.status || 'VERIFIED BUILD',
        title: pMols.shortName || "Mol's Tyangge & SBAT Full-Stack Builds",
        subtitle: pMols.category || 'Full-Stack Web & Database Engineering',
        description:
          pMols.description ||
          'Production full-stack web applications engineered for retail inventory/POS management and structured academic behavior tracking.',
        bullets: (pMols.keyFeatures || []).slice(0, 4),
        verifiedTags: (
          pMols.technologies || ['Full-Stack Web', 'Relational DB', 'Authentication']
        ).slice(0, 5),
        githubUrl: pMols.githubUrl,
        accent: '#72B8FF',
        position: [RIGHT_X, 2.15, -0.5],
        rotY: -Math.PI / 2,
        size: [4.35, 2.9],
      },
    ];
  }

  if (buildingId === 'about') {
    return [
      {
        id: 'about-profile',
        boardType: 'engraved',
        award: 'SHEET 02 // DEVELOPER IDENTITY',
        statusBadge: 'BSIT-3 // UNO-R',
        title: ownerProfile.fullName || 'Ethan Arex V. Ilustre',
        subtitle: `${ownerProfile.role || 'Full-Stack & 3D Web Developer'} • ${
          ownerProfile.location || 'Negros Island Region, PH'
        }`,
        description:
          ownerProfile.bio ||
          'Third-Year Bachelor of Science in Information Technology student at the University of Negros Occidental – Recoletos (Bacolod City), focused on full-stack software engineering, 3D WebGL interactive systems, and AI cybersecurity.',
        bullets: [
          `University: ${ownerProfile.university || 'University of Negros Occidental – Recoletos'}`,
          `Program: ${ownerProfile.degree || 'BS in Information Technology (Third-Year)'}`,
          `Region: ${ownerProfile.location || 'Bacolod City, Negros Island Region, Philippines'}`,
          'Capstone Lead: PhishNot (AI-Assisted Phishing Decision-Support System)',
        ],
        verifiedTags: ['UNO-R BSIT', 'Full-Stack Dev', '3D WebGL', 'AI Cybersecurity'],
        accent: '#00ff88',
        position: [-5.9, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'about-journey',
        boardType: 'engraved',
        award: 'SHEET 06 // ENGINEERING JOURNEY',
        statusBadge: 'ACADEMIC TIMELINE',
        title: 'UNO-R BSIT & Competition Milestones',
        subtitle: 'University of Negros Occidental – Recoletos • Bacolod City',
        description:
          'Verified academic progression and competitive software engineering milestones across regional game development and international hackathons.',
        bullets: educationTimeline.map(
          (e) => `${e.period || 'UNO-R'}: ${e.title} — ${e.institution}`
        ),
        verifiedTags: ['BSIT Curriculum', 'Regional Top 2', 'NASA Space Apps', 'IBM Hackathon'],
        accent: '#ffd24a',
        position: [0, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'about-architecture',
        boardType: 'engraved',
        award: 'CORE DISCIPLINES // SYSTEM DESIGN',
        statusBadge: 'VERIFIED FOCUS',
        title: 'Engineering Pillars & Methodology',
        subtitle: 'Zero-Slop Factual Systems, Clean UI & Real-Time 3D Graphics',
        description:
          'Combines modern full-stack web engineering with hardware-accelerated Three.js/WebGL environments and practical AI decision-support architectures.',
        bullets: [
          '3D WebGL & React Three Fiber: Custom GLSL shaders, skeletal rigs & spatial physics',
          'Full-Stack Applications: React 19, TypeScript, Python FastAPI & relational databases',
          'Cybersecurity Decision Support: Zero-trust URL/message heuristic analysis (PhishNot)',
          'Competitive Prototyping: Rapid execution under 24–48hr hackathon constraints',
        ],
        verifiedTags: ['System Architecture', 'WebGL / GLSL', 'FastAPI', 'Zero-Trust'],
        accent: '#72B8FF',
        position: [5.9, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
    ];
  }

  if (buildingId === 'skills') {
    const c0 = skillCategories[0] || { title: 'Frontend & 3D WebGL', skills: [] };
    const c1 = skillCategories[1] || { title: 'Backend & Databases', skills: [] };
    const c2 = skillCategories[2] || { title: 'AI, Security & Tooling', skills: [] };
    const c3 = skillCategories[3] || null;

    const frames = [
      {
        id: 'stack-cat-0',
        boardType: 'engraved',
        award: 'ARSENAL 01 // FRONTEND & 3D GRAPHICS',
        statusBadge: 'CORE STACK',
        title: c0.title || 'Frontend, 3D WebGL & UI Engineering',
        subtitle: c0.subtitle || 'Interactive User Interfaces & Real-Time 3D Rendering',
        description:
          c0.description ||
          'Production client-side architecture built with React, TypeScript, Three.js, React Three Fiber, and high-contrast responsive Tailwind CSS layouts.',
        bullets: (c0.skills || []).map((s) => `${s.name} — ${s.context || s.category || 'Verified in project builds'}`),
        verifiedTags: (c0.skills || []).map((s) => s.name).slice(0, 6),
        accent: '#00ff88',
        position: [-5.9, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'stack-cat-1',
        boardType: 'engraved',
        award: 'ARSENAL 02 // BACKEND & DATA SYSTEMS',
        statusBadge: 'SERVER & DB',
        title: c1.title || 'Backend APIs, Databases & Cloud',
        subtitle: c1.subtitle || 'RESTful Services, Authentication & Persistent Storage',
        description:
          c1.description ||
          'Server-side application logic, relational schema design, and cloud-hosted backend services powering full-stack and capstone deployments.',
        bullets: (c1.skills || []).map((s) => `${s.name} — ${s.context || s.category || 'Backend architecture'}`),
        verifiedTags: (c1.skills || []).map((s) => s.name).slice(0, 6),
        accent: '#72B8FF',
        position: [0, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
      {
        id: 'stack-cat-2',
        boardType: 'engraved',
        award: 'ARSENAL 03 // AI, SECURITY & WORKFLOW',
        statusBadge: 'DEV TOOLING',
        title: c2.title || 'AI Integration, Security & DevOps',
        subtitle: c2.subtitle || 'Decision-Support Pipelines, Git & Deployment Tooling',
        description:
          c2.description ||
          'AI/LLM API orchestration, phishing detection heuristics, collaborative Git version control, and modern build pipelines.',
        bullets: (c2.skills || []).map((s) => `${s.name} — ${s.context || s.category || 'Engineering workflow'}`),
        verifiedTags: (c2.skills || []).map((s) => s.name).slice(0, 6),
        accent: '#ffd24a',
        position: [5.9, 2.15, BACK_Z],
        rotY: 0,
        size: [4.35, 2.9],
      },
    ];

    if (c3) {
      frames.push({
        id: 'stack-cat-3',
        boardType: 'engraved',
        award: 'ARSENAL 04 // SPECIALIZED SYSTEMS',
        statusBadge: 'VERIFIED',
        title: c3.title,
        subtitle: c3.subtitle || 'Applied Software Engineering Tools',
        description: c3.description || 'Additional verified tools and technologies used across academic and competition builds.',
        bullets: (c3.skills || []).map((s) => `${s.name} — ${s.context || 'Project build'}`),
        verifiedTags: (c3.skills || []).map((s) => s.name).slice(0, 6),
        accent: '#00ff88',
        position: [LEFT_X, 2.15, -0.5],
        rotY: Math.PI / 2,
        size: [4.35, 2.9],
      });
    }
    return frames;
  }

  // 5. CONTACT (Communications Hub)
  return [
    {
      id: 'contact-direct',
      boardType: 'engraved',
      award: 'COMM-01 // DIRECT CHANNELS',
      statusBadge: 'ONLINE 24/7',
      title: 'Direct Email & Location Coordinates',
      subtitle: 'Bacolod City • Negros Island Region, Philippines',
      description:
        'Available for software engineering internships, full-stack web and 3D WebGL collaborations, hackathon teams, and technical discussions.',
      bullets: [
        `Direct Email: ${ownerProfile.email || 'ethanilustre@yahoo.com'}`,
        `University: ${ownerProfile.university || 'University of Negros Occidental – Recoletos'}`,
        `Location: ${ownerProfile.location || 'Negros Island Region, Philippines'}`,
        'Click this portrait to open the Interactive Message Dispatch Terminal',
      ],
      verifiedTags: ['Direct Email', 'Bacolod City', 'Internships', 'Collaborations'],
      contactAction: true,
      accent: '#00ff88',
      position: [-5.9, 2.15, BACK_Z],
      rotY: 0,
      size: [4.35, 2.9],
    },
    {
      id: 'contact-profiles',
      boardType: 'engraved',
      award: 'COMM-02 // VERIFIED REPOSITORIES & NETWORK',
      statusBadge: 'GITHUB & LINKEDIN',
      title: 'GitHub & LinkedIn Engineering Profiles',
      subtitle: 'Source Code Repositories, Commit History & Professional Network',
      description:
        'Explore verified open-source repositories, live 3D WebGL deployments, and academic software builds directly on GitHub and LinkedIn.',
      bullets: [
        'GitHub: github.com/ethanarexilustre1019-ui ↗',
        'LinkedIn: linkedin.com/in/ethan-arex-ilustre ↗',
        'Featured Repos: PhishNot, Project EAVI 3D, NASA CLPS Browser, Patintero Rush',
        'Click this portrait to launch GitHub or LinkedIn in a new tab',
      ],
      githubUrl: ownerProfile.github || 'https://github.com/ethanarexilustre1019-ui',
      linkedinUrl: ownerProfile.linkedin || 'https://www.linkedin.com/in/ethan-arex-ilustre',
      verifiedTags: ['GitHub ↗', 'LinkedIn ↗', 'Open Source', 'Verified Builds'],
      contactAction: true,
      accent: '#72B8FF',
      position: [0, 2.15, BACK_Z],
      rotY: 0,
      size: [4.35, 2.9],
    },
    {
      id: 'contact-dispatch',
      boardType: 'engraved',
      award: 'COMM-03 // TRANSMISSION TERMINAL',
      statusBadge: 'INTERACTIVE FORM',
      title: "Let's Build a Solution Together",
      subtitle: 'Direct Inquiry & Project Collaboration Dispatch',
      description:
        'Click this engraved portrait to transmit an inquiry message directly to Ethan Arex V. Ilustre with instant email fallback support.',
      bullets: [
        '1. Click this 3D Portrait to open the transmission form on the right',
        '2. Enter your Name, Email, Subject, and Project/Internship details',
        '3. Dispatch directly from inside the 3D Communications Hub',
      ],
      verifiedTags: ['Send Message', 'Instant Dispatch', 'Zero Friction'],
      contactAction: true,
      accent: '#ffd24a',
      position: [5.9, 2.15, BACK_Z],
      rotY: 0,
      size: [4.35, 2.9],
    },
  ];
}

const BUILDING_HEADERS = {
  achievements: 'SHEET 05 // 3D HALL OF CERTIFICATES & HACKATHONS',
  projects: 'SHEET 04 // SOFTWARE & CAPSTONE ENGINEERING LAB',
  about: 'SHEET 02 // UNO-R DEVELOPER HALL & JOURNEY',
  skills: 'SHEET 03 // TECHNICAL ARSENAL & STACK GALLERY',
  contact: 'SHEET 07 // 3D COMMUNICATIONS & DISPATCH HUB',
};

const GALLERY_COLLIDERS = [
  { x: 0, z: -0.9, hw: 0.7, hd: 0.7 }, // central pedestal
  { x: -3.4, z: -2.6, hw: 1.25, hd: 0.4 },
  { x: 3.4, z: -2.6, hw: 1.25, hd: 0.4 },
];

function GallerySpot({ position, target, color = '#e8fff4' }) {
  const lightRef = useRef();
  const targetObj = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    targetObj.position.set(...target);
    targetObj.updateMatrixWorld();
    if (lightRef.current) {
      lightRef.current.target = targetObj;
    }
  }, [targetObj, target]);

  return (
    <>
      <primitive object={targetObj} />
      <spotLight
        ref={lightRef}
        position={position}
        angle={0.65}
        penumbra={0.65}
        intensity={95}
        distance={16}
        decay={2}
        color={color}
      />
      <mesh position={position}>
        <cylinderGeometry args={[0.14, 0.2, 0.26, 12]} />
        <meshStandardMaterial color="#101815" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[position[0], position[1] - 0.14, position[2]]}>
        <circleGeometry args={[0.13, 12]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={2.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

function FramedCertificate({ frame }) {
  const [hover, setHover] = useState(false);
  const uploaded = useStore((s) => s.images[frame.id]);
  const openFrame = useStore((s) => s.openFrame);
  const focused = useStore((s) => s.focusFrame?.id === frame.id);
  const tex = useMemo(() => createFrameTexture(frame), [frame]);
  const [w, h] = frame.size;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let img = null;
      if (uploaded) img = await loadImageFromSrc(uploaded);
      if (!img && !frame.boardType) img = await loadFrameImage(frame);
      if (!cancelled) redrawFrameTexture(tex, frame, img);
    })();
    return () => {
      cancelled = true;
    };
  }, [uploaded, frame, tex]);

  return (
    <group
      position={frame.position}
      rotation={[0, frame.rotY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (!cameraOrbit.isDragging) openFrame(frame);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer Architectural Frame Border */}
      <mesh castShadow>
        <boxGeometry args={[w + 0.36, h + 0.36, 0.14]} />
        <meshStandardMaterial
          color={hover || focused ? '#00ff88' : frame.boardType === 'engraved' ? '#1c2b24' : '#c9a24a'}
          metalness={0.75}
          roughness={0.28}
          emissive={frame.accent || '#00ff88'}
          emissiveIntensity={hover || focused ? 0.5 : 0.14}
        />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.04]} />
        <meshStandardMaterial color="#090e0c" roughness={0.9} />
      </mesh>
      {/* High-Resolution Engraved / Certificate Canvas Plane */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={frame.boardType === 'engraved' ? 0.42 : 0.28}
          roughness={0.45}
        />
      </mesh>
    </group>
  );
}

export default function InteriorGallery() {
  const interiorBuildingId = useStore((s) => s.interiorBuildingId) || 'achievements';
  const wood = useMemo(() => woodTexture(), []);
  const exitTex = useMemo(() => exitTexture(), []);

  const headerText =
    BUILDING_HEADERS[interiorBuildingId] || BUILDING_HEADERS.achievements;

  const bannerTex = useMemo(
    () =>
      signTexture(
        headerText,
        '#060c09',
        '#00ff88',
        '#00ff88',
        1024,
        180
      ),
    [headerText]
  );

  const activeFrames = useMemo(
    () => buildBuildingFrames(interiorBuildingId),
    [interiorBuildingId]
  );

  const { halfW, halfD, height, bounds, spawn } = GALLERY_ROOM;

  const handleFloorClick = (e) => {
    e.stopPropagation();
    if (cameraOrbit.isDragging) return;
    nav.target = {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, e.point.x)),
      z: Math.max(bounds.minZ, Math.min(bounds.maxZ, e.point.z)),
      via: [],
    };
  };

  const handleDoorThreshold = (pos) => {
    if (pos.z > 5.3 && Math.abs(pos.x) < 1.5) {
      useStore.getState().exitAwardsGallery();
    }
  };

  const wallMat = <meshStandardMaterial color="#0d1713" roughness={0.9} />;

  return (
    <>
      <color attach="background" args={['#050907']} />
      <hemisphereLight args={['#c8ffe4', '#1d2621', 0.98]} />
      <pointLight position={[0, 5.4, 0]} intensity={45} distance={24} decay={2} color="#e2fff0" />

      {/* Hardwood Exhibition Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={handleFloorClick}>
        <planeGeometry args={[halfW * 2, halfD * 2]} />
        <meshStandardMaterial map={wood} roughness={0.45} metalness={0.05} />
      </mesh>

      {/* Gallery Carpet & Emerald Emblem */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[8.5, 4.8]} />
        <meshStandardMaterial color="#0b2218" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.55, 1.75, 44]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Inward-Facing Single-Sided Walls */}
      <mesh position={[0, height / 2, -halfD]}>
        <planeGeometry args={[halfW * 2, height]} />
        {wallMat}
      </mesh>
      <mesh position={[0, height / 2, halfD]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[halfW * 2, height]} />
        {wallMat}
      </mesh>
      <mesh position={[-halfW, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[halfD * 2, height]} />
        {wallMat}
      </mesh>
      <mesh position={[halfW, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[halfD * 2, height]} />
        {wallMat}
      </mesh>
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[halfW * 2, halfD * 2]} />
        <meshStandardMaterial color="#070c0a" roughness={1} />
      </mesh>

      {/* Wainscot Baseboards */}
      {[
        [[0, 0.55, -halfD + 0.05], [halfW * 2, 1.1, 0.1]],
        [[-halfW + 0.05, 0.55, 0], [0.1, 1.1, halfD * 2]],
        [[halfW - 0.05, 0.55, 0], [0.1, 1.1, halfD * 2]],
      ].map(([p, s], i) => (
        <mesh key={i} position={p} receiveShadow>
          <boxGeometry args={s} />
          <meshStandardMaterial color="#08100d" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0.55, halfD - 0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[halfW * 2, 1.1]} />
        <meshStandardMaterial color="#08100d" roughness={0.8} />
      </mesh>

      {/* Header Banner on North Wall */}
      <mesh position={[0, 4.18, -halfD + 0.03]}>
        <planeGeometry args={[8.2, 0.78]} />
        <meshStandardMaterial
          map={bannerTex}
          emissiveMap={bannerTex}
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Central Holocron Pedestal & Exhibition Benches */}
      <mesh position={[0, 0.55, -0.9]} castShadow>
        <cylinderGeometry args={[0.48, 0.58, 1.1, 20]} />
        <meshStandardMaterial color="#13221b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.38, -0.9]} castShadow>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {[-3.4, 3.4].map((bx) => (
        <group key={bx} position={[bx, 0, -2.6]}>
          <mesh position={[0, 0.48, 0]} castShadow>
            <boxGeometry args={[2.3, 0.12, 0.68]} />
            <meshStandardMaterial color="#1a2922" roughness={0.7} />
          </mesh>
          {[-0.95, 0.95].map((lx) => (
            <mesh key={lx} position={[lx, 0.24, 0]}>
              <boxGeometry args={[0.12, 0.48, 0.58]} />
              <meshStandardMaterial color="#090e0c" metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Single-Sided Inward Exit Door on South Wall */}
      <group
        position={[0, 0, halfD - 0.02]}
        rotation={[0, Math.PI, 0]}
        onClick={(e) => {
          e.stopPropagation();
          nav.target = { x: 0, z: 5.4, via: [], exit: true };
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <mesh position={[0, 1.65, 0]}>
          <planeGeometry args={[2.5, 3.3]} />
          <meshStandardMaterial color="#081810" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.55, 0.01]}>
          <planeGeometry args={[2.1, 3.0]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 3.6, 0.01]}>
          <planeGeometry args={[1.6, 0.56]} />
          <meshStandardMaterial
            map={exitTex}
            emissiveMap={exitTex}
            emissive="#ffffff"
            emissiveIntensity={1.1}
          />
        </mesh>
      </group>

      {/* Giant Engraved 3D Wall Portraits & Spotlights */}
      {activeFrames.map((frame) => {
        const nx = Math.sin(frame.rotY);
        const nz = Math.cos(frame.rotY);
        return (
          <React.Fragment key={frame.id}>
            <FramedCertificate frame={frame} />
            <GallerySpot
              position={[
                frame.position[0] + nx * 2.3,
                5.6,
                frame.position[2] + nz * 2.3,
              ]}
              target={frame.position}
            />
          </React.Fragment>
        );
      })}

      <DekuController
        mode="interior"
        spawn={spawn}
        bounds={bounds}
        colliders={GALLERY_COLLIDERS}
        onDoorThreshold={handleDoorThreshold}
      />
    </>
  );
}
