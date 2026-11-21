import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './providers/PortfolioProvider';
import { CinematicIntro } from '../components/layout/CinematicIntro';
import { Navbar } from '../components/navigation/Navbar';
import { HeroScene } from '../scenes/HeroScene';
import { Hero } from '../sections/Hero';
import { About } from '../sections/About';
import { Skills } from '../sections/Skills';
import { Projects } from '../sections/Projects';
import { Achievements } from '../sections/Achievements';
import { Education } from '../sections/Education';
import { Contact } from '../sections/Contact';
import { Footer } from '../components/layout/Footer';
import { ProjectModal } from '../components/projects/ProjectModal';
import { CertificateModal } from '../components/certificates/CertificateModal';
import { BackToTop } from '../components/ui/BackToTop';
import { useSectionObserver } from '../hooks/useSectionObserver';
import { initSectionScrollAnimations } from '../animations/scroll';

const PortfolioShell: React.FC = () => {
  const { setActiveSection, reducedMotion, introComplete } = usePortfolio();

  useSectionObserver(setActiveSection);

  useEffect(() => {
    if (!introComplete) return;
    const cleanup = initSectionScrollAnimations(reducedMotion);
    return cleanup;
  }, [introComplete, reducedMotion]);

  return (
    <div className="relative min-h-screen text-white selection:bg-[#00E676] selection:text-[#050807]">
      {/* Section A: Cinematic Intro Overlay */}
      <CinematicIntro />

      {/* Persistent Modular Three.js 3D Hero & Environment Engine */}
      <HeroScene />

      {/* Tactical HUD Top Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Education />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Deep-Dive Modals & Utilities */}
      <ProjectModal />
      <CertificateModal />
      <BackToTop />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <PortfolioShell />
    </PortfolioProvider>
  );
};

export default App;
