// Chronos Time Dial - Exclusive Time Travel Feature

console.log("Initializing Chronos Time Dial...");

const eras = ['present', 'ancient', 'future'];
let currentEraIndex = 0;

// Create Dial UI
const dialContainer = document.createElement('div');
dialContainer.className = 'chronos-dial-container';
dialContainer.innerHTML = `
    <div class="chronos-ring">
        <div class="chronos-label">TIME ERA</div>
        <div class="chronos-marker"></div>
        <div class="chronos-era-display">PRESENT</div>
    </div>
    <div class="chronos-instructions">Click to Time Travel</div>
`;

document.body.appendChild(dialContainer);

// CSS Injection for Dial
const style = document.createElement('style');
style.innerHTML = `
    .chronos-dial-container {
        position: fixed;
        bottom: 30px;
        left: 30px;
        z-index: 10000;
        cursor: pointer;
        opacity: 0.8;
        transition: transform 0.3s, opacity 0.3s;
    }
    
    .chronos-dial-container:hover {
        transform: scale(1.1);
        opacity: 1;
    }

    .chronos-ring {
        width: 80px;
        height: 80px;
        border: 2px solid var(--color-primary);
        border-radius: 50%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(5px);
        box-shadow: 0 0 20px var(--color-primary-glow);
        transition: all 0.5s ease;
    }

    .chronos-label {
        font-size: 0.5rem;
        color: var(--color-text-muted);
        letter-spacing: 1px;
    }

    .chronos-era-display {
        font-size: 0.7rem;
        font-weight: 700;
        color: var(--color-primary);
        text-transform: uppercase;
        margin-top: 2px;
    }

    .chronos-marker {
        width: 60px;
        height: 60px;
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        position: absolute;
        top: 8px;
        left: 8px;
        transition: transform 0.5s cubic-bezier(0.4, 2, 0.5, 1);
    }

    .chronos-instructions {
        font-size: 0.7rem;
        color: var(--color-primary);
        text-align: center;
        margin-top: 8px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s;
    }

    .chronos-dial-container:hover .chronos-instructions {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Era - Ancient */
    [data-era="ancient"] {
        --color-bg-deep: #2c1e12;
        --color-text-main: #d4b483;
        --color-primary: #8b4513;
        --color-bg-card: rgba(60, 40, 20, 0.8);
        --font-heading: 'Cinzel', serif; /* Enhance serif feel */
        filter: sepia(0.6) contrast(1.1);
    }
    
    [data-era="ancient"] .chronos-ring {
        border-color: #8b4513;
        background: #1a1005;
        box-shadow: 0 0 10px #8b4513;
    }

    /* Era - Future */
    [data-era="future"] {
        --color-bg-deep: #000510;
        --color-text-main: #0ff;
        --color-primary: #0ff;
        --color-secondary: #f0f;
        --color-bg-card: rgba(0, 255, 255, 0.1);
        --glass-border: 1px solid #0ff;
        filter: saturate(1.2) hue-rotate(10deg);
    }

    [data-era="future"] body {
        background-image: linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent);
        background-size: 50px 50px;
    }

    [data-era="future"] .chronos-ring {
        border-color: #0ff;
        box-shadow: 0 0 30px #0ff;
        animation: pulse-future 2s infinite;
    }

    @keyframes pulse-future {
        0% { box-shadow: 0 0 20px #0ff; }
        50% { box-shadow: 0 0 50px #0ff, 0 0 10px #f0f; }
        100% { box-shadow: 0 0 20px #0ff; }
    }
`;
document.head.appendChild(style);

// Logic
dialContainer.addEventListener('click', () => {
    currentEraIndex = (currentEraIndex + 1) % eras.length;
    const newEra = eras[currentEraIndex];
    document.documentElement.setAttribute('data-era', newEra);

    // Update Dial UI
    document.querySelector('.chronos-era-display').innerText = newEra;
    document.querySelector('.chronos-marker').style.transform = `rotate(${currentEraIndex * 120}deg)`;

    // Play Click Sound (Optional/Mock)
    console.log(`Travelled to: ${newEra}`);

    // Trigger Global Animation
    document.body.style.transition = 'filter 1s ease, background 1s ease';

    if (newEra === 'ancient') {
        // Mock Old Film Grain Overlay?
    }
});
