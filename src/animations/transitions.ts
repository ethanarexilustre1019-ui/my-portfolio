import gsap from 'gsap';

export function animateModalOpen(element: HTMLElement | null, reducedMotion = false): void {
  if (!element) return;
  if (reducedMotion) {
    gsap.set(element, { opacity: 1, scale: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.96, y: 18 },
    { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: 'power3.out' }
  );
}
