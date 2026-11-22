import * as THREE from 'three';

const mk = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

function toTexture(canvas, repeat) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}

let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const setSpacing = (ctx, px) => {
  if ('letterSpacing' in ctx) ctx.letterSpacing = px;
};

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function woodTexture() {
  const c = mk(512, 512);
  const ctx = c.getContext('2d');
  const plankH = 64;
  for (let row = 0; row < 8; row++) {
    const base = 60 + rnd() * 22;
    ctx.fillStyle = `rgb(${base + 38},${base + 14},${base - 10})`;
    ctx.fillRect(0, row * plankH, 512, plankH);
    for (let i = 0; i < 24; i++) {
      ctx.strokeStyle = `rgba(25,12,4,${0.08 + rnd() * 0.14})`;
      ctx.lineWidth = 1;
      const y = row * plankH + rnd() * plankH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(150, y + rnd() * 6 - 3, 350, y + rnd() * 6 - 3, 512, y + rnd() * 4 - 2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(18,9,3,0.75)';
    ctx.fillRect(0, row * plankH, 512, 2);
    const joint = rnd() * 400 + 40;
    ctx.fillRect(joint, row * plankH, 2, plankH);
  }
  return toTexture(c, [6, 4]);
}

export function signTexture(text, bg = '#070d0a', fg = '#00ff88', accent = '#00ff88', w = 1024, h = 256) {
  const c = mk(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = accent || fg;
  ctx.lineWidth = 8;
  ctx.strokeRect(14, 14, w - 28, h - 28);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = h * 0.42;
  ctx.font = `800 ${size}px "JetBrains Mono", Arial, sans-serif`;
  while (ctx.measureText(text).width > w - 90 && size > 20) {
    size -= 4;
    ctx.font = `800 ${size}px "JetBrains Mono", Arial, sans-serif`;
  }
  ctx.fillText(text, w / 2, h / 2 + 4);
  return toTexture(c);
}

export function exitTexture() {
  const c = mk(256, 96);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#051f12';
  ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 244, 84);
  ctx.fillStyle = '#00ff88';
  ctx.font = '800 44px "JetBrains Mono", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  setSpacing(ctx, '4px');
  ctx.fillText('EXIT TOWN', 128, 50);
  return toTexture(c);
}

export const ART_W = 1400;
export const ART_H = 960;

export function drawEngravedBoard(ctx, w, h, f) {
  ctx.save();
  const accent = f.accent || '#00ff88';

  // Brushed dark obsidian-emerald engraved plaque background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#07110d');
  bg.addColorStop(0.5, '#0a1812');
  bg.addColorStop(1, '#050b08');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle architectural blueprint grid lines
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Outer & Inner Engraved Metallic Borders
  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, w - 44, h - 44);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // Corner Bolts
  ctx.fillStyle = accent;
  [[40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40]].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Top Header Strip: Index Code + Status Pill
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '800 24px "JetBrains Mono", Consolas, monospace';
  ctx.fillStyle = accent;
  ctx.fillText(f.award || 'ARCHITECTURAL MONUMENT', 72, 86);

  if (f.statusBadge) {
    ctx.font = '800 20px "JetBrains Mono", Consolas, monospace';
    const bw = ctx.measureText(f.statusBadge).width + 36;
    ctx.fillStyle = accent;
    ctx.fillRect(w - 72 - bw, 66, bw, 40);
    ctx.fillStyle = '#040806';
    ctx.textAlign = 'center';
    ctx.fillText(f.statusBadge, w - 72 - bw / 2, 87);
  }

  // Divider rule
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, 122);
  ctx.lineTo(w - 72, 122);
  ctx.stroke();

  // Giant Engraved Main Title
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px "Impact", "Arial Black", sans-serif';
  const titleLines = wrapLines(ctx, (f.title || '').toUpperCase(), w - 144);
  let y = 186;
  titleLines.slice(0, 2).forEach((ln) => {
    ctx.fillText(ln, 72, y);
    y += 58;
  });

  // Subtitle
  if (f.subtitle) {
    ctx.fillStyle = '#72B8FF';
    ctx.font = '700 26px "JetBrains Mono", Arial, sans-serif';
    ctx.fillText(f.subtitle, 72, y + 4);
    y += 44;
  }

  // Engraved Description Paragraph
  if (f.description) {
    ctx.fillStyle = '#d4e4dc';
    ctx.font = '500 27px Arial, sans-serif';
    const descLines = wrapLines(ctx, f.description, w - 144);
    descLines.slice(0, 4).forEach((ln) => {
      ctx.fillText(ln, 72, y + 10);
      y += 38;
    });
    y += 14;
  }

  // Key Engraved Bullet Points / Specifications
  const bullets = f.bullets || [];
  if (bullets.length > 0) {
    ctx.font = '600 25px "JetBrains Mono", Arial, sans-serif';
    bullets.slice(0, 5).forEach((bText) => {
      if (y > h - 165) return;
      ctx.fillStyle = accent;
      ctx.fillText('▸', 72, y + 12);
      ctx.fillStyle = '#f0f7f4';
      const bLines = wrapLines(ctx, bText, w - 185);
      bLines.slice(0, 2).forEach((bl, bi) => {
        ctx.fillText(bl, 106, y + 12 + bi * 32);
      });
      y += bLines.length > 1 ? 68 : 42;
    });
  }

  // Bottom Engraved Tech / Metadata Pills
  const tags = f.verifiedTags || [];
  let tx = 72;
  const ty = h - 122;
  ctx.font = '700 20px "JetBrains Mono", Consolas, monospace';
  tags.slice(0, 6).forEach((tag) => {
    const tw = ctx.measureText(tag).width + 28;
    if (tx + tw > w - 72) return;
    ctx.fillStyle = 'rgba(0, 255, 136, 0.12)';
    ctx.fillRect(tx, ty, tw, 38);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(tx, ty, tw, 38);
    ctx.fillStyle = '#00ff88';
    ctx.fillText(tag, tx + 14, ty + 26);
    tx += tw + 14;
  });

  // Footer Bar
  ctx.fillStyle = '#8FA198';
  ctx.font = '700 19px "JetBrains Mono", Consolas, monospace';
  ctx.fillText(
    `ENGRAVED ARCHIVE // ${f.recipientDisplay || 'ETHAN AREX V. ILUSTRE'}`,
    72,
    h - 54
  );
  ctx.textAlign = 'right';
  ctx.fillStyle = accent;
  ctx.fillText('▶ CLICK PORTRAIT TO INSPECT CLOSER', w - 72, h - 54);
  ctx.restore();
}

