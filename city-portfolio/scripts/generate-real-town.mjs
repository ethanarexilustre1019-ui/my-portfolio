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

function eulerToQuat(rotX, rotY, rotZ) {
  const c1 = Math.cos(rotX / 2), s1 = Math.sin(rotX / 2);
  const c2 = Math.cos(rotY / 2), s2 = Math.sin(rotY / 2);
  const c3 = Math.cos(rotZ / 2), s3 = Math.sin(rotZ / 2);
  return [
    s1 * c2 * c3 + c1 * s2 * s3,
    c1 * s2 * c3 - s1 * c2 * s3,
    c1 * c2 * s3 + s1 * s2 * c3,
    c1 * c2 * c3 - s1 * s2 * s3,
  ];
}

function assembleTownGLB() {
  const cityDir = 'd:/portfolio/public/models/city';

  const instances = [];

  // SCALE FACTORS
  const S_TILE = 2.5; // Road/plaza/calcada: 2.0 * 2.5 = 5.0m
  const S_BUILD = 2.5;
  const S_VEH = 2.5;
  const S_PROP = 2.5;

  // 1. ROADS AND INTERSECTIONS GRID
  // Central road loop:
  // North road: z = -7.5, running x from -22.5 to +22.5
  // South road: z = +7.5, running x from -22.5 to +22.5
  // West road: x = -7.5, running z from -22.5 to +22.5
  // East road: x = +7.5, running z from -22.5 to +22.5

  const roadX = [-22.5, -17.5, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 17.5, 22.5];
  const roadZ = [-22.5, -17.5, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 17.5, 22.5];

  // North-South streets along x = -7.5 and x = +7.5
  for (const z of roadZ) {
    for (const x of [-7.5, 7.5]) {
      const isCross = z === -7.5 || z === 7.5;
      const model = isCross ? 'asfalto_cruzamento.glb' : (Math.abs(z) === 2.5 ? 'asfalto_faixa_pedestre.glb' : 'asfalto_reta.glb');
      const rotY = isCross ? 0 : 0;
      instances.push({
        name: `walkable_road_ns_${x}_${z}`,
        path: path.join(cityDir, model),
        position: [x, 0, z],
        rotation: eulerToQuat(0, rotY, 0),
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  }

  // East-West streets along z = -7.5 and z = +7.5
  for (const x of roadX) {
    if (x === -7.5 || x === 7.5) continue; // already placed cruzamento
    for (const z of [-7.5, 7.5]) {
      const model = Math.abs(x) === 2.5 ? 'asfalto_faixa_pedestre.glb' : 'asfalto_reta.glb';
      instances.push({
        name: `walkable_road_ew_${x}_${z}`,
        path: path.join(cityDir, model),
        position: [x, 0, z],
        rotation: eulerToQuat(0, Math.PI / 2, 0),
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  }

  // 2. CENTRAL PLAZA (Between x: [-5..5] and z: [-5..5])
  for (const x of [-2.5, 2.5]) {
    for (const z of [-2.5, 2.5]) {
      instances.push({
        name: `walkable_plaza_${x}_${z}`,
        path: path.join(cityDir, 'praca.glb'),
        position: [x, 0, z],
        rotation: eulerToQuat(0, (x > 0 ? Math.PI : 0), 0),
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  }

  // Sidewalk border around the plaza
  for (const x of [-2.5, 2.5]) {
    instances.push({
      name: `walkable_sidewalk_p_n_${x}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [x, 0, -5],
      scale: [S_TILE, S_TILE, S_TILE],
    });
    instances.push({
      name: `walkable_sidewalk_p_s_${x}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [x, 0, 5],
      scale: [S_TILE, S_TILE, S_TILE],
    });
  }
  for (const z of [-2.5, 2.5]) {
    instances.push({
      name: `walkable_sidewalk_p_w_${z}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [-5, 0, z],
      scale: [S_TILE, S_TILE, S_TILE],
    });
    instances.push({
      name: `walkable_sidewalk_p_e_${z}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [5, 0, z],
      scale: [S_TILE, S_TILE, S_TILE],
    });
  }

  // Outer sidewalks along building frontages
  for (const x of [-12.5, -2.5, 2.5, 12.5]) {
    instances.push({
      name: `walkable_sidewalk_front_n_${x}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [x, 0, -10],
      scale: [S_TILE, S_TILE, S_TILE],
    });
    instances.push({
      name: `walkable_sidewalk_front_s_${x}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [x, 0, 10],
      scale: [S_TILE, S_TILE, S_TILE],
    });
  }
  for (const z of [-12.5, -2.5, 2.5, 12.5]) {
    instances.push({
      name: `walkable_sidewalk_front_w_${z}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [-10, 0, z],
      scale: [S_TILE, S_TILE, S_TILE],
    });
    instances.push({
      name: `walkable_sidewalk_front_e_${z}`,
      path: path.join(cityDir, 'calcada.glb'),
      position: [10, 0, z],
      scale: [S_TILE, S_TILE, S_TILE],
    });
  }

  // 3. THE 5 MAIN SHOWCASE BUILDINGS (Architectural Assets)
  // Building 1: HALL OF CERTIFICATES (museu.glb - Grand Museum, size 6x6 -> 15x15m)
  instances.push({
    name: 'building_awards',
    path: path.join(cityDir, 'museu.glb'),
    position: [0, 0, -18.5],
    rotation: eulerToQuat(0, 0, 0), // facing South toward central plaza
    scale: [S_BUILD, S_BUILD, S_BUILD],
  });

  // Building 2: TECH & CAPSTONE LAB (centro_tecnologia.glb - Modern Tech Center)
  instances.push({
    name: 'building_work',
    path: path.join(cityDir, 'centro_tecnologia.glb'),
    position: [-16.5, 0, -3.5],
    rotation: eulerToQuat(0, Math.PI / 2, 0), // facing East toward plaza
    scale: [S_BUILD * 1.35, S_BUILD * 1.35, S_BUILD * 1.35],
  });

  // Building 3: ABOUT ME / BIO (biblioteca.glb - Grand Library)
  instances.push({
    name: 'building_about',
    path: path.join(cityDir, 'biblioteca.glb'),
    position: [16.5, 0, -3.5],
    rotation: eulerToQuat(0, -Math.PI / 2, 0), // facing West toward plaza
    scale: [S_BUILD * 1.35, S_BUILD * 1.35, S_BUILD * 1.35],
  });

  // Building 4: TECH STACK & ARCHITECTURE (centro_pesquisa.glb - R&D Center)
  instances.push({
    name: 'building_stack',
    path: path.join(cityDir, 'centro_pesquisa.glb'),
    position: [-16.5, 0, 15.5],
    rotation: eulerToQuat(0, Math.PI / 2, 0), // facing East toward street
    scale: [S_BUILD, S_BUILD, S_BUILD],
  });

  // Building 5: CONTACT & TERMINAL (banco.glb - High-Tech Financial/Civic Hub)
  instances.push({
    name: 'building_contact',
    path: path.join(cityDir, 'banco.glb'),
    position: [16.5, 0, 15.5],
    rotation: eulerToQuat(0, -Math.PI / 2, 0), // facing West toward street
    scale: [S_BUILD * 1.35, S_BUILD * 1.35, S_BUILD * 1.35],
  });

  // 4. LOW-POLY CITY BACKDROP BUILDINGS (Real Architecture, No Primitives!)
  instances.push(
    {
      name: 'city_hotel_nw',
      path: path.join(cityDir, 'hotel.glb'),
      position: [-22, 0, -18.5],
      rotation: eulerToQuat(0, 0, 0),
      scale: [S_BUILD * 1.3, S_BUILD * 1.3, S_BUILD * 1.3],
    },
    {
      name: 'city_shopping_ne',
      path: path.join(cityDir, 'shopping.glb'),
      position: [22, 0, -18.5],
      rotation: eulerToQuat(0, 0, 0),
      scale: [S_BUILD, S_BUILD, S_BUILD],
    },
    {
      name: 'city_office_w',
      path: path.join(cityDir, 'escritorio.glb'),
      position: [-26, 0, -3.5],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_BUILD * 1.25, S_BUILD * 1.25, S_BUILD * 1.25],
    },
    {
      name: 'city_market_e',
      path: path.join(cityDir, 'mercado.glb'),
      position: [26, 0, -3.5],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_BUILD * 1.3, S_BUILD * 1.3, S_BUILD * 1.3],
    },
    {
      name: 'city_corner_sw',
      path: path.join(cityDir, 'loja_esquina.glb'),
      position: [-26, 0, 15.5],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_BUILD * 1.2, S_BUILD * 1.2, S_BUILD * 1.2],
    },
    {
      name: 'city_corner_se',
      path: path.join(cityDir, 'loja_esquina.glb'),
      position: [26, 0, 15.5],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_BUILD * 1.2, S_BUILD * 1.2, S_BUILD * 1.2],
    }
  );

  // 5. PARKED GTA-STYLE VEHICLES
  instances.push(
    // Taxi parked on North avenue curb
    {
      name: 'prop_taxi',
      path: path.join(cityDir, 'taxi.glb'),
      position: [-3.2, 0.22, -6.6],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_VEH, S_VEH, S_VEH],
    },
    // Electric sports car parked across
    {
      name: 'prop_carro_eletrico',
      path: path.join(cityDir, 'carro_eletrico.glb'),
      position: [4.2, 0.22, -8.4],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_VEH, S_VEH, S_VEH],
    },
    // City transit bus stopped at bus stop on West avenue
    {
      name: 'prop_onibus',
      path: path.join(cityDir, 'onibus.glb'),
      position: [-8.4, 0.22, 3.8],
      rotation: eulerToQuat(0, 0, 0),
      scale: [S_VEH, S_VEH, S_VEH],
    },
    // Commuter car on South avenue
    {
      name: 'prop_carro_sedan',
      path: path.join(cityDir, 'carro.glb'),
      position: [4.0, 0.22, 6.6],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_VEH, S_VEH, S_VEH],
    }
  );

  // 6. STREET FURNITURE & LIGHTING
  // Streetlights (poste_luz.glb) at sidewalk corners
  const lightCoords = [
    [-9.5, -9.5], [9.5, -9.5], [-9.5, 9.5], [9.5, 9.5],
    [-5.5, -5.5], [5.5, -5.5], [-5.5, 5.5], [5.5, 5.5],
    [-19.5, -9.5], [19.5, -9.5], [-19.5, 9.5], [19.5, 9.5],
  ];
  lightCoords.forEach(([x, z], i) => {
    instances.push({
      name: `prop_streetlight_${i}`,
      path: path.join(cityDir, 'poste_luz.glb'),
      position: [x, 0.2, z],
      rotation: eulerToQuat(0, (x > 0 ? Math.PI : 0), 0),
      scale: [S_PROP, S_PROP, S_PROP],
    });
  });

  // Traffic lights (semaforo.glb) at the 4 main intersections
  const trafficCoords = [
    [-6.2, -8.8, 0],
    [8.8, -6.2, Math.PI / 2],
    [6.2, 8.8, Math.PI],
    [-8.8, 6.2, -Math.PI / 2],
  ];
  trafficCoords.forEach(([x, z, rotY], i) => {
    instances.push({
      name: `prop_trafficlight_${i}`,
      path: path.join(cityDir, 'semaforo.glb'),
      position: [x, 0.2, z],
      rotation: eulerToQuat(0, rotY, 0),
      scale: [S_PROP, S_PROP, S_PROP],
    });
  });

  // Bus stop shelter (ponto_onibus.glb)
  instances.push({
    name: 'prop_bus_stop',
    path: path.join(cityDir, 'ponto_onibus.glb'),
    position: [-10.8, 0.2, 4.2],
    rotation: eulerToQuat(0, Math.PI / 2, 0),
    scale: [S_PROP, S_PROP, S_PROP],
  });

  // Fire hydrants (hidrante.glb)
  instances.push(
    {
      name: 'prop_hydrant_1',
      path: path.join(cityDir, 'hidrante.glb'),
      position: [-5.6, 0.2, -9.4],
      scale: [S_PROP, S_PROP, S_PROP],
    },
    {
      name: 'prop_hydrant_2',
      path: path.join(cityDir, 'hidrante.glb'),
      position: [9.4, 0.2, 5.6],
      scale: [S_PROP, S_PROP, S_PROP],
    }
  );

  // Park benches (banco_praca.glb) in central plaza
  instances.push(
    {
      name: 'prop_bench_1',
      path: path.join(cityDir, 'banco_praca.glb'),
      position: [-2.2, 0.2, -1.2],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_PROP * 1.2, S_PROP * 1.2, S_PROP * 1.2],
    },
    {
      name: 'prop_bench_2',
      path: path.join(cityDir, 'banco_praca.glb'),
      position: [2.2, 0.2, -1.2],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_PROP * 1.2, S_PROP * 1.2, S_PROP * 1.2],
    },
    {
      name: 'prop_bench_3',
      path: path.join(cityDir, 'banco_praca.glb'),
      position: [-2.2, 0.2, 1.2],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_PROP * 1.2, S_PROP * 1.2, S_PROP * 1.2],
    },
    {
      name: 'prop_bench_4',
      path: path.join(cityDir, 'banco_praca.glb'),
      position: [2.2, 0.2, 1.2],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_PROP * 1.2, S_PROP * 1.2, S_PROP * 1.2],
    }
  );

  // Lush Trees: Golden yellow flowering trees (ipe_amarelo.glb) & Pines (araucaria.glb)
  const treeCoords = [
    [-4.5, -4.5, 'ipe_amarelo.glb', 1.3],
    [4.5, -4.5, 'ipe_amarelo.glb', 1.4],
    [-4.5, 4.5, 'araucaria.glb', 1.3],
    [4.5, 4.5, 'ipe_amarelo.glb', 1.35],
    [-11.5, -11.5, 'araucaria.glb', 1.4],
    [11.5, -11.5, 'ipe_amarelo.glb', 1.3],
    [-11.5, 11.5, 'ipe_amarelo.glb', 1.4],
    [11.5, 11.5, 'araucaria.glb', 1.3],
    [-3.8, -11.5, 'ipe_amarelo.glb', 1.25], // flank museum entrance left
    [3.8, -11.5, 'ipe_amarelo.glb', 1.25],  // flank museum entrance right
    [-6.5, -14.5, 'araucaria.glb', 1.35],
    [6.5, -14.5, 'araucaria.glb', 1.35],
  ];
  treeCoords.forEach(([x, z, model, scaleMult], i) => {
    instances.push({
      name: `prop_tree_${i}`,
      path: path.join(cityDir, model),
      position: [x, 0.2, z],
      rotation: eulerToQuat(0, (i * 1.2) % (Math.PI * 2), 0),
      scale: [S_PROP * scaleMult, S_PROP * scaleMult, S_PROP * scaleMult],
    });
  });

  // Bushes (arbustos.glb) in planters
  const bushCoords = [
    [-3.2, -4.8], [3.2, -4.8], [-3.2, 4.8], [3.2, 4.8],
    [-4.8, -3.2], [4.8, -3.2], [-4.8, 3.2], [4.8, 3.2],
  ];
  bushCoords.forEach(([x, z], i) => {
    instances.push({
      name: `prop_bush_${i}`,
      path: path.join(cityDir, 'arbustos.glb'),
      position: [x, 0.2, z],
      scale: [S_PROP * 1.3, S_PROP * 1.3, S_PROP * 1.3],
    });
  });

  console.log(`Assembling complete GTA city block with ${instances.length} authentic 3D instances...`);

  // Assemble GLTF structure
  const master = {
    asset: { version: '2.0', generator: 'GTA City Stylized Town Assembler' },
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

    binChunks.push(binBuf);
    let padding = (4 - (binBuf.length % 4)) % 4;
    if (padding > 0) {
      binChunks.push(Buffer.alloc(padding));
    }
    currentBinOffset += binBuf.length + padding;

    if (gltf.materials) {
      gltf.materials.forEach((mat, idx) => {
        const newIndex = master.materials.length;
        materialIndexMap.set(idx, newIndex);
        master.materials.push(JSON.parse(JSON.stringify(mat)));
      });
    }

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

    const nodeIndex = master.nodes.length;
    const node = {
      name: inst.name,
      translation: inst.position || [0, 0, 0],
      rotation: inst.rotation || [0, 0, 0, 1],
      scale: inst.scale || [1, 1, 1],
    };

    if (gltf.meshes && gltf.meshes.length > 0) {
      if (gltf.meshes.length === 1) {
        node.mesh = meshIndexMap.get(0);
      } else {
        node.children = [];
        for (let m = 0; m < gltf.meshes.length; m++) {
          const childIdx = master.nodes.length + 1 + node.children.length;
          node.children.push(childIdx);
          master.nodes.push({
            name: `${inst.name}_sub_${m}`,
            mesh: meshIndexMap.get(m),
          });
        }
      }
    }
    master.nodes.push(node);
    master.scenes[0].nodes.push(nodeIndex);
  }

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

  const destPaths = [
    'd:/portfolio/public/models/town.glb',
    'd:/portfolio/public/town.glb',
    'd:/portfolio/city-portfolio/public/models/town.glb',
    'd:/portfolio/city-portfolio/public/town.glb',
  ];

  for (const p of destPaths) {
    const parentDir = path.dirname(p);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
    fs.writeFileSync(p, glb);
    console.log(`Saved master town model: ${p} (${glb.length} bytes)`);
  }
}

assembleTownGLB();
