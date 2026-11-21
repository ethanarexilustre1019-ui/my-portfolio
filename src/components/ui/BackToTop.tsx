import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { usePortfolio } from '../../app/providers/PortfolioProvider';
import { audioService } from '../../services/audioService';

export const BackToTop: React.FC = () => {
  const { reducedMotion } = usePortfolio();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    audioService.playClick();
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 z-30 w-10 h-10 rounded-[3px] bg-[#F4F7F5] text-[#050807] hover:bg-[#00E676] flex items-center justify-center transition-all cursor-pointer shadow-lg"
    >
      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
};
