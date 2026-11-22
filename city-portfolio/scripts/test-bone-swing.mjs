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

  const lLeg = bones['L_leg_0155_241'];
  const lKnee = bones['L_knee_0156_242'];

  console.log('Found L_leg:', Boolean(lLeg), 'L_knee:', Boolean(lKnee));

  gltf.scene.updateMatrixWorld(true);
  const kneeWorldBefore = new THREE.Vector3();
  lKnee.getWorldPosition(kneeWorldBefore);
  console.log('Knee initial world pos:', kneeWorldBefore.toArray().map(v => v.toFixed(3)));

  // Test rotate L_leg around X
  lLeg.rotateX(0.5);
  gltf.scene.updateMatrixWorld(true);
  const kneeWorldAfterX = new THREE.Vector3();
  lKnee.getWorldPosition(kneeWorldAfterX);
  console.log('Knee world pos after rotateX(0.5):', kneeWorldAfterX.toArray().map(v => v.toFixed(3)), 'delta:', [kneeWorldAfterX.x - kneeWorldBefore.x, kneeWorldAfterX.y - kneeWorldBefore.y, kneeWorldAfterX.z - kneeWorldBefore.z].map(v => v.toFixed(3)));

  // Test rotate L_leg around Z
  lLeg.rotation.set(0, 0, 0); // reset
  lLeg.rotateZ(0.5);
  gltf.scene.updateMatrixWorld(true);
  const kneeWorldAfterZ = new THREE.Vector3();
  lKnee.getWorldPosition(kneeWorldAfterZ);
  console.log('Knee world pos after rotateZ(0.5):', kneeWorldAfterZ.toArray().map(v => v.toFixed(3)), 'delta:', [kneeWorldAfterZ.x - kneeWorldBefore.x, kneeWorldAfterZ.y - kneeWorldBefore.y, kneeWorldAfterZ.z - kneeWorldBefore.z].map(v => v.toFixed(3)));
});
