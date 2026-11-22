import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

if (!globalThis.self) globalThis.self = globalThis;
if (!globalThis.window) globalThis.window = globalThis;

console.log('Three.js version:', THREE.REVISION);
const loader = new GLTFLoader();
const buf = fs.readFileSync('d:/portfolio/public/models/city/museu.glb');
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

loader.parse(
  arrayBuffer,
  '',
  (gltf) => {
    console.log('Successfully parsed museu.glb with Three.js GLTFLoader!');
    console.log('Scene children count:', gltf.scene.children.length);
  },
  (err) => {
    console.error('Error parsing GLB:', err);
  }
);
