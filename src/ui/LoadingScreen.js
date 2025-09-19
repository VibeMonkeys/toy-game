export class LoadingScreen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isVisible = false;
        this.loadingProgress = 0;
        this.animationPhase = 0;
        this.dots = '';
        this.lastDotUpdate = 0;
        this.fadeOpacity = 1;
        this.loadingTexts = [
            '휴넷 26주년 기념 게임을 준비하고 있습니다',
            '맵 데이터를 불러오는 중입니다',
            '캐릭터 정보를 초기화하고 있습니다',
            '게임 시스템을 점검하고 있습니다',
            '모든 준비가 완료되었습니다!'
        ];
        this.currentTextIndex = 0;
    }

    show() {
        this.isVisible = true;
        this.loadingProgress = 0;
        this.animationPhase = 0;
        this.currentTextIndex = 0;
        this.fadeOpacity = 1;
        this.startLoading();
    }

    hide() {
        this.isVisible = false;
    }

    startLoading() {
        const loadingInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 15 + 10;

            if (this.loadingProgress >= 20 && this.currentTextIndex === 0) {
                this.currentTextIndex = 1;
            } else if (this.loadingProgress >= 40 && this.currentTextIndex === 1) {
                this.currentTextIndex = 2;
            } else if (this.loadingProgress >= 60 && this.currentTextIndex === 2) {
                this.currentTextIndex = 3;
            } else if (this.loadingProgress >= 80 && this.currentTextIndex === 3) {
                this.currentTextIndex = 4;
            }

            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadingInterval);

                setTimeout(() => {
                    this.animationPhase = 1; // 페이드 아웃 시작
                    const fadeInterval = setInterval(() => {
                        this.fadeOpacity -= 0.05;
                        if (this.fadeOpacity <= 0) {
                            clearInterval(fadeInterval);
                            this.hide();
                        }
                    }, 50);
                }, 1000);
            }
        }, 200);
    }

    update() {
        if (!this.isVisible) return;

        const now = Date.now();
        if (now - this.lastDotUpdate > 500) {
            this.dots += '.';
            if (this.dots.length > 3) {
                this.dots = '';
            }
            this.lastDotUpdate = now;
        }
    }

    draw() {
        if (!this.isVisible) return;

        // 배경
        this.ctx.fillStyle = `rgba(25, 35, 55, ${this.fadeOpacity})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 휴넷 로고 (간단한 텍스트로 대체)
        this.ctx.fillStyle = `rgba(255, 215, 0, ${this.fadeOpacity})`;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('휴넷', this.canvas.width / 2, this.canvas.height / 2 - 100);

        // 26주년 텍스트
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.fadeOpacity})`;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('26주년 창립 기념', this.canvas.width / 2, this.canvas.height / 2 - 50);

        // 로딩 바 배경
        const barWidth = 400;
        const barHeight = 20;
        const barX = (this.canvas.width - barWidth) / 2;
        const barY = this.canvas.height / 2 + 50;

        this.ctx.fillStyle = `rgba(60, 60, 60, ${this.fadeOpacity})`;
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // 로딩 바
        const progressWidth = (barWidth * this.loadingProgress) / 100;
        const gradient = this.ctx.createLinearGradient(barX, barY, barX + progressWidth, barY);
        gradient.addColorStop(0, `rgba(0, 150, 255, ${this.fadeOpacity})`);
        gradient.addColorStop(1, `rgba(0, 200, 255, ${this.fadeOpacity})`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(barX, barY, progressWidth, barHeight);

        // 로딩 바 테두리
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.fadeOpacity * 0.5})`;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        // 진행률 텍스트
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.fadeOpacity})`;
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`${Math.floor(this.loadingProgress)}%`, this.canvas.width / 2, barY + barHeight + 25);

        // 로딩 메시지
        this.ctx.font = '18px Arial';
        this.ctx.fillText(
            this.loadingTexts[this.currentTextIndex] + this.dots,
            this.canvas.width / 2,
            barY + barHeight + 60
        );

        // 스파클 효과 (간단한 별 모양)
        for (let i = 0; i < 5; i++) {
            const x = (this.canvas.width / 2) + Math.sin(Date.now() * 0.002 + i) * 200;
            const y = (this.canvas.height / 2) + Math.cos(Date.now() * 0.003 + i) * 100;
            const alpha = (Math.sin(Date.now() * 0.005 + i) + 1) * 0.5 * this.fadeOpacity;

            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.drawStar(x, y, 3, 2, 1);
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