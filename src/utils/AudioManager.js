export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }

    playBeep(frequency = 440, duration = 200) {
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }

    playItemCollect() {
        this.playBeep(800, 300);
    }

    playMenuSelect() {
        this.playBeep(600, 150);
    }

    playMenuMove() {
        this.playBeep(400, 100);
    }
};