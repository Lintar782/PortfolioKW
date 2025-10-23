// --- Three.js Setup (Webcam Context) ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

// --- 3D Object: Icosahedron Hologram ---
let icosahedron;
let dragControl;
const rotationSpeed = 0.005;

function initHeroScene() {
    // Objek Utama: Icosahedron Transparan Wireframe
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00C6FF, // Biru Neon
        emissive: 0x7F00FF, // Ungu Kosmik (Cahaya Diri)
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
        side: THREE.DoubleSide
    });
    icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);
    
    // Partikel Latar Belakang (Simple Stars)
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xEDEDED, size: 0.1, opacity: 0.8, transparent: true });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Pencahayaan Neon
    const pointLight = new THREE.PointLight(0x00C6FF, 1.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
}

// --- Interaksi Drag 3D (Menggunakan GSAP Draggable untuk kemudahan) ---
// Catatan: Ini adalah simulasi sederhana. Pada implementasi penuh, Anda perlu
// mengikat Draggable ke perubahan rotasi Three.js.
// Untuk kemudahan, kita akan mengikat event mouse/touch langsung.
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (e) => {
    isDragging = true;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.offsetX - previousMousePosition.x;
    const deltaY = e.offsetY - previousMousePosition.y;

    // Rotasi objek berdasarkan gerakan mouse (dibatasi agar tidak terlalu cepat)
    icosahedron.rotation.y += deltaX * 0.005;
    icosahedron.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: e.offsetX, y: e.offsetY };
});


// --- Render Loop (Animasi) ---
function animate() {
    requestAnimationFrame(animate);

    if (icosahedron) {
        // Rotasi Idle (jika tidak sedang di-drag)
        if (!isDragging) {
            icosahedron.rotation.y += rotationSpeed;
        }
    }
    renderer.render(scene, camera);
}

// --- Event Listener ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Inisialisasi ---
initHeroScene();
animate();

// Export untuk digunakan di main.js (misal untuk GSAP Parallax)
window.icosahedron = icosahedron;
window.camera = camera;