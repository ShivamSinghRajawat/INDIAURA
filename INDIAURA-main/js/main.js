// Main application logic

console.log("Indiaura App Initialized");

// --- Language Toggle (Mock) ---
const langToggle = document.getElementById('lang-toggle');
let currentLang = 'EN';

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'EN' ? 'HI' : 'EN';
        updateLanguage(currentLang);
    });
}

function updateLanguage(lang) {
    console.log(`Switching language to ${lang}`);
    const btnText = lang === 'EN' ? '🇺🇸 EN / 🇮🇳 HI' : '🇮🇳 HI / 🇺🇸 EN';
    if (langToggle) langToggle.innerText = btnText;

    // Mock simple text replacement for demo purposes
    if (lang === 'HI') {
        translatePageToHindi();
    } else {
        translatePageToEnglish();
    }
}

function translatePageToHindi() {
    const elements = {
        '.tagline': 'भारत की संस्कृति को डिजिटल रूप से संरक्षित करना 🇮🇳',
        'h1': 'अमर विरासत का <br> <span style="color: var(--color-text-main)">अनुभव करें</span>',
        '.cta-group .btn-primary': 'विरासत देखें',
        '.cta-group .btn-outline': 'वर्चुअल टूर शुरू करें'
    };

    for (const [selector, text] of Object.entries(elements)) {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = text;
    }
}

function translatePageToEnglish() {
    location.reload();
}

// --- Light/Dark Theme Toggle ---
// We will look for a theme toggle button. If not found, we create one dynamically for the navbar.
// Or we expect the user to have added it. Let's try to attach to an ID or create it.

function initThemeToggle() {
    // Check if toggle exists, if not, create it in nav-actions
    let themeBtn = document.getElementById('theme-toggle');

    if (!themeBtn) {
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            themeBtn = document.createElement('button');
            themeBtn.id = 'theme-toggle';
            themeBtn.className = 'btn-outline';
            themeBtn.style.padding = '8px 12px';
            themeBtn.style.fontSize = '1.2rem';
            themeBtn.style.marginLeft = '10px';
            themeBtn.innerHTML = '🌞'; // Default to sun (click to switch to light) or moon depending on current
            navActions.appendChild(themeBtn);
        }
    }

    if (themeBtn) {
        // Load saved preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeBtn.innerHTML = savedTheme === 'dark' ? '🌞' : '🌙';

        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeBtn.innerHTML = newTheme === 'dark' ? '🌞' : '🌙';

            // Dispatch event for other scripts (like map.js) to react
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
        });
    }
}

// Initialize on load
initThemeToggle();
