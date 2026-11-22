import fs from 'fs';

const buf = fs.readFileSync('D:/portfolio/public/models/deku/source/fortnite_deku.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);

const rFingers = gltf.nodes.filter(n => n.name && n.name.startsWith('R_') && n.name.includes('finger'));
rFingers.forEach(b => console.log(' -', b.name));
