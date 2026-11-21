import * as THREE from 'three';

/**
 * CameraController
 * Frames the close-up 3D Stylized Midoriya Bust in the Hero section (z = 3.65)
 * with subtle mouse-based camera parallax and scroll recession.
 */
export class CameraController {
  public readonly camera: THREE.PerspectiveCamera;
  private mouseX = 0;
  private mouseY = 0;
  private scrollProgress = 0;
  private targetPos = new THREE.Vector3(0, 0.05, 3.65);
  private lookAtTarget = new THREE.Vector3(0, 0.02, 0);

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.copy(this.targetPos);
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
    if (reducedMotion) {
      this.camera.position.set(0, 0.05, 3.65);
      this.camera.lookAt(0, 0.02, 0);
      return;
    }

    const baseZ = 3.65 + this.scrollProgress * 1.4;
    const baseY = 0.05 - this.scrollProgress * 0.55;

    this.targetPos.set(
      this.mouseX * 0.22,
      baseY + this.mouseY * 0.14,
      baseZ
    );

    this.camera.position.lerp(this.targetPos, 0.07);
    this.lookAtTarget.set(this.mouseX * 0.06, 0.02 + this.mouseY * 0.05, 0);
    this.camera.lookAt(this.lookAtTarget);
  }

  public resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
