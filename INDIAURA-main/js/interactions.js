// Premium Interactions & Gestures (No external heavy libs)

console.log("Initializing Premium Interactions...");

// 1. Custom Luxury Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

document.addEventListener('mousemove', (e) => {
    // Smooth follow for outer circle
    cursor.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
    // Instant follow for inner dot
    cursorDot.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
});

// Hover States for Cursor
const interactables = document.querySelectorAll('a, button, .heritage-card, .event-card, .artifact-frame');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// 2. 3D Tilt Effect on Cards
function initTilt(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 15deg)
            const xPct = x / rect.width;
            const yPct = y / rect.height;
            const xRot = (0.5 - yPct) * 15; // Invert Y for X rotation
            const yRot = (xPct - 0.5) * 15;

            el.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`;

            // Glare/Shine Effect
            let shine = el.querySelector('.shine');
            if (!shine) {
                shine = document.createElement('div');
                shine.className = 'shine';
                el.appendChild(shine);
            }
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            const shine = el.querySelector('.shine');
            if (shine) shine.style.background = 'none';
        });
    });
}

// Init Tilt on key elements
initTilt('.heritage-card');
initTilt('.event-card');
initTilt('.stat-box');
initTilt('.team-card');

// 3. Scroll-Linked Rotations & Animations
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Rotate Museum Artifacts
    const artifacts = document.querySelectorAll('.artifact-frame');
    artifacts.forEach((art, index) => {
        const speed = index % 2 === 0 ? 0.1 : -0.1;
        art.style.transform = `rotate(${scrolled * speed}deg)`;
    });

    // Parallax Headers
    const headers = document.querySelectorAll('h1');
    headers.forEach(h => {
        h.style.transform = `translateY(${scrolled * 0.2}px)`;
        h.style.opacity = 1 - (scrolled / 800);
    });

    // Rotate User Profile in Nav for fun
    const profile = document.querySelector('.user-profile');
    if (profile) {
        profile.style.transform = `rotate(${scrolled * 0.5}deg)`;
    }
});

console.log("Premium Interactions Active.");
