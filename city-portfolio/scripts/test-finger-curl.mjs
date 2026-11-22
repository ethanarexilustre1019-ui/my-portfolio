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

  const lHand = bones['L_hand_088_151'];
  const lIndexA = bones['L_indexfinger_A_092_156'];
  const lIndexTip = bones['L_indexfinger_C_end_0249_159'];

  gltf.scene.updateMatrixWorld(true);
  const tipBefore = new THREE.Vector3();
  lIndexTip.getWorldPosition(tipBefore);

  lIndexA.rotateZ(0.6);
  gltf.scene.updateMatrixWorld(true);
  const tipAfterZ = new THREE.Vector3();
  lIndexTip.getWorldPosition(tipAfterZ);
  console.log('Index rotateZ(0.6) delta:', [tipAfterZ.x - tipBefore.x, tipAfterZ.y - tipBefore.y, tipAfterZ.z - tipBefore.z].map(v => v.toFixed(3)));

  lIndexA.rotation.set(0, 0, 0);
  lIndexA.rotateX(0.6);
  gltf.scene.updateMatrixWorld(true);
  const tipAfterX = new THREE.Vector3();
  lIndexTip.getWorldPosition(tipAfterX);
  console.log('Index rotateX(0.6) delta:', [tipAfterX.x - tipBefore.x, tipAfterX.y - tipBefore.y, tipAfterX.z - tipBefore.z].map(v => v.toFixed(3)));
});
