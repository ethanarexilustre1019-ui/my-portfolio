import * as THREE from 'three';

export type ViewportDeviceTier = 'mobile' | 'tablet' | 'ipad-landscape' | 'desktop';

/**
 * CameraController
 * Frames the 3D Stylized Midoriya Bust across Mobile (<768px), Tablet/iPad (768-1023px),
 * and Desktop/iPad Landscape (1024px+), supporting both mouse and touch parallax.
 */
export class CameraController {
  public readonly camera: THREE.PerspectiveCamera;
  private mouseX = 0;
  private mouseY = 0;
  private scrollProgress = 0;
  private tier: ViewportDeviceTier = 'desktop';
  private targetPos = new THREE.Vector3(0, 0.05, 3.65);
  private lookAtTarget = new THREE.Vector3(0, 0.02, 0);

  constructor(aspect: number, tier: ViewportDeviceTier = 'desktop') {
    this.tier = tier;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.applyBaseTransform();
    this.camera.position.copy(this.targetPos);
  }

  private getBaseCameraCoords(): { z: number; y: number; lookY: number } {
    if (this.tier === 'mobile') {
      return { z: 4.25, y: 0.14, lookY: 0.15 };
    }
    if (this.tier === 'tablet') {
      return { z: 3.95, y: 0.12, lookY: 0.14 };
    }
    if (this.tier === 'ipad-landscape') {
      return { z: 3.92, y: 0.04, lookY: 0.02 };
    }
    return { z: 3.65, y: 0.05, lookY: 0.02 };
  }

  private applyBaseTransform(): void {
    const { z, y, lookY } = this.getBaseCameraCoords();
    this.targetPos.set(0, y, z);
    this.lookAtTarget.set(0, lookY, 0);
  }

  public setDeviceTier(tier: ViewportDeviceTier): void {
    this.tier = tier;
  }

  public handleMouseMove(normalizedX: number, normalizedY: number): void {
    this.mouseX = THREE.MathUtils.clamp(normalizedX, -1, 1);
    this.mouseY = THREE.MathUtils.clamp(normalizedY, -1, 1);
  }

  public handleScroll(scrollProgress: number): void {
    this.scrollProgress = THREE.MathUtils.clamp(scrollProgress, 0, 1);
  }

  public getMouse(): { x: number; y: number } {
    return { x: this.mouseX, y: this.mouseY };
  }

  public update(reducedMotion: boolean): void {
    const { z, y, lookY } = this.getBaseCameraCoords();

    if (reducedMotion) {
      this.camera.position.set(0, y, z);
      this.camera.lookAt(0, lookY, 0);
      return;
    }

    const baseZ = z + this.scrollProgress * 1.3;
    const baseY = y - this.scrollProgress * 0.48;

    this.targetPos.set(
      this.mouseX * 0.22,
      baseY + this.mouseY * 0.14,
      baseZ
    );

    this.camera.position.lerp(this.targetPos, 0.07);
    this.lookAtTarget.set(this.mouseX * 0.06, lookY + this.mouseY * 0.05, 0);
    this.camera.lookAt(this.lookAtTarget);
  }

  public resize(aspect: number, tier: ViewportDeviceTier = 'desktop'): void {
    this.tier = tier;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
