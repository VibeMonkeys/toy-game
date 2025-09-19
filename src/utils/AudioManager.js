export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.initialized = false;
        this.soundEnabled = true;
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

    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    playBeep(frequency = 440, duration = 200) {
        if (!this.audioContext || !this.soundEnabled) return;

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

    playPortalSound() {
        this.playBeep(600, 400);
    }

    playQuestComplete() {
        // 성공적인 퀘스트 완료 사운드
        setTimeout(() => this.playBeep(523, 150), 0);   // C5
        setTimeout(() => this.playBeep(659, 150), 150); // E5
        setTimeout(() => this.playBeep(784, 300), 300); // G5
    }

    playLevelUp() {
        // 레벨업/진행 사운드
        setTimeout(() => this.playBeep(440, 100), 0);   // A4
        setTimeout(() => this.playBeep(554, 100), 100); // C#5
        setTimeout(() => this.playBeep(659, 200), 200); // E5
        setTimeout(() => this.playBeep(880, 300), 400); // A5
    }

    playGameComplete() {
        // 게임 완료 축하 사운드
        setTimeout(() => this.playBeep(523, 200), 0);   // C5
        setTimeout(() => this.playBeep(659, 200), 200); // E5
        setTimeout(() => this.playBeep(784, 200), 400); // G5
        setTimeout(() => this.playBeep(1047, 400), 600); // C6
    }

    playError() {
        // 에러/실패 사운드
        this.playBeep(200, 500);
    }

    playFootstep() {
        // 발걸음 소리 (매우 짧고 낮은 소리)
        this.playBeep(150, 50);
    }

    playDialogOpen() {
        // 대화창 열기 사운드
        this.playBeep(800, 100);
    }

    playDialogClose() {
        // 대화창 닫기 사운드
        this.playBeep(600, 100);
    }

    playUIClick() {
        // UI 클릭 사운드
        this.playBeep(800, 80);
    }

    playUIHover() {
        // UI 호버 사운드
        this.playBeep(600, 60);
    }
};