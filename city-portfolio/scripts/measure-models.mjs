import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

if (!globalThis.self) globalThis.self = globalThis;
if (!globalThis.window) globalThis.window = globalThis;

const loader = new GLTFLoader();
const dir = 'd:/portfolio/public/models/city';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.glb'));

for (const f of files) {
  const buf = fs.readFileSync(`${dir}/${f}`);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  loader.parse(ab, '', (gltf) => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    console.log(`${f.padEnd(25)} size: [${size.x.toFixed(2)}, ${size.y.toFixed(2)}, ${size.z.toFixed(2)}] center: [${box.min.x.toFixed(2)}..${box.max.x.toFixed(2)}, ${box.min.y.toFixed(2)}..${box.max.y.toFixed(2)}, ${box.min.z.toFixed(2)}..${box.max.z.toFixed(2)}]`);
  });
}
