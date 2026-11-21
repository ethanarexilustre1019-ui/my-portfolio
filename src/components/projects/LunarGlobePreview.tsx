import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ClpsSite {
  id: string;
  name: string;
  vendor: string;
  region: string;
  lat: number;
  lon: number;
  color: string;
}

const CLPS_SITES: ClpsSite[] = [
  {
    id: 'im-1',
    name: 'IM-1 Odysseus',
    vendor: 'Intuitive Machines',
    region: 'Malapert A (South Pole)',
    lat: -80.13,
    lon: 1.44,
    color: '#00E676',
  },
  {
    id: 'im-2',
    name: 'IM-2 Athena',
    vendor: 'Intuitive Machines',
    region: 'Mons Mouton (South Pole)',
    lat: -84.6,
    lon: -31.0,
    color: '#72B8FF',
  },
  {
    id: 'bgm-1',
    name: 'Blue Ghost M1',
    vendor: 'Firefly Aerospace',
    region: 'Mare Crisium',
    lat: 18.56,
    lon: 61.81,
    color: '#00E676',
  },
  {
    id: 'griffin-1',
    name: 'Griffin Mission 1',
    vendor: 'Astrobotic',
    region: 'Nobile Crater Rim',
    lat: -85.2,
    lon: 53.5,
    color: '#72B8FF',
  },
  {
    id: 'apex-1',
    name: 'APEX 1.0 (Draper)',
    vendor: 'ispace / Draper',
    region: 'Schrödinger Basin (Far Side)',
    lat: -75.0,
    lon: 132.4,
    color: '#00E676',
  },
  {
    id: 'im-3',
    name: 'IM-3 Lunar Vertex',
    vendor: 'Intuitive Machines',
    region: 'Reiner Gamma Swirl',
    lat: 7.5,
    lon: -59.0,
    color: '#72B8FF',
  },
  {
    id: 'pm-1',
    name: 'Peregrine M1',
    vendor: 'Astrobotic',
    region: 'Sinus Viscositatis',
    lat: 35.1,
    lon: -40.9,
    color: '#00E676',
  },
];

function latLonToVector3(latDeg: number, lonDeg: number, radius: number): THREE.Vector3 {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const LunarGlobePreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSite, setActiveSite] = useState<ClpsSite>(CLPS_SITES[0]);
  const targetRotRef = useRef<{ x: number; y: number }>({ x: 0.45, y: 0 });

  useEffect(() => {
    // Rotate globe to bring selected landing site toward viewer
    const latRad = THREE.MathUtils.degToRad(activeSite.lat);
    const lonRad = THREE.MathUtils.degToRad(activeSite.lon);
    targetRotRef.current = {
      x: -latRad * 0.55,
      y: -lonRad - Math.PI * 0.5,
    };
  }, [activeSite]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 280;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.85);

    // Space lighting (Synodic solar directional + rim light)
    const ambient = new THREE.AmbientLight('#1a2822', 1.4);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight('#ffffff', 2.4);
    sunLight.position.set(4, 2, 3);
    scene.add(sunLight);

    const emeraldRim = new THREE.PointLight('#00E676', 2.2, 10);
    emeraldRim.position.set(-3, -2, 2);
    scene.add(emeraldRim);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Generate procedural LRO lunar regolith bump/albedo canvas texture
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 256;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#4c5652';
      ctx.fillRect(0, 0, 512, 256);

      // Lunar maria dark basalt regions & highland craters
      for (let i = 0; i < 140; i++) {
        const cx = (Math.sin(i * 12.7) * 0.5 + 0.5) * 512;
        const cy = (Math.cos(i * 9.3) * 0.5 + 0.5) * 256;
        const r = 3 + (i % 7) * 4.5;
        const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, i % 3 === 0 ? '#2b3330' : '#65736d');
        grad.addColorStop(0.8, '#38423e');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const moonTexture = new THREE.CanvasTexture(texCanvas);
    const moonGeo = new THREE.SphereGeometry(1.18, 48, 48);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonTexture,
      bumpScale: 0.035,
      roughness: 0.88,
      metalness: 0.08,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    globeGroup.add(moonMesh);

    // Selenographic Telemetry Wireframe Overlay
    const wireGeo = new THREE.SphereGeometry(1.195, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: '#00E676',
      wireframe: true,
      transparent: true,
      opacity: 0.11,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Orbital Horizon Ring
    const orbitGeo = new THREE.RingGeometry(1.42, 1.44, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: '#72B8FF',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI * 0.38;
    orbitMesh.rotation.y = 0.25;
    scene.add(orbitMesh);

    // Plot all 7 Verified NASA CLPS Mission Pins
    const pinGeo = new THREE.SphereGeometry(0.042, 12, 12);
    CLPS_SITES.forEach((site) => {
      const pos = latLonToVector3(site.lat, site.lon, 1.21);
      const pinMat = new THREE.MeshBasicMaterial({
        color: site.color,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      globeGroup.add(pin);
    });

    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      globeGroup.rotation.y += (targetRotRef.current.y - globeGroup.rotation.y) * 0.05 + 0.0025;
      globeGroup.rotation.x += (targetRotRef.current.x - globeGroup.rotation.x) * 0.05;
      targetRotRef.current.y += 0.0025;
      orbitMesh.rotation.z += 0.003;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 280;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      moonGeo.dispose();
      moonMat.dispose();
      moonTexture.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      orbitGeo.dispose();
      orbitMat.dispose();
      pinGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[270px] bg-[#040706] flex flex-col justify-between overflow-hidden border border-[#00E676]/25">
      {/* Top Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between px-3.5 py-2 bg-[#050807]/85 border-b border-[#00E676]/20 text-[11px] font-hud">
        <span className="text-[#00E676] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
          THREE.JS LRO LUNAR GLOBE // LIVE PREVIEW
        </span>
        <span className="text-[#72B8FF]">
          LAT {activeSite.lat.toFixed(1)}° / LON {activeSite.lon.toFixed(1)}°
        </span>
      </div>

      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-[210px] relative" />

      {/* Interactive CLPS Landing Site Selector */}
      <div className="relative z-10 px-3 py-2.5 bg-[#050807]/90 border-t border-[#00E676]/20">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-white">{activeSite.name}</span>
          <span className="text-[11px] text-[#A7B8AE]">{activeSite.region}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CLPS_SITES.map((site) => {
            const isSelected = site.id === activeSite.id;
            return (
              <button
                key={site.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSite(site);
                }}
                className={`px-2 py-0.5 text-[10px] font-hud transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#00E676] text-[#050807] font-bold'
                    : 'bg-[#101915] text-[#A7B8AE] border border-[#00E676]/25 hover:border-[#00E676] hover:text-white'
                }`}
              >
                {site.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
