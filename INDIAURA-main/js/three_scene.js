import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene Setup
const container = document.getElementById('canvas-container');
if (container) {
    const scene = new THREE.Scene();
    // Dark background matching the deep theme
    // scene.background = new THREE.Color(0x050505); 
    // Transparent background to blend with CSS gradient if needed, 
    // but here we keep it simple.

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom for hero background feel
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // --- Content: A Stylized "Digital" Globe ---

    // 1. Particle Sphere (Points)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000; // number of dots

    // Create detailed sphere distribution
    const posArray = new Float32Array(particlesCount * 3);
    const radius = 8;

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Fibonacci sphere distribution for even spread
        // Simplified random on sphere surface for now to look organic
        const r = radius;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);

        posArray[i] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = r * Math.cos(phi);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xFFB347, // Saffron Gold
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 2. Connecting Lines (Icosahedron)
    const wireframeGeo = new THREE.IcosahedronGeometry(8, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00A86B, // Green
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframeMesh);

    // 3. Central Core Glow
    const coreGeo = new THREE.SphereGeometry(7.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
        color: 0x1a2a4a, // Deep blue
        transparent: true,
        opacity: 0.3
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFB347, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Gentle pulses
        const time = Date.now() * 0.001;
        particlesMesh.rotation.y += 0.001;
        wireframeMesh.rotation.y -= 0.0005;

        // Pulse size
        const scale = 1 + Math.sin(time) * 0.02;
        wireframeMesh.scale.set(scale, scale, scale);

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
