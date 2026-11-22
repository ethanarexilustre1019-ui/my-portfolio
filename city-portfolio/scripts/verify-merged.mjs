import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

if (!globalThis.self) globalThis.self = globalThis;
if (!globalThis.window) globalThis.window = globalThis;

const loader = new GLTFLoader();
const buf = fs.readFileSync('d:/portfolio/public/models/test_merged.glb');
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

loader.parse(
  arrayBuffer,
  '',
  (gltf) => {
    console.log('Test merged GLB successfully parsed in Three.js GLTFLoader!');
    console.log('Meshes in parsed scene:');
    gltf.scene.traverse((c) => {
      if (c.isMesh) console.log(' - Mesh:', c.name, 'geometry vertices:', c.geometry.attributes.position.count);
    });
  },
  (err) => console.error('Error parsing merged GLB:', err)
);
