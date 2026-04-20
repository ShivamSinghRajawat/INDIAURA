import { heritageData } from './data.js';

const grid = document.getElementById('heritage-grid');
const btns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');

// Check for URL Search Params
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get('search');

// State
let currentState = {
    filter: 'all',
    search: initialSearch || ''
};

if (initialSearch && searchInput) {
    searchInput.value = initialSearch;
}

function renderCards() {
    grid.innerHTML = '';

    // Filter by Category
    let filtered = currentState.filter === 'all'
        ? heritageData
        : heritageData.filter(item => item.category === currentState.filter || (currentState.filter === 'unesco' && item.category === 'unesco'));

    // Filter by Search Term
    if (currentState.search) {
        const term = currentState.search.toLowerCase();
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(term) ||
            item.location.toLowerCase().includes(term) ||
            item.tag.toLowerCase().includes(term) ||
            item.thought.toLowerCase().includes(term)
        );
    }

    // Render
    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 3rem;">
            <h3>No results found</h3>
            <p>Try refining your search term.</p>
        </div>`;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'heritage-card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${item.image}')"></div>
            <div class="card-content">
                <span class="card-tag">${item.tag}</span>
                <h3 class="card-title">${item.name}</h3>
                <div class="card-location">📍 ${item.location}</div>
                
                <div style="margin-top: 1rem; padding: 0.8rem; background: rgba(255,255,255,0.05); border-left: 2px solid var(--color-primary); border-radius: 4px; font-style: italic; font-size: 0.85rem; color: var(--color-text-muted);">
                    "${item.thought}"
                </div>

                <a href="detail.html?id=${item.id}" class="btn btn-outline" style="margin-top: 1rem; width: 100%; text-align: center; border-radius: 8px; padding: 8px;">Explore View</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initial Render
renderCards();

// Event Listeners: Filters
btns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active class toggle
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update State
        currentState.filter = btn.dataset.filter;
        renderCards();
    });
});

// Event Listeners: Search
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentState.search = e.target.value.trim();
        renderCards();
    });
}
