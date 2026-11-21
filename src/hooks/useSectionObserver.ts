import { useEffect } from 'react';
import { SectionId } from '../types/portfolio';

const SECTION_IDS: SectionId[] = [
  'hero',
  'about',
  'skills',
  'projects',
  'achievements',
  'education',
  'contact',
];

export function useSectionObserver(onSectionChange: (section: SectionId) => void): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            if (SECTION_IDS.includes(id)) {
              onSectionChange(id);
            }
          }
        });
      },
      {
        rootMargin: '-32% 0px -48% 0px',
        threshold: 0.05,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onSectionChange]);
}
