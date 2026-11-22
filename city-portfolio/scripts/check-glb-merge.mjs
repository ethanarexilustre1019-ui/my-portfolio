import fs from 'fs';

function readGLB(filePath) {
  const buf = fs.readFileSync(filePath);
  const magic = buf.readUInt32LE(0);
  const version = buf.readUInt32LE(4);
  const length = buf.readUInt32LE(8);

  const jsonLen = buf.readUInt32LE(12);
  const jsonType = buf.readUInt32LE(16);
  const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
  const gltf = JSON.parse(jsonStr);

  let binBuf = null;
  const binOffset = 20 + jsonLen;
  if (binOffset < length) {
    const binLen = buf.readUInt32LE(binOffset);
    binBuf = buf.subarray(binOffset + 8, binOffset + 8 + binLen);
  }

  return { gltf, binBuf };
}

const museu = readGLB('d:/portfolio/public/models/city/museu.glb');
console.log('Museu nodes:', museu.gltf.nodes.length, 'bin size:', museu.binBuf.length);
