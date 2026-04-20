// 360° Panorama Viewer using Three.js

import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

console.log("Initializing 360 Viewer...");

const container = document.getElementById('panorama-container');

if (container) {
    init360(container);
}

function init360(element) {
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, element.clientWidth / element.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Slightly offset

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(element.clientWidth, element.clientHeight);
    element.innerHTML = ''; // Clear placeholder
    element.appendChild(renderer.domElement);

    // Geometry (Inside of Sphere)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert scale to view inside

    // Texture
    const texture = new THREE.TextureLoader().load('assets/taj_360.png');
    const material = new THREE.MeshBasicMaterial({ map: texture });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Interaction (Simple Mouse Drag)
    let isDragging = false;
    let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
    let lon = 0, onPointerDownLon = 0;
    let lat = 0, onPointerDownLat = 0;
    let phi = 0, theta = 0;

    element.style.cursor = 'grab';

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        element.style.cursor = 'grabbing';
        onPointerDownPointerX = e.clientX;
        onPointerDownPointerY = e.clientY;
        onPointerDownLon = lon;
        onPointerDownLat = lat;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        element.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        lon = (onPointerDownPointerX - e.clientX) * 0.1 + onPointerDownLon;
        lat = (e.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    });

    // Touch support basic
    element.addEventListener('touchstart', (e) => {
        isDragging = true;
        onPointerDownPointerX = e.touches[0].clientX;
        onPointerDownLon = lon;
    });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        lon = (onPointerDownPointerX - e.touches[0].clientX) * 0.2 + onPointerDownLon;
    });


    function animate() {
        requestAnimationFrame(animate);

        // Auto rotate slowly if not dragging
        if (!isDragging) {
            lon += 0.05;
        }

        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.MathUtils.degToRad(90 - lat);
        theta = THREE.MathUtils.degToRad(lon);

        camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
        camera.position.y = 100 * Math.cos(phi);
        camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        // Only if container still exists and has dimension changes
        if (element.clientWidth > 0) {
            camera.aspect = element.clientWidth / element.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(element.clientWidth, element.clientHeight);
        }
    });
}
