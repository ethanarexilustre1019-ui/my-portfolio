import fs from 'fs';
import path from 'path';

function readGLB(filePath) {
  const buf = fs.readFileSync(filePath);
  const length = buf.readUInt32LE(8);
  const jsonLen = buf.readUInt32LE(12);
  const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
  const gltf = JSON.parse(jsonStr);

  let binBuf = Buffer.alloc(0);
  const binOffset = 20 + jsonLen;
  if (binOffset < length) {
    const binLen = buf.readUInt32LE(binOffset);
    binBuf = buf.subarray(binOffset + 8, binOffset + 8 + binLen);
  }

  return { gltf, binBuf };
}

function mergeGLBs(instances, outputPath) {
  // Master GLTF structure
  const master = {
    asset: { version: '2.0', generator: 'Antigravity City Builder' },
    scenes: [{ name: 'Scene', nodes: [] }],
    scene: 0,
    nodes: [],
    meshes: [],
    materials: [],
    accessors: [],
    bufferViews: [],
    buffers: [{ byteLength: 0 }],
  };

  const binChunks = [];
  let currentBinOffset = 0;

  for (const inst of instances) {
    const { gltf, binBuf } = readGLB(inst.path);

    const bufferViewIndexMap = new Map();
    const accessorIndexMap = new Map();
    const materialIndexMap = new Map();
    const meshIndexMap = new Map();

    // 1. Copy bufferViews
    const startBinOffset = currentBinOffset;
    if (gltf.bufferViews) {
      gltf.bufferViews.forEach((bv, idx) => {
        const newIndex = master.bufferViews.length;
        bufferViewIndexMap.set(idx, newIndex);
        master.bufferViews.push({
          buffer: 0,
          byteOffset: startBinOffset + (bv.byteOffset || 0),
          byteLength: bv.byteLength,
          byteStride: bv.byteStride,
          target: bv.target,
        });
      });
    }

    // 2. Append binBuf with 4-byte padding
    binChunks.push(binBuf);
    let padding = (4 - (binBuf.length % 4)) % 4;
    if (padding > 0) {
      binChunks.push(Buffer.alloc(padding));
    }
    currentBinOffset += binBuf.length + padding;

    // 3. Copy materials
    if (gltf.materials) {
      gltf.materials.forEach((mat, idx) => {
        const newIndex = master.materials.length;
        materialIndexMap.set(idx, newIndex);
        master.materials.push(JSON.parse(JSON.stringify(mat)));
      });
    }

    // 4. Copy accessors
    if (gltf.accessors) {
      gltf.accessors.forEach((acc, idx) => {
        const newIndex = master.accessors.length;
        accessorIndexMap.set(idx, newIndex);
        const newAcc = { ...acc };
        if (acc.bufferView !== undefined) {
          newAcc.bufferView = bufferViewIndexMap.get(acc.bufferView);
        }
        master.accessors.push(newAcc);
      });
    }

    // 5. Copy meshes
    if (gltf.meshes) {
      gltf.meshes.forEach((mesh, idx) => {
        const newIndex = master.meshes.length;
        meshIndexMap.set(idx, newIndex);
        const newMesh = {
          name: mesh.name || `${inst.name}_mesh`,
          primitives: mesh.primitives.map((prim) => {
            const newPrim = {
              mode: prim.mode,
              attributes: {},
            };
            if (prim.indices !== undefined) {
              newPrim.indices = accessorIndexMap.get(prim.indices);
            }
            if (prim.material !== undefined) {
              newPrim.material = materialIndexMap.get(prim.material);
            }
            for (const [attrName, accIdx] of Object.entries(prim.attributes)) {
              newPrim.attributes[attrName] = accessorIndexMap.get(accIdx);
            }
            return newPrim;
          }),
        };
        master.meshes.push(newMesh);
      });
    }

    // 6. Create node for instance
    const nodeIndex = master.nodes.length;
    const node = {
      name: inst.name,
      translation: inst.position || [0, 0, 0],
      rotation: inst.rotation || [0, 0, 0, 1], // quaternion
      scale: inst.scale || [1, 1, 1],
    };

    if (gltf.meshes && gltf.meshes.length > 0) {
      // If single mesh, attach directly
      if (gltf.meshes.length === 1) {
        node.mesh = meshIndexMap.get(0);
      } else {
        // multiple meshes: create child nodes
        node.children = [];
        for (let m = 0; m < gltf.meshes.length; m++) {
          const childIdx = master.nodes.length + 1 + node.children.length;
          node.children.push(childIdx);
          master.nodes.push({
            name: `${inst.name}_part_${m}`,
            mesh: meshIndexMap.get(m),
          });
        }
      }
    }
    master.nodes.push(node);
    master.scenes[0].nodes.push(nodeIndex);
  }

  // Final binary buffer
  const finalBin = Buffer.concat(binChunks);
  master.buffers[0].byteLength = finalBin.length;

  const jsonStr = JSON.stringify(master);
  let jsonBuffer = Buffer.from(jsonStr, 'utf8');
  const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
  if (jsonPadding > 0) {
    jsonBuffer = Buffer.concat([jsonBuffer, Buffer.from(' '.repeat(jsonPadding), 'utf8')]);
  }

  const totalLength = 12 + 8 + jsonBuffer.length + 8 + finalBin.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // glTF
  header.writeUInt32LE(2, 4); // version 2
  header.writeUInt32LE(totalLength, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBuffer.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4); // JSON

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(finalBin.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4); // BIN

  const glb = Buffer.concat([header, jsonHeader, jsonBuffer, binHeader, finalBin]);
  fs.writeFileSync(outputPath, glb);
  console.log(`Successfully generated ${outputPath} (${glb.length} bytes, ${master.nodes.length} nodes, ${master.meshes.length} meshes)`);
}

// Quick 2-instance test
mergeGLBs(
  [
    { name: 'museu_test', path: 'd:/portfolio/public/models/city/museu.glb', position: [0, 0, -10] },
    { name: 'tech_test', path: 'd:/portfolio/public/models/city/centro_tecnologia.glb', position: [-10, 0, 0] },
  ],
  'd:/portfolio/public/models/test_merged.glb'
);
