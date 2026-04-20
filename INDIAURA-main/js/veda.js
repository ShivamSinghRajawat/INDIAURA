// Veda: The Heritage AI Guide & Interactive Effects

console.log("Initializing Veda AI...");

// 1. Veda UI Construction
const vedaContainer = document.createElement('div');
vedaContainer.className = 'veda-container';
vedaContainer.innerHTML = `
    <div class="veda-chat-window">
        <div class="veda-header">
            <span>🕉️ Veda AI Guide</span>
            <span class="close-veda">×</span>
        </div>
        <div class="veda-messages" id="veda-messages">
            <div class="msg bot">Namaste! I am Veda. Ask me about India's heritage, monuments, or festivals.</div>
        </div>
        <div class="veda-input-area">
            <input type="text" id="veda-input" placeholder="Ask a question...">
            <button id="veda-send">➤</button>
        </div>
    </div>
    <div class="veda-trigger">
        <div class="veda-avatar">🕉️</div>
    </div>
`;
document.body.appendChild(vedaContainer);

// CSS Injection
const style = document.createElement('style');
style.innerHTML = `
    .veda-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9998;
        font-family: var(--font-body);
    }

    .veda-trigger {
        width: 60px;
        height: 60px;
        background: var(--color-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 179, 71, 0.4);
        transition: transform 0.3s;
        animation: float 4s ease-in-out infinite;
    }

    .veda-trigger:hover {
        transform: scale(1.1);
    }

    .veda-avatar {
        font-size: 1.5rem;
    }

    .veda-chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 300px;
        height: 400px;
        background: rgba(20, 20, 20, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid var(--color-primary);
        border-radius: 12px;
        display: none;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        transform-origin: bottom right;
        transition: transform 0.3s, opacity 0.3s;
    }
    
    .veda-open {
        display: flex;
        animation: popOpen 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    @keyframes popOpen {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    .veda-header {
        background: var(--color-primary);
        color: #000;
        padding: 10px 15px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-veda {
        cursor: pointer;
        font-size: 1.2rem;
    }

    .veda-messages {
        flex-grow: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .msg {
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.9rem;
        max-width: 85%;
        line-height: 1.4;
    }

    .msg.bot {
        background: rgba(255,255,255,0.1);
        align-self: flex-start;
        border-bottom-left-radius: 2px;
    }

    .msg.user {
        background: var(--color-primary);
        color: #000;
        align-self: flex-end;
        border-bottom-right-radius: 2px;
    }

    .veda-input-area {
        padding: 10px;
        display: flex;
        border-top: 1px solid rgba(255,255,255,0.1);
    }

    #veda-input {
        flex-grow: 1;
        background: transparent;
        border: none;
        color: white;
        padding: 5px;
        outline: none;
    }

    #veda-send {
        background: none;
        border: none;
        color: var(--color-primary);
        cursor: pointer;
        font-size: 1.2rem;
    }
    
    /* Mantra Particle */
    .mantra-particle {
        position: fixed;
        pointer-events: none;
        color: var(--color-primary);
        font-weight: 700;
        font-size: 1.2rem;
        opacity: 0;
        animation: floatUpFade 1.5s ease-out;
        z-index: 9000;
    }

    @keyframes floatUpFade {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 2. Logic
const trigger = document.querySelector('.veda-trigger');
const windowUI = document.querySelector('.veda-chat-window');
const closeBtn = document.querySelector('.close-veda');
const input = document.getElementById('veda-input');
const sendBtn = document.getElementById('veda-send');
const msgs = document.getElementById('veda-messages');

trigger.addEventListener('click', () => {
    windowUI.classList.toggle('veda-open');
    if (windowUI.classList.contains('veda-open')) input.focus();
});

closeBtn.addEventListener('click', () => windowUI.classList.remove('veda-open'));

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('msg', sender);
    div.innerText = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function getBotResponse(query) {
    query = query.toLowerCase();
    if (query.includes('taj mahal')) return "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in Agra. It was commissioned in 1632.";
    if (query.includes('festival') || query.includes('holi')) return "Holi is a popular ancient Hindu festival, also known as the Festival of Spring, the Festival of Colours, or the Festival of Love.";
    if (query.includes('music') || query.includes('sound')) return "Indian classical music is the art music of the Indian subcontinent. Try turning on the Chronos dial to hear ambient sounds!";
    if (query.includes('hello') || query.includes('hi')) return "Namaste! How can I guide you through India's heritage today?";
    return "That's a fascinating topic. Explore our 'Explore' page to learn more about specific artifacts and sites!";
}

function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
        addMessage(getBotResponse(text), 'bot');
    }, 600);
}

sendBtn.addEventListener('click', handleSend);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});


// 3. Mantra Click Effect
const mantras = ['ॐ', 'शन्ति', 'सत्य', 'धर्म', 'प्रेम', 'ज्ञान', 'योगा'];

document.addEventListener('click', (e) => {
    // Avoid triggering on interactive elements to stay clean
    if (e.target.closest('input') || e.target.closest('button')) return;

    const mantra = mantras[Math.floor(Math.random() * mantras.length)];
    const el = document.createElement('div');
    el.className = 'mantra-particle';
    el.innerText = mantra;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1500);
});
