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

    // === 90년대 컴퓨터 시작 음성 및 효과음 ===

    playPOSTBeep() {
        // BIOS POST 테스트 비프음 (1999년 컴퓨터 시작음)
        this.playBeep(1000, 200);
    }

    playSystemStartup() {
        // 90년대 컴퓨터 시스템 시작 사운드 시퀀스
        setTimeout(() => this.playBeep(1000, 200), 0);    // POST 비프
        setTimeout(() => this.playBeep(800, 150), 500);   // 하드웨어 확인
        setTimeout(() => this.playBeep(600, 100), 800);   // 메모리 테스트
        setTimeout(() => this.playBeep(900, 250), 1200);  // OS 로딩 시작
    }

    playWindowsStartup() {
        // Windows 98 시작 사운드 (TA-DA! 멜로디 재현)
        setTimeout(() => this.playBeep(523, 150), 0);     // C5
        setTimeout(() => this.playBeep(659, 150), 150);   // E5
        setTimeout(() => this.playBeep(784, 150), 300);   // G5
        setTimeout(() => this.playBeep(1047, 400), 450);  // C6 (길게)
    }

    playDiskActivity() {
        // 플로피 디스크/하드드라이브 읽기 소리
        const diskSound = () => {
            this.playBeep(200 + Math.random() * 100, 50);
        };

        for (let i = 0; i < 8; i++) {
            setTimeout(diskSound, i * 80);
        }
    }

    playModemDialup() {
        // 90년대 모뎀 다이얼업 소리 (짧은 버전)
        setTimeout(() => this.playBeep(2100, 300), 0);    // 다이얼톤
        setTimeout(() => this.playBeep(1800, 200), 400);  // 연결음
        setTimeout(() => this.playBeep(1200, 150), 700);  // 핸드셰이크
        setTimeout(() => this.playBeep(2400, 100), 900);  // 연결 완료
    }

    playCRTMonitorOn() {
        // CRT 모니터 켜지는 소리
        setTimeout(() => this.playBeep(15000, 50), 0);    // 고주파 휘파람
        setTimeout(() => this.playBeep(12000, 30), 50);   // 전자음
        setTimeout(() => this.playBeep(8000, 20), 100);   // 안정화
    }

    playKeyboardClick() {
        // 90년대 기계식 키보드 클릭음
        const frequency = 2000 + Math.random() * 500;
        this.playBeep(frequency, 30);
    }

    playRetroUISound() {
        // 90년대 Windows UI 사운드
        this.playBeep(880, 120);
    }

    playGameLoading() {
        // 게임 로딩 사운드 (90년대 게임 스타일)
        setTimeout(() => this.playBeep(440, 100), 0);     // A4
        setTimeout(() => this.playBeep(523, 100), 150);   // C5
        setTimeout(() => this.playBeep(659, 100), 300);   // E5
        setTimeout(() => this.playBeep(784, 200), 450);   // G5
    }

    playRetroSuccess() {
        // 90년대 스타일 성공음
        setTimeout(() => this.playBeep(659, 150), 0);     // E5
        setTimeout(() => this.playBeep(784, 150), 150);   // G5
        setTimeout(() => this.playBeep(988, 150), 300);   // B5
        setTimeout(() => this.playBeep(1319, 300), 450);  // E6
    }

    playDOSCommand() {
        // DOS 명령어 실행 사운드
        this.playBeep(1200, 80);
    }

    playFlopgyDiskInsert() {
        // 플로피 디스크 삽입 소리
        setTimeout(() => this.playBeep(300, 100), 0);     // 삽입
        setTimeout(() => this.playBeep(250, 150), 200);   // 고정
    }

    playSystemShutdown() {
        // Windows 98 시스템 종료 사운드
        setTimeout(() => this.playBeep(1047, 200), 0);    // C6
        setTimeout(() => this.playBeep(784, 200), 200);   // G5
        setTimeout(() => this.playBeep(659, 200), 400);   // E5
        setTimeout(() => this.playBeep(523, 400), 600);   // C5 (길게)
    }
};