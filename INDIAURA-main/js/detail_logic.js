import { heritageData } from './data.js';

console.log("Details Page Initializing...");

// Parse URL
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id')) || 2; // Default to Taj Mahal if missing

// Find Data
const item = heritageData.find(d => d.id === id) || heritageData.find(d => d.id === 2);

if (item) {
    // 1. Update Hero
    document.querySelector('.hero-banner h1').innerText = item.name;

    // Update Meta spans
    const metaContainer = document.querySelector('.hero-overlay .container div');
    // Assuming structure: [Location, Category, Tag] - we might need to be safer or query selectors directly if possible.
    // Let's rewrite the innerHTML for safety.
    metaContainer.innerHTML = `
        <span>📍 ${item.location}</span>
        <span>🏛️ ${item.category.toUpperCase()}</span>
        <span>⭐️ ${item.tag}</span>
    `;

    // Banner Image
    document.querySelector('.hero-banner').style.backgroundImage = `url('${item.image}')`;

    // 2. Update AI Story
    const storyTitle = document.querySelector('.story-box h3');
    storyTitle.innerText = `The Story of ${item.name}`;

    // Update Typewriter Text source
    const aiText = item.description
        ? item.description
        : `${item.name} is a magnificent heritage site located in ${item.location}. Accessing ancient archives to retrieve full history...`;

    // Expose to global scope for the existing typewriter script in HTML to pick up
    // Or better, re-implement typewriter here.
    const textContainer = document.getElementById('ai-text-container');
    textContainer.innerHTML = '';
    let idx = 0;
    function typeWriter() {
        if (idx < aiText.length) {
            textContainer.innerHTML += aiText.charAt(idx);
            idx++;
            setTimeout(typeWriter, 20);
        }
    }
    setTimeout(typeWriter, 500);


    // 3. Update Facts
    // We assume there are fact cards in the DOM. Let's find them.
    const factCards = document.querySelectorAll('.fact-card p');
    if (item.facts && item.facts.length > 0) {
        if (factCards[0]) factCards[0].innerText = item.facts[0];
        if (factCards[1]) factCards[1].innerText = item.facts[1] || item.facts[0];
    } else {
        // Fallbacks
        if (factCards[0]) factCards[0].innerText = "A timeless masterpiece of Indian heritage.";
        if (factCards[1]) factCards[1].innerText = "Visited by millions of tourists every year.";
    }

    // 4. Update VR Button
    // Maybe update link or hint that VR is available
}
