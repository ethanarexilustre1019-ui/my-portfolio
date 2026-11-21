import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePortfolio } from '../app/providers/PortfolioProvider';
import { CameraController, ViewportDeviceTier } from './CameraController';
import { CharacterController } from './CharacterController';
import { EnergySystem } from './EnergySystem';
import { EnvironmentSystem } from './EnvironmentSystem';
import { PostProcessing } from './PostProcessing';

function resolveDeviceTier(width: number): ViewportDeviceTier {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1280) return 'ipad-landscape';
  return 'desktop';
}

export const HeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const scrollBlurOverlayRef = useRef<HTMLDivElement | null>(null);
  const { reducedMotion, energySurge } = usePortfolio();
  const [webglAvailable, setWebglAvailable] = useState<boolean>(true);
  const surgeRef = useRef<boolean>(energySurge);
  const reducedMotionRef = useRef<boolean>(reducedMotion);

  useEffect(() => {
    surgeRef.current = energySurge;
  }, [energySurge]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglAvailable(false);
      return;
    }

    let currentWidth = container.clientWidth || window.innerWidth || 1440;
    let currentHeight = container.clientHeight || window.innerHeight || 900;
    const isMobile = currentWidth < 768;
    const initialTier = resolveDeviceTier(currentWidth);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(currentWidth, currentHeight, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.setClearColor('#060a09', 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cameraController = new CameraController(currentWidth / currentHeight, initialTier);
    const environmentSystem = new EnvironmentSystem(scene, isMobile);
    const characterController = new CharacterController(scene, isMobile);
    characterController.setLayoutMode(initialTier);
    const energySystem = new EnergySystem(scene, isMobile);
    const postProcessing = new PostProcessing(
      renderer,
      scene,
      cameraController.camera,
      currentWidth,
      currentHeight,
      isMobile
    );

    environmentSystem.update(0.5, false);
    characterController.update(0.016, 0.5, 0, 0, false);
    energySystem.update(0.5, false);

    const clock = new THREE.Clock();
    let animationFrameId = 0;
    let isPageHidden = document.hidden;

    const handleVisibilityChange = () => {
      isPageHidden = document.hidden;
      if (!isPageHidden) {
        clock.getDelta();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -(event.clientY / window.innerHeight) * 2 + 1;
      cameraController.handleMouseMove(nx, ny);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const nx = (touch.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
        const ny = -(touch.clientY / Math.max(window.innerHeight, 1)) * 2 + 1;
        cameraController.handleMouseMove(nx * 0.75, ny * 0.65);
      }
    };

    const updateScrollState = () => {
      const vh = Math.max(window.innerHeight, 1);
      const scrollY = window.scrollY;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - vh,
        1
      );
      cameraController.handleScroll(scrollY / maxScroll);

      // Keep the 3D Deku character visible in the background as the user scrolls down,
      // applying a light ~30-35% dim and soft depth-of-field blur after the Hero section
      // so the character remains visible while all foreground text is easy to read.
      const fadeStart = vh * 0.12;
      const fadeEnd = vh * 0.65;
      const scrollFactor = THREE.MathUtils.clamp(
        (scrollY - fadeStart) / Math.max(fadeEnd - fadeStart, 1),
        0,
        1
      );

      if (container) {
        const blurPx = (scrollFactor * 7.5).toFixed(2);
        const brightness = (1 - scrollFactor * 0.32).toFixed(3);
        container.style.filter =
          scrollFactor > 0.01
            ? `blur(${blurPx}px) brightness(${brightness})`
            : 'none';
      }

      if (scrollBlurOverlayRef.current) {
        scrollBlurOverlayRef.current.style.opacity = String(scrollFactor * 0.34);
      }
    };

    const syncViewportSize = () => {
      const w = container.clientWidth || window.innerWidth || 1440;
      const h = container.clientHeight || window.innerHeight || 900;
      const mobileNow = w < 768;
      const tierNow = resolveDeviceTier(w);

      currentWidth = w;
      currentHeight = h;

      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, mobileNow ? 1.5 : 2);
      renderer.setPixelRatio(nextPixelRatio);
      renderer.setSize(w, h, false);
      cameraController.resize(w / h, tierNow);
      postProcessing.resize(w, h, nextPixelRatio);
      environmentSystem.setLayoutMode(mobileNow);
      characterController.setLayoutMode(tierNow);
      energySystem.setLayoutMode(mobileNow);
      updateScrollState();
    };

    updateScrollState();

    const resizeObserver = new ResizeObserver(() => {
      syncViewportSize();
    });
    resizeObserver.observe(container);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', syncViewportSize);

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);

      if (isPageHidden) return;

      const liveW = container.clientWidth || window.innerWidth;
      const liveH = container.clientHeight || window.innerHeight;
      if (liveW !== currentWidth || liveH !== currentHeight) {
        syncViewportSize();
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();
      const isReduced = reducedMotionRef.current;
      const isSurge = surgeRef.current;

      const mouse = cameraController.getMouse();
      cameraController.update(isReduced);

      if (!isReduced) {
        environmentSystem.update(elapsedTime, isSurge);
        characterController.update(delta, elapsedTime, mouse.x, mouse.y, isSurge);
        energySystem.update(elapsedTime, isSurge);
      }

      postProcessing.render(isSurge);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', syncViewportSize);

      environmentSystem.dispose();
      characterController.dispose();
      energySystem.dispose();
      postProcessing.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglAvailable) {
    return (
      <div
        className="fixed inset-0 z-0 bg-[#060a09] bg-tactical-grid"
        aria-label="Static futuristic emerald environment fallback"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,230,118,0.16),transparent_55%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        ref={mountRef}
        className="w-full h-full transition-[filter] duration-150 will-change-[filter]"
      />
      {/* Subtle outer edge vignette keeping the center 3D Deku GLB model bright in the Hero section */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,transparent_45%,rgba(5,8,7,0.72)_100%)]" />
      {/* Light ~34% translucent tint when scrolled down so the softly blurred 3D Deku remains visible while text stays legible */}
      <div
        ref={scrollBlurOverlayRef}
        className="absolute inset-0 bg-[#050807] transition-opacity duration-150"
        style={{ opacity: 0 }}
      />
    </div>
  );
};
