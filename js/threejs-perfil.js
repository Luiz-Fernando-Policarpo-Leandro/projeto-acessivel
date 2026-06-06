import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
if (!canvas) throw new Error('Canvas #bg-canvas nao encontrado');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 20;

const sphereGeo = new THREE.IcosahedronGeometry(5, 12);
const sphereMat = new THREE.MeshStandardMaterial({
  color: '#b96f52',
  wireframe: true,
  transparent: true,
  opacity: 0.15,
  roughness: 0.4,
  metalness: 0.2,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const count = 600;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

const palette = [
  new THREE.Color('#b96f52'),
  new THREE.Color('#8fa08a'),
  new THREE.Color('#f7f5f1'),
  new THREE.Color('#8e4d37'),
];

for (let i = 0; i < count; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 6 + Math.random() * 4;

  positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = r * Math.cos(phi);

  const c = palette[Math.floor(Math.random() * palette.length)];
  colors[i * 3] = c.r;
  colors[i * 3 + 1] = c.g;
  colors[i * 3 + 2] = c.b;
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMat = new THREE.PointsMaterial({
  size: 0.08,
  vertexColors: true,
  transparent: true,
  opacity: 0.6,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

const ringGeo = new THREE.TorusGeometry(8, 0.04, 16, 100);
const ringMat = new THREE.MeshStandardMaterial({
  color: '#8fa08a',
  transparent: true,
  opacity: 0.2,
  roughness: 0.5,
  metalness: 0.3,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2.5;
scene.add(ring);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-5, 5, 5);
scene.add(dirLight);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight2.position.set(5, -3, -5);
scene.add(dirLight2);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  sphere.rotation.y = time * 0.08;
  sphere.rotation.x = Math.sin(time * 0.3) * 0.1;
  sphere.scale.setScalar(1 + Math.sin(time * 0.5) * 0.03);

  particles.rotation.y = time * 0.04 + mouseX * 0.05;
  particles.rotation.x = mouseY * 0.03;

  ring.rotation.z = time * 0.06;

  camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.015;
  camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.015;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
