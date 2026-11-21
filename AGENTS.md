# AGENTS.md — Universal Agent Governance & Anti-"AI Slop" Specification

This repository contains the production 3D developer portfolio of **Ethan Arex V. Ilustre** (Third-Year BSIT Student at University of Negros Occidental – Recoletos, Philippines).

All AI coding assistants (Cursor, Claude Code, GitHub Copilot, Windsurf, Antigravity) operating in this repository MUST enforce the following rules across codebase architecture, 3D rendering, UI layout, and copywriting.

---

## 1. Readability, Clean Navbar & Soft 3D Background Depth-of-Field Blur on Scroll
- **Keep the 3D Deku Character Visible While Ensuring Effortless Text Readability**:
  - The 3D Deku Hero Bust (`/models/deku/source/fortnite_deku.glb`) and its radial teal/emerald backlight halo are showcased at 100% sharpness in **01. HOME (`#hero`)**.
  - As the user scrolls past `#hero` (`window.scrollY > window.innerHeight * 0.12`), `HeroScene.tsx` keeps `characterController.rootGroup.visible = true` and smoothly transitions in a **light ~30–35% dim + soft depth-of-field blur (`blur(7.5px)` / `rgba(5, 8, 7, 0.34)`)** so the animated 3D Deku character and emerald aura remain visible behind **02. ABOUT** through **07. CONTACT** while every heading, subtitle, and card remains crisp and effortless to read.
- **Minimal, Uncluttered Navbar**:
  - Do not display the redundant top-left `[EAI] ETHAN AREX V. ILUSTRE` branding block in the navbar (since Ethan's name is prominently displayed in the Hero section). Keep the navbar focused on the section navigation links (`01. HOME`..`07. CONTACT`) and the interactive `RAGE MODE`, audio, and motion controls.

## 2. Three.js Smooth Stylized 3D PBR Character & Interactive RAGE MODE Pipeline
- Model path: `/public/models/deku/source/fortnite_deku.glb`
- Because the raw GLB carries `KHR_materials_unlit`, `CharacterController.tsx` MUST:
  1. Weld duplicate vertex positions (`computeSmoothSkinnedNormals`) for continuous, crease-free 3D surface normals.
  2. Filter out baked 2D black comic ink lines on `dummy_material_1` (`createSmoothedSuitTexture`) and upgrade materials to `THREE.MeshPhysicalMaterial` with micro-pore bump texture (`createMicroPoreBumpTexture`), clearcoat, and subsurface sheen.
  3. Pose `L_collar_085_148`, `L_arm_086_149`, and `L_arm_EX_0118_191` (and right-side equivalents) in harmony so the shoulders remain smooth and pinch-free.
  4. Preserve `this.gogglesRestQuat` on `AC_goggles_0153_238` so the metallic respirator collar rests around the neck below the chin.
  5. Support an interactive **RAGE MODE (One-For-All 100% / Super-Saiyan Overdrive)** toggle (`energySurge`) that transforms Deku's facial bones (`jaw_A_074_128` battle roar, furrowed rage eyebrows, widened eyes), ignites his eyes and spiky hair with radiant emerald-cyan bio-electric glow, flexes his chest and arms into a power-charge stance, and erupts with 3D eye-lightning trails, rising energy aura rings, and high-voltage lightning bolts.

## 3. Anti-"AI Slop" Copywriting & Factual Accuracy
- Never use generic AI buzzwords ("delve into", "testament to", "cutting-edge synergy", "unleash", "elevate").
- Never invent proficiency percentages (`React 95%`), fake metrics, or unverified graduation dates.
- Always represent `PhishNot` with a `DEVELOPMENT IN PROGRESS` badge as an active BSIT Capstone Project providing decision support (not an absolute guarantee of security).
