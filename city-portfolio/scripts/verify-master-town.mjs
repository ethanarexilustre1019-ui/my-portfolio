import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

if (!globalThis.self) globalThis.self = globalThis;
if (!globalThis.window) globalThis.window = globalThis;

const loader = new GLTFLoader();
const buf = fs.readFileSync('d:/portfolio/public/models/town.glb');
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

loader.parse(
  arrayBuffer,
  '',
  (gltf) => {
    console.log('MASTER TOWN GLB PARSED SUCCESSFULLY!');
    let meshCount = 0;
    let vertexCount = 0;
    gltf.scene.traverse((c) => {
      if (c.isMesh) {
        meshCount++;
        vertexCount += c.geometry.attributes.position.count;
      }
    });
    console.log(`Total Meshes: ${meshCount}, Total Vertices: ${vertexCount}`);
    const box = new THREE.Box3().setFromObject(gltf.scene);
    console.log('Town Bounding Box Min:', box.min.toArray());
    console.log('Town Bounding Box Max:', box.max.toArray());
  },
  (err) => console.error('Error parsing master town GLB:', err)
);
