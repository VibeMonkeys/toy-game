export class IntroScreen {
    constructor(canvas, ctx, audioManager = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;
        this.isActive = false;
        this.animationPhase = 0; // 0: POST 검사, 1: 메모리 찴크, 2: OS 로딩, 3: 데스크톱, 4: 응용업체 로고, 5: 게임 로딩
        this.startTime = 0;
        this.phaseData = {
            0: { duration: 2000, text: 'POST 테스트' },
            1: { duration: 1500, text: '메모리 찴크' },
            2: { duration: 1500, text: '시스템 로딩' }
        };
        this.onComplete = null;
        this.typewriterText = '';
        this.typewriterIndex = 0;
        this.lastTypeTime = 0;
        this.memoryProgress = 0;
        this.loadingDots = 0;
        this.phaseSoundsPlayed = new Set(); // 각 단계별 사운드 재생 추적
    }

    start(onComplete) {
        this.isActive = true;
        this.animationPhase = 0;
        this.startTime = Date.now();
        this.onComplete = onComplete;
        this.typewriterText = '';
        this.typewriterIndex = 0;
        this.memoryProgress = 0;
        this.loadingDots = 0;
        this.phaseSoundsPlayed.clear();
        console.log('💻 1999년 레트로 부팅 시작!');

        // CRT 모니터 켜지는 소리
        if (this.audioManager) {
            this.audioManager.playCRTMonitorOn();
        }
    }

    update() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        const currentPhase = this.phaseData[this.animationPhase];

        if (!currentPhase) {
            this.complete();
            return;
        }

        // 타이프라이터 효과 업데이트
        if (Date.now() - this.lastTypeTime > 50) {
            this.updateTypewriter();
            this.lastTypeTime = Date.now();
        }

        // 각 단계별 적절한 사운드 재생
        this.playPhaseSpecificSounds();

        // 현재 단계 완료 체크
        if (elapsed >= currentPhase.duration) {
            this.animationPhase++;
            this.startTime = Date.now();
            this.typewriterText = '';
            this.typewriterIndex = 0;
        }

        // 메모리 찴크 진행도
        if (this.animationPhase === 1) {
            this.memoryProgress = Math.min(100, (elapsed / currentPhase.duration) * 100);
        }

        // 로딩 점 애니메이션
        if (this.animationPhase >= 2) {
            this.loadingDots = Math.floor(elapsed / 500) % 4;
        }
    }

    draw() {
        if (!this.isActive) return;

        switch(this.animationPhase) {
            case 0:
                this.drawPOSTScreen();
                break;
            case 1:
                this.drawMemoryCheck();
                break;
            case 2:
                this.drawSystemLoading();
                break;
        }
    }

    // 1990년대 POST 화면
    drawPOSTScreen() {
        // 검은 배경
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 노란 DOS 텍스트
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'left';

        const lines = [
            'HUNET COMPUTER CO., LTD.',
            'System BIOS Version 2.04.08',
            'Copyright (C) 1999 HUNET Corp.',
            '',
            'Memory Test: 64MB OK',
            '',
            'Primary Master: HUNET-HDD-2000 20GB',
            'Primary Slave: HUNET-CDROM 32X',
            '',
            'Press DEL to enter SETUP',
            'Press F1 to continue',
            '',
            this.typewriterText
        ];

        lines.forEach((line, index) => {
            this.ctx.fillText(line, 20, 30 + (index * 18));
        });

        // 깜박이는 커서
        if (Math.floor(Date.now() / 500) % 2) {
            this.ctx.fillText('▌', 20 + this.ctx.measureText(this.typewriterText).width, 30 + (12 * 18));
        }
    }

    // 메모리 찴크 화면
    drawMemoryCheck() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.textAlign = 'left';

        const lines = [
            'HUNET Memory Check and System Initialization',
            '===========================================',
            '',
            `Testing Base Memory: ${Math.floor(this.memoryProgress * 640 / 100)}K`,
            `Testing Extended Memory: ${Math.floor(this.memoryProgress * 63488 / 100)}K`,
            '',
            `Progress: ${Math.floor(this.memoryProgress)}%`,
            '',
            this.drawProgressBar(this.memoryProgress)
        ];

        lines.forEach((line, index) => {
            if (typeof line === 'string') {
                this.ctx.fillText(line, 20, 40 + (index * 20));
            }
        });
    }

    // 시스템 로딩 화면
    drawSystemLoading() {
        // 단순한 검은 배경
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 시스템 로딩 메시지
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = '18px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('시스템을 시작하고 있습니다' + '.'.repeat(this.loadingDots), centerX, centerY);
    }

    // 데스크톱 초기화
    drawDesktopInit() {
        // Windows 98 데스크톱 배경색
        this.ctx.fillStyle = '#008080';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 태스크바 대신
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('데스크톱 초기화 중' + '.'.repeat(this.loadingDots), 10, this.canvas.height - 15);

        // 시작 버튼 대신
        this.ctx.fillStyle = '#808080';
        this.ctx.fillRect(5, this.canvas.height - 35, 80, 30);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('시작', 45, this.canvas.height - 18);
    }

    // 휴넷 로고
    drawCompanyLogo() {
        // 환성적인 배경
        const gradient = this.ctx.createRadialGradient(this.canvas.width/2, this.canvas.height/2, 0, this.canvas.width/2, this.canvas.height/2, 300);
        gradient.addColorStop(0, '#E6E6FA');
        gradient.addColorStop(1, '#D8BFD8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 휴넷 로고
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = 'bold 72px Times';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HUNET', centerX, centerY - 50);

        this.ctx.fillStyle = '#4169E1';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Human Network', centerX, centerY);

        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('26주년 기념', centerX, centerY + 50);

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('1999.3.22 - 2025.3.22', centerX, centerY + 80);
    }

    // 게임 로딩
    drawGameLoading() {
        // 게임 배경
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 게임 제목
        this.ctx.fillStyle = '#f39c12';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('휴넷 26주년 기념게임', centerX, centerY - 80);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('보물찾기 RPG', centerX, centerY - 40);

        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('휴넷의 모든 층을 탐험하고 26주년 기념품을 모아보세요!', centerX, centerY + 20);

        // 로딩 바
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(centerX - 200, centerY + 60, 400, 20);

        const elapsed = Date.now() - this.startTime;
        const progress = (elapsed / this.phaseData[5].duration) * 100;
        this.ctx.fillStyle = '#27ae60';
        this.ctx.fillRect(centerX - 200, centerY + 60, 400 * (progress / 100), 20);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`로딩 중... ${Math.floor(progress)}%`, centerX, centerY + 100);

        // 로딩 도트
        this.ctx.fillText('게임 시작' + '.'.repeat(this.loadingDots), centerX, centerY + 130);
    }

    drawProgressBar(progress) {
        const barWidth = 40;
        const filled = Math.floor(progress * barWidth / 100);
        return '[' + '█'.repeat(filled) + '░'.repeat(barWidth - filled) + ']';
    }

    updateTypewriter() {
        const messages = [
            'Starting HUNET Boot Sequence...',
            'Checking system configuration...',
            'Initializing hardware...',
            'Loading operating system...'
        ];

        const currentMessage = messages[Math.min(this.animationPhase, messages.length - 1)];
        if (this.typewriterIndex < currentMessage.length) {
            this.typewriterText = currentMessage.substring(0, this.typewriterIndex + 1);
            this.typewriterIndex++;
        }
    }

    handleKeyPress(key) {
        if (!this.isActive) return false;

        // 스페이스키나 엔터키로 스킵 가능
        if (key === ' ' || key === 'Enter') {
            this.complete();
            return true;
        }
        return false;
    }

    playPhaseSpecificSounds() {
        if (!this.audioManager) return;

        const phaseKey = `phase_${this.animationPhase}`;

        // 각 단계당 한 번만 소리 재생
        if (!this.phaseSoundsPlayed.has(phaseKey)) {
            this.phaseSoundsPlayed.add(phaseKey);

            switch (this.animationPhase) {
                case 0: // POST 테스트
                    this.audioManager.playPOSTBeep();
                    break;
                case 1: // 메모리 체크
                    this.audioManager.playDiskActivity();
                    break;
                case 2: // 시스템 로딩
                    this.audioManager.playWindowsStartup();
                    break;
            }
        }

        // 타이핑 사운드 (키보드 클릭음)
        if (Date.now() - this.lastTypeTime > 100 && Math.random() < 0.3) {
            this.audioManager.playKeyboardClick();
        }
    }

    complete() {
        this.isActive = false;
        console.log('🎉 26주년 인트로 완료!');

        // 완료 시 성공 사운드
        if (this.audioManager) {
            this.audioManager.playRetroSuccess();
        }

        if (this.onComplete) {
            this.onComplete();
        }
    }

    isVisible() {
        return this.isActive;
    }
}