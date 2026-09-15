// One shared three.js renderer + laptop model for every card.
// Phones (especially iOS) cap WebGL contexts and GPU memory, so instead of a
// canvas per laptop we render the single model offscreen and copy each frame
// into that card's own 2D canvas.

const W = 3.12;       // body width (≈ 16" laptop)
const D = 2.16;       // body depth
const T = 0.07;       // body thickness
const LID_H = 2.02;   // lid height
const LID_T = 0.04;   // lid thickness
const OPEN = -0.16;   // lid lean past vertical (radians)
const SCREEN_W = W - 0.12;
const SCREEN_H = LID_H - 0.15;

let enginePromise = null;

function pathRoundRect(g, x, y, w, h, r) {
  // Manual path — CanvasRenderingContext2D.roundRect is missing on older Safari
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

function shapeRoundRect(THREE, w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// ShapeGeometry UVs follow shape coordinates — map them to 0..1
function normaliseUV(geometry, w, h) {
  const uv = geometry.attributes.uv;
  const pos = geometry.attributes.position;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  }
}

function deckTexture(THREE, size) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = Math.round(size * (D / W));
  const g = c.getContext('2d');
  const px = c.width / W;
  const s = size / 2048;

  // Key well
  const kbX = 0.34 * px;
  const kbY = 0.13 * px;
  const kbW = (W - 0.68) * px;
  const kbH = 0.98 * px;
  pathRoundRect(g, kbX, kbY, kbW, kbH, 20 * s);
  g.fillStyle = '#050506';
  g.fill();

  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
    [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.7],
    [2.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.3],
    [1, 1, 1, 1.3, 5.2, 1.3, 1, 1, 1]
  ];
  const pad = 16 * s;
  const gap = 12 * s;
  const rowH = (kbH - pad * 2 - gap * (rows.length - 1)) / rows.length;
  rows.forEach((row, ri) => {
    const units = row.reduce((a, b) => a + b, 0);
    const unitW = (kbW - pad * 2 - gap * (row.length - 1)) / units;
    let x = kbX + pad;
    const h = ri === 0 ? rowH * 0.6 : rowH;
    const y = kbY + pad + ri * (rowH + gap) + (rowH - h);
    row.forEach((u) => {
      const w = unitW * u + gap * (u - 1);
      const grad = g.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, '#2a2a2e');
      grad.addColorStop(0.15, '#1a1a1d');
      grad.addColorStop(1, '#0e0e10');
      pathRoundRect(g, x, y, w, h, 8 * s);
      g.fillStyle = grad;
      g.fill();
      x += w + gap;
    });
  });

  // Speaker grilles
  g.fillStyle = 'rgba(10, 10, 12, 0.55)';
  [[0.08, 0.28], [W - 0.28, W - 0.08]].forEach(([a, b]) => {
    for (let gx = a * px; gx < b * px; gx += 12 * s) {
      for (let gy = kbY; gy < kbY + kbH; gy += 12 * s) {
        g.beginPath();
        g.arc(gx, gy, 2.6 * s, 0, Math.PI * 2);
        g.fill();
      }
    }
  });

  // Glass trackpad
  const tpW = 1.24 * px;
  const tpH = 0.8 * px;
  const tpX = (c.width - tpW) / 2;
  const tpY = kbY + kbH + 0.12 * px;
  pathRoundRect(g, tpX, tpY, tpW, tpH, 28 * s);
  g.fillStyle = 'rgba(255, 255, 255, 0.05)';
  g.fill();
  g.strokeStyle = 'rgba(20, 20, 24, 0.35)';
  g.lineWidth = 3 * s;
  g.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Diagonal reflection on the display glass
function glareTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 320;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 512, 320);
  grad.addColorStop(0, 'rgba(255,255,255,0.16)');
  grad.addColorStop(0.38, 'rgba(255,255,255,0.05)');
  grad.addColorStop(0.39, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 320);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function shadowTexture(THREE) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  // Pure black: tinted colour at low alpha would brighten the transparent canvas
  grad.addColorStop(0, 'rgba(0,0,0,0.55)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0.2)');
  grad.addColorStop(0.95, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

async function createEngine() {
  const THREE = await import('three');
  const { RoundedBoxGeometry } = await import('three/examples/jsm/geometries/RoundedBoxGeometry.js');
  const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');

  const phone = window.matchMedia('(max-width: 767px)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
  if (!renderer.getContext()) throw new Error('WebGL unavailable');
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // Low, nearly front-on camera so the display dominates the frame
  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 100);
  camera.position.set(0, 2.0, 8.4);
  camera.lookAt(0, 0.78, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe6d6, 0.8);
  rim.position.set(5, 3, -4);
  scene.add(rim);

  const aluminium = new THREE.MeshPhysicalMaterial({
    color: 0x6c6e73,
    metalness: 1,
    roughness: 0.36,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35
  });

  const laptop = new THREE.Group();
  scene.add(laptop);

  const body = new THREE.Mesh(new RoundedBoxGeometry(W, T, D, 5, 0.034), aluminium);
  body.position.y = T / 2;
  laptop.add(body);

  const deck = new THREE.Mesh(
    new THREE.PlaneGeometry(W - 0.02, D - 0.02),
    new THREE.MeshStandardMaterial({ map: deckTexture(THREE, phone ? 1024 : 2048), transparent: true, roughness: 0.8, metalness: 0 })
  );
  deck.rotation.x = -Math.PI / 2;
  deck.position.y = T + 0.001;
  laptop.add(deck);

  const hinge = new THREE.Group();
  hinge.position.set(0, T, -D / 2 + 0.035);
  hinge.rotation.x = OPEN;
  laptop.add(hinge);

  const lid = new THREE.Mesh(new RoundedBoxGeometry(W, LID_H, LID_T, 5, 0.028), aluminium);
  lid.position.set(0, LID_H / 2, 0);
  hinge.add(lid);

  // Thin black glass bezel
  const bezel = new THREE.Mesh(
    new THREE.ShapeGeometry(shapeRoundRect(THREE, W - 0.024, LID_H - 0.024, 0.085), 8),
    new THREE.MeshPhysicalMaterial({ color: 0x040405, roughness: 0.1, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04 })
  );
  bezel.position.set(0, LID_H / 2, LID_T / 2 + 0.001);
  hinge.add(bezel);

  const screenGeo = new THREE.ShapeGeometry(shapeRoundRect(THREE, SCREEN_W, SCREEN_H, 0.03), 4);
  normaliseUV(screenGeo, SCREEN_W, SCREEN_H);
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, LID_H / 2 + 0.035, LID_T / 2 + 0.003);
  hinge.add(screen);

  const glare = new THREE.Mesh(
    new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
    new THREE.MeshBasicMaterial({ map: glareTexture(THREE), transparent: true, depthWrite: false, toneMapped: false })
  );
  glare.position.copy(screen.position);
  glare.position.z += 0.002;
  hinge.add(glare);

  const notch = new THREE.Mesh(
    new THREE.ShapeGeometry(shapeRoundRect(THREE, 0.32, 0.075, 0.03), 4),
    new THREE.MeshBasicMaterial({ color: 0x040405 })
  );
  notch.position.set(0, screen.position.y + SCREEN_H / 2 - 0.02, LID_T / 2 + 0.004);
  hinge.add(notch);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.35, D * 1.2),
    new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, depthWrite: false, toneMapped: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.005;
  laptop.add(shadow);

  // Screenshot textures, cropped from the top to the 16:10-ish display
  const loader = new THREE.TextureLoader();
  const textures = new Map();
  const listeners = new Set();
  const getTexture = (image) => {
    if (textures.has(image)) return textures.get(image);
    textures.set(image, null);
    loader.load(`/images/projects/${image}`, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      const imgAspect = tex.image.width / tex.image.height;
      const screenAspect = SCREEN_W / SCREEN_H;
      if (imgAspect < screenAspect) {
        tex.repeat.set(1, imgAspect / screenAspect);
        tex.offset.set(0, 1 - tex.repeat.y);
      }
      textures.set(image, tex);
      listeners.forEach((fn) => fn(image));
    });
    return null;
  };

  const renderInto = (ctx, width, height, image, ry) => {
    if (!width || !height) return;
    const tex = getTexture(image);
    screenMat.map = tex;
    screenMat.color.set(tex ? 0xffffff : 0x000000);
    screenMat.needsUpdate = true;
    laptop.rotation.y = ry;
    if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
      renderer.setSize(width, height, false);
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(renderer.domElement, 0, 0, width, height);
  };

  const onTexture = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  return { renderInto, onTexture, phone };
}

export function getLaptopEngine() {
  if (!enginePromise) {
    enginePromise = createEngine().catch((error) => {
      console.warn('3D laptop disabled:', error);
      return null;
    });
  }
  return enginePromise;
}
