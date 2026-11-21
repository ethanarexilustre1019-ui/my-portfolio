import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSectionScrollAnimations(reducedMotion = false): () => void {
  if (reducedMotion || typeof window === 'undefined') {
    return () => {};
  }

  const ctx = gsap.context(() => {
    const revealElements = gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]');
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        {
          y: 18,
          opacity: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  });

  return () => {
    ctx.revert();
  };
}
