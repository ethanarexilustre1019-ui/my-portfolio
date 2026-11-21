import * as THREE from 'three';

const PARTICLE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSurge;
  attribute float aScale;
  attribute float aPhase;
  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec3 pos = position;
    float speed = 0.28 + uSurge * 1.15;
    float spiralAngle = uTime * (0.35 + uSurge * 1.4) + aPhase * 6.2831;
    pos.y += mod(uTime * (speed + aScale * 0.35) + aPhase * 4.0, 5.5) - 2.75;
    pos.x += sin(spiralAngle) * (0.18 + uSurge * 0.16);
    pos.z += cos(spiralAngle) * (0.18 + uSurge * 0.16);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (aScale * (18.0 + uSurge * 14.0)) / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;

    vAlpha = 0.38 + 0.52 * sin(uTime * (3.0 + uSurge * 8.0) + aPhase * 10.0);
    vColorMix = step(0.72, aPhase);
  }
`;

const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec2 uv = gl_PointCoord.xy - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    float glow = smoothstep(0.5, 0.06, dist);
    vec3 emerald = vec3(0.0, 0.95, 0.50);
    vec3 brightCore = vec3(0.75, 1.0, 0.92);
    vec3 finalColor = mix(emerald, brightCore, vColorMix);

    gl_FragColor = vec4(finalColor, glow * vAlpha);
  }
`;

/**
 * EnergySystem
 * Surrounds the 3D Deku Bust with green One-For-All bio-electricity in Normal Mode,
 * and erupts into a 26-bolt Super-Saiyan / 100% Full-Cowling lightning storm with
 * rising 3D energy shockwave rings when RAGE MODE is active.
 */
