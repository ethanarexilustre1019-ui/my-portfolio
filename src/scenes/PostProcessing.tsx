import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * PostProcessing
 * Configures selective UnrealBloomPass (high threshold = 0.88) so ONLY emissive
 * bio-electric green lightning and energy veins glow, while the 3D Midoriya bust's
 * eyes, irises, catchlights, skin, teeth, and silver collar stay razor-sharp.
 */
export class PostProcessing {
  private composer: EffectComposer;
  private bloomPass: UnrealBloomPass;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
    isMobile: boolean
  ) {
    this.composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      isMobile ? 0.32 : 0.45, // restrained selective bloom strength
      0.35, // radius
      0.88 // high threshold: prevents white sclera/teeth from blooming
    );
    this.composer.addPass(this.bloomPass);
  }

  public render(surgeActive: boolean): void {
    this.bloomPass.strength = surgeActive ? 0.75 : 0.45;
    this.composer.render();
  }

  public resize(width: number, height: number): void {
    this.composer.setSize(width, height);
  }

  public dispose(): void {
    this.composer.dispose();
  }
}
