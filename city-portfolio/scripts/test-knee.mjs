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
  const lFoot = bones['L_foot_0157_243'] || gltf.scene.getObjectByName('L_foot_0157_243');
  console.log('L_foot:', lFoot?.name);

  if (lFoot) {
    gltf.scene.updateMatrixWorld(true);
    const footBefore = new THREE.Vector3();
    lFoot.getWorldPosition(footBefore);

    lKnee.rotateX(-0.5);
    gltf.scene.updateMatrixWorld(true);
    const footAfter = new THREE.Vector3();
    lFoot.getWorldPosition(footAfter);
    console.log('Foot delta after knee rotateX(-0.5):', [footAfter.x - footBefore.x, footAfter.y - footBefore.y, footAfter.z - footBefore.z].map(v => v.toFixed(3)));
  }
});
