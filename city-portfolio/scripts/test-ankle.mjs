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

  const lKnee = bones['L_knee_0156_242'];
  const lAnkle = bones['L_ankle_0157_243'];

  gltf.scene.updateMatrixWorld(true);
  const ankleBefore = new THREE.Vector3();
  lAnkle.getWorldPosition(ankleBefore);

  lKnee.rotateX(-0.5);
  gltf.scene.updateMatrixWorld(true);
  const ankleAfter = new THREE.Vector3();
  lAnkle.getWorldPosition(ankleAfter);
  console.log('Ankle delta after knee rotateX(-0.5):', [ankleAfter.x - ankleBefore.x, ankleAfter.y - ankleBefore.y, ankleAfter.z - ankleBefore.z].map(v => v.toFixed(3)));
});
