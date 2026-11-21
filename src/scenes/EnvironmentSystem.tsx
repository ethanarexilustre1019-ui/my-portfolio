import * as THREE from 'three';

/**
 * EnvironmentSystem
 * Replicates the smooth 3-point studio rim-lighting and soft teal/emerald backlight halo
 * behind the character's neck/shoulders, intensifying into an explosive Super-Saiyan
 * emerald-cyan aura when RAGE MODE is active.
 */
export class EnvironmentSystem {
  public readonly group: THREE.Group;
  private keyLight: THREE.DirectionalLight;
  private rightRimLight: THREE.PointLight;
  private leftCyanRimLight: THREE.PointLight;
  private frontFillLight: THREE.PointLight;
  private backlightHalo: THREE.Mesh;

  constructor(scene: THREE.Scene, isMobile: boolean) {
    this.group = new THREE.Group();
    scene.fog = new THREE.FogExp2('#070b0e', isMobile ? 0.022 : 0.015);

    const ambientLight = new THREE.AmbientLight('#1f2e28', 1.65);
    this.group.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight('#e4f5ec', '#0b1318', 1.35);
    hemiLight.position.set(0, 10, 0);
    this.group.add(hemiLight);

    this.keyLight = new THREE.DirectionalLight('#fff3e6', 2.15);
    this.keyLight.position.set(-2.4, 2.8, 4.2);
    this.group.add(this.keyLight);

    this.frontFillLight = new THREE.PointLight('#e6f7ef', 1.4, 10, 1.5);
    this.frontFillLight.position.set(0.2, 0.3, 3.2);
    this.group.add(this.frontFillLight);

    this.rightRimLight = new THREE.PointLight('#00E676', 9.5, 14, 1.35);
    this.rightRimLight.position.set(2.5, 0.75, -0.55);
    this.group.add(this.rightRimLight);

    this.leftCyanRimLight = new THREE.PointLight('#38bdf8', 7.5, 14, 1.35);
    this.leftCyanRimLight.position.set(-2.5, 0.35, -0.65);
    this.group.add(this.leftCyanRimLight);

    // Diffused Radial Teal/Emerald Backlight Halo directly behind Character's Neck & Shoulders
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const ctx = haloCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 125);
      grad.addColorStop(0, 'rgba(20, 184, 166, 0.44)');
      grad.addColorStop(0.45, 'rgba(0, 230, 118, 0.18)');
      grad.addColorStop(1, 'rgba(7, 11, 14, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const haloTex = new THREE.CanvasTexture(haloCanvas);
    const haloGeo = new THREE.PlaneGeometry(4.4, 4.4);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.backlightHalo = new THREE.Mesh(haloGeo, haloMat);
    this.backlightHalo.position.set(0, -0.18, -1.2);
    this.group.add(this.backlightHalo);

    scene.add(this.group);
  }

  public update(elapsedTime: number, rageModeActive: boolean): void {
    this.rightRimLight.intensity =
      (rageModeActive ? 16.0 : 9.5) + Math.sin(elapsedTime * (rageModeActive ? 14.0 : 4.5)) * 1.2;
    this.leftCyanRimLight.intensity =
      (rageModeActive ? 12.5 : 7.5) + Math.cos(elapsedTime * (rageModeActive ? 14.0 : 4.5)) * 1.0;

    const haloScale =
      (rageModeActive ? 1.28 : 1.0) +
      Math.sin(elapsedTime * (rageModeActive ? 10.0 : 2.0)) * (rageModeActive ? 0.06 : 0.035);
    this.backlightHalo.scale.set(haloScale, haloScale, 1);
  }

  public setLayoutMode(_isMobile: boolean): void {}

  public dispose(): void {
    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
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
