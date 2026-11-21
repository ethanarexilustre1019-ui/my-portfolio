# GitHub Copilot Instructions — Ethan Arex V. Ilustre Portfolio

When generating or refactoring code, UI components, shaders, or copy in this repository, adhere strictly to these guidelines:

1. **Architecture & Folder Responsibilities**:
   - `src/data/`: Single source of truth for profile, projects, skills, certificates, and education data. Never hardcode project or certificate strings inside JSX components.
   - `src/scenes/`: Modular native Three.js classes (`HeroScene.tsx`, `CharacterController.ts`, `EnergySystem.ts`, `EnvironmentSystem.ts`, `CameraController.ts`, `PostProcessing.ts`).
   - `src/sections/`: Complete portfolio sections (`Hero.tsx`, `About.tsx`, `Skills.tsx`, `Projects.tsx`, `Achievements.tsx`, `Education.tsx`, `Contact.tsx`).
   - `src/animations/`: Reusable GSAP timelines and ScrollTrigger helpers (`intro.ts`, `scroll.ts`, `transitions.ts`).

2. **Eliminate "AI Slop" in Copy & UI**:
   - Do not write hyperbolic marketing fluff or vague buzzwords.
   - Never invent unverified project capabilities, graduation dates, or skill percentages.
   - Design UI elements with intentional tactical HUD framing: chamfered corners, subtle technical grid overlays, monospace telemetry indices (`01 //`, `SYS.VERIFIED`), and emerald bio-electric highlights (`#00E676`).

3. **Three.js & Animation Best Practices**:
   - Cache geometries and materials; never instantiate new `THREE.BufferGeometry` or `THREE.ShaderMaterial` inside `requestAnimationFrame`.
   - Respect `reducedMotion` state across both GSAP timelines and Three.js camera/shader loops.
