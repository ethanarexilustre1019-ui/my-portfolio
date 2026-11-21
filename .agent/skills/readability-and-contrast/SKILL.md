---
name: readability-and-contrast
description: Skill enforcing WCAG high-contrast typography, spacious navbar branding, and a soft ~30% depth-of-field blur on the 3D hero scene when scrolling through content sections.
---

# Readability, Contrast & Soft 3D Depth-of-Field Blur Skill

## 1. Soft ~30% Blur & Dim on Scroll (Never Solid Black)
- In **01. HOME (`#hero`)**, the 3D Deku character bust renders with `0px` blur and `100%` brightness.
- As the user scrolls into **02. ABOUT** through **07. CONTACT**, `HeroScene.tsx` keeps the 3D Deku character visible and animated in the background while applying a smooth depth-of-field blur (`blur(8px)`) and ~34% dim (`rgba(5, 8, 7, 0.34)`), paired with subtle text drop-shadows on section headers so foreground text is completely legible while the 3D character remains visible behind it.

## 2. Typography & Surface Contrast
- Body text color: `#E2ECE7` / `#D5E2DC` with crisp dark text-shadow on unboxed section subtitles.
- Card surface background: `rgba(12, 21, 17, 0.84)` with `backdrop-filter: blur(16px)`.