export class EnergySystem {
  public readonly group: THREE.Group;
  private particleSystem: THREE.Points;
  private particleMaterial: THREE.ShaderMaterial;
  private lightningLines: THREE.Line[] = [];
  private rageShockwaveRings: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene, isMobile: boolean) {
    this.group = new THREE.Group();

    // 1. Custom ShaderMaterial Energy Particle Field
    const count = isMobile ? 140 : 300;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const isNearBust = i < count * 0.6;
      if (isNearBust) {
        const radius = 0.65 + Math.random() * 1.5;
        const theta = Math.random() * Math.PI * 2;
        positions[i3] = Math.cos(theta) * radius;
        positions[i3 + 1] = (Math.random() - 0.5) * 3.2;
        positions[i3 + 2] = Math.sin(theta) * 0.8;
      } else {
        positions[i3] = (Math.random() - 0.5) * 12;
        positions[i3 + 1] = (Math.random() - 0.5) * 7;
        positions[i3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
      }
      scales[i] = 0.35 + Math.random() * 0.9;
      phases[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.particleMaterial = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSurge: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(particleGeo, this.particleMaterial);
    this.group.add(this.particleSystem);

    // 2. 26 Bio-Electric 3D Lightning Bolts (10 active in Normal Mode, all 26 in RAGE MODE)
    const arcCount = isMobile ? 14 : 26;
    const segmentsPerArc = 12;

    for (let a = 0; a < arcCount; a++) {
      const arcPositions = new Float32Array((segmentsPerArc + 1) * 3);
      const arcGeo = new THREE.BufferGeometry();
      arcGeo.setAttribute('position', new THREE.BufferAttribute(arcPositions, 3));

      let boltColor = '#00E676';
      if (a % 4 === 0) boltColor = '#c8ffe6'; // Hot white-emerald core
      else if (a % 5 === 0) boltColor = '#38bdf8'; // Electric cyan spark
      else if (a >= 18 && a % 3 === 0) boltColor = '#ff4d6d'; // One-For-All crimson power spark in Rage Mode

      const arcMat = new THREE.LineBasicMaterial({
        color: boltColor,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(arcGeo, arcMat);
      this.lightningLines.push(line);
      this.group.add(line);
    }

    // 3. Super-Saiyan Rising 3D Aura Shockwave Rings (active in RAGE MODE)
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.RingGeometry(0.85 + r * 0.18, 0.92 + r * 0.18, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r % 2 === 0 ? '#00E676' : '#38bdf8',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI * 0.46;
      this.rageShockwaveRings.push(ringMesh);
      this.group.add(ringMesh);
    }

    scene.add(this.group);
  }

  public update(elapsedTime: number, rageModeActive: boolean): void {
    this.particleMaterial.uniforms.uTime.value = elapsedTime;
    const targetSurge = rageModeActive ? 1.0 : 0.0;
    this.particleMaterial.uniforms.uSurge.value +=
      (targetSurge - this.particleMaterial.uniforms.uSurge.value) * 0.1;
    const surgeLevel = this.particleMaterial.uniforms.uSurge.value;

    const normalBoltLimit = Math.min(10, this.lightningLines.length);

    this.lightningLines.forEach((line, arcIdx) => {
      const mat = line.material as THREE.LineBasicMaterial;
      if (!rageModeActive && surgeLevel < 0.15 && arcIdx >= normalBoltLimit) {
        mat.opacity = 0;
        return;
      }

      const posAttr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const segments = arr.length / 3 - 1;

      const speedMult = rageModeActive ? 3.2 : 1.8;
      const baseAngle =
        elapsedTime * speedMult + arcIdx * ((Math.PI * 2) / this.lightningLines.length);
      const radiusStart = 0.45 + (arcIdx % 4) * 0.16;
      const radiusEnd =
        (0.88 + (arcIdx % 3) * 0.32) * (1.0 + surgeLevel * 0.55);

      const startX = Math.cos(baseAngle) * radiusStart;
      const startY = -0.65 + (arcIdx % 6) * 0.34;
      const startZ = Math.sin(baseAngle) * 0.45 + 0.25;

      const endX = Math.cos(baseAngle + 0.65) * radiusEnd;
      const endY = startY + (rageModeActive ? 0.35 : 0.0) + Math.sin(elapsedTime * 5 + arcIdx) * 0.55;
      const endZ = Math.sin(baseAngle + 0.65) * 0.55 + 0.25;

      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const envelope = Math.sin(t * Math.PI);
        const jitterAmp = envelope * (0.09 + surgeLevel * 0.14);

        const hash = Math.sin(elapsedTime * 42.0 + arcIdx * 19.1 + s * 11.3);
        const hash2 = Math.cos(elapsedTime * 47.0 + arcIdx * 13.7 + s * 7.9);

        arr[s * 3] = THREE.MathUtils.lerp(startX, endX, t) + hash * jitterAmp;
        arr[s * 3 + 1] = THREE.MathUtils.lerp(startY, endY, t) + hash2 * jitterAmp;
        arr[s * 3 + 2] = THREE.MathUtils.lerp(startZ, endZ, t) + hash * hash2 * jitterAmp;
      }

      posAttr.needsUpdate = true;

      const flicker = Math.sin(elapsedTime * (28 + surgeLevel * 20) + arcIdx * 4.9);
      mat.opacity =
        flicker > -0.35 ? (rageModeActive ? 0.98 : 0.75) : 0.12;
    });

    // Animate Rising Super-Saiyan Shockwave Aura Rings in Rage Mode
    this.rageShockwaveRings.forEach((ring, idx) => {
      const mat = ring.material as THREE.MeshBasicMaterial;
      if (surgeLevel < 0.04) {
        mat.opacity = 0;
        return;
      }

      const cycle = (elapsedTime * 1.4 + idx * 0.33) % 1.0;
      ring.position.y = -0.85 + cycle * 2.1;
      const scale = 0.75 + cycle * 0.85;
      ring.scale.set(scale, scale, 1);
      ring.rotation.z = elapsedTime * (idx % 2 === 0 ? 1.5 : -1.5);
      mat.opacity = Math.sin(cycle * Math.PI) * 0.42 * surgeLevel;
    });
  }

  public setLayoutMode(_isMobile: boolean): void {}

  public dispose(): void {
    this.particleSystem.geometry.dispose();
    this.particleMaterial.dispose();
    this.lightningLines.forEach((line) => {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    this.rageShockwaveRings.forEach((ring) => {
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
    });
  }
}
