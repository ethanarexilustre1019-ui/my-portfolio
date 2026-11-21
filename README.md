# Ethan Arex V. Ilustre — Immersive 3D Developer Portfolio

> *"I don't just write code. I identify problems, develop solutions, and turn ideas into reality."*

An interactive, anime-inspired (My Hero Academia / Emerald Full-Cowling bio-electric energy) 3D developer portfolio engineered for **Ethan Arex V. Ilustre** — Third-Year Bachelor of Science in Information Technology (BSIT) student at the **University of Negros Occidental – Recoletos (UNO-R)**, Philippines.

---

## 1. Technology Stack

- **Core**: React 19, Vite 6, TypeScript 5
- **3D Rendering Engine**: Native Three.js (`WebGLRenderer`, `GLTFLoader`, `AnimationMixer`, custom GLSL `ShaderMaterial`, `BufferGeometry`, `EffectComposer`, `UnrealBloomPass`)
- **Animation**: GSAP (`gsap` + `ScrollTrigger`)
- **Styling**: Tailwind CSS v4 + Bespoke Chamfered Tactical HUD CSS (`src/styles/globals.css`)
- **Icons**: `lucide-react`
- **Anti-"AI Slop" Governance**: `.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.agent/rules/anti-ai-slop.md`, `.agent/skills/bespoke-3d-ui/SKILL.md`

---

## 2. Project Structure

```text
d:\portfolio\
├── .agent/
│   ├── rules/anti-ai-slop.md
│   └── skills/bespoke-3d-ui/SKILL.md
├── .github/
│   └── copilot-instructions.md
├── public/
│   ├── models/                    # Optional external GLB drop-in (/models/emerald-hero.glb)
│   ├── textures/
│   ├── images/
│   │   ├── profile/               # Drop profile photo at ethan-profile.jpg
│   │   ├── projects/              # Verified live project screenshots (Mol's Tyangge, SBAT)
│   │   └── achievements/          # Verified certificates (nasa-space-apps-2026.jpg, ibm-bob-hackathon-2026.jpg)
│   ├── resume/                    # Drop updated resume PDF at Ethan-Arex-Ilustre-Resume.pdf
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── providers/PortfolioProvider.tsx
│   ├── components/
│   │   ├── layout/                # CinematicIntro.tsx, Footer.tsx
│   │   ├── navigation/            # Navbar.tsx
│   │   ├── ui/                    # BackToTop.tsx
│   │   ├── projects/              # ProjectModal.tsx, LunarGlobePreview.tsx
│   │   └── certificates/          # CertificateModal.tsx
│   ├── scenes/
│   │   ├── HeroScene.tsx
│   │   ├── CharacterController.tsx
│   │   ├── EnergySystem.tsx
│   │   ├── EnvironmentSystem.tsx
│   │   ├── CameraController.tsx
│   │   └── PostProcessing.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Achievements.tsx
│   │   ├── Education.tsx
│   │   └── Contact.tsx
│   ├── animations/                # intro.ts, scroll.ts, transitions.ts
│   ├── data/                      # profile.ts, projects.ts, skills.ts, certificates.ts, education.ts
│   ├── hooks/                     # useSectionObserver.ts
│   ├── services/                  # audioService.ts, contactService.ts
│   ├── styles/                    # globals.css
│   ├── types/                     # portfolio.ts
│   └── main.tsx
├── .cursorrules
├── CLAUDE.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Adding Your Profile Picture, Resume, or Additional Certificates

1. **Profile Picture**:
   - Place your profile image at `public/images/profile/ethan-profile.jpg` (or update `profileImagePath` in `src/data/profile.ts`). The About section automatically renders your photo when present and falls back to the holographic EAI emblem when absent.
2. **Resume PDF**:
   - Place your latest PDF resume at `public/resume/Ethan-Arex-Ilustre-Resume.pdf`. An initial summary PDF is already generated there so the **Download Resume** button works out of the box.
3. **Additional Certificates**:
   - Place new certificate images in `public/images/achievements/` and append a new entry to `certificatesData` in `src/data/certificates.ts`.

---

## 4. Development & Production Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview
```

---

## 5. Deployment (Vercel / Netlify)

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables** (Optional):
  - `VITE_CONTACT_ENDPOINT`: Set to a Formspree / Web3Forms / serverless webhook URL if you want direct JSON POST submissions in addition to the built-in `mailto:ethanilustre@yahoo.com` dispatch.
