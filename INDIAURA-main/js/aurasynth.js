// AuraSynth: Generative Web Audio Engine for Indiaura
// Generates persistent ambient soundscapes based on the active "Time Era".

console.log("Initializing AuraSynth...");

class AuraSynth {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.currentEra = 'present';
        this.oscillators = [];
        this.isMuted = true; // Default to muted for browser autoplay policy
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.1; // Low volume background
        this.masterGain.connect(this.ctx.destination);
    }

    togglePlay() {
        if (this.isMuted) {
            this.init();
            this.ctx.resume();
            this.isMuted = false;
            this.updateSoundscape();
            return true;
        } else {
            this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
            setTimeout(() => this.ctx.suspend(), 500);
            this.isMuted = true;
            return false;
        }
    }

    stopAll() {
        this.oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
            try { osc.disconnect(); } catch (e) { }
        });
        this.oscillators = [];
    }

    setEra(era) {
        if (this.currentEra === era) return;
        this.currentEra = era;
        if (!this.isMuted) this.updateSoundscape();
    }

    updateSoundscape() {
        this.stopAll();
        if (this.isMuted) return;

        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2); // Fade in

        if (this.currentEra === 'ancient') {
            this.playAncientTheme();
        } else if (this.currentEra === 'future') {
            this.playFutureTheme();
        } else {
            // Present - Silence or minimal Texture
            // Keeping silent for contrast 
        }
    }

    playAncientTheme() {
        // Ethereal Drone (Tibetan Bowl style)
        const freqs = [110, 220, 330];
        freqs.forEach(f => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;

            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.1 + Math.random(); // Slow wobble
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 2;
            lfo.connect(lfoGain).connect(osc.frequency);

            osc.connect(this.masterGain);
            osc.start();
            lfo.start();
            this.oscillators.push(osc, lfo);
        });

        // Wind Noise
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Low rumble wind

        noise.connect(filter).connect(this.masterGain);
        noise.start();
        this.oscillators.push(noise);
    }

    playFutureTheme() {
        // Sci-Fi Drone (Sawtooth + Detune)
        const freqs = [55, 110];
        freqs.forEach(f => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = f;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(100, this.ctx.currentTime);
            filter.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 5); // Filter sweep

            // Stereo Panner (Mock) if supported or just direct
            osc.connect(filter).connect(this.masterGain);
            osc.start();
            this.oscillators.push(osc);
        });

        // Digital "Bleeps" Loop
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.value = 0.05;

        // LFO for bleep rhythm
        const lfo = this.ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 4; // 4Hz rhythm
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 1;

        // AM Synthesis
        lfo.connect(gain.gain);

        osc.connect(gain).connect(this.masterGain);
        osc.start();
        lfo.start();
        this.oscillators.push(osc, lfo);
    }
}

// Global Instance
window.auraSynth = new AuraSynth();

// UI Injector for Mute Button (attached to Chronos or Veda)
const muteBtn = document.createElement('button');
muteBtn.innerHTML = '🔇 Sound Off';
muteBtn.className = 'aura-toggle btn-outline';
muteBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 130px; /* Next to Chronos */
    z-index: 9999;
    padding: 8px 15px;
    font-size: 0.8rem;
    backdrop-filter: blur(5px);
    background: rgba(0,0,0,0.5);
    border-radius: 20px;
    transition: all 0.3s;
`;

document.body.appendChild(muteBtn);

muteBtn.addEventListener('click', () => {
    const isPlaying = window.auraSynth.togglePlay();
    muteBtn.innerHTML = isPlaying ? '🔊 Sound Active' : '🔇 Sound Off';
    muteBtn.style.borderColor = isPlaying ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)';
    muteBtn.style.color = isPlaying ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)';
});

// Listener for Chronos Era Change (MutationObserver on HTML attribute)
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-era") {
            const newEra = document.documentElement.getAttribute('data-era');
            console.log("AuraSynth detected era:", newEra);
            window.auraSynth.setEra(newEra);
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true
});
