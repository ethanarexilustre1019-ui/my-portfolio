import React, { createContext, useContext, useEffect, useState } from 'react';
import { CertificateItem, ProjectItem, SectionId } from '../../types/portfolio';
import { audioService } from '../../services/audioService';

interface PortfolioContextValue {
  introComplete: boolean;
  completeIntro: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  energySurge: boolean;
  triggerEnergySurge: () => void;
  selectedProject: ProjectItem | null;
  setSelectedProject: (project: ProjectItem | null) => void;
  selectedCertificate: CertificateItem | null;
  setSelectedCertificate: (cert: CertificateItem | null) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [energySurge, setEnergySurge] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const completeIntro = () => {
    if (soundEnabled) {
      audioService.playNormalModeSound();
    }
    setIntroComplete(true);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioService.setEnabled(next);
  };

  const toggleReducedMotion = () => {
    audioService.playClick();
    setReducedMotion((prev) => !prev);
  };

  // Interactive Toggle for Deku 100% Full-Cowling / Super-Saiyan RAGE MODE
  const triggerEnergySurge = () => {
    setEnergySurge((prev) => {
      const nextRage = !prev;
      if (!soundEnabled) {
        setSoundEnabled(true);
        audioService.setEnabled(true);
      }
      if (nextRage) {
        audioService.playRageModeSound();
      } else {
        audioService.playNormalModeSound();
      }
      return nextRage;
    });
  };

  return (
    <PortfolioContext.Provider
      value={{
        introComplete,
        completeIntro,
        soundEnabled,
        toggleSound,
        reducedMotion,
        toggleReducedMotion,
        activeSection,
        setActiveSection,
        energySurge,
        triggerEnergySurge,
        selectedProject,
        setSelectedProject,
        selectedCertificate,
        setSelectedCertificate,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextValue {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
