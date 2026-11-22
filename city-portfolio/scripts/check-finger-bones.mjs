import fs from 'fs';

const buf = fs.readFileSync('D:/portfolio/public/models/deku/source/fortnite_deku.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);

const fingerBones = gltf.nodes.filter(n => n.name && (n.name.includes('hand') || n.name.includes('finger') || n.name.includes('thumb') || n.name.includes('index') || n.name.includes('middle') || n.name.includes('ring') || n.name.includes('pinky')));
console.log('Finger/hand bones found:', fingerBones.length);
fingerBones.slice(0, 35).forEach(b => console.log(' -', b.name));
