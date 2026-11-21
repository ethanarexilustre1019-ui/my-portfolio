import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Generates a subtle, fine stippled micro-roughness / pore bump texture
 * to give the character's skin and suit a smooth vinyl/clay stylized 3D PBR feel.
 */
function createMicroPoreBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const idx = i / 4;
      const noise = Math.floor(
        128 +
          (Math.sin(idx * 12.9898) * 43758.5453 -
            Math.floor(Math.sin(idx * 12.9898) * 43758.5453) -
            0.5) *
            28
      );
      data[i] = noise;
      data[i + 1] = noise;
      data[i + 2] = noise;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

/**
 * Removes harsh 2D black comic-book ink lines baked into the suit texture
 * by replacing very dark ink-line pixels with a smooth neighborhood average.
 */
function createSmoothedSuitTexture(
  sourceImage: HTMLImageElement | ImageBitmap
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const w = sourceImage.width || 1024;
  const h = sourceImage.height || 1024;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(sourceImage, 0, 0, w, h);
    const imgData = ctx.getImageData(0, 0, w, h);
    const src = new Uint8ClampedArray(imgData.data);
    const dst = imgData.data;

    const radius = 5;
    for (let y = radius; y < h - radius; y++) {
      for (let x = radius; x < w - radius; x++) {
        const idx = (y * w + x) * 4;
        const r = src[idx];
        const g = src[idx + 1];
        const b = src[idx + 2];

        if (r < 42 && g < 45 && b < 48) {
          let sumR = 0;
          let sumG = 0;
          let sumB = 0;
          let count = 0;

          for (let dy = -radius; dy <= radius; dy += 2) {
            for (let dx = -radius; dx <= radius; dx += 2) {
              const nIdx = ((y + dy) * w + (x + dx)) * 4;
              const nr = src[nIdx];
              const ng = src[nIdx + 1];
              const nb = src[nIdx + 2];
              if (nr >= 44 || ng >= 48 || nb >= 50) {
                sumR += nr;
                sumG += ng;
                sumB += nb;
                count++;
              }
            }
          }

          if (count > 0) {
            dst[idx] = Math.round(sumR / count);
            dst[idx + 1] = Math.round(sumG / count);
            dst[idx + 2] = Math.round(sumB / count);
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Welds duplicate vertices by position to compute ultra-smooth continuous
 * vertex normals across the entire skinned mesh.
 */
function computeSmoothSkinnedNormals(geometry: THREE.BufferGeometry): void {
  geometry.computeVertexNormals();
  const posAttr = geometry.attributes.position;
  const normAttr = geometry.attributes.normal;
  if (!posAttr || !normAttr) return;

  const accumMap = new Map<string, THREE.Vector3>();
  const v = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    const key = `${Math.round(posAttr.getX(i) * 2000)},${Math.round(
      posAttr.getY(i) * 2000
    )},${Math.round(posAttr.getZ(i) * 2000)}`;
    v.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
    const existing = accumMap.get(key);
    if (existing) {
      existing.add(v);
    } else {
      accumMap.set(key, v.clone());
    }
  }

  accumMap.forEach((vec) => vec.normalize());

  for (let i = 0; i < posAttr.count; i++) {
    const key = `${Math.round(posAttr.getX(i) * 2000)},${Math.round(
      posAttr.getY(i) * 2000
    )},${Math.round(posAttr.getZ(i) * 2000)}`;
    const avg = accumMap.get(key);
    if (avg) {
      normAttr.setXYZ(i, avg.x, avg.y, avg.z);
    }
  }

  normAttr.needsUpdate = true;
}

interface BrowBoneRecord {
  bone: THREE.Object3D;
  restPos: THREE.Vector3;
  tier: 'inner' | 'mid' | 'outer';
}

/**
 * CharacterController
 * Loads the user's 3D Izuku Midoriya (Deku) GLB model (/models/deku/source/fortnite_deku.glb),
 * upgrades its materials into smooth stylized 3D PBR, and supports an interactive
 * 100% Full-Cowling / Super-Saiyan RAGE MODE transformation when toggled:
 * - Normal Mode: Confident calm hero gaze, smooth breathing, periodic blinking, cursor tracking.
 * - RAGE MODE:
 *   1. Jaw bone (jaw_A_074_128) opens into an intense battle roar/scream with upper lip snarl.
 *   2. Eyebrow bones (L/R_browskin_A..E) furrow steeply into a fierce V-shaped anime rage scowl.
 *   3. Eyes ignite with Super-Saiyan emerald-cyan plasma glow + 3D Eye-Lightning Streamers arcing from both eyes.
 *   4. Spiky hair charges with radiant bio-electric emerald rim glow.
 *   5. Chest puffs outward, arms flex into a power-charge stance, and high-frequency power tremor shakes the rig.
 */
export class CharacterController {
  public readonly rootGroup: THREE.Group;
  private modelGroup: THREE.Group;
  private mixer: THREE.AnimationMixer | null = null;
  private isDisposed = false;
  private microBumpTex: THREE.CanvasTexture;
  private generatedTextures: THREE.Texture[] = [];

  // Material references for smooth Normal <-> RAGE MODE shader transitions
  private eyeMaterials: THREE.MeshPhysicalMaterial[] = [];
  private hairMaterials: THREE.MeshPhysicalMaterial[] = [];
  private suitMaterials: THREE.MeshPhysicalMaterial[] = [];
  private rageIntensity = 0;

  // 3D Eye-Lightning Trail Streamers attached to headBone (visible in RAGE MODE)
  private eyeTrailLines: THREE.Line[] = [];

  // Rigged Skeletal Bone References
  private headBone: THREE.Object3D | null = null;
  private neckBone: THREE.Object3D | null = null;
  private chestBone: THREE.Object3D | null = null;
  private gogglesCollarBone: THREE.Object3D | null = null;
  private jawBone: THREE.Object3D | null = null;
  private upperLipBones: Array<{ bone: THREE.Object3D; restPos: THREE.Vector3 }> = [];
  private leftCollarBone: THREE.Object3D | null = null;
  private rightCollarBone: THREE.Object3D | null = null;
  private leftArmBone: THREE.Object3D | null = null;
  private rightArmBone: THREE.Object3D | null = null;
  private leftArmExBone: THREE.Object3D | null = null;
  private rightArmExBone: THREE.Object3D | null = null;
  private leftElbowBone: THREE.Object3D | null = null;
  private rightElbowBone: THREE.Object3D | null = null;
  private leftEyeBone: THREE.Object3D | null = null;
  private rightEyeBone: THREE.Object3D | null = null;
  private upperEyelidBones: Array<{ bone: THREE.Object3D; restPos: THREE.Vector3 }> = [];
  private browSkinBones: BrowBoneRecord[] = [];

  // Base Rest Quaternions
  private headRestQuat = new THREE.Quaternion();
  private neckRestQuat = new THREE.Quaternion();
  private chestRestQuat = new THREE.Quaternion();
  private gogglesRestQuat = new THREE.Quaternion();
  private jawRestQuat = new THREE.Quaternion();
  private leftEyeRestQuat = new THREE.Quaternion();
  private rightEyeRestQuat = new THREE.Quaternion();

  constructor(scene: THREE.Scene, isMobile: boolean) {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'DekuSmoothPBRBustRoot';

    this.modelGroup = new THREE.Group();
    this.rootGroup.add(this.modelGroup);

    this.microBumpTex = createMicroPoreBumpTexture();

    this.setLayoutMode(isMobile);
    this.loadAndUpgradeDekuGlb('/models/deku/source/fortnite_deku.glb');

    scene.add(this.rootGroup);
  }

  private loadAndUpgradeDekuGlb(url: string): void {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        if (this.isDisposed) return;

        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.frustumCulled = false;

            const matName =
              child.material && !Array.isArray(child.material)
                ? child.material.name
                : '';

            if (child.name === 'Object_0' || matName === 'dummy_material_0') {
              child.visible = false;
              return;
            }

            computeSmoothSkinnedNormals(child.geometry);

            const oldMat = child.material as THREE.MeshBasicMaterial;
            const baseMap = oldMat?.map || null;
            if (baseMap) {
              baseMap.colorSpace = THREE.SRGBColorSpace;
              baseMap.needsUpdate = true;
            }

            if (matName === 'dummy_material_1') {
              let smoothMap: THREE.Texture | null = baseMap;
              if (baseMap && baseMap.image) {
                try {
                  const cleanedTex = createSmoothedSuitTexture(baseMap.image);
                  this.generatedTextures.push(cleanedTex);
                  smoothMap = cleanedTex;
                } catch {
                  smoothMap = baseMap;
                }
              }

              const suitMat = new THREE.MeshPhysicalMaterial({
                map: smoothMap,
                bumpMap: this.microBumpTex,
                bumpScale: 0.0018,
                roughness: 0.48,
                metalness: 0.06,
                clearcoat: 0.12,
                clearcoatRoughness: 0.4,
                sheen: 0.42,
                sheenRoughness: 0.5,
                sheenColor: new THREE.Color('#00E676'),
                emissive: new THREE.Color('#00E676'),
                emissiveIntensity: 0.0,
                side: THREE.DoubleSide,
              });
              child.material = suitMat;
              this.suitMaterials.push(suitMat);
            } else if (matName === 'dummy_material_2') {
              const hairMat = new THREE.MeshPhysicalMaterial({
                map: baseMap,
                roughness: 0.36,
                metalness: 0.08,
                clearcoat: 0.22,
                clearcoatRoughness: 0.32,
                sheen: 0.55,
                sheenRoughness: 0.4,
                sheenColor: new THREE.Color('#00E676'),
                emissive: new THREE.Color('#00ff88'),
                emissiveIntensity: 0.0,
                side: THREE.DoubleSide,
              });
              child.material = hairMat;
              this.hairMaterials.push(hairMat);
            } else if (matName === 'dummy_material_3' || matName === 'dummy_material_5') {
              const eyeMat = new THREE.MeshPhysicalMaterial({
                map: baseMap,
                emissiveMap: baseMap,
                emissive: new THREE.Color('#ffffff'),
                emissiveIntensity: 0.35,
                roughness: 0.14,
                metalness: 0.0,
                clearcoat: 0.75,
                clearcoatRoughness: 0.1,
                side: THREE.DoubleSide,
              });
              child.material = eyeMat;
              this.eyeMaterials.push(eyeMat);
            } else if (matName === 'dummy_material_4' || matName === 'dummy_material_6') {
              child.material = new THREE.MeshPhysicalMaterial({
                map: baseMap,
                bumpMap: this.microBumpTex,
                bumpScale: 0.0022,
                roughness: 0.44,
                metalness: 0.02,
                clearcoat: 0.08,
                clearcoatRoughness: 0.42,
                sheen: 0.35,
                sheenRoughness: 0.55,
                sheenColor: new THREE.Color('#72B8FF'),
                side: THREE.DoubleSide,
              });
            }

            if (oldMat && oldMat !== child.material) {
              oldMat.dispose();
            }
          }

          // Capture Skeletal Bones
          const n = child.name;
          if (n === 'head_010_12') {
            this.headBone = child;
            this.headRestQuat.copy(child.quaternion);
          } else if (n === 'neck_09_11') {
            this.neckBone = child;
            this.neckRestQuat.copy(child.quaternion);
          } else if (n === 'chest_08_10') {
            this.chestBone = child;
            this.chestRestQuat.copy(child.quaternion);
          } else if (n === 'AC_goggles_0153_238') {
            this.gogglesCollarBone = child;
            this.gogglesRestQuat.copy(child.quaternion);
          } else if (n === 'jaw_A_074_128') {
            this.jawBone = child;
            this.jawRestQuat.copy(child.quaternion);
          } else if (/^(T|LT|RT)_lip_/i.test(n)) {
            this.upperLipBones.push({ bone: child, restPos: child.position.clone() });
          } else if (n === 'L_collar_085_148') {
            this.leftCollarBone = child;
          } else if (n === 'R_collar_0119_193') {
            this.rightCollarBone = child;
          } else if (n === 'L_arm_086_149') {
            this.leftArmBone = child;
          } else if (n === 'R_arm_0120_194') {
            this.rightArmBone = child;
          } else if (n === 'L_arm_EX_0118_191') {
            this.leftArmExBone = child;
          } else if (n === 'R_arm_EX_0152_236') {
            this.rightArmExBone = child;
          } else if (n === 'L_elbow_087_150') {
            this.leftElbowBone = child;
          } else if (n === 'R_elbow_0121_195') {
            this.rightElbowBone = child;
          } else if (n === 'L_eye_033_51') {
            this.leftEyeBone = child;
            this.leftEyeRestQuat.copy(child.quaternion);
          } else if (n === 'R_eye_054_88') {
            this.rightEyeBone = child;
            this.rightEyeRestQuat.copy(child.quaternion);
          } else if (/^(LT|RT)_eyelid_[ABCD]_/i.test(n)) {
            this.upperEyelidBones.push({
              bone: child,
              restPos: child.position.clone(),
            });
          } else if (/^(L|R)_browskin_[ABCDE]_/i.test(n)) {
            const tier: 'inner' | 'mid' | 'outer' = /_([AB])_/i.test(n)
              ? 'inner'
              : /_C_/i.test(n)
              ? 'mid'
              : 'outer';
            this.browSkinBones.push({
              bone: child,
              restPos: child.position.clone(),
              tier,
            });
          }
        });

        this.applySmoothShowcaseBustPose();
        this.attachEyeLightningStreamers();

        model.scale.setScalar(3.35);
        model.position.set(0, -4.64, 0);

        this.modelGroup.add(model);

        this.mixer = new THREE.AnimationMixer(this.modelGroup);
        const times = [0, 2.0, 4.0];
        const floatTrack = new THREE.VectorKeyframeTrack(
          '.position',
          times,
          [0, 0, 0, 0, 0.045, 0, 0, 0, 0]
        );
        const clip = new THREE.AnimationClip('DekuBustHover', 4.0, [floatTrack]);
        this.mixer.clipAction(clip).play();
      },
      undefined,
      (err) => {
        console.error('Failed to load Deku GLB model:', err);
      }
    );
  }

  /**
   * Attaches 3D Full-Cowling Eye-Lightning Streamers directly to Deku's head bone
   * so glowing emerald-cyan plasma arcs trail from his left and right eyes during RAGE MODE.
   */
  private attachEyeLightningStreamers(): void {
    if (!this.headBone) return;

    const segments = 10;
    for (let i = 0; i < 4; i++) {
      const positions = new Float32Array((segments + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#00ff88' : '#b8ffee',
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(geo, mat);
      this.headBone.add(line);
      this.eyeTrailLines.push(line);
    }
  }

  private applySmoothShowcaseBustPose(): void {
    if (this.leftCollarBone) {
      this.leftCollarBone.rotation.set(0, 0, -Math.PI * 0.58);
    }
    if (this.rightCollarBone) {
      this.rightCollarBone.rotation.set(0, 0, Math.PI * 0.58);
    }

    if (this.leftArmBone) {
      this.leftArmBone.rotation.set(0.06, 0.0, -0.88);
    }
    if (this.rightArmBone) {
      this.rightArmBone.rotation.set(0.06, 0.0, 0.88);
    }

    if (this.leftArmExBone) {
      this.leftArmExBone.rotation.set(0.04, 0.0, -0.58);
    }
    if (this.rightArmExBone) {
      this.rightArmExBone.rotation.set(0.04, 0.0, 0.58);
    }

    if (this.leftElbowBone) {
      this.leftElbowBone.rotation.set(0.14, 0.0, -0.12);
    }
    if (this.rightElbowBone) {
      this.rightElbowBone.rotation.set(0.14, 0.0, 0.12);
    }
  }

  public update(
    delta: number,
    elapsedTime: number,
    mouseX: number,
    mouseY: number,
    rageModeActive: boolean
  ): void {
    // Smoothly interpolate rageIntensity in [0, 1]
    const targetRage = rageModeActive ? 1.0 : 0.0;
    this.rageIntensity += (targetRage - this.rageIntensity) * 0.12;
    const r = this.rageIntensity;

    if (this.mixer) {
      this.mixer.update(delta * (1.0 + r * 1.25));
    }

    // High-frequency Super-Saiyan power tremor when Rage Mode is active
    const powerTremorX = r * Math.sin(elapsedTime * 48.0) * 0.012;
    const powerTremorY = r * Math.cos(elapsedTime * 54.0) * 0.012;

    // 1. Head & Neck Cursor Tracking + Rage Power Roar Tilt
    const idleYaw = Math.sin(elapsedTime * 1.1) * 0.055;
    const idlePitch = Math.cos(elapsedTime * 1.4) * 0.03;
    const idleRoll = Math.sin(elapsedTime * 0.9) * 0.025;

    if (this.headBone) {
      const targetYaw = 0.12 * (1 - r * 0.5) + idleYaw + mouseX * 0.34 + powerTremorX;
      // In Rage Mode, tilt head slightly forward/fierce (-0.08) with intense gaze
      const targetPitch = -0.03 - r * 0.07 + idlePitch - mouseY * 0.2 + powerTremorY;
      const targetRoll = -0.02 + idleRoll - mouseX * 0.05;

      const targetQuat = this.headRestQuat
        .clone()
        .multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(targetPitch, targetYaw, targetRoll, 'YXZ')
          )
        );
      this.headBone.quaternion.slerp(targetQuat, 0.11);
    }

    if (this.neckBone) {
      const neckYaw = 0.05 + idleYaw * 0.5 + mouseX * 0.15;
      const neckPitch = idlePitch * 0.5 - mouseY * 0.09 + r * 0.04;
      const neckQuat = this.neckRestQuat
        .clone()
        .multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(neckPitch, neckYaw, 0, 'YXZ')
          )
        );
      this.neckBone.quaternion.slerp(neckQuat, 0.09);
    }

    // 2. Chest Breathing & Super-Saiyan Power-Charge Chest Expansion
    const breathWave = Math.sin(elapsedTime * (2.3 + r * 3.2));
    if (this.chestBone) {
      // In Rage Mode, puff chest proudly forward (-0.085 pitch) with rapid power breathing
      const breathPitch = -r * 0.085 + breathWave * (0.032 + r * 0.025);
      const chestYaw = mouseX * 0.09;
      const chestQuat = this.chestRestQuat
        .clone()
        .multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(breathPitch, chestYaw, 0, 'YXZ')
          )
        );
      this.chestBone.quaternion.slerp(chestQuat, 0.08);
    }

    // Preserve neck respirator collar rest quaternion
    if (this.gogglesCollarBone) {
      const collarQuat = this.gogglesRestQuat
        .clone()
        .multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(breathWave * 0.018, 0, 0)
          )
        );
      this.gogglesCollarBone.quaternion.slerp(collarQuat, 0.1);
    }

    // 3. Super-Saiyan / 100% Rage Battle Roar Jaw & Snarl Lip Animation
    if (this.jawBone) {
      // In face_011_13 space, rotating jaw_A_074_128 around +X opens the mouth downward
      const roarOpenAngle = r * (0.28 + Math.sin(elapsedTime * 18.0) * 0.035);
      const jawQuat = this.jawRestQuat
        .clone()
        .multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(roarOpenAngle, 0, 0))
        );
      this.jawBone.quaternion.slerp(jawQuat, 0.18);
    }

    // Upper lip snarl in Rage Mode (in face_011_13 space, -Z is UP)
    for (let i = 0; i < this.upperLipBones.length; i++) {
      const { bone, restPos } = this.upperLipBones[i];
      bone.position.z = restPos.z - r * 0.0042;
    }

    // 4. Fierce V-Shaped Anime Rage Eyebrow Scowl (in face_011_13 space, +Z is DOWN, -Z is UP)
    for (let i = 0; i < this.browSkinBones.length; i++) {
      const { bone, restPos, tier } = this.browSkinBones[i];
      let zOffset = 0;
      if (tier === 'inner') {
        // Pull inner eyebrows down sharply into a fierce rage scowl
        zOffset = r * 0.0085;
      } else if (tier === 'mid') {
        zOffset = r * 0.0025;
      } else {
        // Flare outer eyebrow tips upward
        zOffset = -r * 0.0045;
      }
      bone.position.z += (restPos.z + zOffset - bone.position.z) * 0.2;
    }

    // 5. Power-Charge Arm Flex in Rage Mode
    const armSway = breathWave * 0.028;
    // In Rage Mode, flare arms slightly outward (-0.68 vs -0.88) and flex elbows forward
    const rageArmFlare = r * 0.22;
    if (this.leftArmBone) {
      this.leftArmBone.rotation.z = -0.88 + rageArmFlare - armSway;
      this.leftArmBone.rotation.x = 0.06 + r * 0.18;
    }
    if (this.rightArmBone) {
      this.rightArmBone.rotation.z = 0.88 - rageArmFlare + armSway;
      this.rightArmBone.rotation.x = 0.06 + r * 0.18;
    }
    if (this.leftArmExBone) {
      this.leftArmExBone.rotation.z = -0.58 + rageArmFlare * 0.65 - armSway * 0.65;
    }
    if (this.rightArmExBone) {
      this.rightArmExBone.rotation.z = 0.58 - rageArmFlare * 0.65 + armSway * 0.65;
    }
    if (this.leftElbowBone) {
      this.leftElbowBone.rotation.x = 0.14 + r * 0.35;
    }
    if (this.rightElbowBone) {
      this.rightElbowBone.rotation.x = 0.14 + r * 0.35;
    }

    // 6. Real-Time 3D Eye Gaze Tracking
    const eyeYaw = THREE.MathUtils.clamp(mouseX * 0.14, -0.16, 0.16);
    const eyePitch = THREE.MathUtils.clamp(-mouseY * 0.1, -0.12, 0.12);
    const eyeOffsetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(eyePitch, eyeYaw, 0, 'YXZ')
    );

    if (this.leftEyeBone) {
      const targetEyeQ = this.leftEyeRestQuat.clone().multiply(eyeOffsetQuat);
      this.leftEyeBone.quaternion.slerp(targetEyeQ, 0.18);
    }
    if (this.rightEyeBone) {
      const targetEyeQ = this.rightEyeRestQuat.clone().multiply(eyeOffsetQuat);
      this.rightEyeBone.quaternion.slerp(targetEyeQ, 0.18);
    }

    // 7. Eyelids: Periodic Blink in Normal Mode, Wide Blazing Open in Rage Mode
    const blinkPhase = elapsedTime % 3.8;
    const isBlinking = !rageModeActive && blinkPhase > 3.62 && blinkPhase < 3.76;
    // In face_011_13 space, +Z is DOWN (close eye), -Z is UP (widen eye)
    const lidZOffset = isBlinking ? 0.0085 : -r * 0.0035;

    for (let i = 0; i < this.upperEyelidBones.length; i++) {
      const { bone, restPos } = this.upperEyelidBones[i];
      const targetZ = restPos.z + lidZOffset;
      bone.position.z += (targetZ - bone.position.z) * 0.35;
    }

    // 8. Super-Saiyan / 100% Full-Cowling Eye, Hair & Suit Bio-Electric Material Glow
    const plasmaPulse = 0.85 + 0.35 * Math.sin(elapsedTime * 16.0);
    this.eyeMaterials.forEach((mat) => {
      if (r > 0.05) {
        mat.emissive.setRGB(
          THREE.MathUtils.lerp(1.0, 0.1, r),
          1.0,
          THREE.MathUtils.lerp(1.0, 0.65, r)
        );
        mat.emissiveIntensity = THREE.MathUtils.lerp(0.35, 2.8 * plasmaPulse, r);
      } else {
        mat.emissive.setHex(0xffffff);
        mat.emissiveIntensity = 0.35;
      }
    });

    this.hairMaterials.forEach((mat) => {
      mat.emissiveIntensity = r * 0.55 * plasmaPulse;
    });

    this.suitMaterials.forEach((mat) => {
      mat.emissiveIntensity = r * 0.18 * plasmaPulse;
    });

    // 9. Animate 3D Eye-Lightning Streamers trailing from both eyes in Rage Mode
    this.eyeTrailLines.forEach((line, idx) => {
      const mat = line.material as THREE.LineBasicMaterial;
      if (r < 0.05) {
        mat.opacity = 0;
        return;
      }

      const side = idx < 2 ? 1 : -1;
      const posAttr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const segments = arr.length / 3 - 1;

      // Eye socket origin in head_010_12 local space
      const startX = side * 0.036;
      const startY = 0.054;
      const startZ = 0.092;

      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const jitter = t * 0.018;
        const h1 = Math.sin(elapsedTime * 42.0 + idx * 13.7 + s * 9.3) * jitter;
        const h2 = Math.cos(elapsedTime * 47.0 + idx * 17.1 + s * 7.7) * jitter;

        // Arc outward and upward past the temples like Deku's 100% Full Cowling eye trails
        arr[s * 3] = startX + side * (t * 0.11 + t * t * 0.06) + h1;
        arr[s * 3 + 1] = startY + t * 0.09 + (idx % 2 === 0 ? 0.03 : -0.01) * t + h2;
        arr[s * 3 + 2] = startZ - t * 0.12 + h1 * 0.5;
      }

      posAttr.needsUpdate = true;
      const flicker = Math.sin(elapsedTime * 35.0 + idx * 5.1);
      mat.opacity = r * (flicker > -0.35 ? 0.95 : 0.25);
    });
  }

  public setLayoutMode(
    mode: boolean | 'mobile' | 'tablet' | 'ipad-landscape' | 'desktop'
  ): void {
    const tier =
      typeof mode === 'boolean' ? (mode ? 'mobile' : 'desktop') : mode;
    if (tier === 'mobile') {
      // Elevate Deku into the dedicated upper-center mobile Hero stage above the card
      this.rootGroup.position.set(0, 0.34, 0);
      this.rootGroup.scale.setScalar(0.82);
    } else if (tier === 'tablet') {
      // Elevate Deku into the upper-center iPad/Tablet stage above the 2-column cards
      this.rootGroup.position.set(0, 0.28, 0);
      this.rootGroup.scale.setScalar(0.88);
    } else if (tier === 'ipad-landscape') {
      // Proportionally frame Deku between the left and right columns on 1024px-1279px iPad Landscape
      this.rootGroup.position.set(0, -0.02, 0);
      this.rootGroup.scale.setScalar(0.86);
    } else {
      this.rootGroup.position.set(0, 0.0, 0);
      this.rootGroup.scale.setScalar(1.0);
    }
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.mixer) {
      this.mixer.stopAllAction();
    }
    this.microBumpTex.dispose();
    this.generatedTextures.forEach((t) => t.dispose());
    this.rootGroup.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });
  }
}