export function drawFrameArt(ctx, w, h, f) {
  if (f.boardType === 'engraved') {
    drawEngravedBoard(ctx, w, h, f);
    return;
  }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  setSpacing(ctx, '0px');

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#fbf5e3');
  g.addColorStop(1, '#ecdfb8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const gold = f.accent || '#b88a2b';
  ctx.strokeStyle = gold;
  ctx.lineWidth = 14;
  ctx.strokeRect(26, 26, w - 52, h - 52);
  ctx.lineWidth = 3;
  ctx.strokeRect(52, 52, w - 104, h - 104);

  ctx.fillStyle = gold;
  [[52, 52], [w - 52, 52], [52, h - 52], [w - 52, h - 52]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#6b5a2e';
  ctx.font = '600 24px Georgia, serif';
  setSpacing(ctx, '8px');
  ctx.fillText(f.award || 'VERIFIED CREDENTIAL', w / 2, 124);
  setSpacing(ctx, '0px');

  ctx.fillStyle = '#2b2212';
  ctx.font = 'bold 58px Georgia, serif';
  const lines = wrapLines(ctx, f.title, w - 210);
  let y = 225;
  lines.forEach((ln) => {
    ctx.fillText(ln, w / 2, y);
    y += 70;
  });

  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 170, y - 24);
  ctx.lineTo(w / 2 + 170, y - 24);
  ctx.stroke();

  ctx.fillStyle = '#4a3b17';
  ctx.font = 'italic 34px Georgia, serif';
  wrapLines(ctx, f.subtitle || '', w - 240).forEach((ln, i) =>
    ctx.fillText(ln, w / 2, y + 26 + i * 44)
  );

  // Seal
  const sx = w - 165;
  const sy = h - 155;
  const sg = ctx.createRadialGradient(sx - 14, sy - 14, 6, sx, sy, 66);
  sg.addColorStop(0, '#f6d77a');
  sg.addColorStop(1, '#a8761c');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(sx, sy, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7a5410';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(sx, sy, 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#5c3d08';
  ctx.font = '700 50px Georgia, serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', sx, sy + 3);
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#6b5a2e';
  ctx.font = '600 22px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Recipient: ${f.recipientDisplay || 'Ethan Arex V. Ilustre'}`, 88, h - 82);
  ctx.restore();
}

function drawImageContain(ctx, w, h, img) {
  ctx.fillStyle = '#090e0c';
  ctx.fillRect(0, 0, w, h);
  const pad = 20;
  const s = Math.min((w - pad * 2) / img.width, (h - pad * 2) / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export function createFrameTexture(frame) {
  const c = mk(ART_W, ART_H);
  const ctx = c.getContext('2d');
  drawFrameArt(ctx, ART_W, ART_H, frame);
  const tex = toTexture(c);
  tex.userData.canvas = c;
  return tex;
}

export function redrawFrameTexture(tex, frame, img) {
  const c = tex.userData.canvas;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, ART_W, ART_H);
  if (img) drawImageContain(ctx, ART_W, ART_H, img);
  else drawFrameArt(ctx, ART_W, ART_H, frame);
  tex.needsUpdate = true;
}

export function loadImageFromSrc(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function loadFrameImage(frame) {
  // 1. Check existing real certificate image in /images/achievements/ if provided
  if (frame.imagePath) {
    const direct = await loadImageFromSrc(frame.imagePath);
    if (direct) return direct;
  }
  // 2. Check /certificates/<id>.(png|jpg|jpeg|webp)
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const img = await loadImageFromSrc(`/certificates/${frame.id}.${ext}`);
    if (img) return img;
  }
  return null;
}

export function frameDataUrl(frame) {
  const c = mk(ART_W, ART_H);
  drawFrameArt(c.getContext('2d'), ART_W, ART_H, frame);
  return c.toDataURL('image/png');
}

export async function readImageFile(file, maxDim = 1600) {
  const url = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await loadImageFromSrc(url);
  if (!img) return url;
  const s = Math.min(1, maxDim / Math.max(img.width, img.height));
  const c = mk(Math.round(img.width * s), Math.round(img.height * s));
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.86);
}

/**
 * Creates a high-impact urban graffiti / mural canvas texture
 * Features bold stencil text, neon spray glow, chromatic aberration offsets,
 * diagonal hazard accents, and street art splatters.
 */
export function graffitiTexture({
  title = 'ONE FOR ALL',
  subtitle = '100% OVERDRIVE // EAVI',
  tag = 'BSIT DEV',
  theme = 'emerald', // 'emerald' | 'cyan' | 'gold' | 'neon'
  w = 1024,
  h = 512,
} = {}) {
  const c = mk(w, h);
  const ctx = c.getContext('2d');

  const palettes = {
    emerald: {
      bg: '#040d08',
      primary: '#00ff88',
      secondary: '#00e5ff',
      accent: '#ff0055',
      dark: 'rgba(0, 255, 136, 0.12)',
    },
    cyan: {
      bg: '#040b12',
      primary: '#00e5ff',
      secondary: '#72b8ff',
      accent: '#ffe600',
      dark: 'rgba(0, 229, 255, 0.12)',
    },
    gold: {
      bg: '#0e0b04',
      primary: '#ffd24a',
      secondary: '#ff9d00',
      accent: '#00ff88',
      dark: 'rgba(255, 210, 74, 0.12)',
    },
    neon: {
      bg: '#080511',
      primary: '#ff0077',
      secondary: '#9d00ff',
      accent: '#00ffcc',
      dark: 'rgba(255, 0, 119, 0.12)',
    },
  };

  const pal = palettes[theme] || palettes.emerald;

  // Background concrete wall with dark gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, pal.bg);
  bgGrad.addColorStop(1, '#020503');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Brick/concrete mortar grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 2;
  const brickH = 32;
  const brickW = 64;
  for (let y = 0; y < h; y += brickH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    const offset = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
    for (let x = offset; x < w; x += brickW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + brickH);
      ctx.stroke();
    }
  }

  // Paint spray drip streaks
  ctx.fillStyle = pal.dark;
  for (let i = 0; i < 18; i++) {
    const sx = Math.random() * w;
    const sy = Math.random() * (h * 0.4);
    const sw = 12 + Math.random() * 40;
    const sh = 60 + Math.random() * 180;
    ctx.beginPath();
    ctx.ellipse(sx, sy, sw, sw * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(sx - 3, sy, 6, sh);
  }

  // Diagonal Hazard Stripes at top and bottom edge
  const stripeH = 18;
  ctx.save();
  ctx.fillStyle = pal.secondary;
  for (let x = -stripeH; x < w + stripeH * 2; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 14, 0);
    ctx.lineTo(x, stripeH);
    ctx.lineTo(x - 14, stripeH);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, h - stripeH);
    ctx.lineTo(x + 14, h - stripeH);
    ctx.lineTo(x, h);
    ctx.lineTo(x - 14, h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Stencil Tag Stamp in upper corner
  ctx.save();
  ctx.translate(56, 64);
  ctx.rotate(-0.06);
  ctx.fillStyle = pal.accent;
  ctx.fillRect(-12, -22, ctx.measureText(tag).width + 72, 38);
  ctx.fillStyle = '#050807';
  ctx.font = '900 18px "JetBrains Mono", Impact, sans-serif';
  ctx.fillText(`// ${tag.toUpperCase()}`, 0, 2);
  ctx.restore();

  // Giant Main Title Graffiti
  ctx.save();
  ctx.translate(w / 2, h / 2 - 12);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Spray shadow blur
  ctx.shadowColor = pal.primary;
  ctx.shadowBlur = 36;
  ctx.font = '900 68px "Impact", "Arial Black", sans-serif';

  // Chromatic aberration drop shadow
  ctx.fillStyle = pal.accent;
  ctx.fillText(title, 5, 5);

  ctx.fillStyle = pal.secondary;
  ctx.fillText(title, -4, -3);

  // Main bold stencil fill
  ctx.fillStyle = pal.primary;
  ctx.fillText(title, 0, 0);

  // Inner stencil cut lines
  ctx.strokeStyle = pal.bg;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-w * 0.38, 0);
  ctx.lineTo(w * 0.38, 0);
  ctx.stroke();
  ctx.restore();

  // Subtitle / Tactical Info
  ctx.save();
  ctx.font = '700 22px "JetBrains Mono", Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = pal.secondary;
  ctx.shadowBlur = 12;
  ctx.fillText(subtitle, w / 2, h / 2 + 58);

  // Outer framing border
  ctx.strokeStyle = pal.primary;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, w - 40, h - 40);
  ctx.restore();

  return toTexture(c);
}
