// Map Implementation
console.log("Initializing Map...");

const mapElement = document.getElementById('map-container');
const loadingScreen = document.getElementById('loading');

// 1. Data Source (Heritage Sites)
const sites = [
    {
        name: "Taj Mahal",
        lat: 27.1751,
        lng: 78.0421,
        img: "assets/taj_mahal.png",
        desc: "An immense mausoleum of white marble, built in Agra between 1631 and 1648."
    },
    {
        name: "Hampi Group of Monuments",
        lat: 15.3350,
        lng: 76.4600,
        img: "assets/hampi.png",
        desc: "The grandiose remains of the last great Hindu kingdom in South India."
    },
    {
        name: "Ajanta Caves",
        lat: 20.5519,
        lng: 75.7033,
        img: "assets/ajanta.png", // Generic cave
        desc: "Masterpieces of Buddhist religious art, with figures of the Buddha and depictions of Jataka tales."
    },
    {
        name: "Sun Temple, Konark",
        lat: 19.8876,
        lng: 86.0945,
        img: "assets/konark.png",
        desc: "A monumental representation of the sun god Surya's chariot; its 24 wheels are decorated with symbolic designs."
    },
    {
        name: "Qutub Minar",
        lat: 28.5244,
        lng: 77.1855,
        img: "assets/qutub_minar.png",
        desc: "A soaring, 73 m-high tower of victory, built in 1193 by Qutab-ud-din Aibak."
    },
    {
        name: "Khajuraho Group of Monuments",
        lat: 24.8318,
        lng: 79.9199,
        img: "assets/hampi.png", // Generic temple
        desc: "Stunning temples famous for their nagara-style architectural symbolism and erotic sculptures."
    }
];

// 2. Initialize Leaflet
// Centered on India
const map = L.map('map-container', {
    zoomControl: false, // We will add it elsewhere or keep minimal
    attributionControl: false
}).setView([22.5937, 78.9629], 5);

// L.control.zoom({ position: 'bottomright' }).addTo(map);

// 3. Dark Mode Tiles (Base init)
let tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Theme Listener
window.addEventListener('themeChanged', (e) => {
    const theme = e.detail.theme;
    if (tileLayer) map.removeLayer(tileLayer);

    const url = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayer = L.tileLayer(url, {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
});

// 4. Custom Marker Icon
const iconHtml = `
    <div class="marker-pin"></div>
    <div class="pulse"></div>
`;

const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: iconHtml,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
});

// 5. Add Markers
sites.forEach(site => {
    const marker = L.marker([site.lat, site.lng], { icon: customIcon }).addTo(map);

    // Initial Popup Content
    const popupContent = `
        <div class="popup-card">
            <img src="${site.img}" class="popup-img" alt="${site.name}">
            <div class="popup-content">
                <h3 class="popup-title">${site.name}</h3>
                <p class="popup-desc">${site.desc}</p>
                <div class="popup-actions">
                    <button class="popup-btn btn-listen">🔊 Listen</button>
                    <a href="detail.html" class="popup-btn btn-view" style="display:block; text-align:center; padding-top:4px;">View Details</a>
                </div>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent, {
        closeButton: true,
        className: 'premium-popup',
        maxWidth: 300
    });

    // Hover interactions
    marker.on('mouseover', function (e) {
        this.openPopup();
    });

    // We might want to keep popup open on mouseover popup, but simple hover is okay for now.
    // Basic implementation: click to lock, hover to peek.
});

// 6. Fade In Animation
window.addEventListener('load', () => {
    setTimeout(() => {
        // Fade out loading
        loadingScreen.style.opacity = '0';
        loadingScreen.style.pointerEvents = 'none';

        // Fade in map
        mapElement.style.opacity = '1';

        // map.flyTo([22.5937, 78.9629], 5, { duration: 2 });
    }, 800);
});

// 7. Parallax & Atmosphere Effect
document.addEventListener('mousemove', (e) => {
    const silhouette = document.getElementById('silhouette');
    if (!silhouette) return;

    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    // Gentle movement opposite to cursor
    silhouette.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});

// Add floating dust particles
const body = document.body;
for (let i = 0; i < 20; i++) {
    const dust = document.createElement('div');
    dust.classList.add('dust-particle');

    const size = Math.random() * 3;
    dust.style.width = `${size}px`;
    dust.style.height = `${size}px`;
    dust.style.left = `${Math.random() * 100}vw`;
    dust.style.top = `${Math.random() * 100}vh`;
    dust.style.animationDuration = `${10 + Math.random() * 20}s`;
    dust.style.zIndex = '450'; // Between Map and Vignette

    body.appendChild(dust);
}
