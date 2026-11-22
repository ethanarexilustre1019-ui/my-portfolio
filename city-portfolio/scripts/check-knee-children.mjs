import fs from 'fs';
const buf = fs.readFileSync('D:/portfolio/public/models/deku/source/fortnite_deku.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);

const lKnee = gltf.nodes.find(n => n.name === 'L_knee_0156_242');
console.log('L_knee children:');
lKnee.children.forEach(c => console.log(' -', c, gltf.nodes[c].name));
