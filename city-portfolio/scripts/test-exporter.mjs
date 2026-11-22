import fs from 'fs';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

class FileReaderPolyfill {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
    });
  }
}
globalThis.FileReader = FileReaderPolyfill;

const scene = new THREE.Scene();
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
scene.add(mesh);

const exporter = new GLTFExporter();
try {
  const result = await exporter.parseAsync(scene, { binary: true });
  console.log('Exported binary GLB bytes:', result.byteLength);
} catch (err) {
  console.error('Export error:', err);
}
