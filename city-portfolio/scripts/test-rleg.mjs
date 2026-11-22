import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

if (!globalThis.self) globalThis.self = globalThis;
if (!globalThis.window) globalThis.window = globalThis;

const loader = new GLTFLoader();
const buf = fs.readFileSync('D:/portfolio/public/models/deku/source/fortnite_deku.glb');
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

loader.parse(arrayBuffer, '', (gltf) => {
  const bones = {};
  gltf.scene.traverse(c => {
    if (c.name) bones[c.name] = c;
  });

  const rLeg = bones['R_leg_0173_264'];
  const rKnee = bones['R_knee_0174_265'];

  gltf.scene.updateMatrixWorld(true);
  const kneeWorldBefore = new THREE.Vector3();
  rKnee.getWorldPosition(kneeWorldBefore);

  rLeg.rotateX(0.5);
  gltf.scene.updateMatrixWorld(true);
  const kneeWorldAfterX = new THREE.Vector3();
  rKnee.getWorldPosition(kneeWorldAfterX);
  console.log('R_leg rotateX(0.5) delta:', [kneeWorldAfterX.x - kneeWorldBefore.x, kneeWorldAfterX.y - kneeWorldBefore.y, kneeWorldAfterX.z - kneeWorldBefore.z].map(v => v.toFixed(3)));
});
