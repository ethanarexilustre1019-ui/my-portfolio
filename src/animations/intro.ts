import gsap from 'gsap';

export function animateIntroExit(
  container: HTMLElement | null,
  onComplete: () => void,
  reducedMotion = false
): void {
  if (!container) {
    onComplete();
    return;
  }

  if (reducedMotion) {
    gsap.to(container, {
      opacity: 0,
      duration: 0.2,
      onComplete,
    });
    return;
  }

  const tl = gsap.timeline({
    onComplete,
  });

  tl.to(container.querySelectorAll('[data-intro-item]'), {
    y: -18,
    opacity: 0,
    stagger: 0.05,
    duration: 0.35,
    ease: 'power2.in',
  }).to(
    container,
    {
      scale: 1.06,
      opacity: 0,
      duration: 0.55,
      ease: 'power3.inOut',
    },
    '-=0.15'
  );
}
