import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
if (!canvas) throw new Error('Canvas #bg-canvas nao encontrado');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 30;

const count = 800;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const sizes = new Float32Array(count);

const palette = [
  new THREE.Color('#ff6a28'),
  new THREE.Color('#f3b14e'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#ff8c5a'),
];

for (let i = 0; i < count; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 60;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i * 3] = c.r;
  colors[i * 3 + 1] = c.g;
  colors[i * 3 + 2] = c.b;

  sizes[i] = Math.random() * 0.3 + 0.05;
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const mat = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: true,
  transparent: true,
  opacity: 0.7,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const points = new THREE.Points(geo, mat);
scene.add(points);

const torusGeo = new THREE.TorusKnotGeometry(4, 1.2, 128, 32);
const torusMat = new THREE.MeshStandardMaterial({
  color: '#ff6a28',
  wireframe: true,
  transparent: true,
  opacity: 0.12,
  roughness: 0.5,
  metalness: 0.3,
});
const torus = new THREE.Mesh(torusGeo, torusMat);
scene.add(torus);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  points.rotation.y = time * 0.03 + mouseX * 0.1;
  points.rotation.x = mouseY * 0.05;

  torus.rotation.x = time * 0.15;
  torus.rotation.y = time * 0.1;
  torus.position.y = Math.sin(time * 0.5) * 1.5;

  camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
