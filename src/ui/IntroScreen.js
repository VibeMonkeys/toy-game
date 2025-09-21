export class IntroScreen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = false;
        this.animationPhase = 0; // 0: 페이드인, 1: 텍스트 표시, 2: 페이드아웃
        this.startTime = 0;
        this.fadeDuration = 1000; // 1초
        this.displayDuration = 3000; // 3초
        this.onComplete = null;
    }

    start(onComplete) {
        this.isActive = true;
        this.animationPhase = 0;
        this.startTime = Date.now();
        this.onComplete = onComplete;
        console.log('🎉 26주년 인트로 시작!');
    }

    update() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;

        if (this.animationPhase === 0) { // 페이드인
            if (elapsed >= this.fadeDuration) {
                this.animationPhase = 1;
                this.startTime = Date.now();
            }
        } else if (this.animationPhase === 1) { // 텍스트 표시
            if (elapsed >= this.displayDuration) {
                this.animationPhase = 2;
                this.startTime = Date.now();
            }
        } else if (this.animationPhase === 2) { // 페이드아웃
            if (elapsed >= this.fadeDuration) {
                this.complete();
            }
        }
    }

    draw() {
        if (!this.isActive) return;

        const elapsed = Date.now() - this.startTime;
        let alpha = 1;

        // 페이드 효과 계산
        if (this.animationPhase === 0) {
            alpha = Math.min(1, elapsed / this.fadeDuration);
        } else if (this.animationPhase === 2) {
            alpha = Math.max(0, 1 - (elapsed / this.fadeDuration));
        }

        // 전체 배경
        this.ctx.fillStyle = `rgba(0, 20, 40, ${alpha * 0.95})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 26주년 로고/제목
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 큰 제목
        this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🎉 휴넷 26주년 🎉', centerX, centerY - 80);

        // 부제목
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('기념 게임에 오신 것을 환영합니다!', centerX, centerY - 30);

        // 설명
        this.ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
        this.ctx.font = '18px Arial';
        this.ctx.fillText('휴넷의 모든 층을 탐험하고', centerX, centerY + 20);
        this.ctx.fillText('26주년 기념품을 모아보세요!', centerX, centerY + 50);

        // 목표 시간
        this.ctx.fillStyle = `rgba(255, 170, 0, ${alpha})`;
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('⏱️ 목표: 30분 안에 완료하기', centerX, centerY + 100);

        // 시작 안내 (텍스트 표시 단계에서만)
        if (this.animationPhase === 1) {
            const pulseAlpha = 0.7 + 0.3 * Math.sin(elapsed * 0.005);
            this.ctx.fillStyle = `rgba(0, 255, 0, ${alpha * pulseAlpha})`;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText('잠시 후 자동으로 시작됩니다...', centerX, centerY + 150);
        }

        // 장식 요소들
        this.drawDecorations(alpha, elapsed);
    }

    drawDecorations(alpha, elapsed) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // 회전하는 별들
        this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.8})`;
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';

        for (let i = 0; i < 8; i++) {
            const angle = (elapsed * 0.001) + (i * Math.PI / 4);
            const radius = 200;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            this.ctx.fillText('⭐', x, y);
        }

        // 숫자 26 강조
        this.ctx.fillStyle = `rgba(255, 100, 100, ${alpha * 0.6})`;
        this.ctx.font = 'bold 80px Arial';
        this.ctx.fillText('26', centerX - 250, centerY + 20);
        this.ctx.fillText('26', centerX + 250, centerY + 20);
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

    complete() {
        this.isActive = false;
        console.log('🎉 26주년 인트로 완료!');
        if (this.onComplete) {
            this.onComplete();
        }
    }

    isVisible() {
        return this.isActive;
    }
}