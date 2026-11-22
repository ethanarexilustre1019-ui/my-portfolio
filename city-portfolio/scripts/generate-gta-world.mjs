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

/**
 * Creates a flat textured/colored planar decal/mural geometry
 */
function createMuralMesh(w, h, color = [0.0, 1.0, 0.53]) {
  const hw = w / 2;
  const hh = h / 2;
  const positions = new Float32Array([
    -hw, -hh, 0,
     hw, -hh, 0,
     hw,  hh, 0,
    -hw,  hh, 0
  ]);
  const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ]);
  const uvs = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1
  ]);
  const colors = new Float32Array([
    color[0], color[1], color[2],
    color[0], color[1], color[2],
    color[0], color[1], color[2],
    color[0], color[1], color[2]
  ]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  return { positions, normals, uvs, colors, indices };
}

export function buildGTAWorld() {
  const cityDir = 'd:/portfolio/public/models/city';
  const instances = [];

  // Uniform horizontal expansion factor K = 1.6 makes every road 8.0m wide (up from 5.0m),
  // expands the Central Park / Spawn Area to 16.0m x 16.0m (256 m²), and widens the entire town by 60%
  // while keeping every tile boundary and building wall 100% seamless!
  const K = 1.6;
  const KY = 1.25;

  const S_TILE = 2.5; // Native 2.0 * 2.5 * 1.6 = 8.0m exact grid spacing
  const S_BUILD = 2.5;
  const S_PROP = 2.5;

  // =========================================================================
  // 1. SEAMLESS BASE GROUND FOUNDATION (Zero voids anywhere)
  // =========================================================================
  const coords = [];
  for (let x = -47.5; x <= 47.5; x += 5.0) {
    for (let z = -47.5; z <= 47.5; z += 5.0) {
      coords.push([Math.round(x * 10) / 10, Math.round(z * 10) / 10]);
    }
  }

  // =========================================================================
  // 2. COMPLETE URBAN ROAD & INTERSECTION NETWORK (5.0m grid)
  // =========================================================================
  // Primary North-South Avenues: x = -7.5 and x = +7.5
  // Primary East-West Avenues:   z = -7.5 and z = +7.5
  // Secondary Outer Avenues:     x = -22.5, x = +22.5, z = -22.5, z = +22.5

  const roadSet = new Set();
  const roadCells = [];

  // 4-Way Intersections
  const intersections = [
    [-7.5, -7.5], [7.5, -7.5], [-7.5, 7.5], [7.5, 7.5],
    [-22.5, -7.5], [-22.5, 7.5], [22.5, -7.5], [22.5, 7.5],
    [-7.5, -22.5], [7.5, -22.5], [-7.5, 22.5], [7.5, 22.5],
    [-22.5, -22.5], [-22.5, 22.5], [22.5, -22.5], [22.5, 22.5],
  ];
  intersections.forEach(([x, z]) => {
    roadSet.add(`${x},${z}`);
    roadCells.push({
      name: `walkable_cross_${x}_${z}`,
      path: path.join(cityDir, 'asfalto_cruzamento.glb'),
      position: [x, 0, z],
      rotation: eulerToQuat(0, 0, 0),
      scale: [S_TILE, S_TILE, S_TILE],
    });
  });

  // Crosswalks
  const crosswalks = [
    [-7.5, -2.5, 0], [-7.5, 2.5, 0], [7.5, -2.5, 0], [7.5, 2.5, 0],
    [-2.5, -7.5, Math.PI / 2], [2.5, -7.5, Math.PI / 2],
    [-2.5, 7.5, Math.PI / 2], [2.5, 7.5, Math.PI / 2],
    [-17.5, -7.5, Math.PI / 2], [17.5, -7.5, Math.PI / 2],
    [-17.5, 7.5, Math.PI / 2], [17.5, 7.5, Math.PI / 2],
  ];
  crosswalks.forEach(([x, z, rotY]) => {
    roadSet.add(`${x},${z}`);
    roadCells.push({
      name: `walkable_ped_${x}_${z}`,
      path: path.join(cityDir, 'asfalto_faixa_pedestre.glb'),
      position: [x, 0, z],
      rotation: eulerToQuat(0, rotY, 0),
      scale: [S_TILE, S_TILE, S_TILE],
    });
  });

  // Straight Street Segments
  const streetLines = [
    // North-South Avenues: x = -7.5, +7.5, -22.5, +22.5
    ...[-22.5, -7.5, 7.5, 22.5].flatMap((x) =>
      [-17.5, -12.5, -2.5, 2.5, 12.5, 17.5].map((z) => [x, z, 0])
    ),
    // East-West Avenues: z = -22.5, -7.5, +7.5, +22.5
    ...[-22.5, -7.5, 7.5, 22.5].flatMap((z) =>
      [-17.5, -12.5, -2.5, 2.5, 12.5, 17.5].map((x) => [x, z, Math.PI / 2])
    ),
  ];
  streetLines.forEach(([x, z, rotY]) => {
    const key = `${x},${z}`;
    if (!roadSet.has(key)) {
      roadSet.add(key);
      roadCells.push({
        name: `walkable_street_${x}_${z}`,
        path: path.join(cityDir, 'asfalto_reta.glb'),
        position: [x, 0, z],
        rotation: eulerToQuat(0, rotY, 0),
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  });
  instances.push(...roadCells);

  // =========================================================================
  // 3. CENTRAL CIVIC PLAZA & CONNECTED SIDEWALKS (Complete Coverage)
  // =========================================================================
  const plazaSet = new Set();
  // Central Plaza Block: [-2.5, 2.5] x [-2.5, 2.5] (10x10m square)
  for (const x of [-2.5, 2.5]) {
    for (const z of [-2.5, 2.5]) {
      plazaSet.add(`${x},${z}`);
      instances.push({
        name: `walkable_plaza_${x}_${z}`,
        path: path.join(cityDir, 'praca.glb'),
        position: [x, 0, z],
        rotation: eulerToQuat(0, x > 0 ? Math.PI : 0, 0),
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  }

  // Contiguous Sidewalk Pavements for ALL remaining urban block cells
  // Every cell inside the inner ring and building aprons is paved with calcada.glb
  const sidewalkCells = [
    // West Avenue Sidewalks (Connecting street to Tech Lab & Towers)
    [-12.5, -2.5], [-12.5, 2.5], [-12.5, -12.5], [-12.5, 12.5], [-12.5, -17.5], [-12.5, 17.5],
    [-17.5, -2.5], [-17.5, 2.5], [-17.5, -12.5], [-17.5, 12.5],
    // East Avenue Sidewalks (Connecting street to Developer Hall & Hub)
    [12.5, -2.5], [12.5, 2.5], [12.5, -12.5], [12.5, 12.5], [12.5, -17.5], [12.5, 17.5],
    [17.5, -2.5], [17.5, 2.5], [17.5, -12.5], [17.5, 12.5],
    // North Promenade (Connecting street to Hall of Certificates)
    [-2.5, -12.5], [2.5, -12.5], [-2.5, -17.5], [2.5, -17.5],
    // South Promenade (Connecting to South district)
    [-2.5, 12.5], [2.5, 12.5], [-2.5, 17.5], [2.5, 17.5],
  ];

  const sidewalkSet = new Set();
  sidewalkCells.forEach(([x, z]) => {
    const key = `${x},${z}`;
    if (!roadSet.has(key) && !plazaSet.has(key)) {
      sidewalkSet.add(key);
      instances.push({
        name: `walkable_sidewalk_${x}_${z}`,
        path: path.join(cityDir, 'calcada.glb'),
        position: [x, 0, z],
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  });

  // Base grass terrain tiles filling every other perimeter plot (Zero empty gaps)
  coords.forEach(([x, z]) => {
    const key = `${x},${z}`;
    if (!roadSet.has(key) && !plazaSet.has(key) && !sidewalkSet.has(key)) {
      // If outside the active urban zone or in a corner plot, lay grama.glb
      instances.push({
        name: `walkable_grass_${x}_${z}`,
        path: path.join(cityDir, 'grama.glb'),
        position: [x, -0.02, z],
        scale: [S_TILE, S_TILE, S_TILE],
      });
    }
  });

  // =========================================================================
  // 4. THE 5 MAIN PORTFOLIO SHOWCASE BUILDINGS (Architectural Assets)
  // =========================================================================
  // Building 1: HALL OF CERTIFICATES (museu.glb - Grand Classical Museum)
  instances.push({
    name: 'building_awards',
    path: path.join(cityDir, 'museu.glb'),
    position: [0, 0, -18.5],
    rotation: eulerToQuat(0, 0, 0),
    scale: [S_BUILD, S_BUILD, S_BUILD],
  });

  // Building 2: TECH & CAPSTONE LAB (centro_tecnologia.glb - Modern Tech Center)
  instances.push({
    name: 'building_work',
    path: path.join(cityDir, 'centro_tecnologia.glb'),
    position: [-16.5, 0, -3.5],
    rotation: eulerToQuat(0, Math.PI / 2, 0),
    scale: [S_BUILD * 1.35, S_BUILD * 1.35, S_BUILD * 1.35],
  });

  // Building 3: UNO-R DEVELOPER HALL (biblioteca.glb - Grand Library)
  instances.push({
    name: 'building_about',
    path: path.join(cityDir, 'biblioteca.glb'),
    position: [16.5, 0, -3.5],
    rotation: eulerToQuat(0, -Math.PI / 2, 0),
    scale: [S_BUILD * 1.35, S_BUILD * 1.35, S_BUILD * 1.35],
  });

  // Building 4: TECHNICAL ARSENAL TOWER (centro_pesquisa.glb - R&D Center)
  instances.push({
    name: 'building_stack',
    path: path.join(cityDir, 'centro_pesquisa.glb'),
    position: [-16.5, 0, 15.5],
    rotation: eulerToQuat(0, Math.PI / 2, 0),
    scale: [S_BUILD, S_BUILD, S_BUILD],
  });

  // Building 5: COMMUNICATIONS HUB (banco.glb - High-Tech Financial Hub)
  instances.push({
    name: 'building_contact',
    path: path.join(cityDir, 'banco.glb'),
    position: [16.5, 0, 15.5],
    rotation: eulerToQuat(0, -Math.PI / 2, 0),
    scale: [S_BUILD * 1.35, S_BUILD * 1.35, S_BUILD * 1.35],
  });

  // =========================================================================
  // 5. SURROUNDING CITY ARCHITECTURE & NEIGHBORHOOD BUILDINGS
  // =========================================================================
  instances.push(
    // NW Hotel & Commercial Complex
    {
      name: 'city_hotel_nw',
      path: path.join(cityDir, 'hotel.glb'),
      position: [-22, 0, -18.5],
      rotation: eulerToQuat(0, 0, 0),
      scale: [S_BUILD * 1.3, S_BUILD * 1.3, S_BUILD * 1.3],
    },
    // NE Shopping Center
    {
      name: 'city_shopping_ne',
      path: path.join(cityDir, 'shopping.glb'),
      position: [22, 0, -18.5],
      rotation: eulerToQuat(0, 0, 0),
      scale: [S_BUILD, S_BUILD, S_BUILD],
    },
    // West Corporate Office Tower
    {
      name: 'city_office_w',
      path: path.join(cityDir, 'escritorio.glb'),
      position: [-26, 0, -3.5],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_BUILD * 1.25, S_BUILD * 1.25, S_BUILD * 1.25],
    },
    // East Market & Shops
    {
      name: 'city_market_e',
      path: path.join(cityDir, 'mercado.glb'),
      position: [26, 0, -3.5],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_BUILD * 1.3, S_BUILD * 1.3, S_BUILD * 1.3],
    },
    // SW Corner Retail & Townhouses
    {
      name: 'city_corner_sw',
      path: path.join(cityDir, 'loja_esquina.glb'),
      position: [-26, 0, 15.5],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_BUILD * 1.2, S_BUILD * 1.2, S_BUILD * 1.2],
    },
    // SE Corner Retail & Townhouses
    {
      name: 'city_corner_se',
      path: path.join(cityDir, 'loja_esquina.glb'),
      position: [26, 0, 15.5],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_BUILD * 1.2, S_BUILD * 1.2, S_BUILD * 1.2],
    },
    // South District Apartment Blocks
    {
      name: 'city_apartments_s1',
      path: path.join(cityDir, 'predio_apartamentos.glb'),
      position: [-16.5, 0, 26],
      rotation: eulerToQuat(0, Math.PI, 0),
      scale: [S_BUILD * 1.2, S_BUILD * 1.2, S_BUILD * 1.2],
    },
    {
      name: 'city_apartments_s2',
      path: path.join(cityDir, 'predio_apartamentos.glb'),
      position: [16.5, 0, 26],
      rotation: eulerToQuat(0, Math.PI, 0),
      scale: [S_BUILD * 1.2, S_BUILD * 1.2, S_BUILD * 1.2],
    },
    {
      name: 'city_townhouse_s3',
      path: path.join(cityDir, 'casa_sobrado.glb'),
      position: [0, 0, 26],
      rotation: eulerToQuat(0, Math.PI, 0),
      scale: [S_BUILD * 1.3, S_BUILD * 1.3, S_BUILD * 1.3],
    }
  );

  // =========================================================================
  // 6. DISTANT 3D BACKGROUND SCENERY (Can't Go There, Pure Scenic Horizon)
  // =========================================================================
  // North Horizon: Mountain Ridges (morro.glb) & Dense Forest Line (arvores_mata.glb)
  const northHills = [-38, -19, 0, 19, 38];
  northHills.forEach((x, i) => {
    instances.push({
      name: `bg_mountain_n_${i}`,
      path: path.join(cityDir, 'morro.glb'),
      position: [x, -0.5, -46],
      rotation: eulerToQuat(0, (i * 0.7) % Math.PI, 0),
      scale: [S_BUILD * 3.5, S_BUILD * 3.8, S_BUILD * 3.5],
    });
    instances.push({
      name: `bg_forest_n_${i}`,
      path: path.join(cityDir, 'arvores_mata.glb'),
      position: [x + 9, -0.2, -38],
      scale: [S_BUILD * 2.2, S_BUILD * 2.4, S_BUILD * 2.2],
    });
  });

  // East Horizon: Modern High-Rise City Skyline (predio_alto.glb)
  const eastTowers = [-30, -15, 0, 15, 30];
  eastTowers.forEach((z, i) => {
    instances.push({
      name: `bg_skyscraper_e_${i}`,
      path: path.join(cityDir, 'predio_alto.glb'),
      position: [42, 0, z],
      rotation: eulerToQuat(0, -Math.PI / 2, 0),
      scale: [S_BUILD * 1.8, S_BUILD * (2.2 + (i % 2) * 0.8), S_BUILD * 1.8],
    });
  });

  // West Horizon: Corporate Towers & Apartment Complexes
  const westTowers = [-30, -15, 0, 15, 30];
  westTowers.forEach((z, i) => {
    instances.push({
      name: `bg_skyscraper_w_${i}`,
      path: path.join(cityDir, 'predio_alto.glb'),
      position: [-42, 0, z],
      rotation: eulerToQuat(0, Math.PI / 2, 0),
      scale: [S_BUILD * 1.8, S_BUILD * (2.0 + ((i + 1) % 2) * 0.8), S_BUILD * 1.8],
    });
  });

  // South Horizon: Rolling Green Hills & Tree Ridges
  const southHills = [-36, -18, 0, 18, 36];
  southHills.forEach((x, i) => {
    instances.push({
      name: `bg_mountain_s_${i}`,
      path: path.join(cityDir, 'morro.glb'),
      position: [x, -0.5, 46],
      rotation: eulerToQuat(0, Math.PI + (i * 0.5), 0),
      scale: [S_BUILD * 3.2, S_BUILD * 3.4, S_BUILD * 3.2],
    });
  });

  // =========================================================================
  // 7. STREET HARDWARE, LIGHTING & AVENUE TREES (No static bus blocking roads!)
  // =========================================================================
  // Streetlights (poste_luz.glb) lining sidewalks
  const streetLightCoords = [
    [-9.5, -9.5], [9.5, -9.5], [-9.5, 9.5], [9.5, 9.5],
    [-5.5, -5.5], [5.5, -5.5], [-5.5, 5.5], [5.5, 5.5],
    [-14.5, -9.5], [14.5, -9.5], [-14.5, 9.5], [14.5, 9.5],
    [-9.5, -14.5], [9.5, -14.5], [-9.5, 14.5], [9.5, 14.5],
  ];
  streetLightCoords.forEach(([x, z], i) => {
    instances.push({
      name: `prop_streetlight_${i}`,
      path: path.join(cityDir, 'poste_luz.glb'),
      position: [x, 0.2, z],
      rotation: eulerToQuat(0, x > 0 ? Math.PI : 0, 0),
      scale: [S_PROP, S_PROP, S_PROP],
    });
  });

  // Traffic lights (semaforo.glb) at 4 main intersections
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

  // Bus stop shelter set back cleanly on the outer West sidewalk (no bus blocking the road)
  instances.push({
    name: 'prop_bus_stop',
    path: path.join(cityDir, 'ponto_onibus.glb'),
    position: [-11.2, 0.2, 4.2],
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

  // Avenue Trees along outer sidewalks (keeping central spawn park wide open & spacious)
  const treeCoords = [
    [-11.5, -11.5, 'araucaria.glb', 1.4],
    [11.5, -11.5, 'ipe_amarelo.glb', 1.3],
    [-11.5, 11.5, 'ipe_amarelo.glb', 1.4],
    [11.5, 11.5, 'araucaria.glb', 1.3],
    [-4.2, -11.5, 'ipe_amarelo.glb', 1.25],
    [4.2, -11.5, 'ipe_amarelo.glb', 1.25],
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

  console.log(`Assembling complete GTA-style world with ${instances.length} 3D instances...`);

  // Assemble GLTF structure
  const master = {
    asset: { version: '2.0', generator: 'GTA City Stylized Town Assembler v2' },
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
    const rawPos = inst.position || [0, 0, 0];
    const rawScale = inst.scale || [1, 1, 1];
    const isTile = inst.name.startsWith('walkable_');
    const isProp = inst.name.startsWith('prop_');
    const sx = isProp ? rawScale[0] * 1.15 : rawScale[0] * K;
    const sy = isTile ? rawScale[1] : isProp ? rawScale[1] * 1.15 : rawScale[1] * KY;
    const sz = isProp ? rawScale[2] * 1.15 : rawScale[2] * K;

    const node = {
      name: inst.name,
      translation: [rawPos[0] * K, rawPos[1], rawPos[2] * K],
      rotation: inst.rotation || [0, 0, 0, 1],
      scale: [sx, sy, sz],
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

buildGTAWorld();
