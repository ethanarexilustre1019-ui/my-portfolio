---
name: threejs-pbr-character
description: Skill for upgrading unlit anime GLB models into smooth, studio-lit 3D stylized PBR characters with multi-joint skeletal animations in Three.js.
---

# Three.js Smooth Stylized PBR Character & Skeletal Animation Skill

## 1. Material & Normal Upgrade Pipeline (`src/scenes/CharacterController.tsx`)
- **Smooth Vertex Normals**: Call `computeSmoothSkinnedNormals(mesh.geometry)` to weld split seam normals by spatial coordinate so 3-point rim lighting transitions smoothly across cheeks, jaw, hair locks, and shoulders.
- **2D Ink-Line Removal**: Run `createSmoothedSuitTexture` on `dummy_material_1` to replace dark baked comic outline pixels (`RGB < 45`) with a local neighborhood average.
- **Stylized Vinyl/Clay PBR**: Use `THREE.MeshPhysicalMaterial` with `roughness: 0.44`, `clearcoat: 0.08..0.22`, `sheen: 0.35..0.55`, and a procedural micro-pore bump texture (`bumpScale: 0.002`).

## 2. Multi-Joint Skeletal Animation Invariants
- Always preserve rest quaternions (`headRestQuat`, `neckRestQuat`, `chestRestQuat`, `gogglesRestQuat`, `leftEyeRestQuat`, `rightEyeRestQuat`) and compose delta Euler rotations via `.clone().multiply(offsetQuat)` + `.slerp(...)`.
- Rotate shoulder deltoid helper bones (`L_arm_EX_0118_191`, `R_arm_EX_0152_236`) at ~65% of the upper arm angle (`L_arm_086_149`, `R_arm_0120_194`) to eliminate shoulder mesh pinching.
