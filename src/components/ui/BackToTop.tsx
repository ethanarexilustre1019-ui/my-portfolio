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
      aria-label="Scroll back to top"
      className="fixed bottom-6 right-6 z-30 w-11 h-11 hud-panel flex items-center justify-center text-[#00E676] border-[#00E676]/50 hover:bg-[#00E676] hover:text-[#050807] transition-all cursor-pointer shadow-[0_0_20px_rgba(0,230,118,0.25)]"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
