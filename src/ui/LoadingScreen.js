export class LoadingScreen {
    constructor(canvas, ctx, audioManager = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audioManager = audioManager;
        this.isVisible = false;
        this.loadingProgress = 0;
        this.animationPhase = 0;
        this.dots = '';
        this.lastDotUpdate = 0;
        this.fadeOpacity = 1;

        // 90년대 DOS/Windows 98 스타일 로딩 메시지
        this.loadingTexts = [
            'Loading HUNET 26th Anniversary Game v1.0...',
            'Initializing system components...',
            'Loading graphics and sound drivers...',
            'Checking system configuration...',
            'Starting game engine...',
            'All systems ready!'
        ];
        this.currentTextIndex = 0;

        // DOS 스타일 블록 문자 애니메이션
        this.dosBlocks = [];
        this.blockChars = ['█', '▓', '▒', '░'];
        this.scrollingText = 'HUNET Corporation 1999 - Loading Anniversary Game Data...';
        this.scrollOffset = 0;
        this.lastScrollTime = 0;

        // Windows 98 스타일 요소들
        this.windowX = 0;
        this.windowY = 0;
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.progressBarFill = 0;

        this.initializeDOSBlocks();
    }

    initializeDOSBlocks() {
        // DOS 스타일 블록 문자 애니메이션 초기화
        for (let i = 0; i < 50; i++) {
            this.dosBlocks.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                char: this.blockChars[Math.floor(Math.random() * this.blockChars.length)],
                opacity: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 0.5 + 0.1
            });
        }

        // Windows 98 스타일 창 위치 설정
        this.windowWidth = Math.min(500, this.canvas.width - 40);
        this.windowHeight = 250;
        this.windowX = (this.canvas.width - this.windowWidth) / 2;
        this.windowY = (this.canvas.height - this.windowHeight) / 2;
    }

    show() {
        this.isVisible = true;
        this.loadingProgress = 0;
        this.animationPhase = 0;
        this.currentTextIndex = 0;
        this.fadeOpacity = 1;
        this.scrollOffset = 0;
        this.progressBarFill = 0;

        // 시작 사운드
        if (this.audioManager) {
            this.audioManager.playDiskActivity();
        }

        this.startLoading();
    }

    hide() {
        this.isVisible = false;
    }

    startLoading() {
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 15 + 10;
            this.progressBarFill = Math.min(100, this.progressBarFill + Math.random() * 20 + 15);

            // 각 단계별 사운드 및 텍스트 변경
            const prevTextIndex = this.currentTextIndex;

            if (this.loadingProgress >= 16 && this.currentTextIndex === 0) {
                this.currentTextIndex = 1;
            } else if (this.loadingProgress >= 32 && this.currentTextIndex === 1) {
                this.currentTextIndex = 2;
            } else if (this.loadingProgress >= 48 && this.currentTextIndex === 2) {
                this.currentTextIndex = 3;
            } else if (this.loadingProgress >= 64 && this.currentTextIndex === 3) {
                this.currentTextIndex = 4;
            } else if (this.loadingProgress >= 80 && this.currentTextIndex === 4) {
                this.currentTextIndex = 5;
            }

            // 새로운 단계 진입 시 사운드 재생
            if (prevTextIndex !== this.currentTextIndex && this.audioManager) {
                this.audioManager.playDOSCommand();
            }

            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                this.progressBarFill = 100;
                clearInterval(loadingInterval);

                // 완료 사운드
                if (this.audioManager) {
                    this.audioManager.playRetroSuccess();
                }

                setTimeout(() => {
                    this.animationPhase = 1; // 페이드 아웃 시작
                    const fadeInterval = setInterval(() => {
                        this.fadeOpacity -= 0.05;
                        if (this.fadeOpacity <= 0) {
                            clearInterval(fadeInterval);
                            this.hide();
                        }
                    }, 50);
                }, 800);
            }
        }, 200);
    }

    update() {
        if (!this.isVisible) return;

        const now = Date.now();

        // DOS 스타일 점 애니메이션
        if (now - this.lastDotUpdate > 400) {
            this.dots += '.';
            if (this.dots.length > 3) {
                this.dots = '';
            }
            this.lastDotUpdate = now;
        }

        // 스크롤링 텍스트 애니메이션
        if (now - this.lastScrollTime > 100) {
            this.scrollOffset++;
            if (this.scrollOffset > this.scrollingText.length * 10) {
                this.scrollOffset = 0;
            }
            this.lastScrollTime = now;
        }

        // DOS 블록 애니메이션 업데이트
        this.dosBlocks.forEach(block => {
            block.opacity += (Math.random() - 0.5) * 0.05;
            block.opacity = Math.max(0.05, Math.min(0.4, block.opacity));

            // 가끔 문자 변경
            if (Math.random() < 0.01) {
                block.char = this.blockChars[Math.floor(Math.random() * this.blockChars.length)];
            }
        });
    }

    draw() {
        if (!this.isVisible) return;

        // DOS 스타일 검은 배경
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeOpacity})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // DOS 블록 문자 배경 애니메이션
        this.drawDOSBackground();

        // 간단한 로딩 화면
        this.drawSimpleLoading();

        // 하단 스크롤링 텍스트 (DOS 스타일)
        this.drawScrollingText();
    }

    drawDOSBackground() {
        this.ctx.font = '12px monospace';
        this.dosBlocks.forEach(block => {
            this.ctx.fillStyle = `rgba(0, 255, 0, ${block.opacity * this.fadeOpacity})`;
            this.ctx.fillText(block.char, block.x, block.y);
        });
    }

    drawSimpleLoading() {
        // 화면 중앙
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 휴넷 로고
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.fadeOpacity})`;
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('HUNET', centerX, centerY - 80);

        // 26주년 텍스트
        this.ctx.fillStyle = `rgba(200, 200, 200, ${this.fadeOpacity})`;
        this.ctx.font = '18px Arial';
        this.ctx.fillText('26th Anniversary Game', centerX, centerY - 40);

        // 간단한 프로그레스 바
        const barWidth = 300;
        const barHeight = 6;
        const barX = centerX - barWidth / 2;
        const barY = centerY + 20;

        // 배경
        this.ctx.fillStyle = `rgba(60, 60, 60, ${this.fadeOpacity})`;
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // 진행 상황
        const fillWidth = barWidth * (this.progressBarFill / 100);
        this.ctx.fillStyle = `rgba(0, 150, 255, ${this.fadeOpacity})`;
        this.ctx.fillRect(barX, barY, fillWidth, barHeight);

        // 로딩 텍스트
        this.ctx.fillStyle = `rgba(150, 150, 150, ${this.fadeOpacity})`;
        this.ctx.font = '14px Arial';
        this.ctx.fillText(this.loadingTexts[this.currentTextIndex] + this.dots, centerX, centerY + 60);

        // 진행률
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`${Math.floor(this.progressBarFill)}%`, centerX, centerY + 80);
    }

    drawWindows98Border(x, y, width, height) {
        // 외부 테두리 (밝은 색)
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.fadeOpacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.stroke();

        // 내부 테두리 (어두운 색)
        this.ctx.strokeStyle = `rgba(128, 128, 128, ${this.fadeOpacity})`;
        this.ctx.beginPath();
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.lineTo(x, y + height);
        this.ctx.stroke();
    }

    drawScrollingText() {
        // DOS 스타일 하단 스크롤링 텍스트
        this.ctx.fillStyle = `rgba(0, 255, 0, ${this.fadeOpacity * 0.8})`;
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';

        const textY = this.canvas.height - 20;
        const charWidth = 8;
        const startX = -this.scrollOffset;

        for (let i = 0; i < this.scrollingText.length; i++) {
            const x = startX + (i * charWidth);
            if (x > -charWidth && x < this.canvas.width) {
                this.ctx.fillText(this.scrollingText[i], x, textY);
            }
        }
    }

    drawStar(x, y, outerRadius, innerRadius, points) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(-Math.PI / 2);

        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points;
            const px = radius * Math.cos(angle);
            const py = radius * Math.sin(angle);

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    isComplete() {
        return this.animationPhase === 1 && this.fadeOpacity <= 0;
    }
};